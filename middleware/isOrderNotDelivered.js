const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const Order = require('../models/order.model');

const isOrderNotDelivered = async(req, res, next) => {
    const orderId = req.params.id; 


const orderNotDelivered = await Order.findById(orderId);

if (!orderNotDelivered) {
    const error = appError.create('order not exist', 404, httpStatusText.NOT_FOUND);
    return next(error);
}
else {if (orderNotDelivered.status=="delivered"){
const error = appError.create('order is delivered', 404, httpStatusText.NOT_FOUND);
    return next(error);

}

else{req.currentOrder=orderNotDelivered;
    next();
}
}
}
module.exports = isOrderNotDelivered;
