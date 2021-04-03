exports.up = function (knex) {
     return knex.schema
     .createTable('Session', function (table) {
          table.string('session_id', 40)
               .notNullable()
               .primary();
          table.string('device_id', 50)
               .notNullable()
               .references('device_id')
               .inTable('Device');
          table.string('game_id', 40)
               .notNullable()
               .references('game_id')
               .inTable('Game');
          table.string('name', 100)
               .nullable();
          table.string('language', 20)
               .notNullable();
          table.string('game_stage', 20)
               .notNullable();
          table.string('room', 40)
               .nullable();
          table.date('date')
               .notNullable();
          table.time('start_time')
               .notNullable();
          table.time('end_time')
               .nullable();
     })
};

exports.down = function (knex) {
     return knex.schema
     .dropTable("Session")
};