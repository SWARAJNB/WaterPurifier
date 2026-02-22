const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    brand: { type: String, required: [true, 'Brand is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    discountPrice: { type: Number, default: 0 },
    images: [{ type: String }],
    category: { type: String, default: 'Water Purifier' },
    purifierType: {
        type: String,
        enum: ['RO', 'UV', 'UF', 'RO+UV', 'RO+UF', 'RO+UV+UF', 'Gravity'],
        required: [true, 'Purifier type is required']
    },
    capacity: { type: Number, required: true, comment: 'in litres' },
    specifications: {
        type: Map,
        of: String,
        default: {}
    },
    features: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Text index for search
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
