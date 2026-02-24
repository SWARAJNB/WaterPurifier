from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User, CartItem
from app.routers.auth import get_current_user
from typing import List

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/cart")
async def get_cart(user: User = Depends(get_current_user)):
    return user.cart

@router.post("/cart/sync")
async def sync_cart(cart_items: List[CartItem], user: User = Depends(get_current_user)):
    # Merge or replace logic. Let's go with replace for simplicity
    user.cart = cart_items
    await user.save()
    return user.cart

@router.post("/wishlist/{product_id}")
async def toggle_wishlist(product_id: str, user: User = Depends(get_current_user)):
    if product_id in user.wishlist:
        user.wishlist.remove(product_id)
    else:
        user.wishlist.append(product_id)
    await user.save()
    return user.wishlist

@router.get("/profile")
async def get_profile(user: User = Depends(get_current_user)):
    return user
