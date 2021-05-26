exports.up = function (knex) {
     return knex.schema
     .createTable('ActivityEntities', function (table) {
          table.string('entity_id', 150)
               .notNullable()
               .primary()
               .references('entity_id')
               .inTable('Entity');
          table.string('activity_id', 150)
               .notNullable()
               .primary()
               .references('activity_id')
               .inTable('Activity');
     })
};

exports.down = function (knex) {
     return knex.schema
     .dropTable('ActivityEntities');
};