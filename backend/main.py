import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.extras import Review, Booking, Service, Coupon, Offer
from app.models.info import BusinessInfo
from app.api_v1 import api_router
import certifi
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AquaPure API",
    description="Water Purifier eCommerce Backend API (FastAPI)",
    version="1.0.0"
)

# CORS Middleware (should be added first)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global error handler
@app.middleware("http")
async def error_handler(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )

# Include API V1 Router
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup."""
    logger.info(f"📡 Connecting to MongoDB")
    client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        tlsCAFile=certifi.where()
    )
    try:
        # Verify connection
        await client.admin.command('ping')
        logger.info("✅ Successfully connected to MongoDB Atlas")
    except Exception as e:
        logger.error(f"❌ MongoDB Connection Error: {e}")
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

    # seed demo products if none exist
    try:
        count = await Product.count()
        if count == 0:
            logger.info("🛠️  No products found in database, running seeder...")
            # import here to avoid circular imports at module load time
            from seed_products import seed_products
            await seed_products()
            logger.info("✅ Demo products seeded automatically")
    except Exception as e:
        logger.warning(f"⚠️  Could not seed products: {e}")

    logger.info(f"🚀 FastAPI running in {settings.NODE_ENV} mode on port {settings.PORT}")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "OK",
        "message": "AquaPure API Running ✅",
        "environment": settings.NODE_ENV,
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to AquaPure API",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
