import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User
from app.models.product import Product
# Import other models as created

from app.routers import auth, products, orders, reviews, admin, services, coupons, offers
from app.models.order import Order
from app.models.extras import Review, Booking, Service, Coupon, Offer

app = FastAPI(
    title="AquaPure API",
    description="Water Purifier eCommerce Backend API (FastAPI)",
    version="1.0.0"
)

# Include Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(reviews.router)
app.include_router(admin.router)
app.include_router(services.router)
app.include_router(coupons.router)
app.include_router(offers.router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
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
            Offer
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
