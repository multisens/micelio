exports.up = function (knex) {
     return knex.schema
     .createTable('Agent', function (table) {
          table.string('agent_id', 150)
               .notNullable()
               .primary();
          table.string('name', 100)
               .notNullable();
          table.string('type', 20)
               .notNullable();
          table.text('attributes')
               .nullable();
     })
};

exports.down = function (knex) {
     return knex.schema
     .dropTable("Agent")
};