exports.up = function (knex) {
    return knex.schema
    .createTable('ActivityAgents', function (table) {
        table.string('agent_id', 150)
            .notNullable()
            .primary()
            .references('agent_id')
            .inTable('Agent');
        table.string('activity_id', 150)
            .notNullable()
            .primary()
            .references('activity_id')
            .inTable('Activity');
    })
};

exports.down = function (knex) {
    return knex.schema
    .dropTable('ActivityAgents')
};