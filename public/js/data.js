/*jslint browser: true*/ /*global  $*/

/**
 * @fileOverview Contains data manipulation functions and objects.
 * @author <a href="mailto:danielfrancocecilia@gmail.com">Daniel Franco</a>
 * @version 1.0
 * @since 1.0
 */

var socket,
    boards = [],
    tasks = [],
    projects = [],
    priorities = [],
    types = [],
    users = [];

/**
 * Initializes the data variables from the
 * database information
 * @public
 *
 */
function initData() {
    openConnection();

    // Init boards
    socket.emit('db_getBoards');
    socket.on('getBoards', function(data) {
        for (var i = 0, len = data.rows.length; i < len; i++) {
            boards.push(data.rows[i]);
        }

        // Each time we get boards from the database we must
        // refresh the boards combo and the board itself.
        refreshMyBoards();
        refreshBoard();
    });

    // Init priorities
    socket.emit('db_getPriorities');
    socket.on('getPriorities', function(data) {
        for (var i = 0, len = data.rows.length; i < len; i++) {
            priorities.push(data.rows[i]);
        }
    });

    // Init types
    socket.emit('db_getTypes');
    socket.on('getTypes', function(data) {
        for (var i = 0, len = data.rows.length; i < len; i++) {
            types.push(data.rows[i]);
        }
    });

    // Init projects
    socket.emit('db_getProjects');
    socket.on('getProjects', function(data) {
        for (var i = 0, len = data.rows.length; i < len; i++) {
            projects.push(data.rows[i]);
        }
    });

    // Init users
    socket.emit('db_getUsers');
    socket.on('getUsers', function(data) {
        for (var i = 0, len = data.rows.length; i < len; i++) {
            users.push(data.rows[i]);
        }
    });

    // Init tasks
    socket.emit('db_getTasks');
    socket.on('getTasks', function(data) {
        for (var i = 0, len = data.rows.length; i < len; i++) {
            tasks.push(data.rows[i]);
        }

        // If we get tasks from the database we must refresh
        // boards combo and the current board.
        refreshMyBoards();
        refreshBoard();
    });
}

/**
 * Opens the connection against the database
 * @public
 *
 */
function openConnection() {
    socket = io.connect('http://localhost:8080');
    socket.emit('db_openConnection');
}

/**
 * Finds an object in the tasks array by code and name
 * @public
 *
 * @param taskCode. Task code.
 * @param taskName. Task name.
 *
 * @returns object ({ index: i, oTask: task[i] }) found or null
 */
function findTask(taskCode, taskName) {
    "use strict";
    for (var i = 0, len = tasks.length; i < len; i++) {
        if ((tasks[i].code === taskCode) && (tasks[i].name === taskName)) {
            return {
                index: i,
                oTask: tasks[i]
            }; // Return as soon as the object is found
        }
    }

    return null; // The object was not found
}

/**
 * Adds the task passed by parameter to the array
 * @public
 *
 * @param oTask. Object task.
 */
function addTask(oTask) {
    "use strict";
    if (findTask(oTask.code, oTask.name) === null) {
        tasks.push(oTask);
    } else {
        console.log("Task with code " + oTask.code + " and name " + oTask.name + " already exists");
    }
}

/**
 * Deletes the task passed by parameter from the array
 * @public
 *
 * @param index. Position of the task within the array.
 */
function deleteTask(index) {
    "use strict";
    tasks.splice(index, 1);
}

/**
 * Updates the task object properties with the data introduced by
 * the user
 *
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oTask Task object used to fill the fields
 */
function updateTask(dialog, oTask) {
    "use strict";
    oTask.code = $(dialog).find('input[name$="txtCode"]').val();
    oTask.name = $(dialog).find('input[name$="txtName"]').val();
    oTask.description = $(dialog).find('textarea[name$="txtDescription"]').val();
    oTask.board = parseInt($(dialog).find('select[name$="cmbBoard"]').val());
    oTask.estimation = parseInt($(dialog).find('input[name$="txtEstimation"]').val());
    oTask.incurred = parseInt($(dialog).find('input[name$="txtIncurred"]').val());
    oTask.project = parseInt($(dialog).find('select[name$="cmbProject"]').val());
    oTask.priority = parseInt($(dialog).find('select[name$="cmbPriority"]').val());
    oTask.type = parseInt($(dialog).find('select[name$="cmbType"]').val());
    oTask.assignedTo = parseInt($(dialog).find('select[name$="cmbAssignedTo"]').val());
}

/**
 * Updates the tasks array after each move between
 * boards
 * @public
 *
 * @param taskName. Task name.
 * @param taskState. New state. {1: new, 2: in progress, 3: finished}
 */
function updateTaskState(taskName, taskState) {
    "use strict";
    var code, name, task;

    code = taskName.split('-')[0];
    name = taskName.split('-')[1];
    task = findTask(code, name);

    // We found it in the array
    if (task !== null) {
        task.oTask.state = parseInt(taskState);
    }
}

/**
 * Gets all the tasks objects filtered by board
 * @public
 *
 * @param board. board id.
 *
 * @returns tasks[]. Array of tasks
 */
function getTasksByBoard(board) {
    "use strict";
    var tasks_board = [];

    for (var i = 0, len = tasks.length; i < len; i++) {
        if (tasks[i].board === parseInt(board)) {
            tasks_board.push(tasks[i]);
        }
    }

    return tasks_board; // The subarray of tasks
}

