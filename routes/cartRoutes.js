const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// Obtener el carrito del usuario
router.get('/', protect, getCart);

// Agregar un producto al carrito
router.post('/add', protect, addToCart);

// Eliminar un producto del carrito
router.delete('/remove', protect, removeFromCart);

// Vaciar el carrito
router.delete('/clear', protect, clearCart);

module.exports = router;
