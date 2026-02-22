const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, unique: true },
    discountPercent: { type: Number },
    discountAmount: { type: Number },
    expiryDate: { type: Date, required: true },
    image: { type: String }, // Banner image URL from Cloudinary
    isActive: { type: Boolean, default: true },
    category: { type: String, enum: ['Banner', 'Coupon', 'Special'], default: 'Special' }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
