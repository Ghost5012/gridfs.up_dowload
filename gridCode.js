var fs = require('fs')
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
//change the db name below
var conn = mongoose.createConnection('mongodb://localhost:27017/fileUpload');
//uploade(save) file to a mongoDB database
module.exports.uploadFile = function (conn, file) {
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
        fs.createReadStream(file).pipe(writestream);
        // all set!
        writestream.on("close", function (file) {
            // do something with `file`
            console.log(file.filename);
        });
    })
};

// download file from MongoDB database
module.exports.downloadFile = function (conn, fileName) {
    conn.once('open', function () {
        var gfs = Grid(conn.db, mongoose.mongo);

        //create a writestream to write the file
        //from the database
        var fswritestram = fs.createWriteStream('/home/vincent/Desktop/' + fileName);


        // create a stream, this will be
        //used to retrieve file from database
        var readstream = gfs.createReadStream({
            //the file will be stored with the name
            filename: "error.jpg"
        });
        readstream.pipe(fswritestram)


        readstream.on("close", function () {
            console.log('File retrieved successfully')
        });
    })
}

//delete file from the db
module.exports.removeFile = function (conn, fileName) {
    conn.once('open', function () {
        var gfs = Grid(conn.db, mongoose.mongo);
        gfs.remove({ filename: fileName }, function (err) {
            if (err) return handleError(err);
            console.log("File Deleted")
        });
    })
}

//checking file existence
module.exports.fileExist = function (conn, file) {
    conn.once('open', function () {
        var gfs = Grid(conn.db, mongoose.mongo)
        gfs.exist({ filename: file }, function (err, found) {
            if (err) return handleError(err);
            found ? console.log('File exists') : console.log('File does not exist');
        })
    });
}