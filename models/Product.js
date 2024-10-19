// ecommerce-backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        descripcion: {
            type: String,
            required: true,
            trim: true,
        },
        precio: {
            type: Number,
            required: true,
            default: 0.0,
        },
        categorias: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                required: true,
            }
        ],
        imagen: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', productSchema);
