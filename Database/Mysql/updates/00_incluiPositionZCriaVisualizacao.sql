ALTER TABLE ActivityEntities
    ADD position_z double(15, 6);

ALTER TABLE ActivityAgents
    ADD position_z double(15, 6);

ALTER TABLE Action
    ADD position_z double(15, 6);

ALTER TABLE GameCharacter
    ADD position_z double(15, 6);

ALTER TABLE GameObject
    ADD position_z double(15, 6);

CREATE TABLE Visualization(
    visualization_id varchar(40) NOT NULL,
    user_id varchar(40) NOT NULL,
    game_id varchar(40) NOT NULL,
    name varchar(100) NOT NULL,
    config text NOT NULL,

    PRIMARY KEY(game_id),
    FOREIGN KEY(user_id) REFERENCES MicelioUser(user_id),
    FOREIGN KEY(game_id) REFERENCES Game(game_id)
);