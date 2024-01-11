
const express = require('express');

const router = express.Router();

const orderController = require('../controllers/orders.controller');
const Order =require('../models/order.model');

const { validationSchema } = require('../middleware/validationSchema');

const verifyToken = require('../middleware/verfiyToken');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middleware/allowedTo');
const orderStatus = require('../utils/orderStatus');
const isBuyer = require('../middleware/isBuyer');
const isDelivery = require('../middleware/isDelivery');
const isOrderNotDelivered = require ('../middleware/isOrderNotDelivered');


router.route('/:id').post(verifyToken,isBuyer, orderController.createOrder);
 router.get('/', verifyToken , isBuyer, orderController.getAllOrders);
router.put('/updateOrder/:id', verifyToken , isDelivery, isOrderNotDelivered , orderController.updateOrder);

             module.exports = router;