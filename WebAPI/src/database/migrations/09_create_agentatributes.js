exports.up = function(knex) {
    return knex.schema
      .createTable('AgentAttributes', function (table) {
        table.string('attributes_id', 40)
             .notNullable()
             .primary();
        table.string('agent_id', 40)
             .notNullable()
             .references('agent_id')
             .inTable('Agent');
        table.string('name', 50)
             .notNullable();
        table.string('value', 50)
             .notNullable();
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
        .dropTable("AgentAttributes")
  };