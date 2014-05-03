var taskerDB = {};

window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

if ('webkitIndexedDB' in window) {
    window.IDBTransaction = window.webkitIDBTransaction;
    window.IDBKeyRange = window.webkitIDBKeyRange;
}

taskerDB.indexedDB = {};
taskerDB.indexedDB.db = null;

taskerDB.indexedDB.onerror = function(e) {
    console.log(e);
};

taskerDB.indexedDB.open = function() {
    var request = indexedDB.open("tasker");

    request.onsuccess = function(e) {
        var db, setVrequest, projects, project_index, v = 1;

        taskerDB.indexedDB.db = e.target.result;
        db = taskerDB.indexedDB.db;

        if (v != db.version) {
            setVrequest = db.setVersion(v);

            setVrequest.onerror = taskerDB.indexedDB.onerror;
            setVrequest.onsuccess = function(e) {
                if(db.objectStoreNames.contains("projects")) {
                    db.deleteObjectStore("projects");
                }

                projects = db.createObjectStore("projects", {keyPath: "code"});
                project_index = projects.createIndex("by_name", "name", {unique: true});

                e.target.transaction.oncomplete = function() {
                    // TODO
                };
            };
        } else {
            // TODO            
        }
    };

    request.onerror = taskerDB.indexedDB.onerror;
};

taskerDB.indexedDB.addProject = function(project) {
    var db = taskerDB.indexedDB.db;
    //var trans = db.transaction(["projects"], "readwrite");
    var trans = db.transaction(["projects"], window.webkitIDBTransaction.READ_WRITE);    
    var store_projects = trans.objectStore("projects");
    var request = store_projects.put(project);

    // TODO
    request.onsuccess = function(e) {};
    request.onerror = function(e) {
        console.log("Error Adding: ", e);
    };
};

taskerDB.indexedDB.deleteProject = function(code) {
    var db = taskerDB.indexedDB.db;
    var trans = db.transaction(["projects"], "readwrite");
    var store_projects = trans.objectStore("projects");
    var request = store_projects.delete(code);

    // TODO
    request.onsuccess = function(e) {};
    request.onerror = function(e) {
        console.log("Error Deleting: ", e);
    };
};

taskerDB.indexedDB.getProject = function(code) {
    var db = taskerDB.indexedDB.db;
    var trans = db.transaction(["projects"], "readwrite");
    var store_projects = trans.objectStore("projects");
    var request = store_projects.get(code); 
    
    request.onsuccess = function(event) {
        alert("Name for code project " + code + " is " + event.target.result.name);
    };

    request.onerror = function(event) {
        console.log("Error Retrieving: ", event);
    };
};

taskerDB.indexedDB.getAllProjects = function() {
    var db = taskerDB.indexedDB.db;
    var trans = db.transaction(["projects"], "readwrite");
    var store_projects = trans.objectStore("projects");  
    var cursor_request = store_projects.openCursor();

    cursor_request.onsuccess = function(e) {
        var result = e.target.result;

        if (result) {
            alert(result.value);
            result.continue;
        }        
    };

    cursor_request.onerror = taskerDB.indexedDB.onerror;
};

function init() {
    taskerDB.indexedDB.open();
}

window.addEventListener("DOMContentLoaded", init, false);

/*    this.db = "";
    this.request = "";    

    this.openDatabase = function () {
        this.request = indexedDB.open("tasker");

        this.request.onupgradeneeded = function(event) {
            // The database did not previously exist, so create object stores and indexes.
            this.db = request.result;
            var projects = db.createObjectStore("projects", {keyPath: "code"});
            var project_index = projects.createIndex("by_name", "name", {unique: true});
        };

        this.request.onsuccess = function(event) {
            this.db = event.target.result;
        };

        this.request.onerror = function(event) {
            alert("Database error: " + event.target.errorCode);
        };
    }  

    this.insertProject = function(project) {        
        var t = this.db.transaction(["projects"], "readwrite");
        var projects = t.objectStore("projects");
        var request = projects.add(project);  
    }

    this.insertTask = function(task) {        
        var t = this.db.transaction(["tasks"], "readwrite");
        var tasks = t.objectStore("tasks");
        var request = tasks.add(task);
    }

    this.getProject = function(project_code) {        
        var t = this.db.transaction(["projects"]);
        var projects = t.objectStore("projects");
        var request = projects.get(project_code);

        request.onerror = function(event) {};
        request.onsuccess = function(event) {
            alert("Name for code project " + project_code + " is " + request.result.name);
        };
    }

    this.getTask = function(task) {

    }
}*/