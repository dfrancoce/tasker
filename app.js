var express = require("express"),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    db = require('./db/db.js');

server.listen(process.env.PORT || 8080);

// Serving the content..
app.use(express.static(__dirname + '/public/'));
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

// Server operations against the database
io.sockets.on('connection', function(socket) {
    // Open connection to the database
    socket.on('db_openConnection', function() {
        db.openConnection();
    });

    // Projects
    socket.on('db_insertProject', function(data) {
        console.log("insertProject");
        db.insertProject(data);
    });

    socket.on('db_deleteProject', function(data) {
        db.deleteProject(data);
    });

    //Users
    socket.on('db_insertUser', function(data) {
        db.insertUser(data);
    });

    socket.on('db_deleteUser', function(data) {
        db.deleteUser(data);
    });

    socket.on('disconnect', function(data) {

    });
});
