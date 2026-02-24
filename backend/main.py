import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.extras import Review, Booking, Service, Coupon, Offer
from app.models.info import BusinessInfo
from app.api_v1 import api_router

app = FastAPI(
    title="AquaPure API",
    description="Water Purifier eCommerce Backend API (FastAPI)",
    version="1.0.0"
)

# Include API V1 Router
app.include_router(api_router, prefix="/api/v1")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import certifi

@app.on_event("startup")
async def startup_event():
    print(f"📡 Connecting to MongoDB: {settings.MONGODB_URI.split('@')[-1]}") # Log safe part of URI
    client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        tlsCAFile=certifi.where()
    )
    try:
        # Verify connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas")
    except Exception as e:
        print(f"❌ MongoDB Connection Error: {e}")
        raise e

    await init_beanie(
        database=client.get_default_database(),
        document_models=[
            User,
            Product,
            Order,
            Review,
            Booking,
            Service,
            Coupon,
            Offer,
            BusinessInfo
        ]
    )
    print(f"🚀 FastAPI running in {settings.NODE_ENV} mode")

@app.get("/api/health")
async def health_check():
    return {
        "status": "OK",
        "message": "AquaPure API Running (Python)",
        "environment": settings.NODE_ENV
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
