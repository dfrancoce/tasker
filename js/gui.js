/*jslint browser: true*/ /*global  $*/

/**
 * @fileOverview Contains GUI functions.
 * @author <a href="mailto:danielfrancocecilia@gmail.com">Daniel Franco</a>
 * @version 1.0
 * @since 1.0
 */

 /**
 * Generates "New Board" dialog with the info
 * to be filled by the user
 * @public
 *
 * @param dialog DIV used as dialog
 * @returns dialog DOM element
 */
function showNewBoardDialog(dialog) {
    "use strict";
    $(dialog).dialog({
        width: "400",
        height: "auto",
        modal: true,
        title: "<img class = 'icon' src = './img/task.png'/> New Board",
        position: ["center", 150],
        autoOpen: false,
        resizable: false,
        hide: {
            effect: 'fold',
            duration: 500
        }
    });

    return $(dialog);
}

/**
 * Generates "New Task" dialog with the info
 * to be filled by the user
 * @public
 *
 * @param dialog DIV used as dialog
 * @returns dialog DOM element
 */
function showNewTaskDialog(dialog) {
    "use strict";
    $(dialog).dialog({
        width: "400",
        height: "auto",
        modal: true,
        title: "<img class = 'icon' src = './img/task.png'/> New Task",
        position: ["center", 150],
        autoOpen: false,
        resizable: false,
        hide: {
            effect: 'fold',
            duration: 500
        }
    });

    return $(dialog);
}

/**
 * Generates "New Project" dialog with the info
 * to be filled by the user
 * @public
 *
 * @param dialog DIV used as dialog
 * @returns dialog DOM element
 */
function showNewProjectDialog(dialog) {
    "use strict";
    $(dialog).dialog({
        width: "400",
        height: "auto",
        modal: true,
        title: "<img class = 'icon' src = './img/project.png'/> New Project",
        position: ["center", 250],
        autoOpen: false,
        resizable: false,
        hide: {
            effect: 'fold',
            duration: 500
        }
    });

    return $(dialog);
}

/**
 * Generates "New User" dialog with the info
 * to be filled by the user
 * @public
 *
 * @param dialog DIV used as dialog
 * @returns dialog DOM element
 */
function showNewUserDialog(dialog) {
    "use strict";
    $(dialog).dialog({
        width: "400",
        height: "auto",
        modal: true,
        title: "<img class = 'icon' src = './img/user.png'/> New User",
        position: ["center", 250],
        autoOpen: false,
        resizable: false,
        hide: {
            effect: 'fold',
            duration: 500
        }
    });

    return $(dialog);
}

/**
 * Generates delete dialog to confirm
 * the elimination
 * @public
 *
 * @returns dialog DOM element
 */
function showDeleteDialog() {
    "use strict";
    var dialog, icon, message;

    dialog = $(document.createElement('div'));
    icon = $(document.createElement('img'));
    message = $(document.createElement('span'));

    $(message).text("Are you sure you want to delete it?");
    $(icon).attr('src', './img/warning.png');
    $(icon).addClass('iconDialogMessage');

    $(dialog).append($(icon));
    $(dialog).append($(message));

    $(dialog).dialog({
        width: "250",
        height: "auto",
        modal: true,
        title: "<img class = 'icon' src = './img/trash.png'/> Delete",
        position: ["center", 250],
        autoOpen: false,
        resizable: false,
        hide: {
            effect: 'fold',
            duration: 500
        }
    });

    return $(dialog);
}

/**
 * Opens a "New Task" dialog
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 */
function openNewTaskDialog(dialog) {
    "use strict";
    var dlg_newTask;

    dlg_newTask = showNewTaskDialog(dialog);
    setNewTaskDialogFields(null);

    $(dlg_newTask).unbind("dialogclose");
    $(dlg_newTask).bind("dialogclose", function(event, ui) {
        $(dialog).removeClass("dialog");
        $(dialog).addClass("dialog_hidden");
    });

    $(dlg_newTask).dialog("open");
    $(dlg_newTask).dialog("option", "buttons", {
        "Save": function() {
            var $el;
            var oTask = {
                "code": "",
                "name": "",
                "description": "",
                "board": "",
                "state": "1",
                "project": "",
                "priority": "",
                "type": "",
                "estimation": "",
                "incurred": "",
                "assignedTo": ""
            };

            updateTask(dialog, oTask);
            addTask(oTask);

            $el = generateTaskElement(oTask.code + '-' + oTask.name, "toDo");
            stickTask($el, "toDo");

            $(this).dialog("close");
        },
        "Cancel": function() {
            $(this).dialog("close");
        }
    });
}

