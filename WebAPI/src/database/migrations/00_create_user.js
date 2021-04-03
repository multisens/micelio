exports.up = function (knex) {
     return knex.schema
     .createTable('MicelioUser', function (table) {
          table.string('user_id', 40)
               .notNullable()
               .primary();
          table.string('username', 40)
               .notNullable()
               .unique();
          table.string('password', 60)
               .notNullable();
     })
};

exports.down = function (knex) {
     return knex.schema
     .dropTable("MicelioUser")
};