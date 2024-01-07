const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const Product = require('../models/product.model');

const isProductOwner = async(req, res, next) => {
if(req.currentUser.id == req.currentProduct.userId){
    next();
}
else {
    const error = appError.create('you are not the product owner', 401, httpStatusText.ERROR);
    return next(error);
}

}
module.exports = isProductOwner;