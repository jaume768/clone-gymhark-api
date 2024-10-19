const Category = require('../models/Category');

// Crear una nueva categoría
const createCategory = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        const categoriaExistente = await Category.findOne({ nombre: nombre.toUpperCase() });

        if (categoriaExistente) {
            return res.status(400).json({ message: 'Categoría ya existente' });
        }

        const categoria = await Category.create({ nombre, descripcion });

        res.status(201).json(categoria);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoría', error: error.message });
    }
};

// Obtener todas las categorías
const getAllCategories = async (req, res) => {
    try {
        const categorias = await Category.find().sort({ nombre: 1 }); // Ordenar alfabéticamente
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las categorías', error: error.message });
    }
};

// Obtener una categoría por ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await Category.findById(id);

        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la categoría', error: error.message });
    }
};

// Actualizar una categoría existente
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const categoria = await Category.findById(id);

        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Actualizar campos
        if (nombre) categoria.nombre = nombre;
        if (descripcion) categoria.descripcion = descripcion;

        await categoria.save();

        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la categoría', error: error.message });
    }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await Category.findById(id);

        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Verificar si hay productos asociados a esta categoría
        const Product = require('../models/Product');
        const productos = await Product.find({ categoria: id });

        if (productos.length > 0) {
            return res.status(400).json({ message: 'No se puede eliminar la categoría porque tiene productos asociados' });
        }

        await categoria.remove();

        res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la categoría', error: error.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
