// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Orders');
const Cart = require('../models/Cart');

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(`⚠️  Error al validar la firma: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`Pago para ${paymentIntent.amount} fue exitoso!`);

        const userId = paymentIntent.metadata.userId;

        try {
          const cart = await Cart.findOne({ usuario: userId }).populate('items.producto');

          if (cart) {
            const newOrder = new Order({
              usuario: userId,
              items: cart.items.map(item => ({
                producto: item.producto._id,
                cantidad: item.cantidad,
                precio: item.producto.precio,
              })),
              total: paymentIntent.amount / 100,
            });

            await newOrder.save();

            cart.items = [];
            await cart.save();

            console.log('Orden creada y carrito vaciado');
          } else {
            console.log('No se encontró el carrito del usuario');
          }
        } catch (error) {
          console.error('Error al crear la orden:', error.message);
        }

        break;
      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);

module.exports = router;
