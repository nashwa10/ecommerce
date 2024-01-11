const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const Product = require('../models/product.model');

const isProductExist = async(req, res, next) => {
    const productId = req.params.id; 


const existingProduct = await Product.findById(productId);

if (!existingProduct) {
    const error = appError.create('Wrong Product ID', 404, httpStatusText.NOT_FOUND);
    return next(error);
}
else {req.currentProduct = existingProduct;
next();
}
}
module.exports = isProductExist;
module.exports = isProductExist;