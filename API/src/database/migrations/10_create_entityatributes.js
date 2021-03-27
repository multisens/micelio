exports.up = function(knex) {
    return knex.schema
      .createTable('EntityAttributes', function (table) {
        table.string('attributes_id', 40)
             .notNullable()
             .primary();
        table.string('entity_id', 40)
             .notNullable()
             .references('entity_id')
             .inTable('Entity');
        table.string('name', 50)
             .notNullable();
        table.string('value', 50)
             .notNullable();
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
        .dropTable("EntityAttributes")
  };