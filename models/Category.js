const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true, // Para almacenar en mayúsculas
        },
        descripcion: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt automáticamente
    }
);

module.exports = mongoose.model('Category', categorySchema);
