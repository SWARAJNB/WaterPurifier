const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Scheduled', 'Completed', 'Cancelled'], default: 'Pending' },
    preferredDate: { type: Date, required: true },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    message: { type: String },
    assignedTechnician: { type: String },
    scheduledAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
