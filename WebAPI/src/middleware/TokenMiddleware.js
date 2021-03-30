const knex = require('../database/connection');

const TokenMiddleware = async (request, response, next) => {
	const token = request.headers.token;

	if (!token) {
		return response.status(401).json({ error: "You dont have game permissions to send a request.", code: "T-001"});
	}
	
	const bd_response = await knex('game')
	.where('token', token)
	.select('game_id')
	.first();

	if (!bd_response) {
		return response.status(404).json({ error: "You dont have a valid key to send a request.", code: "T-002" });
	}

	request.headers.game_id = bd_response.game_id;

	next();
}

module.exports = TokenMiddleware;
