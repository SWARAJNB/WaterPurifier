from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.auth import UserResponse

class OrderItemSchema(BaseModel):
    product: str
    name: str
    image: str
    price: float
    quantity: int

class OrderCreate(BaseModel):
    orderItems: List[OrderItemSchema]
    shippingAddress: dict
    paymentMethod: str
    itemsPrice: float
    taxPrice: float
    shippingPrice: float
    totalPrice: float

class OrderResponse(OrderCreate):
    id: str
    user: str
    isPaid: bool
    paidAt: Optional[datetime]
    status: str
    isDelivered: bool
    deliveredAt: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
