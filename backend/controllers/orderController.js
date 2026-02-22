const Order = require('../models/Order');
const Product = require('../models/Product');
const { orderSchema } = require('../utils/zodSchema');
const sendResponse = require('../utils/response');

// @desc    Create order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
    try {
        const validated = orderSchema.parse(req.body);

        // Check stock
        for (const item of validated.orderItems) {
            const product = await Product.findById(item.product);
            if (!product) return sendResponse(res, 404, `Product not found: ${item.product}`);
            if (product.stock < item.quantity) return sendResponse(res, 400, `Insufficient stock for ${product.name}`);
        }

        const order = await Order.create({
            user: req.user._id,
            ...validated,
            isPaid: validated.paymentMethod === 'COD' ? false : true,
            paidAt: validated.paymentMethod === 'COD' ? undefined : Date.now()
        });

        // Deduct stock
        for (const item of validated.orderItems) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }

        sendResponse(res, 201, 'Order placed successfully', order);
    } catch (error) {
        if (error.name === 'ZodError') return sendResponse(res, 400, error.errors[0].message);
        sendResponse(res, 500, error.message);
    }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        sendResponse(res, 200, 'Orders fetched successfully', orders);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return sendResponse(res, 404, 'Order not found');
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return sendResponse(res, 403, 'Not authorized to view this order');
        }
        sendResponse(res, 200, 'Order details fetched', order);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return sendResponse(res, 404, 'Order not found');
        order.status = req.body.status;
        if (req.body.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            if (!order.isPaid) { order.isPaid = true; order.paidAt = Date.now(); }
        }
        if (req.body.status === 'Cancelled') {
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
            }
        }
        await order.save();
        sendResponse(res, 200, 'Order status updated', order);
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};
