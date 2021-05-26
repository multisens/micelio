exports.up = function (knex) {
    return knex.schema
    .createTable('AgentAttributesUpdate', function (table) {
         table.string('agent_id', 150)
              .notNullable()
              .primary()
              .references('agent_id')
              .inTable('Agent');
         table.time('time_updated')
              .notNullable()
              .primary();
         table.text('attributes')
              .notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema
    .dropTable('AgentAttributesUpdate')
};