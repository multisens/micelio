const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class GameLinkController {

	async get(request, response) {

        const {experiment_id} = request.params;

        const game = await knex('GameStagetwo as g')
                        .select('g.txt_game_link', 'g.txt_game_page', 'g.has_game_form')
                         .where('g.experiment_id', experiment_id)
                         .first();
    
        response.json({game});
	}

	async update(request, response) {

        const {experiment_id} = request.params;

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        let {newGameLink, newGameText, newGameHasForm} = request.body;

        if (!newGameLink && !newGameText) {
            return response.status(400).json({error: "Missing link and text"});
        }

        const game = await knex('GameStagetwo as g')
                        .select('g.txt_game_link', 'g.txt_game_page')
                            .where('g.experiment_id', experiment_id)
                            .first();

        if (!newGameLink && game) {
            newGameLink = game.txt_game_link;
        }
        if (!newGameText && game) {
            newGameText = game.txt_game_page;
        }

        const trx = await knex.transaction();

        try{
            if(!game) {
                const game_page_id = await idGenerator('GameStagetwo', 'game_page');

                const gameData = {
                    game_page_id,
                    txt_game_link: newGameLink,
                    txt_game_page: newGameText,
                    has_game_form: newGameHasForm,
                    experiment_id
                };

                const gameChange = await trx('GameStagetwo').insert(gameData);

                if(gameChange){
                    await trx.commit();
                    return response.status(201).json({ok: true});
                }
                else{
                    await trx.rollback();
                    return response.status(400).json({error: 'Cannot update the game page, check the information sent'});
                }
            } else {
                const gameChange = await trx('GameStagetwo').where('experiment_id', experiment_id).update({txt_game_link: newGameLink, txt_game_page: newGameText, has_game_form: newGameHasForm});

                if(gameChange){
                    await trx.commit();
                    return response.status(201).json({ok: true});
                }
                else{
                    await trx.rollback();
                    return response.status(400).json({error: 'Cannot update the game page, check the information sent'});
                }
            }
        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: 'Cannot update the game page, try again later'});
        }
    }
}

module.exports = GameLinkController;
