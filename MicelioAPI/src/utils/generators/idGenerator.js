const {v4: uuid} = require('uuid');
const knex = require('../../database/connection');

const idGenerator = async (table, identifier) => {

    if(! identifier){
        identifier = table;
    }

    const columnName = `${identifier.toLowerCase()}_id`;


    const ids = await knex(table)
    .select(columnName);

    const filteredIds = ids.map((id) => id[columnName])
    let id = uuid();

    while( filteredIds.indexOf(id) !== -1){
        id = uuid();
    }
    
    return id;
}

module.exports = idGenerator;