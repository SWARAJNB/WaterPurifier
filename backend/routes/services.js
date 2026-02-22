const express = require('express');
const router = express.Router();
const { getServices, createService, bookService, getAllBookings, updateBookingStatus } = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(getServices)
    .post(protect, admin, createService);

router.post('/book', protect, bookService);

router.route('/bookings')
    .get(protect, admin, getAllBookings);

router.put('/bookings/:id', protect, admin, updateBookingStatus);

module.exports = router;
