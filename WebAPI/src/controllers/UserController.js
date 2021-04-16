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

			const lowerUsername = username.toLowerCase();

			const registeredUser = await knex('MicelioUser')
			.select('username', 'email')
			.where('username', lowerUsername)
			.orWhere('email', email)
			.first();
			
			if(registeredUser){
				if(registeredUser.username === lowerUsername) {
					return response.status(400).json({error: 'User already exists.'});
				}
				if(registeredUser.email === email) {
					return response.status(400).json({error: 'Email already used.'});
				}
			}

			const user_id =  await idGenerator('MicelioUser', 'user');

			const data = {
				user_id,
				username: lowerUsername,
				email: email,
				password: hashedPassword
			}

			const insertedUser = await knex('MicelioUser')
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
