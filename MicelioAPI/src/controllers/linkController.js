const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class LinkController {

	async get(request, response) {

        const {experiment_id} = request.params;

        const game = await knex('Game_Stagetwo as g')
                        .select('g.txt_game_link', 'g.txt_game_page')
                         .where('g.experiment_id', experiment_id)
                         .first();

        const video = await knex('Video_Stagetwo as v')
                         .select('v.txt_video_link', 'v.txt_video_page')
                          .where('v.experiment_id', experiment_id)
                          .first();
    
        response.json({game, video});
	}

	async update(request, response) {

        const {experiment_id} = request.params;
        const {page} = request.body;

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        if(page === 'G') {

            const {link, text} = request.body;

            const game = await knex('Game_Stagetwo as g')
                            .select('g.txt_game_link', 'g.txt_game_page')
                             .where('g.experiment_id', experiment_id)
                             .first();

            if (!link && game) {
                link = game.txt_game_link;
            }
            if (!text && game) {
                text = game.txt_game_page;
            }

            const trx = await knex.transaction();

            try{
                if(!game) {
                    const game_page_id = await idGenerator('Game_Stagetwo', 'game_page');

                    const gameData = {
                        game_page_id,
                        txt_game_link: link,
                        txt_game_page: text,
                        experiment_id
                    };

                    const gameChange = await trx('Game_Stagetwo').insert(gameData);

                    if(gameChange){
                        await trx.commit();
                        return response.status(201).json({ok: true});
                    }
                    else{
                        await trx.rollback();
                        return response.status(400).json({error: 'Cannot update the game page, check the information sent'});
                    }
                } else {
                    const gameChange = await trx('Game_Stagetwo').where('experiment_id', experiment_id).update({txt_game_link: link, txt_game_page: text});

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
        } else {
            const {link, text} = request.body;

            const video = await knex('Video_Stagetwo as v')
                             .select('v.txt_video_link', 'v.txt_video_page')
                              .where('v.experiment_id', experiment_id)
                              .first();

            if (!link && video) {
                link = video.txt_video_link;
            }
            if (!text && video) {
                text = video.txt_video_page;
            }

            const trx = await knex.transaction();

            try{
                if(!video) {
                    const video_page_id = await idGenerator('Video_Stagetwo', 'video_page');

                    const videoData = {
                        video_page_id,
                        txt_video_link: link,
                        txt_video_page: text,
                        experiment_id
                    };

                    const videoChange = await trx('Video_Stagetwo').insert(videoData);

                    if(videoChange){
                        await trx.commit();
                        return response.status(201).json({ok: true});
                    }
                    else{
                        await trx.rollback();
                        return response.status(400).json({error: 'Cannot update the video page, check the information sent'});
                    }
                } else {
                    const videoChange = await trx('Video_Stagetwo').where('experiment_id', experiment_id).update({txt_video_link: link, txt_video_page: text});

                    if(videoChange){
                        await trx.commit();
                        return response.status(201).json({ok: true});
                    }
                    else{
                        await trx.rollback();
                        return response.status(400).json({error: 'Cannot update the video page, check the information sent'});
                    }
                }
            }
            catch(err){
                await trx.rollback();
                return response.status(400).json({error: 'Cannot update the video page, try again later'});
            }
        }
    }
}

module.exports = LinkController;
