const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'uploads/profile.png'
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    tagId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tag',
    }
})

module.exports = mongoose.model('Product', productSchema);