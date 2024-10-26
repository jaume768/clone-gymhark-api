const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getUserOrders, createOrder } = require('../controllers/orderController');

router.get('/my-orders', protect, getUserOrders);
router.post('/', protect, createOrder);

module.exports = router;
