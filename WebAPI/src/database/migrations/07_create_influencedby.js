exports.up = function (knex) {
     return knex.schema
     .createTable('InfluencedBy', function (table) {
          table.increments('influencedBy_id')
               .notNullable()
               .primary();
          table.string('influence_id', 150)
               .notNullable()
               .references('activity_id')
               .inTable('Activity');
          table.string('influenced_id', 150)
               .notNullable()
               .references('activity_id')
               .inTable('Activity');
     })
};

exports.down = function (knex) {
     return knex.schema
     .dropTable("InfluencedBy")
};