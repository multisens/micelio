exports.up = function(knex) {
    return knex.schema
      .createTable('ModifiedAttributes', function (table) {
        table.string('attributes_id', 40)
             .notNullable()
             .primary();
        table.string('activity_id', 100)
             .notNullable()
             .references('activity_id')
             .inTable('Activity');
        table.string('type', 15)
             .notNullable();
        table.string('delta', 50)
             .notNullable();
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
        .dropTable("ModifiedAttributes")
  };