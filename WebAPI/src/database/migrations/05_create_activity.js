exports.up = function (knex) {
     return knex.schema
     .createTable('Activity', function (table) {
          table.string('activity_id', 150)
               .notNullable()
               .primary();
          table.string('session_id', 40)
               .notNullable()
               .references('session_id')
               .inTable('Session');
          table.string('time', 20)
               .notNullable();
          table.string('name', 100)
               .notNullable();
          table.text('attributes')
               .nullable();

     })
};

exports.down = function (knex) {
     return knex.schema
     .dropTable("Activity")
};