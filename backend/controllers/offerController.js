const Offer = require('../models/Offer');
const sendResponse = require('../utils/response');

// @desc    Get all active offers
exports.getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({ isActive: true, expiryDate: { $gt: new Date() } });
        sendResponse(res, 200, 'Offers fetched', offers);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// @desc    Create offer (Admin)
exports.createOffer = async (req, res) => {
    try {
        const image = req.file ? req.file.path : '';
        const offer = await Offer.create({ ...req.body, image });
        sendResponse(res, 201, 'Offer created', offer);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// @desc    Delete offer (Admin)
exports.deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Offer deleted');
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};
