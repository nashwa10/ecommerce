const mongoose = require('mongoose');
const orderStatus = require('../utils/orderStatus');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (assuming you have a User model)
        required: true,
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart', // Reference to the Cart model
        required: true,
    },
  address:{
    type: String,
    required: true,
},
  shippingAmount:{
    type: Number,
    required: true,
    default:0
},
    totalPrice: {
        type: Number,
        required: true,
    },
    // Add other fields relevant to your order
    // ...
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String, // ["pending", "inprogress", "delivered"]
        enum: [orderStatus.pending, orderStatus.inprogress, orderStatus.delivered, orderStatus.cancelled],
        default: orderStatus.pending
    },
});


module.exports = mongoose.model('Order', orderSchema);
