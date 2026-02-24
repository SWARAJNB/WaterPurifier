from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    PORT: int = 5000
    NODE_ENV: str = "development"
    MONGODB_URI: str = "mongodb://127.0.0.1:27017/waterpurifier"
    JWT_SECRET: str = "aquapure_jwt_secret_key_2024_super_secure"
    JWT_EXPIRE: str = "7d"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    WHATSAPP_NUMBER: str = "919999999999"
    
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"

settings = Settings()
