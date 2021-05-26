exports.up = function (knex) {
     return knex.schema
     .createTable('Entity', function (table) {
          table.string('entity_id', 150)
               .notNullable()
               .primary();
          table.string('name', 100)
               .notNullable();
          table.text('attributes')
               .nullable();
     });
};

exports.down = function (knex) {
     return knex.schema
     .dropTable('Entity');
};