const knex = require('../database/connection')

class RankingController {
  async get(request, response) {
    const game_id = request.headers.game_id;

    /*const dbResponse = await knex.select(["act.*"])
        .from('activity as act')
        .innerJoin('session as sess', 'act.session_id', 'sess.session_id')
        .innerJoin("entity as ent", "")
        .innerJoin('game', 'sess.game_id', 'game.game_id')
        .where('game.game_id', game_id)
        .where('act.name', 'score')*/

    try{
      const dbResponse = await knex.select(["actage.properties", "age.name", "age.agent_id"])
          .from("activityagents as actage")
          .innerJoin("agent as age", "age.agent_id", "actage.agent_id")
          .innerJoin("activity as act", "act.activity_id", "actage.activity_id")
          .innerJoin("session as sess", "sess.session_id", "act.session_id")
          .innerJoin("game", "game.game_id", "sess.game_id")
          .where("game.game_id", game_id)
          .where("act.name", "score")

      if(!dbResponse){
        return response.status(200).send();
      }

      const agents = dbResponse.map((agent) => {
        agent.properties = JSON.parse(agent.properties)

        return {
          agent_id: agent.agent_id,
          name: agent.name,
          score: agent.properties.score
        }
      })

      const agentsRanked = agents.sort((a,b) => {

        if(b.score > a.score) {
          return 1;
        }
        if(b.score < a.score) {
          return -1;
        }

        return 0;
      })

      response.json(agentsRanked)
    }catch(e){
      response.status(500).json({error: e.message});
    }


  }
}

module.exports = RankingController
