const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    
    government: {
        type: String,
        required: true,
         
    },
    shippingAmount: {
        type: Number,
        required: true,
        default: 1
    }


  
});

module.exports = mongoose.model('Shipping', shippingSchema);
