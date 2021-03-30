exports.up = function(knex) {
    return knex.schema
      .createTable('ActivityAttributes', function (table) {
        table.string('attributes_id', 40)
             .notNullable()
             .primary();
        table.string('activity_id', 100)
             .notNullable()
             .references('activity_id')
             .inTable('Activity');
        table.string('name', 50)
             .notNullable();
        table.string('value', 50)
             .notNullable();
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
        .dropTable("ActivityAttributes")
  };