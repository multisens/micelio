const {verify} = require('jsonwebtoken');
const knex = require('../database/connection');

const TokenMiddleware = async (request, response, next) => {
	const token = request.headers.token;

	if (!token) {
		console.error("[TOKEN MIDDLEWARE] Não foi possível encontrar o token.");
		return response.status(401).json({ error: "You dont have game permissions to send a request.", code: "T-001"});
	}
	
	try{
		const isTokenValid = await verify(token, process.env.JWT_SECRET);
		if(!isTokenValid){
			console.error("[TOKEN MIDDLEWARE] O token enviado não é um token válido.");
			return response.status(401).json({ error: "You dont have a valid key to send a request.", code: "T-002" });
		}
		
		request.headers.game_id = isTokenValid.sub;
		
		next();
		
	}
	catch(err){
		console.error(`[TOKEN MIDDLEWARE] Não foi possível validar o token. ${err.message}`);
		return response.status(400).json({ error: "Cannot validate your token.", code: "T-003"});
	}	
}

module.exports = TokenMiddleware;
