from typing import Optional, List, Dict
from beanie import Document, Indexed
from pydantic import Field
from datetime import datetime

class Review(Document):
    user: str # User ID
    product: str # Product ID
    rating: int = Field(ge=1, le=5)
    comment: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "reviews"

class Service(Document):
    name: str
    description: str
    price: float
    isActive: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "services"

class Booking(Document):
    user: str
    service: str # Service ID
    booking_date: datetime
    status: str = "Pending" # Pending, Confirmed, etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "bookings"

class Coupon(Document):
    code: Indexed(str, unique=True)
    discount: int # percentage
    minOrder: float = 0
    maxDiscount: Optional[float] = None
    expiresAt: datetime
    usageLimit: int = 0
    usedCount: int = 0
    isActive: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "coupons"

class Offer(Document):
    title: str
    description: str
    image: str = ""
    discountText: str = ""
    expiryDate: datetime
    isActive: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "offers"
