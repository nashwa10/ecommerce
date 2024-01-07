
const {validationResult} = require('express-validator');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');


const addToCart = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id; // Assuming the user ID is part of the request parameters
    const productId =req.params.id ; 
      const {quantity} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
        return next(error);
    }

    try {
        console.log('Product ID:', productId);

        // Find the product by ID
        const product = await Product.findById(productId);
        console.log('quantity:', quantity);

        if (!product) {
            const error = appError.create('Product not found', 404, 'Not Found');
            return next(error);
        }

        // Create or update the user's cart entry
        let cartEntry = await Cart.findOne({ userId, productId });

        if (!cartEntry) {
            cartEntry = new Cart({
                userId,
                productId,
                quantity

            });
        } else {
            cartEntry.quantity += quantity;

        }

        await cartEntry.save();


        res.status(200).json({ status: 'Success', message: 'Product added to cart successfully.', data: { cartEntry } });
    } catch (error) {
        console.error(error);
        const appError = appError.create('Internal Server Error', 500, 'Error');
        return next(appError);
    return(error);
     }
});
const incrementQuantity = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id; // Assuming the user ID is part of the request parameters
    const productId =req.params.id ; 

    try {

        console.log(userId, productId);

        // Find the user's cart entry for the specified product
        let cartEntry = await Cart.findOne({ userId, productId });

        if (!cartEntry) {
            const error = appError.create('Cart entry not found', 404, 'Not Found');
            return next(error);
        }

        // Increment the quantity
        cartEntry.quantity++;

        await cartEntry.save();

        res.status(200).json({ status: 'Success', message: 'Quantity incremented successfully.', data: { cartEntry } });
    } catch (error) {
        console.error(error);
        const appError = appError.create('Internal Server Error', 500, 'Error');
        return next(appError);
    }
});

const decrementQuantity = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id; // Assuming the user ID is part of the request parameters
    const productId =req.params.id ; 

    try {
        // Find the user's cart entry for the specified product
        let cartEntry = await Cart.findOne({ userId, productId });

        if (!cartEntry) {
            const error = appError.create('Cart entry not found', 404, 'Not Found');
            return next(error);
        }

        // Decrement the quantity, ensuring it doesn't go below zero
        cartEntry.quantity = Math.max(0, cartEntry.quantity - 1);

        await cartEntry.save();

        res.status(200).json({ status: 'Success', message: 'Quantity decremented successfully.', data: { cartEntry } });
    } catch (error) {
        console.error(error);
        const appError = appError.create('Internal Server Error', 500, 'Error');
        return next(appError);
    }
});

const deleteFromCart = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id; // Assuming the user ID is part of the request parameters
    const productId  = req.params.id;

    try {
        // Find and remove the user's cart entry for the specified product
        const result = await Cart.findOneAndRemove({ userId, productId });

        if (!result) {
            const error = appError.create('Cart entry not found', 404, 'Not Found');
            return next(error);
        }

        res.status(200).json({ status: 'Success', message: 'Product deleted from cart successfully.' });
    } catch (error) {
        console.error(error);
        const appError = appError.create('Internal Server Error', 500, 'Error');
        return next(appError);
    }
});

const deleteAllFromCart = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id; // Assuming the user ID is part of the request parameters

    try {
        // Remove all cart entries for the user
        const result = await Cart.deleteMany({ userId });

        if (result.deletedCount === 0) {
            const error = appError.create('No cart entries found', 404, 'Not Found');
            return next(error);
        }

        res.status(200).json({ status: 'Success', message: 'All products deleted from cart successfully.' });
    } catch (error) {
        console.error(error);
        const appError = appError.create('Internal Server Error', 500, 'Error');
        return next(appError);
    }
});

const getAllFromCart = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id;

    try {
        // Find all cart entries for the user
        const cartEntries = await Cart.find({ userId }).populate('productId').exec();

          // Calculate total price for all products in the cart
          let totalPrice = 0;

          for (const cartEntry of cartEntries) {
              const productPrice = cartEntry.productId.price;
              const quantity = cartEntry.quantity;
              totalPrice += productPrice * quantity;
          }

        res.status(200).json({ status: 'Success', 
        message: 'Retrieved all products from cart successfully.',
         data: { cartEntries,totalPrice } });
    } catch (error) {
        console.error(error);
        const appError = appError.create('Internal Server Error', 500, 'Error');
        return next(appError);
    }
});


module.exports = {
    addToCart , 
    incrementQuantity,
    decrementQuantity,
    deleteFromCart,
    deleteAllFromCart,
    getAllFromCart
}
