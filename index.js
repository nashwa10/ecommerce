
require('dotenv').config()
const express = require('express');
const rateLimit = require('express-rate-limit');

const path = require('path');

const cors = require('cors');


const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const mongoose = require('mongoose');

const httpStatusText = require('./utils/httpStatusText');


const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
    console.log('mongodb server started')
})

app.use(cors())
app.use(express.json());

const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');
const tagsRouter = require('./routes/tags.route');
const productsRouter = require('./routes/products.route');
const categoriesRouter = require('./routes/categories.route');
const cartsRouter = require('./routes/carts.route');
const shippingRouter=require('./routes/shipping.route');
const ordersRouter=require('./routes/orders.route');
  
app.use('/api/courses', coursesRouter) // /api/courses
app.use('/api/orders', ordersRouter) // /api/courses

app.use('/api/users', usersRouter) // /api/users
app.use('/api/shipping', shippingRouter) // /shipping


app.use('/api/products', productsRouter) // /api/products


app.use('/api/tags', tagsRouter) // /api/tags

app.use('/api/categories', categoriesRouter) // /api/categories

app.use('/api/carts', cartsRouter) // /api/carts

// global middleware for not found router
app.all('*', (req, res, next)=> {
    return res.status(404).json({ status: httpStatusText.ERROR, message: 'this resource is not available'})
})


// Apply rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  
  app.use(limiter);
// global error handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data: null});
})


app.listen(process.env.PORT || 5000, () => {
    console.log('listening on port: 5000');
});
