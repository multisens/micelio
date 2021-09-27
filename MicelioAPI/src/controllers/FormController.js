const knex = require('../database/connection');

class FormController {

	async get(request, response) {
		const {experiment_id} = request.params;
	
		const consentTerm = await knex('experiment as e')
		                         .select('e.experiment_id', 'e.txt_consent_form')
								 .where('e.experiment_id', experiment_id);

		if (!consentTerm) {
			return response.status(400).json({error: "Game not found"});
		}
	
		return response.json({ok: true, data: consentTerm[0]});
	}
	

	async create(request, response) {

		//

	}

}

module.exports = FormController;
