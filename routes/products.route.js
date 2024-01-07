
const express = require('express');
const router = express.Router();
const multer  = require('multer');
const isSeller = require('../middleware/isSeller');
const isProductExist = require('../middleware/isProductExist');
const verifyToken = require('../middleware/verfiyToken');
const Product=require('../models/product.model');
const isProductOwner= require('../middleware/isProductOwner');



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

const productsController = require('../controllers/products.controller');

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
router.route('/') 
            .post(upload.single('image'),verifyToken,isSeller,
             productsController.addProduct)

             router.route('/:id')
            .put(
                upload.single('image'),verifyToken,isProductExist,isProductOwner,
                 productsController.updateProduct)
                 router.route('/:id')
            .delete(verifyToken,isProductExist,isProductOwner,productsController.deleteProduct)


            router.delete('/',
            // ,verifyToken,
            // isProductExist,isProductOwner,
            productsController.deleteAllProducts);

module.exports = router;