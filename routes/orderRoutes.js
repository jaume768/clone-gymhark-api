const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getUserOrders } = require('../controllers/orderController');

router.get('/my-orders', protect, getUserOrders);

module.exports = router;
