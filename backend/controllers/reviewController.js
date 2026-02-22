const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create review
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
    try {
        const { product, rating, title, comment } = req.body;
        const existing = await Review.findOne({ user: req.user._id, product });
        if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

        const review = await Review.create({ user: req.user._id, product, rating, title, comment });
        const populated = await Review.findById(review._id).populate('user', 'name avatar');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
