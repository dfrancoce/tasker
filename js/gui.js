/*jslint browser: true*/ /*global  $*/

/**
 * @fileOverview Contains GUI functions.
 * @author <a href="mailto:danielfrancocecilia@gmail.com">Daniel Franco</a>
 * @version 1.0
 * @since 1.0
 */

 /* =====================================
  *	 _____         _                 
  *	|  _  (_)     | |                
  *	| | | |_  __ _| | ___   __ _ ___ 
  *	| | | | |/ _` | |/ _ \ / _` / __|
  *	| |/ /| | (_| | | (_) | (_| \__ \
  *	|___/ |_|\__,_|_|\___/ \__, |___/
  *	                        __/ |    
  *	                       |___/     
  * ===================================== */

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
        hide: {effect: 'fold', duration: 500}
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
        hide: {effect: 'fold', duration: 500}
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
        hide: {effect: 'fold', duration: 500}
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
        hide: {effect: 'fold', duration: 500}
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

    $(dlg_newTask).unbind("dialogclose");
    $(dlg_newTask).bind("dialogclose", function (event, ui) {
        $(dialog).removeClass("dialog");
        $(dialog).addClass("dialog_hidden");
    });

    $(dlg_newTask).dialog("open");
    $(dlg_newTask).dialog("option", "buttons", {
        "Save": function () {
            $(this).dialog("close");
        },
        "Cancel": function () {
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

    $(dlg_newProject).unbind("dialogclose");
    $(dlg_newProject).bind("dialogclose", function (event, ui) {
        $(dialog).removeClass("dialog");
        $(dialog).addClass("dialog_hidden");
    });

    $(dlg_newProject).dialog("open");
    $(dlg_newProject).dialog("option", "buttons", {
        "Save": function () {
            var project = { code: $("#txtCode").val() , name: $("#txtProject").val() };

            taskerDB.indexedDB.addProject(project);
            taskerDB.indexedDB.getProject($("#txtCode").val());
            //taskerDB.indexedDB.getAllProjects();
            //taskerDB.indexedDB.getProject(1);
            //taskerDB.indexedDB.getProject(2);
            //$(this).dialog("close");
        },
        "Cancel": function () {
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

    $(dlg_newUser).unbind("dialogclose");
    $(dlg_newUser).bind("dialogclose", function (event, ui) {        
        $(dialog).removeClass("dialog");
        $(dialog).addClass("dialog_hidden");
    });

    $(dlg_newUser).dialog("open");
    $(dlg_newUser).dialog("option", "buttons", {
        "Save": function () {            
            $(this).dialog("close");
        },
        "Cancel": function () {
            $(this).dialog("close");
        }
    });
}

/* =================================
 *	___  ___                 
 *	|  \/  |                 
 *	| .  . | ___ _ __  _   _ 
 *	| |\/| |/ _ \ '_ \| | | |		
 *	| |  | |  __/ | | | |_| |		
 *	\_|  |_/\___|_| |_|\__,_|       
 *									
 * ================================= */

 /**
  * Handles the menu clicks 
  * @public 
  */
function handleMenu() {    
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
        if(e.type === "mouseenter") {
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
	    drop: function (event, ui) {
	        stickTask(ui.draggable, "toDo");
	    }
	});

	$("div.droppableInProgress").droppable({
	    accept: 'span.toDo, span.finished',
	    activeClass: "ui-state-highlight",
	    drop: function (event, ui) {
	        stickTask(ui.draggable, "progress");
	    }
	});

	$("div.droppableFinished").droppable({
	    accept: 'span.toDo, span.progress',
	    activeClass: "ui-state-highlight",
	    drop: function (event, ui) {
	        stickTask(ui.draggable, "finished");
	    }
	});
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
});