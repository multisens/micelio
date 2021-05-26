exports.up = function (knex) {
     return knex.schema
     .createTable('EntityAttibutesUpdate', function (table) {
          table.string('entity_id', 150)
               .notNullable()
               .primary();
          table.time('time_updated')
               .notNullable()
               .primary();
          table.text('attributes')
               .notNullable();
     });
};

exports.down = function (knex) {
     return knex.schema
     .dropTable('EntityAttibutesUpdate');
};