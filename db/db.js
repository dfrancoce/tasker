var pg = require("pg");
var connection_string, client;

function openConnection() {
    connection_string = "pg://postgres:admin@localhost:5432/taskerDB";
    client = new pg.Client(connection_string);
    client.connect();
}

// PROJECTS
function getProjectParameters(oProject) {
    var parameters = [];

    parameters.push(oProject.code);
    parameters.push(oProject.name);

    return parameters;
}

function insertProject(oProject) {
    var query;
    client.query('INSERT INTO "Projects" (code, name) VALUES ($1, $2)', getProjectParameters(oProject));
}

function deleteProject(oProject) {
    var query;
    client.query('DELETE FROM "Projects" WHERE code = $1 and name = $2', getProjectParameters(oProject));
}

function getProject() {
    // TODO
}

function getAllProjects() {
    // TODO
}
// END PROJECTS

// USERS
function getUserParameters(oUser) {
    var parameters = [];

    parameters.push(oUser.code);
    parameters.push(oUser.name);

    return parameters;
}

function insertUser(oUser) {
    var query;
    client.query('INSERT INTO "Users" (code, name) VALUES ($1, $2)', getUserParameters(oUser));
}

function deleteUser(oUser) {
    var query;
    client.query('DELETE FROM "Users" WHERE code = $1 and name = $2', getUserParameters(oUser));
}

function getUser() {
    // TODO
}

function getAllUsers() {
    // TODO
}

// END USERS

exports.openConnection = openConnection;

// PROJECTS
exports.insertProject = insertProject;
exports.deleteProject = deleteProject;
exports.getProject = getProject;
exports.getAllProjects = getAllProjects;

// USERS
exports.insertUser = insertUser;
exports.deleteUser = deleteUser;
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;