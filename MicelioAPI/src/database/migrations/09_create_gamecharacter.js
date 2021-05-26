exports.up = function (knex) {
    return knex.schema
    .createTable('GameCharacter', function (table) {
         table.string('agent_id', 150)
              .notNullable()
              .primary()
              .references('agent_id')
               .inTable('Agent');
         table.decimal('position_x', 9, 6)
              .notNullable();
         table.decimal('position_y', 9, 6)
              .notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema
    .dropTable('GameCharacter')
};