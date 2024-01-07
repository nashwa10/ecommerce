
const express = require('express');
const router = express.Router();
const multer  = require('multer');
const isSeller = require('../middleware/isSeller');
const categoryController = require('../controllers/categories.controller');



const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    
    if(imageType === 'image') {
        return cb(null, true)
    } else {
        return cb(appError.create('file must be an image', 400), false)
    }
}

const upload = multer({ 
    storage: diskStorage,
    fileFilter
})

const categoriesController = require('../controllers/categories.controller');

const { validationSchema } = require('../middleware/validationSchema');
// const verifyToken = require('../middleware/verfiyToken');
// const userRoles = require('../utils/userRoles');
const allowedTo = require('../middleware/allowedTo');


// router.route('/')
//             .get(courseController.getAllCourses)
//             .post(verifyToken, allowedTo(userRoles.MANGER), validationSchema(), courseController.addCourse);


// router.route('/:courseId')
//             .get(courseController.getCourse)
//             .patch(courseController.updateCourse)
//             .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), courseController.deleteCourse);
// router.route('/addProduct')
//             .post(upload.single('image'),isSeller,
//              productsController.addProduct)
router.route('/')
.post(
 categoryController.addCategory)

module.exports = router;