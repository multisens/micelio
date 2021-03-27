exports.up = function(knex) {
    return knex.schema
      .createTable('Agent', function (table) {
        table.string('agent_id', 40)
             .notNullable()
             .primary();
        table.string('activity_id', 100)
             .notNullable()
             .references('activity_id')
             .inTable('Activity');
        table.decimal('position_x', 9, 6)
             .notNullable();
        table.decimal('position_y', 9, 6)
             .notNullable();
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
        .dropTable("Agent")
  };