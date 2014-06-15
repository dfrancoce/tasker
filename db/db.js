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
        callback(result, null);
    });

    query.on("error", function(error) {
        callback(null, error);
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

// TASKS
function getTaskParameters(oTask) {
    var parameters = [];

    parameters.push(oTask.code);
    parameters.push(oTask.name);

    return parameters;
}

function insertTask(oTask, callback) {
    var query, sql, parameters, parameters_insert = [];

    parameters_insert.push(oTask.code);
    parameters_insert.push(oTask.name);
    parameters_insert.push(oTask.description);
    parameters_insert.push(oTask.board);
    parameters_insert.push(oTask.state);
    parameters_insert.push(oTask.project);
    parameters_insert.push(oTask.priority);
    parameters_insert.push(oTask.type);
    parameters_insert.push(oTask.estimation);
    parameters_insert.push(oTask.incurred);
    parameters_insert.push(oTask.assignedTo);

    client.query('INSERT INTO "Tasks" (code, name, description, board, state, project, priority, type, estimation, incurred, assignedTo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', parameters_insert);

    parameters = getTaskParameters(oTask);
    sql = 'SELECT * FROM "Tasks" WHERE code = $1 and name = $2';
    getEntityCollection(sql, parameters, callback);
}

function updateTask(oTask) {
    var parameters = [];

    parameters = getTaskParameters(oTask);
    parameters.push(oTask.description);
    parameters.push(oTask.board);
    parameters.push(oTask.state);
    parameters.push(oTask.project);
    parameters.push(oTask.priority);
    parameters.push(oTask.type);
    parameters.push(oTask.estimation);
    parameters.push(oTask.incurred);
    parameters.push(oTask.assignedTo);
    parameters.push(oTask.id);
    client.query('UPDATE "Tasks" SET code = $1, name = $2, description = $3, board = $4, state = $5, project = $6, priority = $7, type = $8, estimation = $9, incurred = $10, assignedTo = $11 WHERE id = $12', parameters);
}

function deleteTask(oTask, callback) {
    var parameters = [];

    parameters = getTaskParameters(oTask);
    client.query('DELETE FROM "Tasks" WHERE code = $1 AND name = $2', parameters);
    callback(true, "Board deleted");
}
// END TASKS

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
    sql = 'SELECT * FROM "Boards" WHERE code = $1 and name = $2';
    getEntityCollection(sql, parameters, callback);
}

function updateBoard(oBoard) {
    var parameters;

    parameters = getBoardParameters(oBoard);
    parameters.push(oBoard.id);
    client.query('UPDATE "Boards" SET code = $1, name = $2 WHERE id = $3', parameters);
}

function deleteBoard(oBoard, callback) {
    var query, sql, parameters = [];

    // Checking if there is any task contained within the board to delete
    sql = 'SELECT * FROM "Tasks" WHERE board = $1';
    parameters.push(oBoard.id);

    getEntityCollection(sql, parameters, function(result, error) {
        if (error === null) {
            if (result.rows.length > 0) {
                callback(false, "Can't delete the board, you must delete the tasks first");
            } else {
                parameters = getBoardParameters(oBoard);
                client.query('DELETE FROM "Boards" WHERE code = $1 AND name = $2', parameters);
                callback(true, "Board deleted");
            }
        } else {
            callback(false, "Can't delete the board");
        }
    });
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

function updateProject(oProject) {
    var parameters;

    parameters = getProjectParameters(oProject);
    parameters.push(oProject.id);
    client.query('UPDATE "Projects" SET code = $1, name = $2 WHERE id = $3', parameters);
}

function deleteProject(oProject, callback) {
    var query, sql, parameters = [];

    // Checking if there is any task for this project
    sql = 'SELECT * FROM "Tasks" WHERE project = $1';
    parameters.push(oProject.id);

    getEntityCollection(sql, parameters, function(result, error) {
        if (error === null) {
            if (result.rows.length > 0) {
                callback(false, "Can't delete the project, you must delete the tasks first");
            } else {
                parameters = getProjectParameters(oProject);
                client.query('DELETE FROM "Projects" WHERE code = $1 AND name = $2', parameters);
                callback(true, "Project deleted");
            }
        } else {
            callback(false, "Can't delete the project");
        }
    });
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

function updateUser(oUser) {
    var parameters;

    parameters = getUserParameters(oUser);
    parameters.push(oUser.id);
    client.query('UPDATE "Users" SET code = $1, name = $2 WHERE id = $3', parameters);
}

function deleteUser(oUser, callback) {
    var query, sql, parameters = [];

    // Checking if there is any task for this user
    sql = 'SELECT * FROM "Tasks" WHERE assignedTo = $1';
    parameters.push(oUser.id);

    getEntityCollection(sql, parameters, function(result, error) {
        if (error === null) {
            if (result.rows.length > 0) {
                callback(false, "Can't delete the user, you must delete the tasks assigned to this user first");
            } else {
                parameters = getUserParameters(oUser);
                client.query('DELETE FROM "Users" WHERE code = $1 AND name = $2', parameters);
                callback(true, "User deleted");
            }
        } else {
            callback(false, "Can't delete the user");
        }
    });
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

// TASKS
exports.insertTask = insertTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;

// BOARDS
exports.insertBoard = insertBoard;
exports.updateBoard = updateBoard;
exports.deleteBoard = deleteBoard;

// PROJECTS
exports.insertProject = insertProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;

// USERS
exports.insertUser = insertUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;