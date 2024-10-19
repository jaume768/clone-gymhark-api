const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Ruta para registro
router.post('/register', register);

// Ruta para login
router.post('/login', login);

router.get('/profile',protect, getProfile);

module.exports = router;

