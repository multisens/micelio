const knex = require('../database/connection');

class ExperimentController {

	async get(request, response) {
	
		const consentTerm = await knex('experiment as e')
		                         .select('e.experiment_id');

		if (!consentTerm) {
			return response.status(400).json({error: "Experiment not found"});
		}
	
		return response.json({ok: true, data: consentTerm[0]});
	}
	

	async create(request, response) {

		//

	}

}

module.exports = ExperimentController;
