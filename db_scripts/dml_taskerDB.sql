-- BOARDS
INSERT INTO "Boards"(code, name) VALUES ('BOARD1', 'Tboard1');
INSERT INTO "Boards"(code, name) VALUES ('BOARD2', 'Tboard2');
INSERT INTO "Boards"(code, name) VALUES ('BOARD3', 'Tboard3');

SELECT * FROM "Boards";

-- PROJECTS
INSERT INTO "Projects"(code, name) VALUES ('PROJ1', 'Tproject1');
INSERT INTO "Projects"(code, name) VALUES ('PROJ2', 'Tproject2');
INSERT INTO "Projects"(code, name) VALUES ('PROJ3', 'Tproject3');

SELECT * FROM "Projects";

-- PRIORITIES
INSERT INTO "Priorities"(name) VALUES ('Low');
INSERT INTO "Priorities"(name) VALUES ('Medium');
INSERT INTO "Priorities"(name) VALUES ('High');
INSERT INTO "Priorities"(name) VALUES ('Very High');
INSERT INTO "Priorities"(name) VALUES ('DEFCON 1');

SELECT * FROM "Priorities";

-- STATES
INSERT INTO "States"(name) VALUES ('To do');
INSERT INTO "States"(name) VALUES ('In progress');
INSERT INTO "States"(name) VALUES ('Finished');

SELECT * FROM "States";

-- TYPES
INSERT INTO "Types"(name) VALUES ('Design');
INSERT INTO "Types"(name) VALUES ('Development');
INSERT INTO "Types"(name) VALUES ('Testing');
INSERT INTO "Types"(name) VALUES ('Documentation');

SELECT * FROM "Types";

-- USERS
INSERT INTO "Users"(code, name) VALUES ('USER1', 'Tuser1');
INSERT INTO "Users"(code, name) VALUES ('USER2', 'Tuser2');
INSERT INTO "Users"(code, name) VALUES ('USER3', 'Tuser3');

SELECT * FROM "Users";

-- TASKS
INSERT INTO "Tasks"(
	code, 
	name, 
	description, 
	board, 
	state, 
	project, 
	priority, 
	type, 
	estimation, 
	incurred, 
	assignedTo
) VALUES ('TASK1', 'Test task 1', 'This is a task to test the app', 1, 1, 1, 1, 1, 0, 0, 1);

INSERT INTO "Tasks"(
	code, 
	name, 
	description, 
	board, 
	state, 
	project, 
	priority, 
	type, 
	estimation, 
	incurred, 
	assignedTo
) VALUES ('TASK2', 'Test task 2', 'This is a task to test the app', 2, 2, 2, 2, 2, 0, 0, 2);

INSERT INTO "Tasks"(
	code, 
	name, 
	description, 
	board, 
	state, 
	project, 
	priority, 
	type, 
	estimation, 
	incurred, 
	assignedTo
) VALUES ('TASK3', 'Test task 3', 'This is a task to test the app', 3, 3, 3, 3, 3, 0, 0, 3);

SELECT * FROM "Tasks";

