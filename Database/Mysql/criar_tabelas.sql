CREATE TABLE MicelioUser(
	user_id varchar(40) NOT NULL,
	username varchar(40) NOT NULL,
	password varchar(60) NOT NULL,
	email varchar(60) NOT NULL,

	PRIMARY KEY(user_id),
	UNIQUE(username)
);

CREATE TABLE Game(
	game_id varchar(40) NOT NULL,
	name varchar(100) NOT NULL,
	token varchar(200) NOT NULL,
	version varchar(50) NOT NULL,

	PRIMARY KEY(game_id)
);

CREATE TABLE HasPermission(
	has_permission_id varchar(40) NOT NULL,
	user_id varchar(40) NOT NULL,
	game_id varchar(40) NOT NULL,
	owner boolean NOT NULL,

	PRIMARY KEY(has_permission_id),
	FOREIGN KEY(user_id) REFERENCES MicelioUser(user_id),
	FOREIGN KEY(game_id) REFERENCES Game(game_id)
);

CREATE TABLE SessionGroup(
	session_group_id varchar(40) NOT NULL,
	has_permission_id varchar(40) NOT NULL,
	name varchar(50) NOT NULL,
	it_ends boolean NOT NULL,
	parameters text,

	PRIMARY KEY(session_group_id ),
	FOREIGN KEY(has_permission_id) REFERENCES HasPermission(has_permission_id)
);

CREATE TABLE Device(
	device_id varchar(50) NOT NULL,
	model varchar(50) NOT NULL,
	screen_width int NOT NULL,
	screen_height int NOT NULL,
	system_name varchar(50) NOT NULL,

	PRIMARY KEY(device_id)
);

CREATE TABLE Session(
	session_id varchar(40) NOT NULL,
	device_id varchar(50) NOT NULL,
	game_id varchar(40) NOT NULL,
	name varchar(100),
	language varchar(20) NOT NULL,
	game_stage varchar(20) NOT NULL,
	date date NOT NULL,
	start_time time NOT NULL,
	end_time time,

	PRIMARY KEY(session_id),
	FOREIGN KEY(game_id) REFERENCES Game(game_id),
	FOREIGN KEY(device_id) REFERENCES Device(device_id)
);

CREATE TABLE SessionInGroup(
	session_id varchar(40) NOT NULL,
	session_group_id  varchar(40) NOT NULL,

	PRIMARY KEY(session_id, session_group_id ),
	FOREIGN KEY(session_id) REFERENCES Session(session_id),
	FOREIGN KEY(session_group_id ) REFERENCES SessionGroup(session_group_id)
);

CREATE TABLE Activity(
	activity_id varchar(150) NOT NULL,
	session_id varchar(40) NOT NULL,
	time varchar(20) NOT NULL,
	name varchar(100) NOT NULL,
	properties text,

	PRIMARY KEY(activity_id),
	FOREIGN KEY(session_id) REFERENCES Session(session_id)
);

CREATE TABLE Action(
	activity_id varchar(150) NOT NULL,
	position_x double(15, 6) NOT NULL,
	position_y double(15, 6) NOT NULL,

	PRIMARY KEY(activity_id),
	FOREIGN KEY(activity_id) REFERENCES Activity(activity_id)
);

CREATE TABLE InfluencedBy(
	influenced_by_id int NOT NULL,
	influence_id varchar(150) NOT NULL,
	influenced_id varchar(150) NOT NULL,
	properties text,

	PRIMARY KEY(influenced_by_id),
	FOREIGN KEY(influence_id) REFERENCES Activity(activity_id),
	FOREIGN KEY(influenced_id) REFERENCES Activity(activity_id)
);

CREATE TABLE Agent(
	agent_id varchar(150) NOT NULL,
	name varchar(100) NOT NULL,
	type varchar(20) NOT NULL,
	properties text,

	PRIMARY KEY(agent_id)
);

CREATE TABLE GameCharacter(
	agent_id varchar(150) NOT NULL,
	position_x double(15, 6),
	position_y double(15, 6),

	PRIMARY KEY(agent_id),
	FOREIGN KEY(agent_id) REFERENCES Agent(agent_id)
);

