from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.models.extras import Offer
from app.routers.auth import get_current_user
from app.models.user import User
from typing import List
import json

router = APIRouter(prefix="/api/offers", tags=["offers"])

@router.get("/")
async def get_offers():
    return await Offer.find(Offer.isActive == True).to_list()

@router.post("/")
async def create_offer(
    offer_data: str,
    file: UploadFile = File(None),
    user: User = Depends(get_current_user)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    
    data = json.loads(offer_data)
    # File upload logic (Cloudinary) would go here
    offer = Offer(**data, image="")
    await offer.insert()
    return offer

@router.delete("/{id}")
async def delete_offer(id: str, user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    offer = await Offer.get(id)
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    await offer.delete()
    return {"message": "Offer deleted"}
