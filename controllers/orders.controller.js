
const {validationResult} = require('express-validator');
const Order = require('../models/order.model');
const orderStatus = require('../utils/orderStatus');

const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');


const createOrder = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id; // Assuming the user ID is part of the request parameters
    const cartId = req.params.id; 
    const { address, shippingAmount, totalPrice } = req.body;

    try {
        // You can add additional validation if needed

        const order = new Order({
            userId,
            cartId,
            address,
            shippingAmount,
            totalPrice
        });

        await order.save();

        res.status(201).json({
            status: 'Success',
            message: 'Order created successfully.',
            data: { order },
        });
    } catch (error) {
        console.error(error);
        const appError = new Error('Internal Server Error');
        appError.status = 500;
        next(appError);
    }
});




const getAllOrders = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id;

    try {
        // Find all orders for the user
        const orders = await Order.find({ userId }).populate({
            path: "cartId",
            populate:"productId"
          }).exec();

        // Calculate total price for each order
        for (const order of orders) {
            const cartEntry = order.cartId;
            const productPrice = cartEntry.productId.price;
            const quantity = cartEntry.quantity;
            order.totalPrice = productPrice * quantity;
        }

        res.status(200).json({
            status: 'Success',
            message: 'Retrieved all orders successfully.',
            data: { orders },
        });
    } catch (error) {
        console.error(error);
        const appError = new Error('Internal Server Error');
        appError.status = 500;
        next(appError);
    }
});



const updateOrder = asyncWrapper(async (req, res, next) => {
    const orderId = req.params.id;
    const { status } = req.body;

    try {
        // Update the order status
        const updatedOrder = 
        await Order.findById(orderId);
        

        if (!updatedOrder) {
            return res.status(404).json({
                status: 'Error',
                message: 'Order not found.',
                data: null,
            });
        }
        updatedOrder.status=status;  
        await updatedOrder.save();

        res.status(200).json({
            status: 'Success',
            message: 'Order status updated successfully.',
            data: { order: updatedOrder },
        });
    } catch (error) {
        console.error(error);
        const appError = new Error('Internal Server Error');
        appError.status = 500;
        next(appError);
    }
});



module.exports = {
createOrder ,
getAllOrders ,
updateOrder  
}
