import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.product import Product
from app.models.user import User
from app.core.config import settings
from datetime import datetime
import certifi

# Comprehensive demo products
sample_products = [
    {
        "name": "AquaPure RO Standard",
        "brand": "AquaPure",
        "description": "Entry-level RO water purifier with mineral conservation. Perfect for small families.",
        "price": 8999,
        "discountPrice": 7499,
        "images": ["https://via.placeholder.com/400?text=AquaPure+RO+Standard"],
        "category": "Water Purifier",
        "purifierType": "RO",
        "capacity": 8,
        "specifications": {
            "filtration": "RO (Reverse Osmosis)",
            "tds_removal": "Up to 2000 PPM",
            "water_storage": "8 Liters",
            "flow_rate": "10-12 LPH",
            "warranty": "2 Years"
        },
        "features": ["Automatic Shutoff", "Low Pressure Indicator", "Mineral Cartridge"],
        "stock": 25,
        "featured": True,
        "isActive": True
    },
    {
        "name": "AquaPure UV Safe Plus",
        "brand": "AquaPure",
        "description": "UV-based purifier providing bacteria and virus removal. Ideal for areas with good water quality.",
        "price": 5999,
        "discountPrice": 4799,
        "images": ["https://via.placeholder.com/400?text=AquaPure+UV+Safe"],
        "category": "Water Purifier",
        "purifierType": "UV",
        "capacity": 10,
        "specifications": {
            "filtration": "UV + Sediment",
            "water_storage": "10 Liters",
            "lamp_life": "12000 Hours",
            "flow_rate": "15 LPH",
            "warranty": "1 Year"
        },
        "features": ["Quick Service", "Low Noise", "Compact Design"],
        "stock": 30,
        "featured": True,
        "isActive": True
    },
    {
        "name": "AquaPure RO+UV Premium",
        "brand": "AquaPure",
        "description": "Dual technology purifier combining RO and UV for complete water purification. Best seller!",
        "price": 12999,
        "discountPrice": 10999,
        "images": ["https://via.placeholder.com/400?text=AquaPure+RO+UV+Premium"],
        "category": "Water Purifier",
        "purifierType": "RO+UV",
        "capacity": 10,
        "specifications": {
            "filtration": "RO + UV Dual Stage",
            "tds_removal": "Up to 2000 PPM",
            "water_storage": "10 Liters",
            "flow_rate": "12-15 LPH",
            "warranty": "2 Years"
        },
        "features": ["Smart LED Indicator", "Auto on/off", "Mineral Guard"],
        "stock": 45,
        "featured": True,
        "bestSeller": True,
        "isActive": True
    },
    {
        "name": "AquaPure RO+UV+UF Ultra",
        "brand": "AquaPure",
        "description": "Triple-tech purification with UF for complete water safety. The ultimate choice!",
        "price": 18999,
        "discountPrice": 15999,
        "images": ["https://via.placeholder.com/400?text=AquaPure+RO+UV+UF"],
        "category": "Water Purifier",
        "purifierType": "RO+UV+UF",
        "capacity": 12,
        "specifications": {
            "filtration": "RO + UV + UF Triple Tech",
            "tds_removal": "Up to 2000 PPM",
            "water_storage": "12 Liters",
            "flow_rate": "15-18 LPH",
            "warranty": "3 Years"
        },
        "features": ["TDS Controller", "Hot Water Tap", "Mineral Boost"],
        "stock": 20,
        "featured": True,
        "bestSeller": True,
        "isActive": True
    },
    {
        "name": "Pure-Flow Compact RO",
        "brand": "Pure-Flow",
        "description": "Space-saving design with powerful RO filtration. Perfect for kitchen counter-tops.",
        "price": 7999,
        "discountPrice": 6499,
        "images": ["https://via.placeholder.com/400?text=Pure-Flow+Compact"],
        "category": "Water Purifier",
        "purifierType": "RO",
        "capacity": 6,
        "specifications": {
            "filtration": "RO",
            "tds_removal": "Up to 1500 PPM",
            "water_storage": "6 Liters",
            "flow_rate": "8-10 LPH",
            "warranty": "2 Years"
        },
        "features": ["Compact Design", "Easy Installation", "Auto Shutoff"],
        "stock": 35,
        "featured": False,
        "isActive": True
    },
    {
        "name": "CrystalClear Advanced RO+UV+TDS",
        "brand": "CrystalClear",
        "description": "Advanced TDS controller maintains essential minerals. Premium quality assurance.",
        "price": 16999,
        "discountPrice": 13999,
        "images": ["https://via.placeholder.com/400?text=CrystalClear+Advanced"],
        "category": "Water Purifier",
        "purifierType": "RO+UV+TDS",
        "capacity": 12,
        "specifications": {
            "filtration": "RO + UV + TDS Control",
            "tds_removal": "Adjustable up to 2000 PPM",
            "water_storage": "12 Liters",
            "flow_rate": "16-20 LPH",
            "warranty": "2 Years"
        },
        "features": ["Variable TDS", "Premium Tap", "Digital Display"],
        "stock": 18,
        "featured": True,
        "isActive": True
    },
    {
        "name": "GenX Alkaline Plus RO",
        "brand": "GenX",
        "description": "RO purifier with alkaline ionization for healthier water. Advanced wellness feature.",
        "price": 14999,
        "discountPrice": 12499,
        "images": ["https://via.placeholder.com/400?text=GenX+Alkaline"],
        "category": "Water Purifier",
        "purifierType": "RO+Alkaline",
        "capacity": 10,
        "specifications": {
            "filtration": "RO + Alkaline Ionization",
            "ph_level": "7.5-8.5 (Mild Alkaline)",
            "water_storage": "10 Liters",
            "flow_rate": "12-14 LPH",
            "warranty": "2 Years"
        },
        "features": ["Alkaline Technology", "pH Indicator", "Eco-Friendly"],
        "stock": 22,
        "featured": True,
        "isActive": True
    },
    {
        "name": "WaterGuard Smart WiFi RO",
        "brand": "WaterGuard",
        "description": "Smart WiFi enabled purifier with mobile app monitoring. IoT ready!",
        "price": 21999,
        "discountPrice": 18999,
        "images": ["https://via.placeholder.com/400?text=WaterGuard+Smart"],
        "category": "Water Purifier",
        "purifierType": "RO+UV",
        "capacity": 12,
        "specifications": {
            "filtration": "RO + UV Smart",
            "tds_removal": "Up to 2000 PPM",
            "water_storage": "12 Liters",
            "flow_rate": "15-18 LPH",
            "connectivity": "WiFi Enabled",
            "warranty": "3 Years"
        },
        "features": ["WiFi Monitoring", "Mobile App", "Smart Alerts", "Auto Diagnosis"],
        "stock": 12,
        "featured": True,
        "bestSeller": True,
        "isActive": True
    },
    {
        "name": "GreenFilter Eco UV",
        "brand": "GreenFilter",
        "description": "Eco-friendly UV purifier using minimal electricity. Save power and money!",
        "price": 4999,
        "discountPrice": 3999,
        "images": ["https://via.placeholder.com/400?text=GreenFilter+Eco"],
        "category": "Water Purifier",
        "purifierType": "UV",
        "capacity": 8,
        "specifications": {
            "filtration": "UV (Energy Efficient)",
            "water_storage": "8 Liters",
            "power_consumption": "5W (Ultra Low)",
            "flow_rate": "12 LPH",
            "warranty": "1 Year"
        },
        "features": ["Energy Efficient", "Portable", "Budget Friendly"],
        "stock": 40,
        "featured": False,
        "isActive": True
    },
    {
        "name": "PureSpring Total Care RO+UV+UF",
        "brand": "PureSpring",
        "description": "Complete purification with pre-filtration. Medical grade quality water.",
        "price": 19999,
        "discountPrice": 16499,
        "images": ["https://via.placeholder.com/400?text=PureSpring+Total"],
        "category": "Water Purifier",
        "purifierType": "RO+UV+UF",
        "capacity": 14,
        "specifications": {
            "filtration": "Pre-filter + RO + UV + UF",
            "tds_removal": "Up to 2000 PPM",
            "water_storage": "14 Liters",
            "flow_rate": "18-20 LPH",
            "warranty": "3 Years"
        },
        "features": ["Pre-filtration", "Medical Grade", "Premium Support"],
        "stock": 15,
        "featured": True,
        "isActive": True
    },
    {
        "name": "SureWater Mineral RO",
        "brand": "SureWater",
        "description": "RO with built-in mineral cartridge. Maintain essential minerals naturally.",
        "price": 11999,
        "discountPrice": 9999,
        "images": ["https://via.placeholder.com/400?text=SureWater+Mineral"],
        "category": "Water Purifier",
        "purifierType": "RO+Minerals",
        "capacity": 10,
        "specifications": {
            "filtration": "RO with Mineral Guard",
            "minerals": "Maintains Ca, Mg, K",
            "water_storage": "10 Liters",
            "flow_rate": "13-15 LPH",
            "warranty": "2 Years"
        },
        "features": ["Mineral Preservation", "TDS Adjusted", "Lab Tested"],
        "stock": 28,
        "featured": False,
        "isActive": True
    },
    {
        "name": "ProFlow RO+UV Compact",
        "brand": "ProFlow",
        "description": "Compact sized but powerful performance. Modern design and durability.",
        "price": 9999,
        "discountPrice": 8299,
        "images": ["https://via.placeholder.com/400?text=ProFlow+Compact"],
        "category": "Water Purifier",
        "purifierType": "RO+UV",
        "capacity": 8,
        "specifications": {
            "filtration": "RO + UV",
            "tds_removal": "Up to 1800 PPM",
            "water_storage": "8 Liters",
            "flow_rate": "10-12 LPH",
            "warranty": "2 Years"
        },
        "features": ["Space Saving", "Modern Design", "Easy Service"],
        "stock": 32,
        "featured": True,
        "isActive": True
    },
    {
        "name": "VitaWater UV+Alkaline",
        "brand": "VitaWater",
        "description": "UV purification with alkaline mineralization. Health-focused design.",
        "price": 6999,
        "discountPrice": 5799,
        "images": ["https://via.placeholder.com/400?text=VitaWater+UV"],
        "category": "Water Purifier",
        "purifierType": "UV+Alkaline",
        "capacity": 9,
        "specifications": {
            "filtration": "UV + Alkaline",
            "water_storage": "9 Liters",
            "alkaline_boost": "Yes",
            "flow_rate": "14 LPH",
            "warranty": "1.5 Years"
        },
        "features": ["Health Focused", "Alkaline Boost", "Modern Style"],
        "stock": 24,
        "featured": False,
        "isActive": True
    },
    {
        "name": "QuickPure Tap Filter RO",
        "brand": "QuickPure",
        "description": "Faucet-mounted inline RO filter. Quick installation, instant purification!",
        "price": 3999,
        "discountPrice": 2999,
        "images": ["https://via.placeholder.com/400?text=QuickPure+Tap"],
        "category": "Water Purifier",
        "purifierType": "RO-Inline",
        "capacity": 0,
        "specifications": {
            "filtration": "Inline RO",
            "tds_removal": "Up to 1500 PPM",
            "installation": "Faucet Mount",
            "flow_rate": "5-8 LPH",
            "warranty": "6 Months"
        },
        "features": ["Instant Install", "Budget Friendly", "Portable"],
        "stock": 50,
        "featured": False,
        "isActive": True
    },
    {
        "name": "PremiumFlow RO+UV+UF+TDS+Alkaline",
        "brand": "PremiumFlow",
        "description": "All-in-one purification with every advanced feature. The complete solution!",
        "price": 25999,
        "discountPrice": 21999,
        "images": ["https://via.placeholder.com/400?text=PremiumFlow+Complete"],
        "category": "Water Purifier",
        "purifierType": "RO+UV+UF+TDS+Alkaline",
        "capacity": 15,
        "specifications": {
            "filtration": "Complete 5-stage",
            "tds_removal": "Up to 2000 PPM",
            "water_storage": "15 Liters",
            "flow_rate": "20-25 LPH",
            "alkaline": "Yes",
            "warranty": "3 Years"
        },
        "features": ["5-Stage Purification", "Premium Build", "Lifetime Support"],
        "stock": 10,
        "featured": True,
        "bestSeller": True,
        "isActive": True
    }
]

