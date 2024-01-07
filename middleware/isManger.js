
//MANGER
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');


const isManger = (req, res, next) => {
    if (req.currentUser.role === 'MANGER') {
        console.log('isManger:', req.currentUser);
        return next();
      } else {
        const error = appError.create('user is not manager ', 401, httpStatusText.ERROR)
        return next(error);

      }
}
module.exports = isManger;