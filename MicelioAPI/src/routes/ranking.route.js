const {Router} = require('express')

const RankingController = require('../controllers/RankingController')
const rankingController = new RankingController();

const rankingRouter = Router()

rankingRouter.get('/', rankingController.get);

module.exports = rankingRouter;
