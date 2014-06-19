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
    socket.on('getBoards', function(data, error) {
        if (error === null) {
            for (var i = 0, len = data.rows.length; i < len; i++) {
                boards.push(data.rows[i]);
            }

            // Each time we get boards from the database we must
            // refresh the boards combo and the board itself.
            refreshMyBoards();
            refreshBoard();
        } else {
            console.log("Error retrieving boards");
        }
    });

    // Init priorities
    socket.emit('db_getPriorities');
    socket.on('getPriorities', function(data, error) {
        if (error === null) {
            for (var i = 0, len = data.rows.length; i < len; i++) {
                priorities.push(data.rows[i]);
            }
        } else {
            console.log("Error retrieving priorities");
        }
    });

    // Init types
    socket.emit('db_getTypes');
    socket.on('getTypes', function(data, error) {
        if (error === null) {
            for (var i = 0, len = data.rows.length; i < len; i++) {
                types.push(data.rows[i]);
            }
        } else {
            console.log("Error retrieving types");
        }
    });

    // Init projects
    socket.emit('db_getProjects');
    socket.on('getProjects', function(data, error) {
        if (error === null) {
            for (var i = 0, len = data.rows.length; i < len; i++) {
                projects.push(data.rows[i]);
            }
        } else {
            console.log("Error retrieving projects");
        }
    });

    // Init users
    socket.emit('db_getUsers');
    socket.on('getUsers', function(data, error) {
        if (error === null) {
            for (var i = 0, len = data.rows.length; i < len; i++) {
                users.push(data.rows[i]);
            }
        } else {
            console.log("Error retriving users");
        }
    });

    // Init tasks
    socket.emit('db_getTasks');
    socket.on('getTasks', function(data, error) {
        if (error === null) {
            for (var i = 0, len = data.rows.length; i < len; i++) {
                tasks.push(data.rows[i]);
            }

            // If we get tasks from the database we must refresh
            // boards combo and the current board.
            refreshMyBoards();
            refreshBoard();
        } else {
            console.log("Error retrieving tasks");
        }
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
 * Finds an object in the tasks array by id and name
 * @public
 *
 * @param taskId. Task id.
 * @param taskName. Task name.
 *
 * @returns object ({ index: i, oTask: task[i] }) found or null
 */
function findTask(taskId, taskName) {
    "use strict";
    for (var i = 0, len = tasks.length; i < len; i++) {
        if ((tasks[i].id === parseInt(taskId)) && (tasks[i].name === taskName)) {
            return {
                index: i,
                oTask: tasks[i]
            }; // Return as soon as the object is found
        }
    }

    return null; // The object was not found
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
function findTaskByCodeName(taskCode, taskName) {
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
 * Adds the task passed by parameter to the array and
 * inserts the task into the database
 * @public
 *
 * @param oTask. Object task.
 */
function addTask(oTask) {
    "use strict";
    if (findTaskByCodeName(oTask.code, oTask.name) === null) {
        socket.emit('db_insertTask', oTask); // insert task into the database
    }
}

/**
 * Deletes the task passed by parameter from the array and
 * removes the task from the database table
 * @public
 *
 * @param oTask. Object to be deleted.
 */
function deleteTask(oTask) {
    "use strict";

    if (oTask !== null) {
        tasks.splice(oTask.index, 1);
        socket.emit('db_deleteTask', oTask.oTask); // delete task from the database
        socket.on('onDeleteTask', function(result, msg) {
            if (result) {
                refreshBoard();
            }

            console.log(msg);
        });
    }
}

/**
 * Updates the task object properties with the data introduced by
 * the user and persist the changes to the database
 *
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oTask Task object used to fill the fields
 */
function updateTask(dialog, oTask) {
    "use strict";
    var new_task;

    new_task = findTaskByCodeName(oTask.code, oTask.name);

    if (new_task !== null) {
        new_task.oTask.code = $(dialog).find('input[name$="txtCode"]').val();
        new_task.oTask.name = $(dialog).find('input[name$="txtName"]').val();
        new_task.oTask.description = $(dialog).find('textarea[name$="txtDescription"]').val();
        new_task.oTask.board = parseInt($(dialog).find('select[name$="cmbBoard"]').val());

        if ($(dialog).find('input[name$="txtEstimation"]').val() === "") {
            new_task.oTask.estimation = 0;
        } else {
            new_task.oTask.estimation = parseInt($(dialog).find('input[name$="txtEstimation"]').val());
        }

        if ($(dialog).find('input[name$="txtIncurred"]').val() === "") {
            new_task.oTask.incurred = 0;
        } else {
            new_task.oTask.incurred = parseInt($(dialog).find('input[name$="txtIncurred"]').val());
        }

        new_task.oTask.project = parseInt($(dialog).find('select[name$="cmbProject"]').val());
        new_task.oTask.priority = parseInt($(dialog).find('select[name$="cmbPriority"]').val());
        new_task.oTask.type = parseInt($(dialog).find('select[name$="cmbType"]').val());
        new_task.oTask.assignedto = parseInt($(dialog).find('select[name$="cmbAssignedTo"]').val());

        socket.emit('db_updateTask', new_task.oTask);
    } else {
        oTask.code = $(dialog).find('input[name$="txtCode"]').val();
        oTask.name = $(dialog).find('input[name$="txtName"]').val();
        oTask.description = $(dialog).find('textarea[name$="txtDescription"]').val();
        oTask.board = parseInt($(dialog).find('select[name$="cmbBoard"]').val());

        if ($(dialog).find('input[name$="txtEstimation"]').val() === "") {
            oTask.estimation = 0;
        } else {
            oTask.estimation = parseInt($(dialog).find('input[name$="txtEstimation"]').val());
        }

        if ($(dialog).find('input[name$="txtIncurred"]').val() === "") {
            oTask.incurred = 0;
        } else {
            oTask.incurred = parseInt($(dialog).find('input[name$="txtIncurred"]').val());
        }

        oTask.project = parseInt($(dialog).find('select[name$="cmbProject"]').val());
        oTask.priority = parseInt($(dialog).find('select[name$="cmbPriority"]').val());
        oTask.type = parseInt($(dialog).find('select[name$="cmbType"]').val());
        oTask.assignedto = parseInt($(dialog).find('select[name$="cmbAssignedTo"]').val());
    }
}

/**
 * Updates the tasks array and database table after each move between
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
    task = findTaskByCodeName(code, name);

    // We found it in the array
    if (task !== null) {
        task.oTask.state = parseInt(taskState);
        socket.emit('db_updateTask', task.oTask);
    }
}

/**
 * Gets all the tasks objects from the array filtered by board
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
 * Finds an object in the boards array by id and name
 * @public
 *
 * @param boardId. Board id.
 * @param boardName. Board name.
 *
 * @returns object ({ index: i, oBoard: boards[i] }) found or null
 */
function findBoard(boardId, boardName) {
    "use strict";
    for (var i = 0, len = boards.length; i < len; i++) {
        if ((boards[i].id === parseInt(boardId)) && (boards[i].name === boardName)) {
            return {
                index: i,
                oBoard: boards[i]
            }; // Return as soon as the object is found
        }
    }

    return null; // The object was not found
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
function findBoardByCodeName(boardCode, boardName) {
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
 * the user and persists the changes to the database
 *
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oProject Board object used to fill the fields
 */
function updateBoard(dialog, oBoard) {
    "use strict";
    var new_board;

    new_board = findBoardByCodeName(oBoard.code, oBoard.name);

    if (new_board !== null) {
        new_board.oBoard.code = $(dialog).find('input[name$="txtCode"]').val();
        new_board.oBoard.name = $(dialog).find('input[name$="txtBoard"]').val();

        socket.emit('db_updateBoard', new_board.oBoard);
    } else {
        oBoard.code = $(dialog).find('input[name$="txtCode"]').val();
        oBoard.name = $(dialog).find('input[name$="txtBoard"]').val();
    }
}

/**
 * Adds the board passed by parameter to the array and inserts the
 * the element into the database
 * @public
 *
 * @param oBoard. Object board.
 */
function addBoard(oBoard) {
    "use strict";
    if (findBoardByCodeName(oBoard.code, oBoard.name) === null) {
        socket.emit('db_insertBoard', oBoard); // insert board into the database
    }
}

/**
 * Deletes the board passed by parameter from the array and from the
 * database
 * @public
 *
 * @param oBoard. Object board.
 */
function deleteBoard(oBoard) {
    "use strict";

    if (oBoard !== null) {
        socket.emit('db_deleteBoard', oBoard.oBoard); // delete board from the database
        socket.on('onDeleteBoard', function(result, msg) {
            if (result) {
                boards.splice(oBoard.index, 1);
                refreshMyBoards();
                setNewTaskDialogCombos(null);
            }

            console.log(msg);
        });
    }
}

/**
 * Finds an object in the projects array by id and name
 * @public
 *
 * @param projectCode. Project id.
 * @param projectName. Project name.
 *
 * @returns object ({ index: i, oProject: projects[i] }) found or null
 */
function findProject(projectId, projectName) {
    "use strict";
    for (var i = 0, len = projects.length; i < len; i++) {
        if ((projects[i].id === parseInt(projectId)) && (projects[i].name === projectName)) {
            return {
                index: i,
                oProject: projects[i]
            }; // Return as soon as the object is found
        }
    }

    return null; // The object was not found
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
function findProjectByCodeName(projectCode, projectName) {
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
 * the user and persists the changes to the database
 *
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oProject Project object used to fill the fields
 */
function updateProject(dialog, oProject) {
    "use strict";
    var new_project;

    new_project = findProjectByCodeName(oProject.code, oProject.name);

    if (new_project !== null) {
        new_project.oProject.code = $(dialog).find('input[name$="txtCode"]').val();
        new_project.oProject.name = $(dialog).find('input[name$="txtProject"]').val();

        socket.emit('db_updateProject', new_project.oProject);
    } else {
        oProject.code = $(dialog).find('input[name$="txtCode"]').val();
        oProject.name = $(dialog).find('input[name$="txtProject"]').val();
    }
}

/**
 * Adds the project passed by parameter to the array and inserts
 * the element into the database
 * @public
 *
 * @param oProject. Object project.
 */
function addProject(oProject) {
    "use strict";
    if (findProjectByCodeName(oProject.code, oProject.name) === null) {
        socket.emit('db_insertProject', oProject); // insert project into the database
    }
}

/**
 * Deletes the project passed by parameter from the array and from
 * the database table
 * @public
 *
 * @param oProject. Object project
 */
function deleteProject(oProject) {
    "use strict";

    if (oProject !== null) {
        projects.splice(oProject.index, 1);
        socket.emit('db_deleteProject', oProject.oProject); // delete project from the database
        socket.on('onDeleteProject', function(result, msg) {
            if (result) {
                setNewTaskDialogCombos(null);
            }

            console.log(msg);
        });
    }
}

/**
 * Finds an object in the users array by id and name
 * @public
 *
 * @param userCode. User id.
 * @param userName. User name.
 *
 * @returns object ({ index: i, oUser: users[i] }) found or null
 */
function findUser(userId, userName) {
    "use strict";
    for (var i = 0, len = users.length; i < len; i++) {
        if ((users[i].id === parseInt(userId)) && (users[i].name === userName)) {
            return {
                index: i,
                oUser: users[i]
            }; // Return as soon as the object is found
        }
    }

    return null; // The object was not found
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
function findUserByCodeName(userCode, userName) {
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
 * the user and persists the changes to the database
 *
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oUser User object used to fill the fields
 */
function updateUser(dialog, oUser) {
    "use strict";
    var new_user;

    new_user = findUserByCodeName(oUser.code, oUser.name);

    if (new_user !== null) {
        new_user.oUser.code = $(dialog).find('input[name$="txtCode"]').val();
        new_user.oUser.name = $(dialog).find('input[name$="txtUserName"]').val();

        socket.emit('db_updateUser', new_user.oUser);
    } else {
        oUser.code = $(dialog).find('input[name$="txtCode"]').val();
        oUser.name = $(dialog).find('input[name$="txtUserName"]').val();
    }
}

/**
 * Adds the user passed by parameter to the array and inserts
 * the element into the database
 * @public
 *
 * @param oUser. Object user.
 */
function addUser(oUser) {
    "use strict";
    if (findUserByCodeName(oUser.code, oUser.name) === null) {
        socket.emit('db_insertUser', oUser); // insert user into the database
    }
}

/**
 * Deletes the user passed by parameter from the array and
 * removes the element from the database
 * @public
 *
 * @param oUser. Object user
 */
function deleteUser(oUser) {
    "use strict";

    if (oUser !== null) {
        users.splice(oUser.index, 1);
        socket.emit('db_deleteUser', oUser.oUser); // delete user from the database
        socket.on('onDeleteUser', function(result, msg) {
            if (result) {
                setNewTaskDialogCombos(null);
            }

            console.log(msg);
        });
    }
}