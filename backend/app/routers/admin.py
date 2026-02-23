from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.routers.auth import get_current_user
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"])

async def check_admin(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    return user

@router.get("/dashboard")
async def get_dashboard(admin: User = Depends(check_admin)):
    total_products = await Product.find_all().count()
    total_users = await User.find(User.role == "user").count()
    total_orders = await Order.find_all().count()
    
    # Simple revenue calculation
    paid_orders = await Order.find(Order.isPaid == True).to_list()
    total_revenue = sum(o.totalPrice for o in paid_orders)
    
    recent_orders = await Order.find_all().sort("-created_at").limit(10).to_list()
    low_stock = await Product.find(Product.stock <= 5).to_list()
    
    return {
        "totalProducts": total_products,
        "totalUsers": total_users,
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
        "recentOrders": recent_orders,
        "lowStockProducts": low_stock
    }

@router.get("/users")
async def get_users(admin: User = Depends(check_admin)):
    users = await User.find_all().to_list()
    return users

@router.delete("/users/{id}")
async def delete_user(id: str, admin: User = Depends(check_admin)):
    user = await User.get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await user.delete()
    return {"message": "User removed"}
