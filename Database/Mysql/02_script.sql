CREATE TABLE SessionGroupExp(
      session_group_id varchar(40) NOT NULL,
      experiment_id    VARCHAR(40) NOT NULL,

      PRIMARY KEY(session_group_id, experiment_id)
);

alter table Participant
      add session_group_id varchar(40);

alter table Options
      add ind_order        INT;