tasker
======

Kanban-like tasks manager

Requirements
============

You need to have postgresql and nodeJS installed on your computer. Also the following dependecies:
* `npm install express`
* `npm install socket.io`
* `npm install pg`

Usage
======

In order to test the app you need to:

* Create database taskerDB in postgresql
* Run scripts ddl_taskerDB.sql and dml_taskerDB.sql from db_scripts folder
* Run node app.js in the command line
* Open http://localhost:8080/index.html in your browser
* Enjoy!
