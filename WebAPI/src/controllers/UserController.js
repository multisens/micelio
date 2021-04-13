const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');
const { generatePassword } = require('../utils/generators/passwordGenerator');

class UserController {

	async create(request, response) {
		const { username, password, email } = request.body;

		if (!username) {
			return response.status(400).json({ error: "Invalid username" });
		}

		if (!password) {
			return response.status(400).json({ error: "Invalid password" });
		}

		if (!email) {
			return response.status(400).json({ error: "Invalid e-mail" });
		}

		const hashedPassword = generatePassword(password);

		try {

			const registeredUser = await knex('miceliouser')
			.select('username')
			.where('username', username)
			.first();

			if(registeredUser){
				return response.status(400).json({error: 'User already exists.'});
			}

			const user_id =  await idGenerator('miceliouser', 'user');

			const data = {
				user_id,
				username,
				email,
				password: hashedPassword
			}

			const insertedUser = await knex('miceliouser')
			.insert(data);

			if(insertedUser){
				return response.status(201).json({ok: 'true'});
			}
			else{
				return response.status(400).json(insertedUser);
			}

		}
		catch(err){
		    return response.status(400).json({error: err});
		}

	}

}

module.exports = UserController;
