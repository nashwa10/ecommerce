const asyncWrapper = require("../middleware/asyncWrapper");
const User = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req,res) => {

    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    // get all courses) from DB using Course Model
    const users = await User.find({}, {"__v": false, 'password': false}).limit(limit).skip(skip);

    res.json({ status: httpStatusText.SUCCESS, data: {users}});
})


const register = asyncWrapper(async (req, res, next) => {

    const { firstName, lastName, email, password, role } = req.body;
  
    let avatar = "profile.png" ; //default value

 if(req.file){
    avatar=req.file.filename ;
 }

    const oldUser = await User.findOne({ email: email});

    if(oldUser) {
        const error = appError.create('user already exists', 400, httpStatusText.FAIL)
        return next(error);
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        avatar:avatar
    })

    // generate JWT token 
    const token = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role});
   // newUser.token = token;


   await newUser.save(); 



    res.status(201).json({status: httpStatusText.SUCCESS, data: {user: newUser, token}})


})

const updateUser = asyncWrapper(async (req, res, next) => {
    const userId = req.currentUser.id; // Assuming the user ID is part of the request parameters
console.log("req.body: ",req.body)
    // Extract updated user information from the request body
    const { firstName, lastName, email, password, role } = req.body;

    // Check if the user exists
    const existingUser = await User.findById(userId);

    if (!existingUser) {
        const error = appError.create('User not found', 404, httpStatusText.NOT_FOUND);
        return next(error);
    }

    // Update user information
    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.email = email;
    existingUser.role = role;

    // Update password if provided
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
    }

    // Update avatar if a new file is uploaded
    if (req.file) {
        existingUser.avatar = req.file.filename;
    }
console.log("existingUser: ",existingUser)
    // Save the updated user information
    await existingUser.save();

    // Optional: generate and return a new JWT token if needed
    const token = await generateJWT({ email: existingUser.email, id: existingUser._id, role: existingUser.role });

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { user: existingUser, token } });
});


const login = asyncWrapper(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email && !password) {
        const error = appError.create('email and password are required', 400, httpStatusText.FAIL)
        return next(error);
    }

    const user = await User.findOne({email: email});

    if(!user) {
        const error = appError.create('user not found', 400, httpStatusText.FAIL)
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if(user && matchedPassword) {
        // logged in successfully

       const token = await generateJWT({email: user.email, id: user._id, role: user.role});

        return res.json({ status: httpStatusText.SUCCESS, data: {user,token}});
    } else {
        const error = appError.create('something wrong', 500, httpStatusText.ERROR)
        return next(error);
    }

});
const deleteUser = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id; // Assuming the user ID is part of the request parameters

    // Check if the user exists
    const existingUser = await User.findById(userId);

    if (!existingUser) {
        const error = appError.create('User not found', 404, httpStatusText.NOT_FOUND);
        return next(error);
    }

    // Delete the user
    await existingUser.deleteOne();

    res.status(200).json({ status: httpStatusText.SUCCESS, message: 'User deleted successfully' });
});



module.exports = {
    getAllUsers,
    register,
    login,
    updateUser,
    deleteUser
}