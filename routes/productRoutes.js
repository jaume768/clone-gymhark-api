const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

// Obtener todos los productos
router.get('/', getProducts);

// Obtener un producto por ID
router.get('/:id', getProductById);

// Crear un nuevo producto (requiere autenticación)
router.post('/', protect, createProduct);

// Actualizar un producto (requiere autenticación)
router.put('/:id', protect, updateProduct);

// Eliminar un producto (requiere autenticación)
router.delete('/:id', protect, deleteProduct);

module.exports = router;
