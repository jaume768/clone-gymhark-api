const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Obtener el carrito del usuario
exports.getCart = async (req, res) => {
    try {
        const carrito = await Cart.findOne({ usuario: req.user._id }).populate('items.producto');
        if (carrito) {
            res.json(carrito);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito' });
    }
};

// Agregar un producto al carrito
exports.addToCart = async (req, res) => {
    const { productoId, cantidad } = req.body;

    try {
        const producto = await Product.findById(productoId);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        let carrito = await Cart.findOne({ usuario: req.user._id });

        if (carrito) {
            const itemIndex = carrito.items.findIndex(item => item.producto.toString() === productoId);

            if (itemIndex > -1) {
                carrito.items[itemIndex].cantidad += cantidad;
            } else {
                carrito.items.push({ producto: productoId, cantidad });
            }

            carrito = await carrito.save();
            res.json(carrito);
        } else {
            carrito = new Cart({
                usuario: req.user._id,
                items: [{ producto: productoId, cantidad }],
            });
            await carrito.save();
            res.status(201).json(carrito);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar al carrito' });
    }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
    const { productoId } = req.body;

    try {
        const carrito = await Cart.findOne({ usuario: req.user._id });

        if (carrito) {
            carrito.items = carrito.items.filter(item => item.producto.toString() !== productoId);
            await carrito.save();
            res.json(carrito);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar del carrito' });
    }
};

// Vaciar el carrito
exports.clearCart = async (req, res) => {
    try {
        const carrito = await Cart.findOne({ usuario: req.user._id });

        if (carrito) {
            carrito.items = [];
            await carrito.save();
            res.json(carrito);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar el carrito' });
    }
};
