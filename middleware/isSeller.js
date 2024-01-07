const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');


const isSeller = (req, res, next) => {
  //console.log(req.currentUser.role =='USER',req.currentUser.role)
    if (req.currentUser.role =='SELLER') {
        console.log('isSeller:', req.currentUser);
        return next();
      } else {
        const error = appError.create('user is not Seller ', 401, httpStatusText.ERROR)
        return next(error);

      }
}
module.exports = isSeller;