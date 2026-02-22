const Service = require('../models/Service');
const Booking = require('../models/Booking');
const sendResponse = require('../utils/response');

// @desc    Get all services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true });
        sendResponse(res, 200, 'Services fetched', services);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// @desc    Create service (Admin)
exports.createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);
        sendResponse(res, 201, 'Service created', service);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// @desc    Book a service
exports.bookService = async (req, res) => {
    try {
        const booking = await Booking.create({
            user: req.user._id,
            ...req.body
        });
        sendResponse(res, 201, 'Service booked successfully', booking);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// @desc    Get all bookings (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'name phone').populate('service').sort({ createdAt: -1 });
        sendResponse(res, 200, 'Bookings fetched', bookings);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// @desc    Update booking status (Admin)
exports.updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        sendResponse(res, 200, 'Booking updated', booking);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};
