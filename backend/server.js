const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// ─── Load Environment Variables ───
dotenv.config();

// ─── Database and Server initialization removed from top level ───

const app = express();

// ─── Security Middleware ───
// Helmet: Sets various HTTP security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
}));

// CORS: Allow only trusted origins
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate Limiting: Prevent brute-force & DDoS
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,                  // limit each IP to 200 requests per window
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,                   // stricter for auth routes
    message: { message: 'Too many login/register attempts. Try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(generalLimiter);

// Compression: GZIP responses
app.use(compression());

// Sanitize: Prevent NoSQL injection attacks
app.use(mongoSanitize());

// HPP: Prevent HTTP Parameter Pollution
app.use(hpp());

// Request Logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Body Parsers ───
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Serve Uploaded Files ───
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '7d',           // Cache static files for 7 days
    etag: true,
    lastModified: true,
}));

// ─── Routes ───
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/services', require('./routes/services'));
app.use('/api/offers', require('./routes/offers'));

// ─── Health Check ───
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'AquaPure API Running',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
    });
});

// ─── Error Handler ───
app.use(errorHandler);

// ─── Create uploads directory if not exists ───
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ─── Start Server ───
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error(`Unhandled Rejection: ${err.message}`);
            // Don't exit, just log it. In a real production app, you might want to restart gracefully.
        });

    } catch (err) {
        console.error(`Server failed to start: ${err.message}`);
        process.exit(1);
    }
};

startServer();
