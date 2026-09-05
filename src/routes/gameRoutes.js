const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const productController = require('../controllers/productController');

router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);
router.get('/:gameId/products', productController.getProductsByGame);

module.exports = router;