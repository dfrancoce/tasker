tasker
======

Tasks manager (kanban style) written in HTML+CSS+Javascript(JQuery+UI) and nodeJS + postgresql (Backend)

Requirements
============

You need to have postgresql and nodeJS installed on your computer

Usage
======

In order to test the app you need to:

* Create database taskerDB in postgresql
* Run scripts ddl_taskerDB.sql and dml_taskerDB.sql from db_scripts folder
* Install dependencies
  * npm install express
  * npm install socket.io
  * npm install pg
* Run node app.js in the command line
* Open http://localhost:8080/index.html in your browser
* Enjoy!
