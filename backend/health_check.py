#!/usr/bin/env python3
"""
AquaPure Backend Health Check & Setup Verification
Verifies that all dependencies, configurations, and database connections are working.
"""

import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import certifi

# Import all models and settings
from app.core.config import settings
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.extras import Service, Review, Coupon, Offer, Booking
from app.models.info import BusinessInfo

async def check_environment():
    """Check if all required environment variables are set."""
    print("\n📋 Checking Environment Variables:")
    required_vars = {
        "MONGODB_URI": "Database connection",
        "JWT_SECRET": "JWT authentication",
        "CORS_ORIGINS": "CORS configuration"
    }
    
    missing = []
    for var, description in required_vars.items():
        value = getattr(settings, var, None)
        if value:
            print(f"  ✅ {var}: Configured ({description})")
        else:
            print(f"  ❌ {var}: MISSING")
            missing.append(var)
    
    if missing:
        print(f"\n  ⚠️  Missing variables: {', '.join(missing)}")
        print("  Please set them in .env file")
        return False
    return True

async def check_mongodb():
    """Check MongoDB connection."""
    print("\n🗄️  Checking MongoDB Connection:")
    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            tlsCAFile=certifi.where()
        )
        await client.admin.command('ping')
        print("  ✅ MongoDB: Connected successfully")
        
        # Initialize Beanie with all models
        await init_beanie(
            database=client.get_default_database(),
            document_models=[
                User, Product, Order, Service, 
                Review, Booking, Coupon, Offer, BusinessInfo
            ]
        )
        print("  ✅ Beanie: Models initialized")
        
        # Count documents
        user_count = await User.count()
        product_count = await Product.count()
        order_count = await Order.count()
        
        print(f"\n  📊 Database Statistics:")
        print(f"    • Users: {user_count}")
        print(f"    • Products: {product_count}")
        print(f"    • Orders: {order_count}")
        
        if product_count == 0:
            print("\n  ⚠️  No products found! Run: python seed_products.py")
        
        if user_count == 0:
            print("  ⚠️  No users found! Run: python seed_products.py")
        
        client.close()
        return True
    except Exception as e:
        print(f"  ❌ MongoDB: Failed - {str(e)}")
        return False

async def check_security():
    """Check security configuration."""
    print("\n🔐 Checking Security Setup:")
    
    checks = {
        "JWT_SECRET": settings.JWT_SECRET and len(settings.JWT_SECRET) > 16,
        "CORS configured": settings.cors_origins_list and len(settings.cors_origins_list) > 0,
        "Environment": settings.NODE_ENV in ["development", "production"]
    }
    
    for check, passed in checks.items():
        status = "✅" if passed else "❌"
        print(f"  {status} {check}")
    
    if not all(checks.values()):
        return False
    return True

async def check_optional_services():
    """Check optional services like Cloudinary and Razorpay."""
    print("\n🔌 Optional Services:")
    
    services = {
        "Cloudinary": settings.CLOUDINARY_CLOUD_NAME is not None,
        "Razorpay": settings.RAZORPAY_KEY_ID is not None,
    }
    
    for service, configured in services.items():
        if configured:
            print(f"  ✅ {service}: Configured")
        else:
            print(f"  ⚠️  {service}: Not configured (optional)")
    
    return True

async def main():
    """Run all checks."""
    print("\n" + "="*50)
    print("🌊 AquaPure Backend - Setup Verification")
    print("="*50)
    
    all_passed = True
    
    # Run all checks
    all_passed &= await check_environment()
    all_passed &= await check_security()
    all_passed &= await check_optional_services()
    all_passed &= await check_mongodb()
    
    # Summary
    print("\n" + "="*50)
    if all_passed:
        print("✨ All checks passed! Backend is ready to run.")
        print("\nTo start the server, run:")
        print("  python main.py")
        print("\nAPI documentation will be available at:")
        print("  http://localhost:5000/docs")
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        sys.exit(1)
    
    print("="*50 + "\n")

if __name__ == "__main__":
    asyncio.run(main())
