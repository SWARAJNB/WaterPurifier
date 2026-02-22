from fastapi import APIRouter, Depends, HTTPException, status
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderResponse
from app.routers.auth import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse)
async def create_order(order_data: OrderCreate, user: User = Depends(get_current_user)):
    order = Order(
        user=str(user.id),
        **order_data.dict()
    )
    await order.insert()
    return order

@router.get("/myorders", response_model=List[OrderResponse])
async def get_my_orders(user: User = Depends(get_current_user)):
    orders = await Order.find(Order.user == str(user.id)).to_list()
    return orders

@router.get("/{id}", response_model=OrderResponse)
async def get_order(id: str, user: User = Depends(get_current_user)):
    order = await Order.get(id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user != str(user.id) and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return order
