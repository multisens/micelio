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

        const partList = await knex('Participant as p')
                              .select('p.participant_id', 'p.group_id', 'p.has_ended_exp')
                              .where('p.experiment_id', experiment_id)
                              .orderBy('p.group_id');

        const partListAux = JSON.parse(JSON.stringify(partList));

        const countTotal = partListAux.length

        const group1 = [], group2 = [], group3 = [], group4 = []
        let count = [0,0,0,0]

        if (partList) {
          for (let i=0;i<countTotal;i++) {
            if (partListAux[i].group_id === '1'){
              group1.push({ participant_id: partListAux[i].participant_id
                          , has_ended_exp: partListAux[i].has_ended_exp})
              if(partListAux[i].has_ended_exp === 'S') count[0]++;
            } else if (partListAux[i].group_id === '2') {
              group2.push({ participant_id: partListAux[i].participant_id
                          , has_ended_exp: partListAux[i].has_ended_exp})
              if(partListAux[i].has_ended_exp === 'S') count[1]++;
            } else if (partListAux[i].group_id === '3') {
              group3.push({ participant_id: partListAux[i].participant_id
                          , has_ended_exp: partListAux[i].has_ended_exp})
              if(partListAux[i].has_ended_exp === 'S') count[2]++;
            } else {
              group4.push({ participant_id: partListAux[i].participant_id
                          , has_ended_exp: partListAux[i].has_ended_exp})
              if(partListAux[i].has_ended_exp === 'S') count[3]++;
            }
          }
        }

        const groups = await knex('ExpGroup as g')
                            .select('g.group_id', 'g.num_part_total')
                            .where('g.experiment_id', experiment_id)
                            .groupBy('g.group_id', 'g.num_part_total');

        const groupsAux = JSON.parse(JSON.stringify(groups));

        const groupsArray = []

        let totalEnded = 0

        if (groups) {
          for (let i=0;i<groupsAux.length;i++) {
            groupsArray.push(groupsAux[i])
            groupsArray[i].num_ended_total = count[i]

            totalEnded += count[i];
          }
        }

        groupsArray[0].partList = group1
        groupsArray[1].partList = group2
        groupsArray[2].partList = group3
        groupsArray[3].partList = group4

        expDetails.partEnded = totalEnded
        expDetails.partTotal = countTotal

        return response.json({expDetails, groupsArray});
    }

    async export (request, response) {
      
      const {experiment_id, group_id} = request.params

      const array = []

      if (group_id === '1') {
        array.push({nome: 'Pedro', sobrenome: '1'})
      } else if (group_id === '2') {
        array.push({nome: 'Pedro', sobrenome: '2'})
      } else if (group_id === '3') {
        array.push({nome: 'Pedro', sobrenome: '3'})
      } else {
        array.push({nome: 'Pedro', sobrenome: '4'})
      }

      return response.json({ok: true, data: array});
    }
}

module.exports = ExpDetailsController;
