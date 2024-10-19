// controllers/adminController.js
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

// CRUD para Usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.role = role;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol del usuario', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await user.remove();

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
};

// CRUD para Productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('categorias', 'nombre');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
};

exports.createAdminProduct = async (req, res) => {
    const { nombre, descripcion, precio, categorias, imagen, stock } = req.body;

    try {
        const product = await Product.create({
            nombre,
            descripcion,
            precio,
            categorias,
            imagen,
            stock,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error: error.message });
    }
};

exports.updateAdminProduct = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, categorias, imagen, stock } = req.body;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (nombre) product.nombre = nombre;
        if (descripcion) product.descripcion = descripcion;
        if (precio) product.precio = precio;
        if (categorias) product.categorias = categorias;
        if (imagen) product.imagen = imagen;
        if (stock !== undefined) product.stock = stock;

        await product.save();

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
    }
};

exports.deleteAdminProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);

        if (product) {
            res.json({ message: 'Producto eliminado' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
};

// CRUD para Categorías
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ nombre: 1 }); // Ordenar alfabéticamente
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las categorías', error: error.message });
    }
};

exports.createAdminCategory = async (req, res) => {
    const { nombre, descripcion } = req.body;

    try {
        const category = await Category.create({ nombre, descripcion });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoría', error: error.message });
    }
};

exports.updateAdminCategory = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        if (nombre) category.nombre = nombre;
        if (descripcion) category.descripcion = descripcion;

        await category.save();

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la categoría', error: error.message });
    }
};

exports.deleteAdminCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Verificar si hay productos asociados a esta categoría
        const products = await Product.find({ categorias: id });

        if (products.length > 0) {
            return res.status(400).json({ message: 'No se puede eliminar la categoría porque tiene productos asociados' });
        }

        await category.remove();

        res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la categoría', error: error.message });
    }
};
