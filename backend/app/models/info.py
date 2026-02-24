from typing import Optional
from beanie import Document
from pydantic import Field
from datetime import datetime

class BusinessInfo(Document):
    vision: str = ""
    mission: str = ""
    description: str = ""
    address: str = ""
    phone: str = ""
    email: str = ""
    whatsapp: str = ""
    google_maps_url: str = ""
    facebook_url: str = ""
    instagram_url: str = ""
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "business_info"
