const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const connectDB = require('../config/db');

const products = [
    {
        name: 'Kent Grand Plus 9L RO+UV+UF Water Purifier',
        brand: 'Kent',
        description: 'Kent Grand Plus is a wall-mountable RO water purifier with UV and UF purification. It features a mineral RO technology that retains essential natural minerals using a TDS controller. The multi-stage purification process ensures safe and pure drinking water for your entire family.',
        price: 18500,
        discountPrice: 14999,
        images: [],
        purifierType: 'RO+UV+UF',
        capacity: 9,
        specifications: { filtrationStages: 7, tankCapacity: '9 Litres', purificationCapacity: '20 L/hr', installationType: 'Wall Mount', bodyMaterial: 'ABS Food Grade Plastic', warranty: '1 Year', tds: 'Up to 2000 ppm', powerConsumption: '60W', dimensions: '39 x 26 x 52 cm', weight: '8.2 kg' },
        features: ['Mineral RO Technology', 'UV + UF Protection', 'TDS Controller', 'Zero Water Wastage', 'Auto Flush System', 'Filter Change Alarm'],
        stock: 25, rating: 4.5, numReviews: 128, featured: true, bestSeller: true
    },
    {
        name: 'Aquaguard Aura 7L RO+UV+MTDS Water Purifier',
        brand: 'Aquaguard',
        description: 'Aquaguard Aura features patented Active Copper and Zinc Booster technology. With 8-stage purification, it removes harmful bacteria, viruses, and heavy metals while enriching water with copper and zinc. The sleek stainless steel tank ensures water stays pure for longer.',
        price: 22000,
        discountPrice: 17490,
        images: [],
        purifierType: 'RO+UV+UF',
        capacity: 7,
        specifications: { filtrationStages: 8, tankCapacity: '7 Litres', purificationCapacity: '15 L/hr', installationType: 'Wall Mount / Countertop', bodyMaterial: 'Stainless Steel Tank', warranty: '2 Years', tds: 'Up to 2000 ppm', powerConsumption: '55W', dimensions: '37 x 27 x 50 cm', weight: '9.5 kg' },
        features: ['Active Copper Technology', 'Zinc Booster', 'Stainless Steel Tank', 'Mineral Guard', 'UV e-boiling', '8-Stage Purification'],
        stock: 18, rating: 4.3, numReviews: 95, featured: true, bestSeller: true
    },
    {
        name: 'Pureit Ultima Eco Mineral 10L RO+UV+MF Purifier',
        brand: 'Pureit',
        description: 'Pureit Ultima Eco is an eco-friendly water purifier that saves up to 80% water compared to other RO purifiers. With a 10-litre capacity and 7-stage filtration, it provides mineral-enriched water while minimizing water wastage. Ideal for families of 4-6 members.',
        price: 14500,
        discountPrice: 11999,
        images: [],
        purifierType: 'RO+UV',
        capacity: 10,
        specifications: { filtrationStages: 7, tankCapacity: '10 Litres', purificationCapacity: '24 L/hr', installationType: 'Wall Mount', bodyMaterial: 'ABS Food Grade Plastic', warranty: '1 Year', tds: 'Up to 2000 ppm', powerConsumption: '36W', dimensions: '40 x 28 x 54 cm', weight: '8.8 kg' },
        features: ['Eco Recovery Technology', 'FiltraPower Technology', 'Mineral Cartridge', 'Auto Shut Off', 'Voltage Fluctuation Guard', 'LED Indicators'],
        stock: 30, rating: 4.2, numReviews: 210, featured: true, bestSeller: false
    },
    {
        name: 'Livpure Glo Star 7L RO+UV+UF Purifier',
        brand: 'Livpure',
        description: 'Livpure Glo Star is equipped with in-tank UV sterilization that keeps stored water pure 24/7. The 7-stage purification with RO+UV+UF ensures removal of all types of impurities. The taste enhancer cartridge improves water taste naturally.',
        price: 12500,
        discountPrice: 9499,
        images: [],
        purifierType: 'RO+UV+UF',
        capacity: 7,
        specifications: { filtrationStages: 7, tankCapacity: '7 Litres', purificationCapacity: '12 L/hr', installationType: 'Wall Mount / Countertop', bodyMaterial: 'ABS Plastic', warranty: '1 Year', tds: 'Up to 1500 ppm', powerConsumption: '40W', dimensions: '35 x 25 x 49 cm', weight: '7.5 kg' },
        features: ['In-Tank UV Sterilization', 'Taste Enhancer', 'Super Sediment Filter', 'Carbon Block Filter', 'LED Purification Indicator', 'Child Lock'],
        stock: 40, rating: 4.1, numReviews: 156, featured: false, bestSeller: true
    },
    {
        name: 'AO Smith Z9 Green RO 10L Water Purifier',
        brand: 'AO Smith',
        description: 'AO Smith Z9 Green RO features patented Side Stream RO membrane technology that recovers up to 2X more water. With MIN-TECH membrane, it retains essential minerals while removing harmful contaminants. The 10L capacity serves large families efficiently.',
        price: 29500,
        discountPrice: 24999,
        images: [],
        purifierType: 'RO',
        capacity: 10,
        specifications: { filtrationStages: 8, tankCapacity: '10 Litres', purificationCapacity: '18 L/hr', installationType: 'Wall Mount', bodyMaterial: 'ABS + SS Tank', warranty: '2 Years', tds: 'Up to 2000 ppm', powerConsumption: '45W', dimensions: '42 x 30 x 55 cm', weight: '10.2 kg' },
        features: ['Side Stream RO Technology', 'MIN-TECH Membrane', '2X Water Recovery', 'Digital Display', 'Filter Life Indicator', 'Hot Key Functionality'],
        stock: 12, rating: 4.6, numReviews: 78, featured: true, bestSeller: false
    },
    {
        name: 'Blue Star Aristo 7L RO+UV+UF Purifier',
        brand: 'Blue Star',
        description: 'Blue Star Aristo offers 6-stage purification with Aqua Taste Booster (ATB) technology. The double-layered RO+UV protection ensures 100% safe drinking water. Its compact design fits perfectly in modern kitchens.',
        price: 11000,
        discountPrice: 8999,
        images: [],
        purifierType: 'RO+UV+UF',
        capacity: 7,
        specifications: { filtrationStages: 6, tankCapacity: '7 Litres', purificationCapacity: '12 L/hr', installationType: 'Wall Mount / Countertop', bodyMaterial: 'ABS Plastic', warranty: '1 Year', tds: 'Up to 1500 ppm', powerConsumption: '36W', dimensions: '33 x 23 x 46 cm', weight: '7 kg' },
        features: ['Aqua Taste Booster', 'Double Layered Protection', 'Immersion Copper Impregnation', 'Pre Filter Alert', 'Child Safety Lock', 'Detachable Storage Tank'],
        stock: 35, rating: 4.0, numReviews: 112, featured: false, bestSeller: true
    },
    {
        name: 'Havells Fab Alkaline 7L RO+UV+Alkaline Purifier',
        brand: 'Havells',
        description: 'Havells Fab features 7-stage purification with alkaline water technology. It transforms regular water into alkaline water with pH 8.5+, which aids in better hydration and overall health. The iProtect technology monitors purification in real-time.',
        price: 16500,
        discountPrice: 13999,
        images: [],
        purifierType: 'RO+UV',
        capacity: 7,
        specifications: { filtrationStages: 7, tankCapacity: '7 Litres', purificationCapacity: '15 L/hr', installationType: 'Wall Mount / Countertop', bodyMaterial: 'Food-Grade Plastic', warranty: '1 Year', tds: 'Up to 2000 ppm', powerConsumption: '45W', dimensions: '36 x 25 x 48 cm', weight: '8 kg' },
        features: ['Alkaline Water Technology', 'iProtect Monitoring', 'Revitalizer Technology', 'Self Diagnostic System', 'Zero Splash Tap', 'Corner/Wall Mount Design'],
        stock: 22, rating: 4.4, numReviews: 89, featured: true, bestSeller: false
    },
    {
        name: 'Tata Swach Cristella Plus 18L Gravity Purifier',
        brand: 'Tata Swach',
        description: 'Tata Swach Cristella Plus is a non-electric gravity-based water purifier ideal for areas with low water pressure or no electricity. The GermKill Kit removes bacteria and viruses without electricity, making it perfect for rural areas and budget-conscious families.',
        price: 2500,
        discountPrice: 1899,
        images: [],
        purifierType: 'Gravity',
        capacity: 18,
        specifications: { filtrationStages: 3, tankCapacity: '18 Litres', purificationCapacity: '3000 L per cartridge', installationType: 'Countertop', bodyMaterial: 'Food-Safe ABS Plastic', warranty: '6 Months', tds: 'Low TDS Water Only', powerConsumption: '0W (Non-Electric)', dimensions: '30 x 30 x 52 cm', weight: '3.5 kg' },
        features: ['No Electricity Required', 'GermKill Kit', 'Kitanu Magnet Technology', '3000L Cartridge Life', 'Transparent Tank', 'Easy Maintenance'],
        stock: 50, rating: 3.8, numReviews: 340, featured: false, bestSeller: true
    },
    {
        name: 'Kent Pearl 8L RO+UV+UF+TDS Purifier',
        brand: 'Kent',
        description: 'Kent Pearl features a detachable transparent tank with wall-mount and countertop installation. The TDS controller maintains essential minerals while removing dissolved impurities. Its sleek pearl-white design adds elegance to your kitchen.',
        price: 20000,
        discountPrice: 16499,
        images: [],
        purifierType: 'RO+UV+UF',
        capacity: 8,
        specifications: { filtrationStages: 7, tankCapacity: '8 Litres', purificationCapacity: '20 L/hr', installationType: 'Wall Mount / Countertop', bodyMaterial: 'ABS Food Grade Plastic', warranty: '1 Year', tds: 'Up to 2000 ppm', powerConsumption: '60W', dimensions: '38 x 27 x 51 cm', weight: '8.5 kg' },
        features: ['Detachable Transparent Tank', 'TDS Controller', 'UV LED Lamp', 'Auto-Flushing', 'Filter Alert System', 'ABS Food Grade Body'],
        stock: 20, rating: 4.3, numReviews: 167, featured: false, bestSeller: false
    },
    {
        name: 'LG PuriCare WHP Plus 8L RO+UV+Mineral Purifier',
        brand: 'LG',
        description: 'LG PuriCare WHP Plus with Dual Protection Stainless Steel Tank keeps water safe for up to 3 days. The multi-stage RO filtration with mineral booster provides clean, mineral-rich water. Smart display shows real-time filter status and water quality.',
        price: 26000,
        discountPrice: 21999,
        images: [],
        purifierType: 'RO+UV',
        capacity: 8,
        specifications: { filtrationStages: 6, tankCapacity: '8 Litres', purificationCapacity: '15 L/hr', installationType: 'Wall Mount', bodyMaterial: 'Stainless Steel Tank + ABS', warranty: '2 Years', tds: 'Up to 2000 ppm', powerConsumption: '50W', dimensions: '40 x 28 x 52 cm', weight: '9.8 kg' },
        features: ['Dual Protection SS Tank', 'Smart Display', 'Mineral Booster', 'Digital Sterilization', 'Multi-Stage Filtration', 'Filter Change Indicator'],
        stock: 15, rating: 4.5, numReviews: 64, featured: true, bestSeller: false
    },
    {
        name: 'Eureka Forbes Aquasure Delight 6L RO+UV+MTDS Purifier',
        brand: 'Eureka Forbes',
        description: 'Aquasure Delight Smart Plus is a compact 6L water purifier with advanced RO+UV+MTDS purification. Its compact design is perfect for small kitchens and the mineral cartridge ensures healthy mineral content.',
        price: 9500,
        discountPrice: 7499,
        images: [],
        purifierType: 'RO+UV',
        capacity: 6,
        specifications: { filtrationStages: 6, tankCapacity: '6 Litres', purificationCapacity: '10 L/hr', installationType: 'Wall Mount / Countertop', bodyMaterial: 'ABS Plastic', warranty: '1 Year', tds: 'Up to 1500 ppm', powerConsumption: '35W', dimensions: '31 x 22 x 44 cm', weight: '6.5 kg' },
        features: ['MTDS Technology', 'Mineral Cartridge', 'Compact Design', 'Energy Saving Mode', 'Auto Shut Off', 'Purification Indicator'],
        stock: 45, rating: 3.9, numReviews: 198, featured: false, bestSeller: true
    },
    {
        name: 'V-Guard Zenora 7L RO+UF+MB Water Purifier',
        brand: 'V-Guard',
        description: 'V-Guard Zenora comes with 7-stage purification and mineral balance technology. The UF membrane provides additional protection against bacteria. Purity Lock ensures no contaminated water is dispensed even during power cuts.',
        price: 10500,
        discountPrice: 8299,
        images: [],
        purifierType: 'RO+UF',
        capacity: 7,
        specifications: { filtrationStages: 7, tankCapacity: '7 Litres', purificationCapacity: '12 L/hr', installationType: 'Wall Mount', bodyMaterial: 'ABS Plastic', warranty: '1 Year', tds: 'Up to 2000 ppm', powerConsumption: '36W', dimensions: '34 x 24 x 47 cm', weight: '7.2 kg' },
        features: ['Mineral Balance Technology', 'Purity Lock', 'UF Membrane', '7-Stage Purification', 'Sediment Filter', 'Carbon Block Filter'],
        stock: 28, rating: 4.0, numReviews: 87, featured: false, bestSeller: false
    },
    {
        name: 'Aquaguard Sure Delight NXT 6L UV+UF Purifier',
        brand: 'Aquaguard',
        description: 'Aquaguard Sure Delight NXT is an affordable UV+UF purifier perfect for municipal/corporation water supply. With patented I-Filter Technology, it provides advanced purification without RO. Energy efficient and requires minimal maintenance.',
        price: 6500,
        discountPrice: 5199,
        images: [],
        purifierType: 'UV',
        capacity: 6,
        specifications: { filtrationStages: 5, tankCapacity: '6 Litres', purificationCapacity: '10 L/hr', installationType: 'Wall Mount / Countertop', bodyMaterial: 'ABS Plastic', warranty: '1 Year', tds: 'Low TDS Water', powerConsumption: '20W', dimensions: '30 x 21 x 40 cm', weight: '5.5 kg' },
        features: ['I-Filter Technology', 'UV + UF Double Protection', 'Energy Efficient', 'Chemi Block', 'Compact Design', 'Easy Maintenance'],
        stock: 55, rating: 3.7, numReviews: 230, featured: false, bestSeller: false
    },
    {
        name: 'Kent Supreme Alkaline 9L RO+UV+UF+Alkaline Purifier',
        brand: 'Kent',
        description: 'Kent Supreme Alkaline provides 11-stage purification with alkaline filter that increases water pH to improve gut health and immunity. The Zero Water Wastage technology recirculates rejected water to the overhead tank.',
        price: 24000,
        discountPrice: 19999,
        images: [],
        purifierType: 'RO+UV+UF',
        capacity: 9,
        specifications: { filtrationStages: 11, tankCapacity: '9 Litres', purificationCapacity: '20 L/hr', installationType: 'Wall Mount', bodyMaterial: 'ABS Food Grade Plastic', warranty: '1 Year + 3 Years Extended', tds: 'Up to 2000 ppm', powerConsumption: '60W', dimensions: '41 x 28 x 54 cm', weight: '9.5 kg' },
        features: ['Alkaline Water Filter', '11-Stage Purification', 'Zero Water Wastage', 'TDS Controller', 'UV LED Disinfection', 'Smart Auto-Flush', 'ISI Certified'],
        stock: 16, rating: 4.7, numReviews: 54, featured: true, bestSeller: true
    },
    {
        name: 'Faber Galaxy Plus 9L RO+UV+UF+MAT Purifier',
        brand: 'Faber',
        description: 'Faber Galaxy Plus features Mineral Addition Technology (MAT) that adds essential minerals back to purified water. The 10-stage purification with copper guard provides comprehensive protection against waterborne diseases.',
        price: 13500,
        discountPrice: 10499,
        images: [],
        purifierType: 'RO+UV+UF',
        capacity: 9,
        specifications: { filtrationStages: 10, tankCapacity: '9 Litres', purificationCapacity: '15 L/hr', installationType: 'Wall Mount', bodyMaterial: 'ABS + PC Plastic', warranty: '1 Year', tds: 'Up to 2000 ppm', powerConsumption: '40W', dimensions: '38 x 26 x 50 cm', weight: '8 kg' },
        features: ['Mineral Addition Technology', 'Copper Guard', '10-Stage Purification', 'Pre-Filter Included', 'Smart LED Indicators', 'High Recovery Rate'],
        stock: 32, rating: 4.1, numReviews: 73, featured: false, bestSeller: false
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log('Clearing existing data...');
        await Product.deleteMany({});
        await User.deleteMany({});
        await Coupon.deleteMany({});

        console.log('Seeding products...');
        await Product.insertMany(products);

        console.log('Creating admin user...');
        await User.create({
            name: 'Admin User',
            email: 'admin@aquapure.com',
            password: 'admin123',
            phone: '9999999999',
            role: 'admin'
        });

        console.log('Creating test user...');
        await User.create({
            name: 'Test User',
            email: 'user@aquapure.com',
            password: 'user123',
            phone: '8888888888',
            role: 'user'
        });

        console.log('Creating coupons...');
        await Coupon.insertMany([
            { code: 'WELCOME10', discount: 10, minOrder: 3000, maxDiscount: 1500, expiresAt: new Date('2027-12-31'), isActive: true },
            { code: 'PURE20', discount: 20, minOrder: 10000, maxDiscount: 5000, expiresAt: new Date('2027-06-30'), isActive: true },
            { code: 'SUMMER15', discount: 15, minOrder: 5000, maxDiscount: 3000, expiresAt: new Date('2027-08-31'), isActive: true }
        ]);

        console.log('Database seeded successfully!');
        console.log('Admin: admin@aquapure.com / admin123');
        console.log('User: user@aquapure.com / user123');
        console.log('Coupons: WELCOME10, PURE20, SUMMER15');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedDB();
