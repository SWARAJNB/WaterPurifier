const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});

const productSchema = z.object({
    name: z.string().min(3, 'Product name is required'),
    brand: z.string().min(1, 'Brand is required'),
    category: z.string().min(1, 'Category is required'),
    price: z.preprocess((a) => parseFloat(a), z.number().positive('Price must be positive')),
    discountPrice: z.preprocess((a) => parseFloat(a), z.number().nonnegative().optional()),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    stock: z.preprocess((a) => parseInt(a), z.number().nonnegative()),
    purifierType: z.string().optional(),
    specifications: z.record(z.string()).optional(),
    features: z.array(z.string()).optional()
});

const orderSchema = z.object({
    orderItems: z.array(z.object({
        name: z.string(),
        quantity: z.number().positive(),
        image: z.string(),
        price: z.number(),
        product: z.string()
    })).min(1, 'Order must have at least one item'),
    shippingAddress: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string().default('India')
    }),
    paymentMethod: z.string(),
    itemsPrice: z.number(),
    shippingPrice: z.number(),
    taxPrice: z.number(),
    totalPrice: z.number()
});

module.exports = {
    registerSchema,
    loginSchema,
    productSchema,
    orderSchema
};
