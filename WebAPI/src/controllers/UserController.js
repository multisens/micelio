const knex = require('../database/connection');

const {generatePassword} = require('../utils/generators/passwordGenerator');

class UserController{

  create(request, response){
    const {user, password} = request.body;

    if(!user) {
      return response.status(400).json({error: "Invalid user"});
    }

    if(!password) {
      return response.status(400).json({error: "Invalid password"});
    }

    const hashedPassword = generatePassword(password);

    // todo: Register in database when table is ready


    response.json({user});
  }

}

module.exports = UserController;