/**
 * Open an "Edit Task" dialog. Reuses showNewTaskDialog function.
 *
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oTask Object to be updated
 * @param {Object} span DOM with the code-name title to be updated
 */
function openEditTaskDialog(dialog, oTask, taskTitle) {
    "use strict";
    var dlg_editTask, task_code, task_name, task;

    dlg_editTask = showNewTaskDialog(dialog);
    setNewTaskDialogFields(oTask);

    $(dlg_editTask).unbind("dialogclose");
    $(dlg_editTask).bind("dialogclose", function(event, ui) {
        $(dialog).removeClass("dialog");
        $(dialog).addClass("dialog_hidden");
    });

    $(dlg_editTask).dialog("open");
    $(dlg_editTask).dialog("option", "title", "<img class = 'icon' src = './img/task.png'/> Edit Task");
    $(dlg_editTask).dialog("option", "buttons", {
        "Save": function() {
            updateTask(dialog, oTask);
            $(taskTitle).text(oTask.code + "-" + oTask.name);
            $(this).dialog("close");
        },
        "Cancel": function() {
            $(this).dialog("close");
        }
    });
}

/**
 * Opens a "New Board" dialog
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 */
function openNewBoardDialog(dialog) {
    "use strict";
    var dlg_newBoard;

    dlg_newBoard = showNewBoardDialog(dialog);
    setNewBoardDialogFields(null);

    $(dlg_newBoard).unbind("dialogclose");
    $(dlg_newBoard).bind("dialogclose", function(event, ui) {
        $(dialog).removeClass("dialog");
        $(dialog).addClass("dialog_hidden");
    });

    $(dlg_newBoard).dialog("open");
    $(dlg_newBoard).dialog("option", "buttons", {
        "Save": function() {
            var oBoard = {
                code: "",
                name: ""
            };

            updateBoard(dialog, oBoard);
            addBoard(oBoard);
            refreshMyBoards();
            $(this).dialog("close");
        },
        "Cancel": function() {
            $(this).dialog("close");
        }
    });
}

/**
 * Opens a "New Project" dialog
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 */
function openNewProjectDialog(dialog) {
    "use strict";
    var dlg_newProject;

    dlg_newProject = showNewProjectDialog(dialog);
    setNewProjectDialogFields(null);

    $(dlg_newProject).unbind("dialogclose");
    $(dlg_newProject).bind("dialogclose", function(event, ui) {
        $(dialog).removeClass("dialog");
        $(dialog).addClass("dialog_hidden");
    });

    $(dlg_newProject).dialog("open");
    $(dlg_newProject).dialog("option", "buttons", {
        "Save": function() {
            var oProject = {
                code: "",
                name: ""
            };

            updateProject(dialog, oProject);
            addProject(oProject);
            $(this).dialog("close");
        },
        "Cancel": function() {
            $(this).dialog("close");
        }
    });
}

/**
 * Opens a "New User" dialog
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 */
function openNewUserDialog(dialog) {
    "use strict";
    var dlg_newUser;

    dlg_newUser = showNewUserDialog(dialog);
    setNewUserDialogFields(null);

    $(dlg_newUser).unbind("dialogclose");
    $(dlg_newUser).bind("dialogclose", function(event, ui) {
        $(dialog).removeClass("dialog");
        $(dialog).addClass("dialog_hidden");
    });

    $(dlg_newUser).dialog("open");
    $(dlg_newUser).dialog("option", "buttons", {
        "Save": function() {
            var oUser = {
                code: "",
                name: ""
            };

            updateUser(dialog, oUser);
            addUser(oUser);
            $(this).dialog("close");
        },
        "Cancel": function() {
            $(this).dialog("close");
        }
    });
}

/**
 * Handles the mouse events
 * @public
 */
function handleMouseEvents() {
    "use strict";

    $("#cmbMyBoards").change(function() {
        refreshBoard();
    });
}

