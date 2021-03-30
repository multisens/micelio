const knex = require('knex');
require('dotenv').config();

const connection = knex({
    client: process.env.DATABASE_CLIENT,
    connection: {
        host : process.env.DATABASE_HOST,
        user : process.env.DATABASE_USER,
        password : process.env.DATABASE_PASSWORD,
        database : process.env.DATABASE
    },
    useNullAsDefault: true
});

module.exports = connection;