async def seed_products():
    """Seed demo products into database."""
    client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        tlsCAFile=certifi.where()
    )
    
    try:
        await client.admin.command('ping')
        print("✅ Connected to MongoDB Atlas")
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return
    
    await init_beanie(
        database=client.get_default_database(),
        document_models=[Product, User]
    )
    
    try:
        # Clear existing products
        deleted = await Product.delete_all()
        print(f"🗑️  Cleared {deleted.deleted_count if hasattr(deleted, 'deleted_count') else 'previous'} products")
        
        # Insert new products
        products = [Product(**p) for p in sample_products]
        result = await Product.insert_many(products)
        print(f"✅ Seeded {len(result)} demo products successfully!")
        
        # Show summary
        total = await Product.count()
        featured = len([p for p in sample_products if p.get("featured")])
        bestsellers = len([p for p in sample_products if p.get("bestSeller")])
        
        print(f"\n📊 Seed Summary:")
        print(f"  • Total Products: {total}")
        print(f"  • Featured: {featured}")
        print(f"  • Best Sellers: {bestsellers}")
        print(f"  • Stock Coverage: Good")
        
    except Exception as e:
        print(f"❌ Seeding Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_products())
        "capacity": 9,
        "stock": 25,
        "rating": 4.8,
        "numReviews": 1240,
        "featured": True,
        "bestSeller": True,
        "specifications": {
            "Purification Technology": "RO + UV + UF + TDS Control",
            "Storage Capacity": "9 Litres",
            "Purification Production Rate": "20 L/hr",
            "Duty Cycle": "100 L/day",
            "Weight": "9.4 kg"
        },
        "features": [
            "In-tank UV Disinfection",
            "Zero Water Wastage Technology",
            "Digital Display of Purity",
            "High Power UV Lamp"
        ]
    },
    {
        "name": "Aquaguard Aura",
        "brand": "Aquaguard",
        "description": "Equipped with patented Active Copper Zinc Booster technology, Aquaguard Aura ensures that you get the goodness of copper and zinc in your water along with superior purification.",
        "price": 16000,
        "discountPrice": 14500,
        "images": ["https://res.cloudinary.com/swarajnb/image/upload/v1/water-purifier/aquaguard_aura.jpg"],
        "category": "Water Purifier",
        "purifierType": "RO+UV+MTDS",
        "capacity": 7,
        "stock": 15,
        "rating": 4.7,
        "numReviews": 850,
        "featured": True,
        "bestSeller": False,
        "specifications": {
            "Purification Technology": "RO + UV + MTDS",
            "Storage Capacity": "7 Litres",
            "Stages of Purification": "8 Stages",
            "Material": "Food Grade Plastic"
        },
        "features": [
            "Active Copper Technology",
            "Mineral Guard",
            "Superior RO Purification",
            "Stylish Design"
        ]
    },
    {
        "name": "Pureit Ultima RO+UV",
        "brand": "Pureit",
        "description": "HUL Pureit Ultima RO+UV with Pureness Indicator provides 100% safe and mineral-rich water. Its digital display keeps you informed about the filter life and water quality.",
        "price": 22000,
        "discountPrice": 19999,
        "images": ["https://res.cloudinary.com/swarajnb/image/upload/v1/water-purifier/pureit_ultima.jpg"],
        "category": "Water Purifier",
        "purifierType": "RO+UV",
        "capacity": 10,
        "stock": 10,
        "rating": 4.9,
        "numReviews": 560,
        "featured": False,
        "bestSeller": True,
        "specifications": {
            "Purification Technology": "RO + UV",
            "Storage Capacity": "10 Litres",
            "Purification Life": "6000 Litres",
            "Voltage": "220-240V"
        },
        "features": [
            "Advanced Alert System",
            "Mineral Cartridge Addition",
            "Neon Flash Indicators",
            "Sleek Black Design"
        ]
    },
    {
        "name": "Livpure Bolt+ RO",
        "brand": "Livpure",
        "description": "Livpure Bolt+ RO provides pure drinking water with 7 stages of purification. It features a copper 29 cartridge that infuses the goodness of copper into your water.",
        "price": 14000,
        "discountPrice": 12499,
        "images": ["https://res.cloudinary.com/swarajnb/image/upload/v1/water-purifier/livpure_bolt.jpg"],
        "category": "Water Purifier",
        "purifierType": "RO+UV+Copper",
        "capacity": 7,
        "stock": 30,
        "rating": 4.5,
        "numReviews": 320,
        "featured": False,
        "bestSeller": False,
        "specifications": {
            "Purification Technology": "RO + UV + Mineralizer",
            "Storage Capacity": "7 Litres",
            "Purification Stages": "7 Stages"
        },
        "features": [
            "In-tank UV sterilization",
            "Copper 29 Technology",
            "Mineralizer",
            "Super Elegant Design"
        ]
]

