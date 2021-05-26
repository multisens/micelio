const {verify} = require('jsonwebtoken');
const knex = require('../database/connection');

const TokenMiddleware = async (request, response, next) => {
	const token = request.headers.token;

	if (!token) {
		return response.status(401).json({ error: "You dont have game permissions to send a request.", code: "T-001"});
	}

	try{
		const isTokenValid = await verify(token, process.env.JWT_SECRET);
		if(!isTokenValid){
			return response.status(401).json({ error: "You dont have a valid key to send a request.", code: "T-002" });
		}
	
		request.headers.game_id = isTokenValid.sub;

		next();

	}
	catch(err){
		return response.status(400).json({ error: "Cannot validate your token.", code: "T-003"});
	}	
}

module.exports = TokenMiddleware;
