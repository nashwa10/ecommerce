const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');


const isAdmin = (req, res, next) => {
    if (req.currentUser.role === 'ADMIN') {
        console.log('isAdmin:', req.currentUser);
        return next();
      } else {
        const error = appError.create('user is not admin ', 401, httpStatusText.ERROR)
        return next(error);

      }
}
module.exports = isAdmin;