/**
 * Handles the menu clicks
 * @public
 */
function handleMenu() {
    "use strict";

    $("a.newBoard").click(function() {
        var dialog;

        dialog = $("#dialog_newBoard");
        $(dialog).addClass("dialog");
        $(dialog).removeClass("dialog_hidden");
        openNewBoardDialog($(dialog));
    });

    $("a.newTask").click(function() {
        var dialog;

        dialog = $("#dialog_newTask");
        $(dialog).addClass("dialog");
        $(dialog).removeClass("dialog_hidden");
        openNewTaskDialog($(dialog));
    });

    $("a.newProject").click(function() {
        var dialog;

        dialog = $("#dialog_newProject");
        $(dialog).addClass("dialog");
        $(dialog).removeClass("dialog_hidden");
        openNewProjectDialog($(dialog));
    });

    $("a.newUser").click(function() {
        var dialog;

        dialog = $("#dialog_newUser");
        $(dialog).addClass("dialog");
        $(dialog).removeClass("dialog_hidden");
        openNewUserDialog($(dialog));
    });

    $("li > a").on("hover", function(e) {
        if (e.type === "mouseenter") {
            $(this).addClass("selected");
        } else if (e.type === "mouseleave") {
            $(this).removeClass("selected");
        }
    });
}

/**
 * Sets the behaviour of the "draggable" elements
 * @public
 */
function setDraggables() {
    "use strict";
    $('.draggable').draggable({
        cancel: "a.ui-icon",
        revert: "false",
        containment: "document",
        helper: "clone",
        cursor: "move",
        scroll: false
    });
}

/**
 * Sets the behaviour of the "droppable" elements
 * @public
 */
function setDroppables() {
    "use strict";
    $("div.droppableToDo").droppable({
        accept: 'span.progress, span.finished',
        activeClass: "ui-state-highlight",
        drop: function(event, ui) {
            stickTask(ui.draggable, "toDo");
        }
    });

    $("div.droppableInProgress").droppable({
        accept: 'span.toDo, span.finished',
        activeClass: "ui-state-highlight",
        drop: function(event, ui) {
            stickTask(ui.draggable, "progress");
        }
    });

    $("div.droppableFinished").droppable({
        accept: 'span.toDo, span.progress',
        activeClass: "ui-state-highlight",
        drop: function(event, ui) {
            stickTask(ui.draggable, "finished");
        }
    });
}

/**
 * Sets the content of the combos fields in the New Task (Edit Task)
 * view
 * @public
 *
 * @param oTask. Object task used to set the selected values
 */
function setNewTaskDialogCombos(oTask) {
    "use strict";
    // Boards 
    for (var i = 0, len = boards.length; i < len; i++) {
        $("select[name$='cmbBoard']")[0].options[i] = new Option(
            boards[i].name,
            boards[i].code
        );
    };

    // Projects 
    for (var i = 0, len = projects.length; i < len; i++) {
        $("select[name$='cmbProject']")[0].options[i] = new Option(
            projects[i].name,
            projects[i].code
        );
    };

    // Priorities
    for (var i = 0, len = priorities.length; i < len; i++) {
        $("select[name$='cmbPriority']")[0].options[i] = new Option(
            priorities[i].name,
            priorities[i].code
        );
    };

    // Types
    for (var i = 0, len = types.length; i < len; i++) {
        $("select[name$='cmbType']")[0].options[i] = new Option(
            types[i].name,
            types[i].code
        );
    };

    // Users
    for (var i = 0, len = users.length; i < len; i++) {
        $("select[name$='cmbAssignedTo']")[0].options[i] = new Option(
            users[i].name,
            users[i].code
        );
    };

    if (oTask !== null) {
        $("select[name$='cmbBoard']").find("option[value='" + oTask.board + "']").attr("selected", "selected");
        $("select[name$='cmbProject']").find("option[value='" + oTask.project + "']").attr("selected", "selected");
        $("select[name$='cmbPriority']").find("option[value='" + oTask.priority + "']").attr("selected", "selected");
        $("select[name$='cmbType']").find("option[value='" + oTask.type + "']").attr("selected", "selected");
        $("select[name$='cmbAssignedTo']").find("option[value='" + oTask.assignedTo + "']").attr("selected", "selected");
    } else {
        $("select[name$='cmbBoard']").find("option:first").attr("selected", "selected");
        $("select[name$='cmbProject']").find("option:first").attr("selected", "selected");
        $("select[name$='cmbPriority']").find("option:first").attr("selected", "selected");
        $("select[name$='cmbType']").find("option:first").attr("selected", "selected");
        $("select[name$='cmbAssignedTo']").find("option:first").attr("selected", "selected");
    }
}

