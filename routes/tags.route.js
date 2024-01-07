
const express = require('express');

const router = express.Router();

const tagController = require('../controllers/tags.controller');
const courseController = require('../controllers/courses.controller');

const { validationSchema } = require('../middleware/validationSchema');
const verifyToken = require('../middleware/verfiyToken');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middleware/allowedTo');
const isSeller = require('../middleware/isSeller');



// router.route('/')
//             .get(courseController.getAllCourses)
//             .post(verifyToken, allowedTo(userRoles.MANGER), validationSchema(), courseController.addCourse);


router.route('/:courseId')
            .get(courseController.getCourse)
            .patch(courseController.updateCourse)
            .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), courseController.deleteCourse);

            router.route('/')
            .post(
             tagController.addTag)

module.exports = router;