exports.up = function (knex) {
     return knex.schema
     .createTable('HasPermission', function (table) {
          table.string('user_id', 40)
               .notNullable()
               .primary()
               .references('user_id')
               .inTable('MicelioUser');
          table.string('game_id', 40)
               .notNullable()
               .primary()
               .references('game_id')
               .inTable('Game');;
          table.boolean('owner')
               .notNullable();
     })
};

exports.down = function (knex) {
     return knex.schema
     .dropTable("HasPermission")
};