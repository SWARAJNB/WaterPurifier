const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true },
    phone: { type: String, required: [true, 'Phone is required'] },
    serviceType: {
        type: String,
        required: true,
        enum: ['Installation', 'Maintenance', 'AMC Plan', 'Repair', 'Other']
    },
    message: { type: String, default: '' },
    preferredDate: { type: Date },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
