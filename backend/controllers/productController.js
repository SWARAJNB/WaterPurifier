const Product = require('../models/Product');
const { productSchema } = require('../utils/zodSchema');
const sendResponse = require('../utils/response');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all products with filters, sort, search, pagination
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const { search, brand, purifierType, minPrice, maxPrice, minRating, capacity, sort, page = 1, limit = 12, featured, bestSeller } = req.query;
        const query = { isActive: true };

        // Search
        if (search) query.$text = { $search: search };

        // Filters
        if (brand) query.brand = { $in: brand.split(',') };
        if (purifierType) query.purifierType = { $in: purifierType.split(',') };
        if (capacity) query.capacity = { $in: capacity.split(',').map(Number) };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (minRating) query.rating = { $gte: Number(minRating) };
        if (featured === 'true') query.featured = true;
        if (bestSeller === 'true') query.bestSeller = true;

        // Sort
        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        else if (sort === 'price_desc') sortOption = { price: -1 };
        else if (sort === 'rating') sortOption = { rating: -1 };
        else if (sort === 'popularity') sortOption = { numReviews: -1 };
        else if (sort === 'newest') sortOption = { createdAt: -1 };

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort(sortOption)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        sendResponse(res, 200, 'Products fetched successfully', {
            products,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total
        });
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create product (Admin)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        // Parse JSON strings from form-data if necessary
        const body = { ...req.body };
        if (body.specifications && typeof body.specifications === 'string') body.specifications = JSON.parse(body.specifications);
        if (body.features && typeof body.features === 'string') body.features = JSON.parse(body.features);

        const validated = productSchema.parse(body);

        // req.files is populated by multer-storage-cloudinary
        const images = req.files ? req.files.map(f => f.path) : [];

        const product = await Product.create({
            ...validated,
            images,
            specifications: body.specifications || {},
            features: body.features || []
        });

        sendResponse(res, 201, 'Product created successfully', product);
    } catch (error) {
        if (error.name === 'ZodError') return sendResponse(res, 400, error.errors[0].message);
        sendResponse(res, 500, error.message);
    }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return sendResponse(res, 404, 'Product not found');

        const body = { ...req.body };
        if (body.specifications && typeof body.specifications === 'string') body.specifications = JSON.parse(body.specifications);
        if (body.features && typeof body.features === 'string') body.features = JSON.parse(body.features);

        const validated = productSchema.parse(body);

        if (req.files && req.files.length > 0) {
            for (const imgUrl of product.images) {
                const fileName = imgUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`aquapure/products/${fileName}`).catch(() => { });
            }
            product.images = req.files.map(f => f.path);
        }

        Object.assign(product, validated);
        if (body.specifications) product.specifications = body.specifications;
        if (body.features) product.features = body.features;

        const updated = await product.save();
        sendResponse(res, 200, 'Product updated successfully', updated);
    } catch (error) {
        if (error.name === 'ZodError') return sendResponse(res, 400, error.errors[0].message);
        sendResponse(res, 500, error.message);
    }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return sendResponse(res, 404, 'Product not found');

        // Delete images from Cloudinary
        for (const imgUrl of product.images) {
            const parts = imgUrl.split('/');
            const fileName = parts[parts.length - 1].split('.')[0];
            const publicId = `aquapure/products/${fileName}`;
            await cloudinary.uploader.destroy(publicId).catch(() => { });
        }

        await product.deleteOne();
        sendResponse(res, 200, 'Product deleted successfully');
    } catch (error) {
        sendResponse(res, 500, error.message);
    }
};

// @desc    Get all brands (for filter)
// @route   GET /api/products/brands
exports.getBrands = async (req, res) => {
    try {
        const brands = await Product.distinct('brand', { isActive: true });
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
