exports.up = function (knex) {
     return knex.schema
     .createTable('GameObject', function (table) {
          table.string('entity_id', 150)
               .notNullable()
               .primary()
               .references('entity_id')
               .inTable('Entity');
          table.decimal('position_x', 9, 6)
               .notNullable();
          table.decimal('position_y', 9, 6)
               .notNullable();
     });
};

exports.down = function (knex) {
     return knex.schema
     .dropTable('GameObject');
};