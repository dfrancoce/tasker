var pg = require("pg");
var connection_string, client;

function openConnection() {
    connection_string = "pg://postgres:admin@localhost:5432/taskerDB";
    client = new pg.Client(connection_string);
    client.connect();
}

// GETTERS
function getEntityCollection(sql, parameters, callback) {
    var query;

    if (parameters.length > 0) {
        query = client.query(sql, parameters);
    } else {
        query = client.query(sql);
    }

    query.on("row", function(row, result) {
        result.addRow(row);
    });

    query.on("end", function(result) {
        callback(result);
    });
}

function getBoards(callback) {
    var sql;

    sql = 'SELECT * FROM "Boards"';
    getEntityCollection(sql, [], callback);
}

function getPriorities(callback) {
    var sql;

    sql = 'SELECT * FROM "Priorities"';
    getEntityCollection(sql, [], callback);
}

function getTypes(callback) {
    var sql;

    sql = 'SELECT * FROM "Types"';
    getEntityCollection(sql, [], callback);
}

function getProjects(callback) {
    var sql;

    sql = 'SELECT * FROM "Projects"';
    getEntityCollection(sql, [], callback);
}

function getUsers(callback) {
    var sql;

    sql = 'SELECT * FROM "Users"';
    getEntityCollection(sql, [], callback);
}

function getTasks(callback) {
    var sql;

    sql = 'SELECT * FROM "Tasks"';
    getEntityCollection(sql, [], callback);
}
// END GETTERS

// BOARDS
function getBoardParameters(oBoard) {
    var parameters = [];

    parameters.push(oBoard.code);
    parameters.push(oBoard.name);

    return parameters;
}

function insertBoard(oBoard, callback) {
    var query, sql, parameters;

    parameters = getBoardParameters(oBoard);
    client.query('INSERT INTO "Boards" (code, name) VALUES ($1, $2)', parameters);
    sql = 'SELECT * FROM "Boards" WHERE code = $1 and name = $2'
    getEntityCollection(sql, parameters, callback);
}

function deleteBoard(oBoard) {
    var query;

    client.query('DELETE FROM "Boards" WHERE code = $1 AND name = $2', getBoardParameters(oBoard));
}
// END BOARDS

// PROJECTS
function getProjectParameters(oProject) {
    var parameters = [];

    parameters.push(oProject.code);
    parameters.push(oProject.name);

    return parameters;
}

function insertProject(oProject, callback) {
    var query, sql, parameters;

    parameters = getProjectParameters(oProject);
    client.query('INSERT INTO "Projects" (code, name) VALUES ($1, $2)', parameters);
    sql = 'SELECT * FROM "Projects" WHERE code = $1 and name = $2'
    getEntityCollection(sql, parameters, callback);
}

function deleteProject(oProject) {
    var query;

    client.query('DELETE FROM "Projects" WHERE code = $1 and name = $2', getProjectParameters(oProject));
}
// END PROJECTS

// USERS
function getUserParameters(oUser) {
    var parameters = [];

    parameters.push(oUser.code);
    parameters.push(oUser.name);

    return parameters;
}

function insertUser(oUser, callback) {
    var query, sql, parameters;

    parameters = getUserParameters(oUser);
    client.query('INSERT INTO "Users" (code, name) VALUES ($1, $2)', parameters);
    sql = 'SELECT * FROM "Users" WHERE code = $1 and name = $2'
    getEntityCollection(sql, parameters, callback);
}

function deleteUser(oUser) {
    var query;

    client.query('DELETE FROM "Users" WHERE code = $1 and name = $2', getUserParameters(oUser));
}
// END USERS

exports.openConnection = openConnection;


// GETTERS
exports.getBoards = getBoards;
exports.getTypes = getTypes;
exports.getPriorities = getPriorities;
exports.getUsers = getUsers;
exports.getProjects = getProjects;
exports.getTasks = getTasks;

// BOARDS
exports.insertBoard = insertBoard;
exports.deleteBoard = deleteBoard;

// PROJECTS
exports.insertProject = insertProject;
exports.deleteProject = deleteProject;

// USERS
exports.insertUser = insertUser;
exports.deleteUser = deleteUser;