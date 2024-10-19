const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};

        if (category) {
            const categoria = await Category.findOne({ nombre: category.toUpperCase() });
            if (categoria) {
                filter.categorias = categoria._id; // Filtrar productos que incluyan esta categoría
            } else {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }
        }

        const products = await Product.find(filter).populate('categorias', 'nombre');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id).populate('categorias', 'nombre');
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categorias, imagen, stock } = req.body;

        // Validar que 'categorias' sea un arreglo no vacío
        if (!Array.isArray(categorias) || categorias.length === 0) {
            return res.status(400).json({ message: 'Debe proporcionar al menos una categoría válida' });
        }

        // Verificar que todas las categorías existan
        const categoriasExistentes = await Category.find({ _id: { $in: categorias } });
        if (categoriasExistentes.length !== categorias.length) {
            return res.status(400).json({ message: 'Una o más categorías son inválidas' });
        }

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

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, categorias, imagen, stock } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (categorias) {
            // Validar que 'categorias' sea un arreglo no vacío
            if (!Array.isArray(categorias) || categorias.length === 0) {
                return res.status(400).json({ message: 'Debe proporcionar al menos una categoría válida' });
            }

            // Verificar que todas las categorías existan
            const categoriasExistentes = await Category.find({ _id: { $in: categorias } });
            if (categoriasExistentes.length !== categorias.length) {
                return res.status(400).json({ message: 'Una o más categorías son inválidas' });
            }

            product.categorias = categorias;
        }

        if (nombre) product.nombre = nombre;
        if (descripcion) product.descripcion = descripcion;
        if (precio) product.precio = precio;
        if (imagen) product.imagen = imagen;
        if (stock !== undefined) product.stock = stock; // Permitir stock = 0

        await product.save();

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const producto = await Product.findByIdAndDelete(req.params.id);

        if (producto) {
            res.json({ message: 'Producto eliminado' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const categoria = await Category.findOne({ nombre: category.toUpperCase() });

        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        const products = await Product.find({ categorias: categoria._id }).populate('categorias', 'nombre');

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos por categoría', error: error.message });
    }
};
