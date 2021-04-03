exports.up = function (knex) {
     return knex.schema
     .createTable('Game', function (table) {
          table.string('game_id', 40)
               .notNullable()
               .primary();
          table.string('name', 100)
               .notNullable();
          table.string('token', 200)
               .notNullable();
          table.string('version', 50)
               .notNullable();
     })
};

exports.down = function (knex) {
     return knex.schema
     .dropTable("Game")
};