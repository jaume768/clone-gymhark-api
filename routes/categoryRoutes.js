const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Rutas protegidas
router.post('/', protect, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
