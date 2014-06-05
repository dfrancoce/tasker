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

    // GETTERS
    socket.on('db_getBoards', function(data) {
        db.getBoards(function(result) {
            socket.emit('getBoards', result);
        });
    });

    socket.on('db_getPriorities', function(data) {
        db.getPriorities(function(result) {
            socket.emit('getPriorities', result);
        });
    });

    socket.on('db_getTypes', function(data) {
        db.getTypes(function(result) {
            socket.emit('getTypes', result);
        });
    });

    socket.on('db_getUsers', function(data) {
        db.getUsers(function(result) {
            socket.emit('getUsers', result);
        });
    });

    socket.on('db_getProjects', function(data) {
        db.getProjects(function(result) {
            socket.emit('getProjects', result);
        });
    });

    socket.on('db_getTasks', function(data) {
        db.getTasks(function(result) {
            socket.emit('getTasks', result);
        });
    });
    // END GETTERS

    // BOARDS
    socket.on('db_insertBoard', function(data) {
        db.insertBoard(data, function(result) {
            socket.emit('getBoards', result);
        });
    });

    socket.on('db_deleteBoard', function(data) {
        db.deleteBoard(data);
    });
    // END BOARDS

    // Projects
    socket.on('db_insertProject', function(data) {
        db.insertProject(data, function(result) {
            socket.emit('getProjects', result);
        });
    });

    socket.on('db_deleteProject', function(data) {
        db.deleteProject(data);
    });

    //Users
    socket.on('db_insertUser', function(data) {
        db.insertUser(data, function(result) {
            socket.emit('getUsers', result);
        });
    });

    socket.on('db_deleteUser', function(data) {
        db.deleteUser(data);
    });

    socket.on('disconnect', function(data) {

    });
});