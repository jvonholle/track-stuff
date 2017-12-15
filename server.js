// James R Von Holle JR
// server.js
// server for a simple collection tracking sytem
// using bootstrap, node.js, jquery, and mongoDB

// Global variables (probably should minimize these)
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

var async = require('async');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var murl = "mongodb://localhost:27017/track-stuff";

var router = express();
var server = http.createServer(router);
var dataBase;

router.use(express.static(path.resolve(__dirname, 'client')));
router.use(express.json());
router.use(express.urlencoded());

var socketio = require('socket.io');
var io = socketio.listen(server); // vestigial from example this is built on, not sure
var messages = [];                // what would or wouldn't break if it was removed
var sockets = [];

/***************************************/
/************DATABASE CRUD*************/
/*************************************/

// storebr
// takes an input
// input should be formated as:
// { title, type, !director, !imageurl, !plot, !year(s) }
// everything with ! should be retrieved from OMDB with
// the user-input title
function storebr(inp) {
  dataBase.collection('bluray').insertOne(inp, function(err, result) {
    if(err) throw err;
    console.log("bluray added");
  });
}
// storer
// same as storebr other than input format which is as follows:
// { title, artist, !genre, !year, ~!catalog# } 
// ! are from discogs 
// ~ should probably be able to be put in by user to ensure the correct printing is used
function storer(inp) {
  dataBase.collection('record').insertOne(inp, function(err, result) {
    if(err) throw err;
    console.log("record added");
  });
}
// storebk
// same as storebr other than input format which is as follows:
// { title, author, ~!isbn, !publsher, !year, !plot/desc }
// ! are from a TBD api
// ~ should probably be able to be put in by user to ensure the correct printing is used
function storebk(inp) {
  dataBase.collection('book').insertOne(inp, function(err, result) {
    if(err) throw err;
    console.log("book added");
  });
}

/*******************************************/
/************END DATABASE CRUD*************/
/*****************************************/


/*********************************/
/************ROUTING*************/
/*******************************/
// '/br_show'
// sends everything in the bluray collection to the html page as json
router.get('/br_show', function(req, res) {
  dataBase.collection('bluray').find().toArray(function(err, result) {
    if(err) throw err;
    console.log(result);
    res.json(result);
  });
});

// '/br_add'
// formats input data and eventuall will add API data
// calls storebr() with formated data
router.post('/br_add', function(req, res) {
  var pg_input = {
    'title': req.body.br_title,
    'type':  req.body.br_type 
  };
  
  // REPLACE WITH API-PULLING
  var input;
  router.get("http://www.omdbapi.com/?t="+pg_input.title+"&apikey=bdd19ad9", function(data){
    console.log(data);
    console.log("data");
    input = data;
  });
  // REPLACE WITH API-PULLING
  
  storebr(pg_input);
});

// '/r_show'
// sends everything in the bluray collection to the html page as json
router.get('/r_show', function(req, res) {
  dataBase.collection('record').find().toArray(function(err, result) {
    if(err) throw err;
    console.log(result);
    res.json(result);
  });
});

// '/r_add'
// formats input data and eventually will add API data
// calls storebr() with formated data
router.post('/r_add', function(req, res) {
  var pg_input = {
    'title':  req.body.r_title,
    'artist': req.body.r_artist
};
  
  // REPLACE WITH API-PULLING
  var input = pg_input;
  // REPLACE WITH API-PULLING
  
  storer(input);
});

// '/bk_show'
// sends everything in the bluray collection to the html page as json
router.get('/bk_show', function(req, res) {
  dataBase.collection('book').find().toArray(function(err, result) {
    if(err) throw err;
    console.log(result);
    res.json(result);
  });
});


// '/bk_add'
// formats input data and eventually will add API data
// calls storebr() with formated data
router.post('/bk_add', function(req, res) {
  var pg_input = {
    'title': req.body.bk_title,
    'author': req.body.bk_author
  };
  
  // REPLACE WITH API-PULLING
  var input = pg_input;
  // REPLACE WITH API-PULLING
  
  storebk(input);
});
/*************************************/
/************END ROUTING*************/
/***********************************/


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("beep boop, ready to rock");
  MongoClient.connect(murl, function(err, db) {
    if(err) throw err;
    dataBase = db;
  });
});
