import express from 'express';
import { check, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js'
const router = express.Router();

import { findProduct, deleteProduct, getStoreProducts, updateProduct, createProduct, getProducts } from '../controllers/product.controller.js'

// @route   GET /
// @desc    Get all products from all stores.
// @access  Private
router.get('/', auth, getProducts);

// @route   POST /create
// @desc    add a new product to store
// @access  Private
router.post(
	'/create',
	[
		check('product_name', 'Please Enter Product Name').not().isEmpty(),
		// check('images', 'Please add images for your store').not().isEmpty(),
		check('category', 'Please select Category').not().isEmpty(),
		check('availability', 'Please select availability status').not().isEmpty(),
		check('price', 'Please enter price of product').not().isEmpty(),
		// check('rating', 'Please Enter Stores Address').not().isEmpty(),
	],
  auth,
	createProduct
);

// @route   GET /store-products
// @desc    Get all products belonging to a particular store, can be used by admin and stores
// @access  Private
router.get('/store-products', auth, getStoreProducts);

// @route   POST /find/:limit/:skip
// @desc    Find a particular product, app wide
// @access  Private
router.post('/find', auth, findProduct);

// @route   PUT /:id
// @desc    update a store product, can be used by admin and stores
// @access  Private
router.put('/:id', auth, updateProduct);

// @route   DELETE /:id
// @desc    delete a store product, can be used by admin and stores
// @access  Private
router.delete('/:id', auth, deleteProduct);

export default router;
