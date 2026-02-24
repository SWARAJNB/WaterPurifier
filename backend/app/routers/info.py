from fastapi import APIRouter, Depends, HTTPException, status
from app.models.info import BusinessInfo
from app.models.extras import ContactMessage
from app.models.user import User
from app.routers.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/info", tags=["info"])

@router.post("/contact")
async def submit_contact(message: ContactMessage):
    await message.insert()
    return {"message": "Thank you for contacting us. We will get back to you soon!"}

@router.get("/")
async def get_business_info():
    info = await BusinessInfo.find_one()
    if not info:
        # Create default if not exists
        info = BusinessInfo()
        await info.insert()
    return info

from fastapi import APIRouter, Depends, HTTPException, status
from app.models.info import BusinessInfo
from app.models.extras import ContactMessage
from app.models.user import User
from app.routers.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/info", tags=["info"])


@router.post("/contact")
async def submit_contact(message: ContactMessage):
    await message.insert()
    return {"message": "Thank you for contacting us. We will get back to you soon!"}


@router.get("/")
async def get_business_info():
    info = await BusinessInfo.find_one()
    if not info:
        # Create default if not exists
        info = BusinessInfo()
        await info.insert()
    return info


@router.put("/")
async def update_business_info(
    info_data: dict,
    user: User = Depends(get_current_user)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    info = await BusinessInfo.find_one()
    if not info:
        info = BusinessInfo(**info_data)
        await info.insert()
    else:
        await info.update({"$set": {**info_data, "updated_at": datetime.utcnow()}})
        info = await BusinessInfo.find_one()
    
    return info


@router.get("/status")
async def get_system_status():
    """Return basic counts for products and users to verify seeding."""
    # Import here to avoid circular imports at module load time
    from app.models.product import Product

    product_count = await Product.count()
    user_count = await User.count()

    return {
        "success": True,
        "data": {
            "products": product_count,
            "users": user_count
        },
        "message": "System status"
    }
