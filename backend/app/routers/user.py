from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User, CartItem, Address
from app.routers.auth import get_current_user
from app.schemas.auth import UserResponse
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/user", tags=["user"])

class AddressRequest(BaseModel):
    fullName: str
    phone: str
    street: str
    city: str
    state: str
    zipCode: str
    country: str = "India"
    isDefault: bool = False

class CartItemRequest(BaseModel):
    productId: str
    quantity: int = 1

@router.get("/profile", response_model=dict)
async def get_profile(user: User = Depends(get_current_user)):
    """Get current user profile."""
    return {
        "success": True,
        "data": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "avatar": user.avatar,
            "addresses": user.addresses or [],
            "created_at": user.created_at
        }
    }

@router.put("/profile", response_model=dict)
async def update_profile(data: dict, user: User = Depends(get_current_user)):
    """Update user profile."""
    try:
        allowed_fields = ["name", "phone", "avatar"]
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
        
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "avatar": user.avatar
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating profile: {str(e)}")

# ============ CART ENDPOINTS ============

@router.get("/cart", response_model=dict)
async def get_cart(user: User = Depends(get_current_user)):
    """Get user's shopping cart."""
    return {
        "success": True,
        "data": {
            "items": user.cart or [],
            "count": len(user.cart or [])
        }
    }

@router.post("/cart", response_model=dict)
async def add_to_cart(item: CartItemRequest, user: User = Depends(get_current_user)):
    """Add item to cart."""
    try:
        # Check if item already in cart
        existing = next((c for c in user.cart if c.product == item.productId), None)
        if existing:
            existing.quantity += item.quantity
        else:
            new_item = CartItem(product=item.productId, quantity=item.quantity)
            user.cart.append(new_item)
        
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return {
            "success": True,
            "message": "Item added to cart",
            "data": {"items": user.cart}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding to cart: {str(e)}")

@router.delete("/cart/{product_id}", response_model=dict)
async def remove_from_cart(product_id: str, user: User = Depends(get_current_user)):
    """Remove item from cart."""
    try:
        user.cart = [c for c in user.cart if c.product != product_id]
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return {
            "success": True,
            "message": "Item removed from cart",
            "data": {"items": user.cart}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing from cart: {str(e)}")

@router.delete("/cart", response_model=dict)
async def clear_cart(user: User = Depends(get_current_user)):
    """Clear entire cart."""
    try:
        user.cart = []
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return {
            "success": True,
            "message": "Cart cleared",
            "data": {"items": []}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing cart: {str(e)}")

@router.post("/cart/sync", response_model=dict)
async def sync_cart(data: dict, user: User = Depends(get_current_user)):
    """Sync cart from localStorage after login."""
    try:
        items = data.get("items", [])
        user.cart = [CartItem(product=item.get("product"), quantity=item.get("quantity", 1)) for item in items]
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return {
            "success": True,
            "message": "Cart synced",
            "data": {"items": user.cart}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error syncing cart: {str(e)}")

# ============ WISHLIST ENDPOINTS ============

@router.get("/wishlist", response_model=dict)
async def get_wishlist(user: User = Depends(get_current_user)):
    """Get user's wishlist."""
    return {
        "success": True,
        "data": {"items": user.wishlist or []}
    }

@router.post("/wishlist/{product_id}", response_model=dict)
async def toggle_wishlist(product_id: str, user: User = Depends(get_current_user)):
    """Toggle product wishlist status."""
    try:
        if product_id in user.wishlist:
            user.wishlist.remove(product_id)
            message = "Removed from wishlist"
        else:
            user.wishlist.append(product_id)
            message = "Added to wishlist"
        
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return {
            "success": True,
            "message": message,
            "data": {"items": user.wishlist}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error toggling wishlist: {str(e)}")

# ============ SAVED FOR LATER ============

@router.get("/saved", response_model=dict)
async def get_saved_for_later(user: User = Depends(get_current_user)):
    """Get saved for later items."""
    return {
        "success": True,
        "data": {"items": user.saved_for_later or []}
    }

@router.post("/saved", response_model=dict)
async def add_to_saved(data: dict, user: User = Depends(get_current_user)):
    """Add item to saved for later."""
    try:
        product_id = data.get("productId")
        existing = next((s for s in user.saved_for_later if s.product == product_id), None)
        
        if not existing:
            item = CartItem(product=product_id, quantity=1)
            user.saved_for_later.append(item)
        
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return {
            "success": True,
            "message": "Item saved for later",
            "data": {"items": user.saved_for_later}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving item: {str(e)}")

@router.delete("/saved/{product_id}", response_model=dict)
async def remove_from_saved(product_id: str, user: User = Depends(get_current_user)):
    """Remove item from saved for later."""
    try:
        user.saved_for_later = [s for s in user.saved_for_later if s.product != product_id]
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return {
            "success": True,
            "message": "Item removed from saved",
            "data": {"items": user.saved_for_later}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing item: {str(e)}")

# ============ ADDRESSES ENDPOINTS ============

@router.post("/addresses", response_model=dict)
async def add_address(address_data: AddressRequest, user: User = Depends(get_current_user)):
    """Add new address."""
    try:
        if address_data.isDefault:
            for addr in user.addresses:
                addr.isDefault = False
        
        address = Address(**address_data.dict())
        user.addresses.append(address)
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return {
            "success": True,
            "message": "Address added",
            "data": {"addresses": user.addresses}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding address: {str(e)}")

@router.get("/addresses", response_model=dict)
async def get_addresses(user: User = Depends(get_current_user)):
    """Get all user addresses."""
    return {
        "success": True,
        "data": {"addresses": user.addresses or []}
    }
