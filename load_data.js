// James R Von Holle
// load_data.js
// loads in a bunch of dummy data for this project

var MongoClient = require("mongodb");
var fs = require("fs");

MongoClient.connect("mongodb://localhost:27017/track-stuff", function(err, db) {
    if(err) throw err;
    fs.readFile('moviedata.json', function(err, data) {
        if(err) throw err;
        console.log(data);
        // db.collection('bluray').insertMany(data, function(err, res) {
        //     if(err) throw err;
        //     console.log(res.insertedCount + " inserted");
        // });
    });
    db.close();
});