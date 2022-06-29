const knex = require('../database/connection')


class RankingController {
  async get(request, response){
    const game_id = request.headers.game_id;

    const dbResponse = await knex.select(["act.*"]).from('activity as act').innerJoin('session as sess', 'act.session_id', 'sess.session_id')
        .innerJoin('game', 'sess.game_id', 'game.game_id')
        .where('game.game_id', game_id)
        .where('act.name', 'score')

    response.json(dbResponse)


  }
}

module.exports = RankingController
