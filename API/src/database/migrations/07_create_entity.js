exports.up = function(knex) {
    return knex.schema
      .createTable('Entity', function (table) {
        table.string('entity_id', 40)
             .notNullable()
             .primary();
        table.string('activity_id', 100)
             .notNullable()
             .references('activity_id')
             .inTable('Activity');
        table.string('name', 100)
             .notNullable();
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
        .dropTable("Entity")
  };