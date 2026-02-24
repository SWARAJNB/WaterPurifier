from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.models.order import Order
from app.routers.auth import get_current_user
from app.models.user import User
from app.models.product import Product
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=dict)
async def create_order(order_data: dict, user: User = Depends(get_current_user)):
    """Create new order from cart."""
    try:
        # Validate order data
        cart_items = order_data.get("items", [])
        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        # Calculate total
        total_price = 0
        order_items = []
        
        for item in cart_items:
            product = await Product.get(item.get("productId"))
            if not product:
                raise HTTPException(status_code=404, detail=f"Product not found: {item.get('productId')}")
            
            quantity = item.get("quantity", 1)
            price = product.discountPrice if product.discountPrice > 0 else product.price
            item_total = price * quantity
            total_price += item_total
            
            order_items.append({
                "productId": str(product.id),
                "productName": product.name,
                "price": price,
                "quantity": quantity,
                "total": item_total
            })
        
        # Create order
        order = Order(
            user=str(user.id),
            items=order_items,
            totalPrice=total_price,
            shippingAddress=order_data.get("shippingAddress", {}),
            orderStatus="pending",
            isPaid=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        await order.insert()
        
        # Clear user's cart
        user.cart = []
        await user.save()
        
        return {
            "success": True,
            "message": "Order created successfully",
            "data": {
                "orderId": str(order.id),
                "totalPrice": total_price,
                "orderStatus": "pending"
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating order: {str(e)}")

@router.get("/myorders", response_model=dict)
async def get_my_orders(
    user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50)
):
    """Get user's orders."""
    try:
        skip = (page - 1) * limit
        orders = await Order.find(Order.user == str(user.id)).skip(skip).limit(limit).sort("-created_at").to_list()
        total = await Order.find(Order.user == str(user.id)).count()
        
        return {
            "success": True,
            "data": orders,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")

@router.get("/{order_id}", response_model=dict)
async def get_order(order_id: str, user: User = Depends(get_current_user)):
    """Get specific order details."""
    try:
        order = await Order.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Check authorization
        if str(order.user) != str(user.id) and user.role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized to view this order")
        
        return {
            "success": True,
            "data": order
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching order: {str(e)}")

@router.post("/{order_id}/cancel", response_model=dict)
async def cancel_order(order_id: str, user: User = Depends(get_current_user)):
    """Cancel order if not paid."""
    try:
        order = await Order.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if str(order.user) != str(user.id) and user.role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
        
        if order.isPaid:
            raise HTTPException(status_code=400, detail="Cannot cancel paid order")
        
        order.orderStatus = "cancelled"
        order.updated_at = datetime.utcnow()
        await order.save()
        
        return {
            "success": True,
            "message": "Order cancelled successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error cancelling order: {str(e)}")
