// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middlewares/authMiddleware');

router.post('/create-payment-intent', protect, async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
            currency: 'eur',
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el Payment Intent', error: error.message });
    }
});

module.exports = router;
