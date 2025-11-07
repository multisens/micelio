const express = require('express');
const VideoLinkController = require('../controllers/VideoLinkController');

const Router = express.Router();

const videoLinkController = new VideoLinkController();

Router.get('/:experiment_id', videoLinkController.get)
Router.post('/:experiment_id', videoLinkController.update);

module.exports = Router;
