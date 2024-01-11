
const express = require('express');

const router = express.Router();

const shippingController = require('../controllers/shipping.controller');

const { validationSchema } = require('../middleware/validationSchema');
const verifyToken = require('../middleware/verfiyToken');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middleware/allowedTo');
const isAdmin = require('../middleware/isAdmin');

router.post('/', verifyToken , isAdmin , shippingController.createShipping);
router.put('/:id', verifyToken , isAdmin , shippingController.updateShippingById);
router.delete('/:id', verifyToken , isAdmin , shippingController.deleteShippingById);
router.get('/',  verifyToken , isAdmin ,shippingController.getAllShippings);
router.get('/:id',  verifyToken , isAdmin ,shippingController.getShippingById);
router.get('/name/:government',  verifyToken , isAdmin ,shippingController.getShippingByGovernment);

module.exports = router;