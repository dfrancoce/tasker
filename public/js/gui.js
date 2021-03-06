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
            effect: 'fade',
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
        width: "425",
        height: "auto",
        modal: true,
        title: "<img class = 'icon' src = './img/task.png'/> New Task",
        position: ["center", 150],
        autoOpen: false,
        resizable: false,
        hide: {
            effect: 'fade',
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
            effect: 'fade',
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
            effect: 'fade',
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
        width: "300",
        height: "auto",
        modal: true,
        title: "<img class = 'icon' src = './img/trash.png'/> Delete",
        position: ["center", 250],
        autoOpen: false,
        resizable: false,
        hide: {
            effect: 'fade',
            duration: 500
        }
    });

    return $(dialog);
}

/**
 * Adds the "edit" and "delete" functionality to the
 * "new task" and "edit task" dialogs
 * @public
 *
 * @param dlg_newTask. Div that represents the dialog
 */
function addEditDeleteToTaskDialog(dlg_newTask) {
    // Adds "delete" functionality
    $(dlg_newTask).find('img.iconDel').unbind('click');
    $(dlg_newTask).find('img.iconDel').click(function() {
        var dialog, img, id_to_remove, name_to_remove, entity_name, select;

        img = $(this);
        dialog = showDeleteDialog();

        $(dialog).dialog("open");
        $(dialog).dialog("option", "buttons", {
            "Yes": function() {
                // We get the values from the select and the name of the entity
                // to remove
                select = $(img).siblings('select');
                entity_name = $(select).attr('id').replace('cmb', '');
                id_to_remove = $(select).find('option:selected').val();
                name_to_remove = $(select).find('option:selected').text();

                // We delete the element selected
                switch (entity_name) {
                    case 'Board':
                        var oBoard = findBoard(id_to_remove, name_to_remove);
                        deleteBoard(oBoard);
                        break;
                    case 'Project':
                        var oProject = findProject(id_to_remove, name_to_remove);
                        deleteProject(oProject);
                        break;
                    case 'AssignedTo':
                        var oUser = findUser(id_to_remove, name_to_remove);
                        deleteUser(oUser);
                        break;
                }

                $(this).dialog("close");
            },
            "No": function() {
                $(this).dialog("close");
            }
        });
    });

    // Adds "edit" functionality
    $(dlg_newTask).find('img.iconEdit').unbind('click');
    $(dlg_newTask).find('img.iconEdit').click(function() {
        var dialog, img, id_to_edit, name_to_edit, entity_name, select;

        // We get the values from the select and the name of the entity
        // to remove
        img = $(this);
        select = $(img).siblings('select');
        entity_name = $(select).attr('id').replace('cmb', '');
        id_to_edit = $(select).find('option:selected').val();
        name_to_edit = $(select).find('option:selected').text();

        // We edit the entity selected
        switch (entity_name) {
            case 'Board':
                var oBoard = findBoard(id_to_edit, name_to_edit);

                dialog = $("#dialog_newBoard");
                $(dialog).removeClass("dialog_hidden");
                $(dialog).addClass("dialog");
                openEditBoardDialog(dialog, oBoard.oBoard);
                break;
            case 'Project':
                var oProject = findProject(id_to_edit, name_to_edit);

                dialog = $("#dialog_newProject");
                $(dialog).removeClass("dialog_hidden");
                $(dialog).addClass("dialog");
                openEditProjectDialog(dialog, oProject.oProject);
                break;
            case 'AssignedTo':
                var oUser = findUser(id_to_edit, name_to_edit);

                dialog = $("#dialog_newUser");
                $(dialog).removeClass("dialog_hidden");
                $(dialog).addClass("dialog");
                openEditUserDialog(dialog, oUser.oUser);
                break;
        }
    });
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

    // Adds functionality to the "edit" and "delete" buttons
    addEditDeleteToTaskDialog(dlg_newTask);

    $(dlg_newTask).dialog("open");
    $(dlg_newTask).dialog("option", "buttons", {
        "Save": function() {
            var $el;
            var oTask = {
                "code": "",
                "name": "",
                "description": "",
                "board": 0,
                "state": 1,
                "project": 0,
                "priority": 0,
                "type": 0,
                "estimation": 0,
                "incurred": 0,
                "assignedto": 0
            };

            updateTask(dialog, oTask);
            addTask(oTask);
            refreshBoard();

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

    // Adds functionality to the "edit" and "delete" buttons
    addEditDeleteToTaskDialog(dlg_editTask);

    $(dlg_editTask).dialog("open");
    $(dlg_editTask).dialog("option", "title", "<img class = 'icon' src = './img/task.png'/> Edit Task");
    $(dlg_editTask).dialog("option", "buttons", {
        "Save": function() {
            updateTask(dialog, oTask);
            $(taskTitle).text(oTask.code + "-" + oTask.name);
            refreshBoard();
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
 * Open an "Edit Board" dialog. Reuses showNewBoardDialog function.
 *
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oBoard Object to be updated
 */
function openEditBoardDialog(dialog, oBoard) {
    "use strict";
    var dlg_editBoard, task_code, task_name, task;

    dlg_editBoard = showNewBoardDialog(dialog);
    setNewBoardDialogFields(oBoard);

    $(dlg_editBoard).unbind("dialogclose");
    $(dlg_editBoard).bind("dialogclose", function(event, ui) {
        $(dialog).removeClass("dialog");
        $(dialog).addClass("dialog_hidden");
    });

    $(dlg_editBoard).dialog("open");
    $(dlg_editBoard).dialog("option", "title", "<img class = 'icon' src = './img/task.png'/> Edit board");
    $(dlg_editBoard).dialog("option", "buttons", {
        "Save": function() {
            updateBoard(dialog, oBoard);
            refreshMyBoards();
            setNewTaskDialogCombos(null);
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
 * Opens a "Edit Project" dialog
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oProject Object to be updated
 */
function openEditProjectDialog(dialog, oProject) {
    "use strict";
    var dlg_newProject;

    dlg_newProject = showNewProjectDialog(dialog);
    setNewProjectDialogFields(oProject);

    $(dlg_newProject).unbind("dialogclose");
    $(dlg_newProject).bind("dialogclose", function(event, ui) {
        $(dialog).removeClass("dialog");
        $(dialog).addClass("dialog_hidden");
    });

    $(dlg_newProject).dialog("open");
    $(dlg_newProject).dialog("option", "buttons", {
        "Save": function() {
            updateProject(dialog, oProject);
            setNewTaskDialogCombos(null);
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
 * Opens a "Edit User" dialog
 * @public
 *
 * @param {Object} dialog div that acts like a popup window
 * @param {Object} oUser Object to be updated
 */
function openEditUserDialog(dialog, oUser) {
    "use strict";
    var dlg_newUser;

    dlg_newUser = showNewUserDialog(dialog);
    setNewUserDialogFields(oUser);

    $(dlg_newUser).unbind("dialogclose");
    $(dlg_newUser).bind("dialogclose", function(event, ui) {
        $(dialog).removeClass("dialog");
        $(dialog).addClass("dialog_hidden");
    });

    $(dlg_newUser).dialog("open");
    $(dlg_newUser).dialog("option", "buttons", {
        "Save": function() {
            updateUser(dialog, oUser);
            setNewTaskDialogCombos(null);
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
    $("select[name$='cmbBoard']").find('option').remove();
    for (var i = 0, len = boards.length; i < len; i++) {
        $("select[name$='cmbBoard']")[0].options[i] = new Option(
            boards[i].name,
            boards[i].id
        );
    };

    // Projects
    $("select[name$='cmbProject']").find('option').remove();
    for (var i = 0, len = projects.length; i < len; i++) {
        $("select[name$='cmbProject']")[0].options[i] = new Option(
            projects[i].name,
            projects[i].id
        );
    };

    // Priorities
    $("select[name$='cmbPriority']").find('option').remove();
    for (var i = 0, len = priorities.length; i < len; i++) {
        $("select[name$='cmbPriority']")[0].options[i] = new Option(
            priorities[i].name,
            priorities[i].id
        );
    };

    // Types
    $("select[name$='cmbType']").find('option').remove();
    for (var i = 0, len = types.length; i < len; i++) {
        $("select[name$='cmbType']")[0].options[i] = new Option(
            types[i].name,
            types[i].id
        );
    };

    // Users
    $("select[name$='cmbAssignedTo']").find('option').remove();
    for (var i = 0, len = users.length; i < len; i++) {
        $("select[name$='cmbAssignedTo']")[0].options[i] = new Option(
            users[i].name,
            users[i].id
        );
    };

    if (oTask !== null) {
        $("select[name$='cmbBoard']").find("option[value='" + oTask.board + "']").attr("selected", "selected");
        $("select[name$='cmbProject']").find("option[value='" + oTask.project + "']").attr("selected", "selected");
        $("select[name$='cmbPriority']").find("option[value='" + oTask.priority + "']").attr("selected", "selected");
        $("select[name$='cmbType']").find("option[value='" + oTask.type + "']").attr("selected", "selected");
        $("select[name$='cmbAssignedTo']").find("option[value='" + oTask.assignedto + "']").attr("selected", "selected");
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
    var value;

    // Get selected value
    value = $("select[name$='cmbMyBoards']").find("option:selected").val();

    // Remove all the options
    $("select[name$='cmbMyBoards']").empty();

    // Reload from the array
    for (var i = 0, len = boards.length; i < len; i++) {
        $("select[name$='cmbMyBoards']")[0].options[i] = new Option(
            boards[i].name,
            boards[i].id
        );

        if (parseInt(value) === boards[i].id) {
            $("select[name$='cmbMyBoards']").find("option[value='" + boards[i].id + "']").attr("selected", "selected");
        }
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
    var $el, clazz, board, tasks_board = [];

    board = $("select[name$='cmbMyBoards']").val();
    tasks_board = getTasksByBoard(board);

    // Clears the board
    $(".board").find("table").remove();

    for (var i = 0, len = tasks_board.length; i < len; i++) {
        switch (parseInt(tasks_board[i].state)) {
            case 1:
                clazz = "toDo";
                break;
            case 2:
                clazz = "progress";
                break;
            case 3:
                clazz = "finished";
                break;
        }

        $el = generateTaskElement(tasks_board[i].code + '-' + tasks_board[i].name, clazz);
        stickTask($el, clazz);
    }
}

/**
 * After loading...
 * @public
 */
$(document).ready(function() {
    "use strict";
    // Initializes data
    initData();

    // Initialize GUI stuff
    setDroppables();
    setDraggables();
    handleMenu();
    handleMouseEvents();
});
