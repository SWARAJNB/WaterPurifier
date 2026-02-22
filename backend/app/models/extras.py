from typing import Optional, List
from beanie import Document
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

class Booking(Document):
    user: str
    service: str
    booking_date: datetime
    status: str = "Pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "bookings"

class Service(Document):
    name: str
    description: str
    price: float
    isActive: bool = True

    class Settings:
        name = "services"

class Coupon(Document):
    code: str
    discount_percent: int
    expiry_date: datetime
    isActive: bool = True

    class Settings:
        name = "coupons"
