var fs = require('fs')
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
//change the db name below
var conn = mongoose.createConnection('mongodb://localhost:27017/fileUpload');
module.exports.uploadFile = function (conn, callback) {
    conn.once('open', function () {
        var gfs = Grid(conn.db, mongoose.mongo);
        //9a. create a stream, this will be
        //used to store file in database
        var writestream = gfs.createWriteStream({
            //the file will be stored with the name
            filename: 'error.jpg'
        });

        //9b. create a readstream to read the file
        //from the filestored folder
        //and pipe into the database
        //replace the file path
        fs.createReadStream('/home/vincent/Downloads/404.jpg').pipe(writestream);
        // all set!
        writestream.on("close", callback);
    })
}

module.exports.downloadFile = function (conn, callback) {
    conn.once('open', function () {
        var gfs = Grid(conn.db, mongoose.mongo);

        //create a writestream to write the file
        //from the database
        //replace the file path
        var fswritestram = fs.createWriteStream('/home/vincent/Desktop/404.jpg');


        // create a stream, this will be
        //used to retrieve file from database
        var readstream = gfs.createReadStream({
            //the file will be stored with the name
            filename: "error.jpg"
        });
        readstream.pipe(fswritestram)


        readstream.on("close", callback)
    })
}
