const knex = require('../database/connection');
const { decodeUserSession } = require('../utils/generators/userSessionGenerator');

class ExpDetailsController {

    async get(request, response){
        const {experiment_id} = request.params;
        const {miceliotoken: userToken} = request.cookies;
        const decodedToken = decodeUserSession(userToken);
    
        const user_id = decodedToken.sub;
    
        const expDetailsAux = await knex('Experiment as e')
          .select('e.txt_experiment_name', 'hep.user_id', 'mu.username', 'hep.has_exp_permission_id', 'g.has_game_form')
          .innerJoin('HasExpPermission as hep', 'hep.experiment_id', 'e.experiment_id')
          .innerJoin("MicelioUser as mu", 'mu.user_id', 'hep.user_id')
          .leftJoin('GameStagetwo as g', 'g.experiment_id', 'e.experiment_id')
          .where('e.experiment_id', experiment_id)
          .andWhere('hep.user_id', user_id).first();

        if(!expDetailsAux){
          return response.status(400).json({error: "Experiment not found"});
        }

        const expDetails = JSON.parse(JSON.stringify(expDetailsAux));

        console.log(expDetails)
    
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

        console.log(partListAux)

        const sessionGroupExp = await knex('SessionGroupExp as s')
                                     .select('s.session_group_id')
                                     .where('s.experiment_id', experiment_id);
                                    
        const sGrpExp = JSON.parse(JSON.stringify(sessionGroupExp));

        const sGrpExpAux = ['0']
        sGrpExp.map(s => {sGrpExpAux.push(s)})

        console.log(sGrpExpAux)

        expDetails.sessionGroups = sGrpExpAux

        const countTotal = partListAux.length

        const group1 = [], group2 = [], group3 = [], group4 = []
        let count = [0,0,0,0]

        if (partListAux.length > 0) {
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

        console.log(groupsAux)

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
      
      const {experiment_id, form, group_id, session_id} = request.params

      let groupAux = []
      if (group_id === '0') {
        if (form === 'I' || form === 'F') {
          groupAux = ['1','2','3','4']
        } else {
          groupAux = ['2','4']
        }
      } else {
        groupAux = [group_id]
      }

      let sessionAux = null
      if (session_id > 0) {
        sessionAux = session_id
      }

      const questions = await knex('Questions as q')
                       .innerJoin('Form as f', 'f.form_id', 'q.form_id')
                       .select('q.question_id', 'q.txt_question')
                       .where('f.experiment_id', experiment_id)
                       .andWhere('f.ind_stage', form)
                       .orderBy(['q.ind_order']);

      const questionsAux = JSON.parse(JSON.stringify(questions));

      const answers = await knex('Participant as p')
                     .innerJoin('Answers as a', 'a.participant_id', 'p.participant_id')
                     .innerJoin('Questions as q', 'q.question_id', 'a.question_id')
                     .innerJoin('Form as f', 'f.form_id', 'q.form_id')
                     .select('p.participant_id', 'a.question_id', 'a.txt_answer', 'p.group_id')
                     .where('p.experiment_id', experiment_id)
                     .whereIn('p.group_id', groupAux)
                     .andWhere('f.ind_stage', form)
                     .orderBy(['p.group_id', 'p.participant_id', 'q.ind_order']);
      
      const answersAux = JSON.parse(JSON.stringify(answers));

      if (answersAux.length <= 0) {
        return response.json({notFound: true, data: []});
      }

      const final = []
      const header = ['Participantes', 'Grupo']

      const details = []
      let detailsAux = []

      let questAdded = false
      let firstQuest = true

      let partIdAux = answersAux[0].participant_id
      if (questionsAux.length > 0){
        questionsAux.forEach(q => {
          header.push(q.txt_question)

          if (answersAux.length > 0) {
            answersAux.forEach(a => {

              if (a.participant_id !== partIdAux) {
                if (!questAdded) {
                  detailsAux.push('')
                }
                questAdded = false
                partIdAux = a.participant_id
              }

              if (firstQuest) {
                detailsAux = []
                detailsAux.push(a.participant_id)
                detailsAux.push(a.group_id)
              } else {
                details.forEach(d => {
                  if (d[0] === a.participant_id) {
                    detailsAux = d
                  }
                })
              }

              if (q.question_id === a.question_id) {
                detailsAux.push(a.txt_answer)
                questAdded = true
              } else {
                return;
              }

              if (firstQuest) {
                details.push(detailsAux)
              }
            })
          }
          firstQuest = false
        })
      }

      final.push(header)
      details.forEach(d => {final.push(d)})

      return response.json({ok: true, data: final});
    }
}

module.exports = ExpDetailsController;
