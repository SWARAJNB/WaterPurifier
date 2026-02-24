from fastapi import APIRouter
from app.routers import auth, products, orders, reviews, admin, services, coupons, offers, info, payments, user

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(user.router) # Profile, Cart, Wishlist
api_router.include_router(products.router)
api_router.include_router(orders.router)
api_router.include_router(reviews.router)
api_router.include_router(admin.router)
api_router.include_router(services.router)
api_router.include_router(coupons.router)
api_router.include_router(offers.router)
api_router.include_router(info.router)
api_router.include_router(payments.router)