/**
 * Finds an object in the boards array by code and name
 * @public
 *
 * @param boardCode. Board code.
 * @param boardName. Board name.
 *
 * @returns object ({ index: i, oBoard: boards[i] }) found or null
 */
function findBoard(boardCode, boardName) {
    "use strict";
    for (var i = 0, len = boards.length; i < len; i++) {
        if ((boards[i].code === boardCode) && (boards[i].name === boardName)) {
            return {
                index: i,
                oBoard: boards[i]
            }; // Return as soon as the object is found
        }
    }

    return null; // The object was not found
}

/**
 * Updates the board object properties with the data introduced by
 * the user
 *
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oProject Board object used to fill the fields
 */
function updateBoard(dialog, oBoard) {
    "use strict";
    oBoard.code = $(dialog).find('input[name$="txtCode"]').val();
    oBoard.name = $(dialog).find('input[name$="txtBoard"]').val();
}

/**
 * Adds the board passed by parameter to the array
 * @public
 *
 * @param oBoard. Object board.
 */
function addBoard(oBoard) {
    "use strict";
    if (findBoard(oBoard.code, oBoard.name) === null) {
        socket.emit('db_insertBoard', oBoard); // insert board into the database
    } else {
        console.log("Board with code " + oBoard.code + " and name " + oBoard.name + " already exists");
    }
}

/**
 * Deletes the board passed by parameter from the array
 * @public
 *
 * @param oBoard. Object board.
 */
function deleteBoard(oBoard) {
    "use strict";
    var my_board;

    my_board = findBoard(oBoard.code, oBoard.name);

    if (my_board !== null) {
        boards.splice(my_board.index, 1);
    } else {
        console.log("Board with code " + oBoard.code + " and name " + oBoard.name + " doesn't exist");
    }
}

/**
 * Finds an object in the projects array by code and name
 * @public
 *
 * @param projectCode. Project code.
 * @param projectName. Project name.
 *
 * @returns object ({ index: i, oProject: projects[i] }) found or null
 */
function findProject(projectCode, projectName) {
    "use strict";
    for (var i = 0, len = projects.length; i < len; i++) {
        if ((projects[i].code === projectCode) && (projects[i].name === projectName)) {
            return {
                index: i,
                oProject: projects[i]
            }; // Return as soon as the object is found
        }
    }

    return null; // The object was not found
}

/**
 * Updates the project object properties with the data introduced by
 * the user
 *
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oProject Project object used to fill the fields
 */
function updateProject(dialog, oProject) {
    "use strict";
    oProject.code = $(dialog).find('input[name$="txtCode"]').val();
    oProject.name = $(dialog).find('input[name$="txtProject"]').val();
}

/**
 * Adds the project passed by parameter to the array
 * @public
 *
 * @param oProject. Object project.
 */
function addProject(oProject) {
    "use strict";
    if (findProject(oProject.code, oProject.name) === null) {
        projects.push(oProject);
        socket.emit('db_insertProject', oProject); // insert into the database
    } else {
        console.log("Project with code " + oProject.code + " and name " + oProject.name + " already exists");
    }
}

/**
 * Deletes the project passed by parameter from the array
 * @public
 *
 * @param oProject. Object project
 */
function deleteProject(oProject) {
    "use strict";
    var my_project;

    my_project = findProject(oProject.code, oProject.name);

    if (my_project !== null) {
        projects.splice(my_project.index, 1);
        socket.emit('db_insertProject', oProject); // delete from the database
    } else {
        console.log("Project with code " + oProject.code + " and name " + oProject.name + " doesn't exist");
    }
}

/**
 * Finds an object in the users array by code and name
 * @public
 *
 * @param userCode. User code.
 * @param userName. User name.
 *
 * @returns object ({ index: i, oUser: users[i] }) found or null
 */
function findUser(userCode, userName) {
    "use strict";
    for (var i = 0, len = users.length; i < len; i++) {
        if ((users[i].code === userCode) && (users[i].name === userName)) {
            return {
                index: i,
                oUser: users[i]
            }; // Return as soon as the object is found
        }
    }

    return null; // The object was not found
}

/**
 * Updates the user object properties with the data introduced by
 * the user
 *
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oUser User object used to fill the fields
 */
function updateUser(dialog, oUser) {
    "use strict";
    oUser.code = $(dialog).find('input[name$="txtCode"]').val();
    oUser.name = $(dialog).find('input[name$="txtUserName"]').val();
}

/**
 * Adds the user passed by parameter to the array
 * @public
 *
 * @param oUser. Object user.
 */
function addUser(oUser) {
    "use strict";
    if (findUser(oUser.code, oUser.name) === null) {
        users.push(oUser);
        socket.emit('db_insertUser', oUser); // insert user into the database
    } else {
        console.log("User with code " + oUser.code + " and name " + oUser.name + " already exists");
    }
}

/**
 * Deletes the user passed by parameter from the array
 * @public
 *
 * @param oUser. Object user
 */
function deleteUser(oUser) {
    "use strict";
    var my_user;

    my_user = findUser(oUser.code, oUser.name);

    if (my_user !== null) {
        users.splice(my_user.index, 1);
        socket.emit('db_deleteUser', oUser); // delete user from the database
    } else {
        console.log("User with code " + oUser.code + " and name " + oUser.name + " doesn't exist");
    }
}