CREATE TABLE ActivityAgents(
	agent_id varchar(150) NOT NULL,
	activity_id varchar(150) NOT NULL,
	properties text NOT NULL,
	role varchar(20),
	position_x double(15, 6),
	position_y double(15, 6),

	PRIMARY KEY(agent_id, activity_id),
	FOREIGN KEY(agent_id) REFERENCES Agent(agent_id),
	FOREIGN KEY(activity_id) REFERENCES Activity(activity_id)
);

CREATE TABLE Entity(
	entity_id varchar(150) NOT NULL,
	name varchar(100) NOT NULL,
	properties text,

	PRIMARY KEY(entity_id)
);

CREATE TABLE GameObject(
	entity_id varchar(150) NOT NULL,
	position_x double(15, 6) NOT NULL,
	position_y double(15, 6) NOT NULL,

	PRIMARY KEY(entity_id),
	FOREIGN KEY(entity_id) REFERENCES Entity(entity_id)
);

CREATE TABLE ActivityEntities(
	entity_id varchar(150) NOT NULL,
	activity_id varchar(150) NOT NULL,
	properties text NOT NULL,
	role varchar(20),
	position_x double(15, 6),
	position_y double(15, 6),


	PRIMARY KEY(entity_id, activity_id),
	FOREIGN KEY(entity_id) REFERENCES Entity(entity_id),
	FOREIGN KEY(activity_id) REFERENCES Activity(activity_id)
);

create table experiment
( experiment_id      VARCHAR(40)   PRIMARY KEY
, txt_experiment_name VARCHAR(200)
, txt_consent_term   VARCHAR(4000)
, game_id            VARCHAR(40)
, user_id            VARCHAR(40)
, FOREIGN KEY(game_id)
    REFERENCES game(game_id)
);

create table hasExpPermission
( has_exp_permission_id VARCHAR(40) PRIMARY KEY
, user_id               VARCHAR(40)
, experiment_id         VARCHAR(40)
, FOREIGN KEY(user_id) 
    REFERENCES miceliouser(user_id)
, FOREIGN KEY(experiment_id) 
    REFERENCES experiment(experiment_id)
);

create table exp_group
( group_id      VARCHAR(40)
, experiment_id VARCHAR(40)
, PRIMARY KEY(group_id, experiment_id)
, FOREIGN KEY(experiment_id) 
    REFERENCES experiment(experiment_id)
);

create table participant
( participant_id VARCHAR(40)  PRIMARY KEY
, txt_name       VARCHAR(300) 
, txt_email      varchar(400)
, group_id       VARCHAR(40)
, experiment_id  VARCHAR(40)
, FOREIGN KEY(group_id, experiment_id) 
	  REFERENCES exp_group(group_id, experiment_id)
);

create table game_stagetwo
( game_page_id       VARCHAR(40)
, txt_game_link VARCHAR(4000)
, txt_game_page VARCHAR(4000)
, experiment_id VARCHAR(40)
, PRIMARY KEY(game_page_id, experiment_id)
, FOREIGN KEY(experiment_id) 
    REFERENCES experiment(experiment_id)
);

create table video_stagetwo
( video_page_id       VARCHAR(40)
, txt_video_link VARCHAR(4000)
, txt_video_page VARCHAR(4000)
, experiment_id  VARCHAR(40)
, PRIMARY KEY(video_page_id, experiment_id)
, FOREIGN KEY(experiment_id) 
    REFERENCES experiment(experiment_id)
);

create table form
( form_id       VARCHAR(40)
, question_id   VARCHAR(40)
, stage_id      VARCHAR(40)
, txt_question  VARCHAR(4000)
, experiment_id VARCHAR(40)
, PRIMARY KEY(form_id, question_id)
, FOREIGN KEY(experiment_id)
    REFERENCES experiment(experiment_id)
);

create table answer
( aswer_id     VARCHAR(40)
, txt_answer   VARCHAR(4000)
, form_id      VARCHAR(40)
, question_id  VARCHAR(40)
, participant_id VARCHAR(40)
, PRIMARY KEY (aswer_id, form_id)
, FOREIGN KEY(form_id, question_id) 
    REFERENCES form(form_id, question_id)
, FOREIGN KEY(participant_id) 
    REFERENCES participant(participant_id)
);
