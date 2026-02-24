from fastapi import APIRouter, Depends, HTTPException
from app.models.extras import Coupon
from app.routers.auth import get_current_user
from app.models.user import User
from datetime import datetime

router = APIRouter(prefix="/coupons", tags=["coupons"])

@router.post("/validate")
async def validate_coupon(data: dict):
    code = data.get("code", "").upper()
    cart_total = data.get("cartTotal", 0)
    
    coupon = await Coupon.find_one(Coupon.code == code, Coupon.isActive == True)
    if not coupon:
        raise HTTPException(status_code=404, detail="Invalid coupon code")
    
    if coupon.expiresAt < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Coupon has expired")
        
    if coupon.usageLimit > 0 and coupon.usedCount >= coupon.usageLimit:
        raise HTTPException(status_code=400, detail="Usage limit reached")
        
    if cart_total < coupon.minOrder:
        raise HTTPException(status_code=400, detail=f"Min order of ₹{coupon.minOrder} required")
        
    discount_amount = round(min((cart_total * coupon.discount) / 100, coupon.maxDiscount or 999999))
    
    return {
        "code": coupon.code,
        "discount": coupon.discount,
        "discountAmount": discount_amount,
        "message": f"{coupon.discount}% discount applied!"
    }

@router.get("/")
async def get_all_coupons(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return await Coupon.find_all().to_list()
