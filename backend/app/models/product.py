from typing import Optional, List, Dict
from beanie import Document, Indexed
from pydantic import Field
from datetime import datetime

class Product(Document):
    name: Indexed(str)
    brand: Indexed(str)
    description: str
    price: float = Field(gt=0)
    discountPrice: float = 0
    images: List[str] = []
    category: str = "Water Purifier"
    purifierType: str # RO, UV, etc.
    capacity: int # in litres
    specifications: Dict[str, str] = {}
    features: List[str] = []
    stock: int = 0
    rating: float = 0
    numReviews: int = 0
    featured: bool = False
    bestSeller: bool = False
    isActive: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "products"
        indexes = [
            [
                ("name", "text"),
                ("brand", "text"),
                ("description", "text"),
            ]
        ]
