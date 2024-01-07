
const {validationResult} = require('express-validator');
const Category = require('../models/category.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');


// const getAllCourses = asyncWrapper(async (req,res) => {
//     const query = req.query;

//     const limit = query.limit || 10;
//     const page = query.page || 1;
//     const skip = (page - 1) * limit;

//     // get all courses) from DB using Course Model
//     const courses = await Course.find({}, {"__v": false}).limit(limit).skip(skip);

//     res.json({ status: httpStatusText.SUCCESS, data: {courses}});
// })

// const getCourse = asyncWrapper(
//     async (req, res, next) => {

//         const course = await Course.findById(req.params.courseId);
//         if(!course) {
//             const error = appError.create('course not found', 404, httpStatusText.FAIL)
//             return next(error);
//         }
//         return res.json({ status: httpStatusText.SUCCESS, data: {course}});
    
//     }
// )

const addProduct = asyncWrapper(async (req, res, next) => {
    const { name, price, description, userId, categoryId,tagId } = req.body;
    
    let image = "profile.png" ; //default value

    if(req.file){
       image=req.file.filename ;
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
        return next(error);
    }

    const newProduct = new Product({
        name,
        price,
        description,
        userId,
        categoryId,
        tagId,
        image:image
    })
    await newProduct.save();

    res.status(201).json({status: httpStatusText.SUCCESS, data: {product: newProduct}})
})

// const updateCourse = asyncWrapper(async (req, res) => {
//     const courseId = req.params.courseId;    
//     const updatedCourse = await Course.updateOne({_id: courseId}, {$set: {...req.body}});
//     return res.status(200).json({status: httpStatusText.SUCCESS, data: {course: updatedCourse}})


// })

// const deleteCourse = asyncWrapper(async (req, res) => {
//     await Course.deleteOne({_id: req.params.courseId});
//     res.status(200).json({status: httpStatusText.SUCCESS, data: null});
// })
const addCategory = asyncWrapper(async (req, res, next) => {
    const { name } = req.body;
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
        return next(error);
    }

    const newCategory = new Category({
        name
    
    })
    await newCategory.save();

    res.status(201).json({status: httpStatusText.SUCCESS, data: {category: newCategory}})
})

module.exports = {
    // getAllCourses,
    // getCourse,
    // addProduct
    // updateCourse,
    // deleteCourse
    addCategory
}
