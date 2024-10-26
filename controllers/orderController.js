const Order = require('../models/Orders');

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ usuario: req.user._id })
      .populate('items.producto')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las órdenes', error: error.message });
  }
};

exports.createOrder = async (req, res) => {
    try {
      const { items, total, shippingInfo } = req.body;
  
      const newOrder = new Order({
        usuario: req.user._id,
        items,
        total,
        shippingInfo,
        estado: 'pendiente',
      });
  
      await newOrder.save();
  
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la orden', error: error.message });
    }
};