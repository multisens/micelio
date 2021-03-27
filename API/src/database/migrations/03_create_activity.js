exports.up = function(knex) {
    return knex.schema
      .createTable('Activity', function (table) {
        table.string('activity_id', 40)
             .notNullable()
             .primary();
        table.string('session_id', 40)
             .notNullable()
             .references('game_id')
             .inTable('Game'); 
        table.string('time', 20)
             .notNullable();
        table.string('name', 100)
             .notNullable();
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
        .dropTable("Activity")
  };