async def seed_db():
    print(f"📡 Connecting to MongoDB...")
    client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        tlsCAFile=certifi.where() if "mongodb+srv" in settings.MONGODB_URI else None
    )
    
    try:
        await client.admin.command('ping')
        print("✅ MongoDB connected successfully")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return
    
    await init_beanie(
        database=client.get_default_database(),
        document_models=[Product, User]
    )
    
    # Create demo admin user
    print("\n👤 Creating demo admin user...")
    try:
        existing_admin = await User.find_one(User.email == "admin@aquapure.com")
        if not existing_admin:
            admin_user = User(
                name="Admin User",
                email="admin@aquapure.com",
                password=User.get_password_hash("admin123"),
                phone="9999999999",
                role="admin"
            )
            await admin_user.insert()
            print("✅ Admin user created - Email: admin@aquapure.com, Password: admin123")
        else:
            print("ℹ️  Admin user already exists")
    except Exception as e:
        print(f"⚠️  Error creating admin: {e}")
    
    # Create demo regular user
    print("\n👤 Creating demo regular user...")
    try:
        existing_user = await User.find_one(User.email == "user@aquapure.com")
        if not existing_user:
            regular_user = User(
                name="Demo User",
                email="user@aquapure.com",
                password=User.get_password_hash("user123"),
                phone="8888888888",
                role="user"
            )
            await regular_user.insert()
            print("✅ Regular user created - Email: user@aquapure.com, Password: user123")
        else:
            print("ℹ️  Regular user already exists")
    except Exception as e:
        print(f"⚠️  Error creating user: {e}")
    
    # Clear existing products
    print("\n🗑️  Cleaning existing products...")
    deleted = await Product.delete_all()
    
    # Seed products
    print(f"\n🌱 Seeding {len(sample_products)} products...")
    try:
        products = [Product(**p) for p in sample_products]
        result = await Product.insert_many(products)
        print(f"✅ Successfully added {len(result)} products")
    except Exception as e:
        print(f"❌ Error seeding products: {e}")
    
    # Show summary
    total_products = await Product.count()
    total_users = await User.count()
    
    print(f"\n📊 Seed Summary:")
    print(f"  ✓ Total Products: {total_products}")
    print(f"  ✓ Total Users: {total_users}")
    print(f"\n✨ Seeding completed successfully!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_db())
