const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class VideoLinkController {

	async get(request, response) {

        const {experiment_id} = request.params;

        const video = await knex('Video_Stagetwo as v')
                         .select('v.txt_video_link', 'v.txt_video_page')
                          .where('v.experiment_id', experiment_id)
                          .first();
    
        response.json({video});
	}

	async update(request, response) {

        const {experiment_id} = request.params;

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        let {newVideoLink, newVideoText} = request.body;

        if (!newVideoLink && !newVideoText) {
            return response.status(400).json({error: "Missing link and text"});
        }

        const video = await knex('Video_Stagetwo as v')
                            .select('v.txt_video_link', 'v.txt_video_page')
                            .where('v.experiment_id', experiment_id)
                            .first();

        if (!newVideoLink && video) {
            newVideoLink = video.txt_video_link;
        }
        if (!newVideoText && video) {
            newVideoText = video.txt_video_page;
        }

        const trx = await knex.transaction();

        try{
            if(!video) {
                const video_page_id = await idGenerator('Video_Stagetwo', 'video_page');

                const videoData = {
                    video_page_id,
                    txt_video_link: newVideoLink,
                    txt_video_page: newVideoText,
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
                const videoChange = await trx('Video_Stagetwo').where('experiment_id', experiment_id).update({txt_video_link: newVideoLink, txt_video_page: newVideoText});

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

module.exports = VideoLinkController;
