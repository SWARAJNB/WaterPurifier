const express = require('express');
const router = express.Router();
const { getOffers, createOffer, deleteOffer } = require('../controllers/offerController');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getOffers)
    .post(protect, admin, upload.single('image'), createOffer);

router.delete('/:id', protect, admin, deleteOffer);

module.exports = router;
