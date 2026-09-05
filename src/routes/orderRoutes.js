const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/', verifyToken, orderController.createOrder);
router.get('/:id', verifyToken, orderController.getOrderById);
router.get('/user/:userId', verifyToken, orderController.getOrdersByUser);

module.exports = router;