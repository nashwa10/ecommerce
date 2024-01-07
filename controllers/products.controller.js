
const {validationResult} = require('express-validator');
const Product = require('../models/product.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');




// const addProduct = asyncWrapper(async (req, res, next) => {
    
//     const userId = req.currentUser.id; // Assuming the user ID is part of the request parameters

//     const { name, price, quantity, description, categoryId,tagId } = req.body;
    
//     let image = "profile.png" ; //default value

//     if(req.file){
//        image=req.file.filename ;
//     }
//     const errors = validationResult(req);
//     if(!errors.isEmpty()) {
//         const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
//         return next(error);
//     }

//     const newProduct = new Product({
//         name,
//         price,
//         description,
//         userId,
//         categoryId,
//         tagId,
//         image:image ,
//         quantity: initialQuantity  // Set the initial value
  
//     })
//     await newProduct.save();

//     res.status(201).json({status: httpStatusText.SUCCESS, data: {product: newProduct}})
// })
const addProduct = asyncWrapper(async (req, res, next) => {
    
    const userId = req.currentUser.id; // Assuming the user ID is part of the request parameters

    const { name, price, quantity, description, categoryId, tagId } = req.body;
    
    let image = "profile.png"; // Default value

    if (req.file) {
        image = req.file.filename;
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
        return next(error);
    }

    // Set the initial value of quantity to zero
    let initialQuantity = 0;

    // Check if quantity is provided in the request body
    if (quantity !== undefined) {
        initialQuantity = quantity;
    }

    const newProduct = new Product({
        name,
        price,
        description,
        userId,
        categoryId,
        tagId,
        image: image,
        quantity: initialQuantity  // Set the initial value
    });

    await newProduct.save();

    res.status(201).json({ status: httpStatusText.SUCCESS, data: { product: newProduct } });
});








const updateProduct = asyncWrapper(async (req, res, next) => {
    const productId = req.params.id; // Assuming the product ID is part of the request parameters
    console.log("req.body: ", req.body);

    // Extract updated product information from the request body
    const { name, price, quantity, description, categoryId, tagId } = req.body;

    // Check if the product exists
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
        const error = appError.create('Product not found', 404, httpStatusText.NOT_FOUND);
        return next(error);
    }

    // Update product information
    existingProduct.name = name;
    existingProduct.price = price;
    existingProduct.description = description;
    existingProduct.categoryId = categoryId;
    existingProduct.tagId = tagId;
    existingProduct.quantity=quantity;
    // Update image if a new file is uploaded
    if (req.file) {
        existingProduct.image = req.file.filename;
    }

    console.log("existingProduct: ", existingProduct);

    // Save the updated product information
    await existingProduct.save();

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { product: existingProduct } });

});
const deleteProduct = asyncWrapper(async (req, res, next) => {
    const productId = req.params.id; 

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
        const error = appError.create('Product not found', 404, httpStatusText.NOT_FOUND);
        return next(error);
    }

    await existingProduct.deleteOne();

    res.status(200).json({ status: httpStatusText.SUCCESS, message: 'Product deleted successfully' });
});





const deleteAllProducts = asyncWrapper(async (req, res, next) => {
    try {
        // Delete all products in the collection
        await Product.deleteMany({});

        res.status(200).json({ status: httpStatusText.SUCCESS, message: 'All products deleted successfully.' });
    } catch (error) {
        console.error(error);
        const appError = new AppError('Internal Server Error', 500, httpStatusText.ERROR);
        return next(appError);
    }
});


module.exports = {
   
    addProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts
    
}
