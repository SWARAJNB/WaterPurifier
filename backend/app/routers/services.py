from fastapi import APIRouter, Depends, HTTPException
from app.models.extras import Service, Booking
from app.routers.auth import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/services", tags=["services"])

@router.get("/")
async def get_services():
    return await Service.find(Service.isActive == True).to_list()

@router.post("/")
async def create_service(service: Service, user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    await service.insert()
    return service

@router.post("/book")
async def book_service(booking_data: dict, user: User = Depends(get_current_user)):
    booking = Booking(user=str(user.id), **booking_data)
    await booking.insert()
    return booking

@router.get("/my-bookings")
async def get_my_bookings(user: User = Depends(get_current_user)):
    return await Booking.find(Booking.user == str(user.id)).sort("-created_at").to_list()

@router.get("/bookings")
async def get_bookings(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return await Booking.find_all().sort("-created_at").to_list()
