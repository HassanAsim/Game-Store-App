const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Console', 'Game', 'Accessory', 'Merchandise']
    },
    imageUrl: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    brand: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);