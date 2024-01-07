
const express = require('express');

const router = express.Router();

const cartsController = require('../controllers/carts.controller');

const { validationSchema } = require('../middleware/validationSchema');
const verifyToken = require('../middleware/verfiyToken');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middleware/allowedTo');
const isBuyer = require('../middleware/isBuyer');

router.post('/:id', verifyToken , isBuyer , cartsController.addToCart);
router.get('/', verifyToken , isBuyer , cartsController.getAllFromCart);

router.put('/increment/:id', verifyToken , isBuyer , cartsController.incrementQuantity);
router.put('/decrement/:id', verifyToken , isBuyer , cartsController.decrementQuantity);
router.delete('/:id', verifyToken , isBuyer , cartsController.deleteFromCart);
router.delete('/', verifyToken , isBuyer , cartsController.deleteAllFromCart);


module.exports = router;