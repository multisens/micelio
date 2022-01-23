const knex = require('../database/connection');
const { decodeUserSession } = require('../utils/generators/userSessionGenerator');

class ExpDetailsController {

    async get(request, response){
        const {experiment_id} = request.params;
        const {miceliotoken: userToken} = request.cookies;
        const decodedToken = decodeUserSession(userToken);
    
        const user_id = decodedToken.sub;
    
        const expDetails = await knex('Experiment as e')
          .select('e.txt_experiment_name', 'hep.user_id', 'mu.username', 'hep.has_exp_permission_id')
          .innerJoin('HasExpPermission as hep', 'hep.experiment_id', 'e.experiment_id')
          .innerJoin("MicelioUser as mu", 'mu.user_id', 'hep.user_id')
          .where('e.experiment_id', experiment_id)
          .andWhere('hep.user_id', user_id).first();

        if(!expDetails){
          return response.status(400).json({error: "Experiment not found"});
        }
    
        const expOwner = await knex('Experiment as e')
          .select('user.username')
          .innerJoin('MicelioUser as user', 'e.user_id', 'user.user_id')
          .where('e.experiment_id', experiment_id).first();

        expDetails.username = expOwner.username; 
    
        return response.json({expDetails});
    }

}

module.exports = ExpDetailsController;
