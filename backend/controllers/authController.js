const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../utils/zodSchema');
const sendResponse = require('../utils/response');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// Cookie configuration
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const validated = registerSchema.parse(req.body);
        const exists = await User.findOne({ email: validated.email });
        if (exists) return sendResponse(res, 400, 'User already exists');

        const user = await User.create(validated);
        const token = generateToken(user._id);

        res.cookie('token', token, cookieOptions);

        sendResponse(res, 201, 'User registered successfully', {
            _id: user._id, name: user.name, email: user.email, role: user.role
        });
    } catch (error) {
        if (error.name === 'ZodError') return sendResponse(res, 400, error.errors[0].message);
        sendResponse(res, 500, error.message);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const validated = loginSchema.parse(req.body);
        const user = await User.findOne({ email: validated.email }).select('+password');
        if (!user || !(await user.comparePassword(validated.password))) {
            return sendResponse(res, 401, 'Invalid email or password');
        }

        const token = generateToken(user._id);
        res.cookie('token', token, cookieOptions);

        sendResponse(res, 200, 'Login successful', {
            _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar
        });
    } catch (error) {
        if (error.name === 'ZodError') return sendResponse(res, 400, error.errors[0].message);
        sendResponse(res, 500, error.message);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
    res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
    sendResponse(res, 200, 'Logged out successfully');
};

// @desc    Get user profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;
        if (req.body.addresses) user.addresses = req.body.addresses;
        const updated = await user.save();
        res.json({ _id: updated._id, name: updated.name, email: updated.email, phone: updated.phone, role: updated.role, addresses: updated.addresses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
        await user.save();
        console.log(`Password Reset OTP for ${user.email}: ${otp}`);
        res.json({ message: 'OTP sent to your email (check console for demo)' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email, resetPasswordOTP: otp, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle wishlist item
// @route   POST /api/auth/wishlist/:productId
exports.toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const idx = user.wishlist.indexOf(req.params.productId);
        if (idx > -1) {
            user.wishlist.splice(idx, 1);
        } else {
            user.wishlist.push(req.params.productId);
        }
        await user.save();
        const populated = await User.findById(user._id).populate('wishlist');
        res.json(populated.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
