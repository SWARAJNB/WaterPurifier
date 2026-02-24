from typing import Optional, List, Dict
from beanie import Document
from pydantic import Field
from datetime import datetime

class Order(Document):
    """Order model for storing purchase information."""
    user: str  # User ID
    items: List[Dict] = Field(default_factory=list)  # List of ordered items with product details
    totalPrice: float = 0.0  # Total order amount
    shippingAddress: Dict = Field(default_factory=dict)  # Shipping details
    orderStatus: str = "pending"  # pending, confirmed, shipped, delivered, cancelled
    paymentMethod: str = "razorpay"  # Payment method
    isPaid: bool = False  # Payment status
    paymentId: Optional[str] = None  # Razorpay payment ID
    paidAt: Optional[datetime] = None  # Payment timestamp
    isDelivered: bool = False  # Delivery status
    deliveredAt: Optional[datetime] = None  # Delivery timestamp
    notes: Optional[str] = None  # Special notes/instructions
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "orders"
        indexes = [
            [("user", 1)],  # Index for quick user order lookup
            [("created_at", -1)],  # Index for sorting by date
            [("orderStatus", 1)]  # Index for status filtering
        ]
