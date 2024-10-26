// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Orders');

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

        // Obtener el ID de la orden desde metadata
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          try {
            // Actualizar el estado de la orden a 'completado' y establecer la fecha de pago
            await Order.findByIdAndUpdate(orderId, {
              estado: 'completado',
              fechaPago: new Date(),
            });

            console.log('Orden actualizada a completado');
          } catch (error) {
            console.error('Error al actualizar la orden:', error.message);
          }
        } else {
          console.error('No se encontró el ID de la orden en metadata');
        }

        break;
      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);

module.exports = router;
