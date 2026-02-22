const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    features: [{ type: String }],
    durationMonths: { type: Number, default: 12 },
    category: { type: String, enum: ['Installation', 'Maintenance', 'AMC', 'Repair'], required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
