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
        db.getBoards(function(result, error) {
            if (error === null) {
                socket.emit('getBoards', result, error);
            }
        });
    });

    socket.on('db_getPriorities', function(data) {
        db.getPriorities(function(result, error) {
            if (error === null) {
                socket.emit('getPriorities', result, error);
            }
        });
    });

    socket.on('db_getTypes', function(data) {
        db.getTypes(function(result, error) {
            if (error === null) {
                socket.emit('getTypes', result, error);
            }
        });
    });

    socket.on('db_getUsers', function(data) {
        db.getUsers(function(result, error) {
            if (error === null) {
                socket.emit('getUsers', result, error);
            }
        });
    });

    socket.on('db_getProjects', function(data) {
        db.getProjects(function(result, error) {
            if (error === null) {
                socket.emit('getProjects', result, error);
            }
        });
    });

    socket.on('db_getTasks', function(data) {
        db.getTasks(function(result, error) {
            if (error === null) {
                socket.emit('getTasks', result, error);
            }
        });
    });
    // END GETTERS

    // TASKS
    socket.on('db_insertTask', function(data) {
        db.insertTask(data, function(result, error) {
            if (error === null) {
                socket.emit('getTasks', result, error);
            }
        });
    });

    socket.on('db_updateTask', function(data) {
        db.updateTask(data);
    });

    socket.on('db_deleteTask', function(data) {
        db.deleteTask(data, function(result, msg) {
            socket.emit('onDeleteTask', result, msg);
        });
    });
    // END TASKS

    // BOARDS
    socket.on('db_insertBoard', function(data) {
        db.insertBoard(data, function(result, error) {
            if (error === null) {
                socket.emit('getBoards', result, error);
            }
        });
    });

    socket.on('db_updateBoard', function(data) {
        db.updateBoard(data);
    });

    socket.on('db_deleteBoard', function(data) {
        db.deleteBoard(data, function(result, msg) {
            socket.emit('onDeleteBoard', result, msg);
        });
    });
    // END BOARDS

    // PROJECTS
    socket.on('db_insertProject', function(data) {
        db.insertProject(data, function(result, error) {
            if (error === null) {
                socket.emit('getProjects', result, error);
            }
        });
    });

    socket.on('db_updateProject', function(data) {
        db.updateProject(data);
    });

    socket.on('db_deleteProject', function(data) {
        db.deleteProject(data, function(result, msg) {
            socket.emit('onDeleteProject', result, msg);
        });
    });
    // END PROJECTS

    // USERS
    socket.on('db_insertUser', function(data) {
        db.insertUser(data, function(result, error) {
            if (error === null) {
                socket.emit('getUsers', result, error);
            }
        });
    });

    socket.on('db_updateUser', function(data) {
        db.updateUser(data);
    });

    socket.on('db_deleteUser', function(data) {
        db.deleteUser(data, function(result, msg) {
            socket.emit('onDeleteUser', result, msg);
        });
    });
    // END USERS

    socket.on('disconnect', function(data) {

    });
});