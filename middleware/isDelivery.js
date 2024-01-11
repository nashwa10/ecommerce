const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');


const isDelivery = (req, res, next) => {
    if (req.currentUser.role =='DELIVERY') {
        console.log('isDelivery:', req.currentUser);
        return next();
      } else {
        const error = appError.create('user is not DELIVERY ', 401, httpStatusText.ERROR)
        return next(error);

      }
}
module.exports = isDelivery;