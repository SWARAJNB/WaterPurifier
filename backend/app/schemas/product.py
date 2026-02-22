from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    brand: str
    description: str
    price: float = Field(gt=0)
    discountPrice: float = 0
    category: str = "Water Purifier"
    purifierType: str
    capacity: int
    specifications: Dict[str, str] = {}
    features: List[str] = []
    stock: int = 0
    featured: bool = False
    bestSeller: bool = False
    isActive: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    discountPrice: Optional[float] = None
    category: Optional[str] = None
    purifierType: Optional[str] = None
    capacity: Optional[int] = None
    specifications: Optional[Dict[str, str]] = None
    features: Optional[List[str]] = None
    stock: Optional[int] = None
    featured: Optional[bool] = None
    bestSeller: Optional[bool] = None
    isActive: Optional[bool] = None

class ProductResponse(ProductBase):
    id: str
    images: List[str] = []
    rating: float = 0
    numReviews: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
