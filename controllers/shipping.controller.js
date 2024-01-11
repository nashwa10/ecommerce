
const {validationResult} = require('express-validator');
const Shipping = require('../models/shipping.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');

// Create Shipping
const createShipping = asyncWrapper(async (req, res, next) => {
    const { government, shippingAmount } = req.body;
  
    try {
      const shipping = new Shipping({
        government,
        shippingAmount,
      });
  
      await shipping.save();
  
      res.status(201).json({
        status: 'Success',
        message: 'Shipping details created successfully.',
        data: { shipping },
      });
    } catch (error) {
      console.error(error);
      const appError = appError.create('Internal Server Error', 500, 'Error');
      return next(appError);
    }
  });

  // Update Shipping by ID
const updateShippingById = asyncWrapper(async (req, res, next) => {
    const shippingId = req.params.id;
    const { government, shippingAmount } = req.body;
  
    try {
      const shipping = await Shipping.findByIdAndUpdate(
        shippingId,
        { government, shippingAmount },
        { new: true, runValidators: true }
      );
  
      if (!shipping) {
        const error = appError.create('Shipping not found', 404, 'Not Found');
        return next(error);
      }
  
      res.status(200).json({
        status: 'Success',
        message: 'Shipping details updated successfully.',
        data: { shipping },
      });
    } catch (error) {
      console.error(error);
      const appError = appError.create('Internal Server Error', 500, 'Error');
      return next(appError);
    }
  });

  // Delete Shipping by ID
const deleteShippingById = asyncWrapper(async (req, res, next) => {
    const shippingId = req.params.id;
  
    try {
      const shipping = await Shipping.findByIdAndDelete(shippingId);
  
      if (!shipping) {
        const error = appError.create('Shipping not found', 404, 'Not Found');
        return next(error);
      }
  
      res.status(200).json({
        status: 'Success',
        message: 'Shipping details deleted successfully.',
      });
    } catch (error) {
      console.error(error);
      const appError = appError.create('Internal Server Error', 500, 'Error');
      return next(appError);
    }
  });
  
  
// Get all Shippings
const getAllShippings = asyncWrapper(async (req, res, next) => {
    try {
      const shippings = await Shipping.find();
  
      res.status(200).json({
        status: 'Success',
        message: 'Retrieved all shipping details successfully.',
        data: { shippings },
      });
    } catch (error) {
      console.error(error);
      const appError = appError.create('Internal Server Error', 500, 'Error');
      return next(appError);
    }
  });
  
  // Get Shipping by ID
  const getShippingById = asyncWrapper(async (req, res, next) => {
    const shippingId = req.params.id;
  
    try {
      const shipping = await Shipping.findById(shippingId);
  
      if (!shipping) {
        const error = appError.create('Shipping not found', 404, 'Not Found');
        return next(error);
      }
  
      res.status(200).json({
        status: 'Success',
        message: 'Retrieved shipping details successfully.',
        data: { shipping },
      });
    } catch (error) {
      console.error(error);
      const appError = appError.create('Internal Server Error', 500, 'Error');
      return next(appError);
    }
  });
  
  //get shipping by gevernmentName
  const getShippingByGovernment = async (req, res, next) => {
    try {
  
      // Find shipping information by government
      const government = req.params.government;
      const shipping = await Shipping.findOne({ government: government });  
  
      res.status(200).json({
        status: 'Success',
        message: 'Shipping information retrieved successfully.',
        data: { shipping },
      });
    } catch (error) {
      console.error(error);
      const appError = new Error('Internal Server Error');
      appError.status = 500;
      next(appError);
    }
  };

module.exports = {
    createShipping ,
    updateShippingById,
    deleteShippingById ,
    getAllShippings ,
    getShippingById ,
    getShippingByGovernment

}
