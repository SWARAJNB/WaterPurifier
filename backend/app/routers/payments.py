from fastapi import APIRouter, Depends, HTTPException, status
import razorpay
from app.core.config import settings
from app.models.user import User
from app.models.order import Order
from app.routers.auth import get_current_user
import hashlib
import hmac

router = APIRouter(prefix="/payments", tags=["payments"])

client = None
if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.post("/create-order")
async def create_razorpay_order(amount: float, user: User = Depends(get_current_user)):
    if not client:
        raise HTTPException(status_code=500, detail="Razorpay not configured")
    
    try:
        data = {
            "amount": int(amount * 100), # Razorpay expects paise
            "currency": "INR",
            "receipt": f"receipt_{user.id}",
        }
        order = client.order.create(data=data)
        return order
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify")
async def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    user: User = Depends(get_current_user)
):
    if not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Razorpay secret not configured")

    generated_signature = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
        hashlib.sha256
    ).hexdigest()

    if generated_signature == razorpay_signature:
        return {"status": "success", "message": "Payment verified"}
    else:
        raise HTTPException(status_code=400, detail="Invalid signature")
