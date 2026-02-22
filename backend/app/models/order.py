from typing import Optional, List
from beanie import Document, Link
from pydantic import Field
from datetime import datetime
from app.models.user import User, Address
from app.models.product import Product

class OrderItem(Document):
    product: str # Product ID
    name: str
    image: str
    price: float
    quantity: int = Field(gt=0)

class Order(Document):
    user: str # User ID
    orderItems: List[OrderItem]
    shippingAddress: Address
    paymentMethod: str = "COD"
    itemsPrice: float = 0
    taxPrice: float = 0
    shippingPrice: float = 0
    totalPrice: float = 0
    isPaid: bool = False
    paidAt: Optional[datetime] = None
    status: str = "Processing" # Processing, Shipped, etc.
    isDelivered: bool = False
    deliveredAt: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "orders"
