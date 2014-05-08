/*jslint browser: true*/ /*global  $*/

/**
 * @fileOverview Contains data manipulation functions and objects.
 * @author <a href="mailto:danielfrancocecilia@gmail.com">Daniel Franco</a>
 * @version 1.0
 * @since 1.0
 */

var tasks = [],
    projects = [],
    priorities = [],
    types = [],
    users = [];

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
 * Add the task passed by parameter to the array
 * @public
 *
 * @param oTask. Object task.
 */
function addTask(oTask) {
    "use strict";
    tasks.push(oTask);
}

/**
 * Delete the task passed by parameter from the array
 * @public
 *
 * @param index. Position of the task within the array.
 */
function deleteTask(index) {
    "use strict";
    tasks.splice(index, 1);
}

/**
 * Update the object properties with the data introduced by
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
    oTask.estimation = $(dialog).find('input[name$="txtEstimation"]').val();
    oTask.incurred = $(dialog).find('input[name$="txtIncurred"]').val();
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
        task.oTask.state = taskState;
    }
}