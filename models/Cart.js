const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    cantidad: {
        type: Number,
        required: true,
        default: 1,
    },
});

const CartSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    items: [CartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
