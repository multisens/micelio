CREATE TABLE Game(
	game_id varchar(40) NOT NULL,
	name varchar(100) NOT NULL,
	token varchar(200) NOT NULL,
	version varchar(50) NOT NULL,

	PRIMARY KEY(game_id)
);

CREATE TABLE Device(
	device_id varchar(50) NOT NULL,
	model varchar(50) NOT NULL,
	screen_width int NOT NULL,
	screen_height int NOT NULL,
	system_name varchar(20) NOT NULL,
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
	FOREIGN KEY(game_id) REFERENCES Game(game_id) ON DELETE CASCADE,
	FOREIGN KEY(device_id) REFERENCES Device(device_id) ON DELETE CASCADE
);

CREATE TABLE Activity(
	activity_id varchar(100) NOT NULL,
	session_id varchar(40) NOT NULL,
	time varchar(20) NOT NULL,
	name varchar(100) NOT NULL,

	PRIMARY KEY(activity_id),
	FOREIGN KEY(session_id) REFERENCES Session(session_id) ON DELETE CASCADE
);

CREATE TABLE Action(
	activity_id varchar(100) NOT NULL,
	position_x decimal(9, 6) NOT NULL,
	position_y decimal(9, 6) NOT NULL,

	PRIMARY KEY(activity_id),
	FOREIGN KEY(activity_id) REFERENCES Activity(activity_id) ON DELETE CASCADE
);

CREATE TABLE InfluencedBy(
	influencedBy_id int NOT NULL,
	influence_id varchar(100) NOT NULL,
	influenced_id varchar(100) NOT NULL,

	PRIMARY KEY(influencedBy_id),
	FOREIGN KEY(influence_id) REFERENCES Activity(activity_id) ON DELETE CASCADE,
	FOREIGN KEY(influenced_id) REFERENCES Activity(activity_id) ON DELETE CASCADE
);

CREATE TABLE Agent(
	agent_id varchar(40) NOT NULL,
	activity_id varchar(100) NOT NULL,
	position_x decimal(9, 6),
	position_y decimal(9, 6),

	PRIMARY KEY(agent_id),
	FOREIGN KEY(activity_id) REFERENCES Activity(activity_id) ON DELETE CASCADE
);

CREATE TABLE Entity(
	entity_id varchar(40) NOT NULL,
	activity_id varchar(100) NOT NULL,
	name varchar(100) NOT NULL,

	PRIMARY KEY(entity_id),
	FOREIGN KEY(activity_id) REFERENCES Activity(activity_id) ON DELETE CASCADE
);

CREATE TABLE GameObject(
	entity_id varchar(40) NOT NULL,
	position_x decimal(9, 6) NOT NULL,
	position_y decimal(9, 6) NOT NULL,

	PRIMARY KEY(entity_id),
	FOREIGN KEY(entity_id) REFERENCES Entity(entity_id) ON DELETE CASCADE
);

CREATE TABLE AgentAttributes(
	attribute_id varchar(40) NOT NULL,
	agent_id varchar(40) NOT NULL,
	name varchar(50) NOT NULL,
	value varchar(50) NOT NULL,

	PRIMARY KEY(attribute_id),
	FOREIGN KEY(agent_id) REFERENCES Agent(agent_id) ON DELETE CASCADE
);

CREATE TABLE EntityAttributes(
	attribute_id varchar(40) NOT NULL,
	entity_id varchar(40) NOT NULL,
	name varchar(50) NOT NULL,
	value varchar(50) NOT NULL,

	PRIMARY KEY(attribute_id),
	FOREIGN KEY(entity_id) REFERENCES Entity(entity_id) ON DELETE CASCADE
);

CREATE TABLE ActivityAttributes(
	attribute_id varchar(40) NOT NULL,
	activity_id varchar(100) NOT NULL,
	name varchar(50) NOT NULL,
	value varchar(50) NOT NULL,

	PRIMARY KEY(attribute_id),
	FOREIGN KEY(activity_id) REFERENCES Activity(activity_id) ON DELETE CASCADE
);

CREATE TABLE ModifiedAttribute(
	attribute_id varchar(40) NOT NULL,
	activity_id varchar(100) NOT NULL,
	type varchar(15) NOT NULL,
	delta varchar(50) NOT NULL,

	PRIMARY KEY(attribute_id, activity_id),
	FOREIGN KEY(activity_id) REFERENCES Activity(activity_id) ON DELETE CASCADE
);