/**
 * Updates the input fields of the new task and edit task
 * view with the object data passed by parameter
 *
 * @public
 *
 * @param {Object} oTask Task object used to fill the fields
 */
function setNewTaskDialogFields(oTask) {
    "use strict";
    var dialog = $("#dialog_newTask");

    // Set combos
    setNewTaskDialogCombos(oTask);

    // Set inputs
    if (oTask !== null) {
        $(dialog).find('input[name$="txtCode"]').val(oTask.code);
        $(dialog).find('input[name$="txtName"]').val(oTask.name);
        $(dialog).find('textarea[name$="txtDescription"]').val(oTask.description);
        $(dialog).find('input[name$="txtEstimation"]').val(oTask.estimation);
        $(dialog).find('input[name$="txtIncurred"]').val(oTask.incurred);
    } else {
        $(dialog).find('input').val('');
        $(dialog).find('textarea').val('');
    }
}

/**
 * Updates the input fields of the new board and edit board
 * view with the object data passed by parameter
 *
 * @public
 *
 * @param {Object} oBoard Board object used to fill the fields
 */
function setNewBoardDialogFields(oBoard) {
    "use strict";
    var dialog = $("#dialog_newBoard");

    // Set inputs
    if (oBoard !== null) {
        $(dialog).find('input[name$="txtCode"]').val(oBoard.code);
        $(dialog).find('input[name$="txtBoard"]').val(oBoard.name);
    } else {
        $(dialog).find('input').val('');
    }
}

/**
 * Updates the input fields of the new project and edit project
 * view with the object data passed by parameter
 *
 * @public
 *
 * @param {Object} oProject Project object used to fill the fields
 */
function setNewProjectDialogFields(oProject) {
    "use strict";
    var dialog = $("#dialog_newProject");

    // Set inputs
    if (oProject !== null) {
        $(dialog).find('input[name$="txtCode"]').val(oProject.code);
        $(dialog).find('input[name$="txtProject"]').val(oProject.name);
    } else {
        $(dialog).find('input').val('');
    }
}

/**
 * Updates the input fields of the new user and edit user
 * view with the object data passed by parameter
 *
 * @public
 *
 * @param {Object} oUser User object used to fill the fields
 */
function setNewUserDialogFields(oUser) {
    "use strict";
    var dialog = $("#dialog_newUser");

    // Set inputs
    if (oUser !== null) {
        $(dialog).find('input[name$="txtCode"]').val(oUser.code);
        $(dialog).find('input[name$="txtUserName"]').val(oUser.name);
    } else {
        $(dialog).find('input').val('');
    }
}

/**
 * Refreshes the combo cmbMyBoards with the information
 * stored in the array of boards
 *
 * @public
 * 
 */
function refreshMyBoards() {
    "use strict";

    // Remove all the options
    $("select[name$='cmbMyBoards']").empty();

    // Reload from the array
    for (var i = 0, len = boards.length; i < len; i++) {
        $("select[name$='cmbMyBoards']")[0].options[i] = new Option(
            boards[i].name,
            boards[i].code
        );
    }
}

/**
 * Refreshes the board which is in use at the moment 
 *
 * @public
 * 
 */
function refreshBoard() {
    "use strict";
    var board, tasks_board = [];

    board = $("select[name$='cmbMyBoards']").val();
    tasks_board = getTasksByBoard(board);

    // Clears the board
    $(".board").find("table").remove();

    for (var i = 0, len = tasks_board.length; i < len; i++) {
        var $el = generateTaskElement(tasks_board[i].code + '-' + tasks_board[i].name, "toDo");
        stickTask($el, "toDo");
    }
}

/**
 * After loading...
 * @public
 */
$(document).ready(function() {
    "use strict";
    setDroppables();
    setDraggables();
    handleMenu();
    handleMouseEvents();
});