const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');
const { generatePassword, isPasswordValid } = require('../utils/generators/passwordGenerator');
const { generateUserSession, decodeUserSession } = require('../utils/generators/userSessionGenerator')

class UserController {

	async get(request, response) {
		const { miceliotoken } = request.cookies

		if(!miceliotoken) {
			return response.status(401).send()
		}

		try{
			const { sub: userId } = decodeUserSession(miceliotoken)

			const user_db = await knex('miceliouser').select().where({ user_id: userId }).first()
			delete user_db.password

			response.json({ok: true, data: user_db})

		}catch (e) {
			return response.status(401)
		}
	}

	async create(request, response) {
		let { username, password, confirmation_password, email } = request.body;

		if (!username) {
			return response.status(400).json({ error: "Invalid username" });
		}

		if (!password) {
			return response.status(400).json({ error: "Invalid password" });
		}

		if (!confirmation_password) {
			return response.status(400).json({ error: "Invalid password" });
		}
		else{
			if(confirmation_password != password) {
				return response.status(400).json({ error: "The passwords do not match" });
			}
		}

		if (!email) {
			return response.status(400).json({ error: "Invalid e-mail" });
		}

		const hashedPassword = generatePassword(password);

		try {

			username = username.toLowerCase();
			email = email.toLowerCase();

			const registeredUser = await knex('MicelioUser')
			.select('username', 'email')
			.where('username', username)
			.orWhere('email', email)
			.first();

			if(registeredUser){
				if(registeredUser.username === username) {
					return response.status(400).json({error: 'User already exists.'});
				}
				if(registeredUser.email === email) {
					return response.status(400).json({error: 'Email already in use.'});
				}
			}

			const user_id =  await idGenerator('MicelioUser', 'user');

			const data = {
				user_id,
				username,
				email,
				password: hashedPassword
			}

			const insertedUser = await knex('MicelioUser')
			.insert(data);

			if(insertedUser){
				return response.status(201).json({ok: true});
			}
			else{
				return response.status(400).json({error: 'Cannot insert user, try again later'});
			}

		}
		catch(err){
		    return response.status(400).json({error: 'Cannot connect to database, try again later'});
		}

	}

	async login(request, response) {
		const { username, password } = request.body

		if(!username) {
			return response.status(400).json({error: "Invalid username"})
		}

		if(!password) {
			return response.status(400).json({error: "Invalid password"})
		}

		const user_db = await knex('miceliouser').select().where({ username }).first()
		if(!user_db) {
			return response.status(404)
		}

		if(!isPasswordValid(user_db.password, password)){
			return response.status(400).json({error: 'Invalid password'})
		}

		delete user_db.password

		const token = generateUserSession(user_db.user_id)

		response.cookie('miceliotoken', token)
		response.json({ok: true, data: user_db, token})
	}

	async logout(request, response) {
		response.clearCookie('miceliotoken')
		response.send()
	}
}

module.exports = UserController;
