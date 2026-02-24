from fastapi import APIRouter, Depends, HTTPException, status
import razorpay
from app.core.config import settings
from app.models.user import User
from app.models.order import Order
from app.routers.auth import get_current_user
import hashlib
import hmac
from datetime import datetime

router = APIRouter(prefix="/payments", tags=["payments"])

# Initialize Razorpay client
client = None
if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.post("/create-order", response_model=dict)
async def create_razorpay_order(data: dict, user: User = Depends(get_current_user)):
    """Create Razorpay order for payment."""
    if not client:
        raise HTTPException(
            status_code=500,
            detail="Payment gateway not configured. Contact admin."
        )
    
    try:
        amount = data.get("amount")
        order_id = data.get("orderId")
        
        if not amount or amount <= 0:
            raise HTTPException(status_code=400, detail="Invalid amount")
        
        # Create Razorpay order
        razorpay_data = {
            "amount": int(amount * 100),  # Razorpay expects amount in paise
            "currency": "INR",
            "receipt": f"order_{order_id}",
            "notes": {
                "userId": str(user.id),
                "orderId": order_id
            }
        }
        
        order = client.order.create(data=razorpay_data)
        
        return {
            "success": True,
            "data": {
                "orderId": order["id"],
                "amount": amount,
                "currency": "INR"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating payment order: {str(e)}")

@router.post("/verify", response_model=dict)
async def verify_payment(payment_data: dict, user: User = Depends(get_current_user)):
    """Verify Razorpay payment and mark order as paid."""
    if not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Payment verification not configured")
    
    try:
        razorpay_order_id = payment_data.get("razorpay_order_id")
        razorpay_payment_id = payment_data.get("razorpay_payment_id")
        razorpay_signature = payment_data.get("razorpay_signature")
        order_id = payment_data.get("orderId")
        
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id]):
            raise HTTPException(status_code=400, detail="Missing payment details")
        
        # Verify signature
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        # Update order as paid
        order = await Order.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if str(order.user) != str(user.id) and user.role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
        
        order.isPaid = True
        order.paymentId = razorpay_payment_id
        order.orderStatus = "confirmed"
        order.updated_at = datetime.utcnow()
        await order.save()
        
        return {
            "success": True,
            "message": "Payment verified successfully",
            "data": {
                "orderId": order_id,
                "paymentId": razorpay_payment_id,
                "status": "paid"
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment verification error: {str(e)}")

@router.get("/order-status/{order_id}", response_model=dict)
async def check_order_status(order_id: str, user: User = Depends(get_current_user)):
    """Check order payment status."""
    try:
        order = await Order.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if str(order.user) != str(user.id) and user.role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
        
        return {
            "success": True,
            "data": {
                "orderId": str(order.id),
                "isPaid": order.isPaid,
                "status": order.orderStatus,
                "totalPrice": order.totalPrice
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking status: {str(e)}")
