const Coupon = require('../models/Coupon');

// @desc    Validate coupon
// @route   POST /api/coupons/validate
exports.validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
        if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
        if (coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon has expired' });
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });
        if (cartTotal < coupon.minOrder) return res.status(400).json({ message: `Minimum order of ₹${coupon.minOrder} required` });

        const discount = Math.min((cartTotal * coupon.discount) / 100, coupon.maxDiscount || Infinity);
        res.json({ code: coupon.code, discount: coupon.discount, discountAmount: Math.round(discount), message: `${coupon.discount}% discount applied!` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all coupons (Admin)
exports.getCoupons = async (req, res) => {
    try { res.json(await Coupon.find().sort({ createdAt: -1 })); }
    catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Create coupon (Admin)
exports.createCoupon = async (req, res) => {
    try { res.status(201).json(await Coupon.create(req.body)); }
    catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Update coupon (Admin)
exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Delete coupon (Admin)
exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon removed' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};
