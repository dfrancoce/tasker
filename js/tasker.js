/**
 * Generates some tasks to run some testing
 *
 * @public
 */
function test_init() {
    // Projects
    var p1 = {
        "code": "101",
        "name": "PA"
    }

    var p2 = {
        "code": "102",
        "name": "PB"
    }

    var p3 = {
        "code": "103",
        "name": "PC"
    }

    projects.push(p1);
    projects.push(p2);
    projects.push(p3);
    // </> Projects

    // Priorities
    var pr1 = {
        "code": "1",
        "name": "Low"
    }

    var pr2 = {
        "code": "2",
        "name": "Medium"
    }

    var pr3 = {
        "code": "3",
        "name": "High"
    }

    priorities.push(pr1);
    priorities.push(pr2);
    priorities.push(pr3);
    // </> Priorities

    // Types
    var ty1 = {
        "code": "1",
        "name": "Development"
    }

    var ty2 = {
        "code": "2",
        "name": "Testing"
    }

    var ty3 = {
        "code": "3",
        "name": "Documentation"
    }

    types.push(ty1);
    types.push(ty2);
    types.push(ty3);
    // </> Types

    // Users
    var u1 = {
        "code": "1",
        "name": "User 1"
    }

    var u2 = {
        "code": "2",
        "name": "User 2"
    }

    var u3 = {
        "code": "3",
        "name": "User 3"
    }

    users.push(u1);
    users.push(u2);
    users.push(u3);
    // </> Types

    // Tasks
    var t1 = {
        "code": "t1",
        "name": "Test 1",
        "description": "Description of the test 1",
        "state": "1",
        "project": "1",
        "priority": "1",
        "type": "2",
        "estimation": "16",
        "incurred": "4",
        "assignedTo": "2"
    }

    var t2 = {
        "code": "t2",
        "name": "Test 2",
        "description": "Description of the test 2",
        "state": "1",
        "project": "2",
        "priority": "2",
        "type": "1",
        "estimation": "24",
        "incurred": "2",
        "assignedTo": "1"
    }

    var t3 = {
        "code": "t3",
        "name": "Test 3",
        "description": "Description of the test 3",
        "state": "1",
        "project": "3",
        "priority": "3",
        "type": "3",
        "estimation": "8",
        "incurred": "6",
        "assignedTo": "3"
    }

    tasks.push(t1);
    tasks.push(t2);
    tasks.push(t3);
    // </> Tasks	

    $toDo = $(".board_toDo");

    for (i = 0; i < tasks.length; i++) {
        var $el = generateTaskElement(tasks[i].code + '-' + tasks[i].name, "toDo");
        stickTask($el, "toDo");
    }
};

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
 * Generates the element task draggable within
 * the div droppable
 * @public
 *
 * @param taskName. Task name.
 * @param boardClassName. ClassName that identifies where
 * is the task
 *
 * @returns el DOM element of the task
 */
function generateTaskElement(taskName, boardClassName) {
    "use strict";
    var el, icon_trash, icon_edit, td, tr, item;

    td = document.createElement('td');

    // Creates span "draggable" with the name of the task
    item = document.createElement('span');
    $(item).addClass("taskName draggable ui-draggable " + boardClassName);
    $(item).text(taskName);
    $(item).appendTo(td);

    // Creates DOM elements for the icons
    icon_edit = document.createElement('img');
    $(icon_edit).attr('src', './img/edit.png');
    $(icon_edit).attr('class', 'iconEdit');
    $(icon_edit).appendTo(td);

    icon_trash = document.createElement('img');
    $(icon_trash).attr('src', './img/trash.png');
    $(icon_trash).attr('class', 'iconDel');
    $(icon_trash).appendTo(td);
    // </>

    // Wrap it all in a table
    tr = document.createElement('tr');
    $(td).appendTo(tr);

    el = document.createElement('table');
    $(el).attr('class', 'tasks');
    $(tr).appendTo(el);
    // </>

    return el;
}

/**
 * Sticks a task on the selected board
 * @public
 *
 * @param item. Item draggable to stick on a board
 * @param boardClassName. ClassName that identifies the board
 * where the item will be sticked
 *
 */
function stickTask(item, boardClassName) {
    "use strict";
    var board, el, task_name;

    board = $(".board_" + boardClassName);

    // Get the "name" of the task and remove it 
    // from the original board
    task_name = $(item).text();
    $(item).closest("table").remove();

    // Generate the new DOM element and stick it on
    // the new board
    el = generateTaskElement(task_name, boardClassName);
    $(el).appendTo(board);

    // Updating task state in the array of tasks
    switch (boardClassName) {
        case 'toDo':
            updateTaskState(task_name, 1);
            break;
        case 'progress':
            updateTaskState(task_name, 2);
            break;
        case 'finished':
            updateTaskState(task_name, 3);
            break;
    }
    // </>

    // Adds "edit" functionality
    $(el).find('img.iconEdit').unbind('click');
    $(el).find('img.iconEdit').click(function() {
        var dialog, task_code, task_name, task, task_title;

        // Finds the task in the array by code and name
        task_title = $(this).siblings('span');
        task_code = $(task_title).text().split('-')[0];
        task_name = $(task_title).text().split('-')[1];
        task = findTask(task_code, task_name);

        if (task !== null) {
            dialog = $("#dialog_newTask");
            $(dialog).removeClass("dialog_hidden");
            $(dialog).addClass("dialog");
            openEditTaskDialog(dialog, task.oTask, task_title);
        }
    });

    // Adds "delete" functionality
    $(el).find('img.iconDel').unbind('click');
    $(el).find('img.iconDel').click(function() {
        var dialog, img, task, task_code, task_name;

        img = $(this);
        dialog = showDeleteDialog();

        $(dialog).dialog("open");
        $(dialog).dialog("option", "buttons", {
            "Yes": function() {
                // Finds the task in the array by code and name
                task_code = $(img).siblings('span').text().split('-')[0];
                task_name = $(img).siblings('span').text().split('-')[1];
                task = findTask(task_code, task_name);

                if (task !== null) {
                    // Deletes task from the array
                    deleteTask(task.index);
                }

                $(img).closest('table').hide("fold", {}, 500, function() {
                    $(this).remove();
                });

                $(this).dialog("close");
            },
            "No": function() {
                $(this).dialog("close");
            }
        });
    });

    setDraggables();
}

/**
 * After loading...
 * @public
 */
$(document).ready(function() {
    "use strict";
    test_init();
});