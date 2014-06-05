-- BOARDS
-- DROP TABLE "Boards";
CREATE TABLE "Boards"
(
  id serial NOT NULL,
  code text,
  name text,
  CONSTRAINT boards_pk_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Boards"
  OWNER TO postgres;

-- PRIORITIES
-- DROP TABLE "Priorities";
CREATE TABLE "Priorities"
(
  id serial NOT NULL,
  name text,
  CONSTRAINT priorities_pk_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Priorities"
  OWNER TO postgres;

-- PROJECTS
-- DROP TABLE "Projects";
CREATE TABLE "Projects"
(
  id serial NOT NULL,
  code text,
  name text,
  CONSTRAINT projects_pk_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Projects"
  OWNER TO postgres;

-- STATES
-- DROP TABLE "States";
CREATE TABLE "States"
(
  id serial NOT NULL,
  name text,
  CONSTRAINT states_pk_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "States"
  OWNER TO postgres;

-- TYPES
-- DROP TABLE "Types";
CREATE TABLE "Types"
(
  id serial NOT NULL,
  name text,
  CONSTRAINT types_pk_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Types"
  OWNER TO postgres;

-- USERS
-- DROP TABLE "Users";
CREATE TABLE "Users"
(
  id serial NOT NULL,
  code text,
  name text,
  CONSTRAINT users_pk_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Users"
  OWNER TO postgres;

-- TASKS
-- DROP TABLE "Tasks";
CREATE TABLE "Tasks"
(
  id serial NOT NULL,
  code text,
  name text,
  description text,
  board smallint,
  state smallint,
  project smallint,
  priority smallint,
  type smallint,
  estimation smallint,
  incurred smallint,
  assignedto smallint,
  CONSTRAINT tasks_pk_id PRIMARY KEY (id),
  CONSTRAINT task_types_fk FOREIGN KEY (type)
      REFERENCES "Types" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT tasks_boards_fk FOREIGN KEY (board)
      REFERENCES "Boards" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT tasks_priorities_fk FOREIGN KEY (priority)
      REFERENCES "Priorities" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT tasks_projects_fk FOREIGN KEY (project)
      REFERENCES "Projects" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT tasks_states_fk FOREIGN KEY (state)
      REFERENCES "States" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT tasks_users_fk FOREIGN KEY (assignedto)
      REFERENCES "Users" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "Tasks"
  OWNER TO postgres;





