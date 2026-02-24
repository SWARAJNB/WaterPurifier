from typing import Optional, List
from beanie import Document, Indexed
from pydantic import EmailStr, Field, BaseModel
from datetime import datetime
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Address(Document):
    fullName: str
    phone: str
    street: str
    city: str
    state: str
    zipCode: str
    country: str = "India"
    isDefault: bool = False

class CartItem(BaseModel):
    product: str # Product ID
    quantity: int = 1
    added_at: datetime = Field(default_factory=datetime.utcnow)

class User(Document):
    name: str
    email: Indexed(EmailStr, unique=True)
    password: str = Field(exclude=True)
    phone: str = ""
    role: str = "user"  # 'user' or 'admin'
    avatar: str = ""
    addresses: List[Address] = []
    wishlist: List[str] = [] # List of Product IDs
    cart: List[CartItem] = []
    saved_for_later: List[CartItem] = []
    resetPasswordOTP: Optional[str] = None
    resetPasswordExpire: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.password)

    @classmethod
    def get_password_hash(cls, password: str) -> str:
        return pwd_context.hash(password)

    class Settings:
        name = "users"
