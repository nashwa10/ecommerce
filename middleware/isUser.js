const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');


const isUser = (req, res, next) => {
  //console.log(req.currentUser.role =='USER',req.currentUser.role)
    if (req.currentUser.role =='USER') {
        console.log('isUser:', req.currentUser);
        return next();
      } else {
        const error = appError.create('user is not user ', 401, httpStatusText.ERROR)
        return next(error);

      }
}
module.exports = isUser;