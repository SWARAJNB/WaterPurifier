const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getBrands } = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/brands', getBrands);
router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.array('images', 5), createProduct);
router.route('/:id')
    .get(getProduct)
    .put(protect, admin, upload.array('images', 5), updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
