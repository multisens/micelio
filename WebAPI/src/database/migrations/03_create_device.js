exports.up = function (knex) {
     return knex.schema
     .createTable('Device', function (table) {
          table.string('device_id', 50)
               .notNullable()
               .primary();
          table.string('model', 50)
               .notNullable();
          table.integer('screen_width')
               .notNullable();
          table.integer('screen_height')
               .notNullable();
          table.string('system_name', 20)
               .notNullable();
     })
};

exports.down = function (knex) {
     return knex.schema
     .dropTable("Device")
};