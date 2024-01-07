const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');


const isBuyer = (req, res, next) => {
  //console.log(req.currentUser.role =='USER',req.currentUser.role)
    if (req.currentUser.role =='BUYER') {
        console.log('isBuyer:', req.currentUser);
        return next();
      } else {
        const error = appError.create('user is not buyer ', 401, httpStatusText.ERROR)
        return next(error);

      }
}
module.exports = isBuyer;