/*jslint browser: true*/ /*global  $*/

/**
 * @fileOverview Manages tasks
 * @author <a href="mailto:danielfrancocecilia@gmail.com">Daniel Franco</a>
 * @version 1.0
 * @since 1.0
 */

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
        task = findTaskByCodeName(task_code, task_name);

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
                task = findTaskByCodeName(task_code, task_name);

                if (task !== null) {
                    // Deletes task from the array
                    deleteTask(task);
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