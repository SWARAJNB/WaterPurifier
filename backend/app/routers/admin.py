from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.extras import Service
from app.models.info import BusinessInfo
from app.routers.auth import get_current_user
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["admin"])

async def check_admin(user: User = Depends(get_current_user)):
    """Verify user is admin."""
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ============ DASHBOARD ============

@router.get("/stats", response_model=dict)
async def get_dashboard_stats(admin: User = Depends(check_admin)):
    """Get dashboard statistics."""
    try:
        total_products = await Product.find().count()
        total_users = await User.find().count()
        total_orders = await Order.find().count()
        
        # Calculate revenue
        paid_orders = await Order.find(Order.isPaid == True).to_list()
        total_revenue = sum(o.totalPrice for o in paid_orders) if paid_orders else 0
        
        # Get recent orders
        recent_orders = await Order.find().sort("-created_at").limit(5).to_list()
        
        return {
            "success": True,
            "data": {
                "totalProducts": total_products,
                "totalUsers": total_users,
                "totalOrders": total_orders,
                "totalRevenue": total_revenue,
                "recentOrders": len(recent_orders)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")

# ============ USER MANAGEMENT ============

@router.get("/users", response_model=dict)
async def get_all_users(
    admin: User = Depends(check_admin),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Get all users with pagination."""
    try:
        skip = (page - 1) * limit
        users = await User.find().skip(skip).limit(limit).to_list()
        total = await User.find().count()
        
        return {
            "success": True,
            "data": users,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

@router.put("/users/{user_id}/role", response_model=dict)
async def update_user_role(
    user_id: str,
    data: dict,
    admin: User = Depends(check_admin)
):
    """Update user role (admin/user)."""
    try:
        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        role = data.get("role", "user")
        if role not in ["user", "admin"]:
            raise HTTPException(status_code=400, detail="Invalid role")
        
        user.role = role
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return {
            "success": True,
            "message": f"User role updated to {role}",
            "data": {"id": str(user.id), "role": user.role}
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating role: {str(e)}")

@router.delete("/users/{user_id}", response_model=dict)
async def delete_user(user_id: str, admin: User = Depends(check_admin)):
    """Delete user account."""
    try:
        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if str(user.id) == str(admin.id):
            raise HTTPException(status_code=400, detail="Cannot delete your own account")
        
        await user.delete()
        return {
            "success": True,
            "message": "User deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")

# ============ ORDER MANAGEMENT ============

@router.get("/orders", response_model=dict)
async def get_all_orders(
    admin: User = Depends(check_admin),
    status_filter: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Get all orders with optional filter."""
    try:
        query = {}
        if status_filter:
            query["orderStatus"] = status_filter
        
        skip = (page - 1) * limit
        orders = await Order.find(query).skip(skip).limit(limit).sort("-created_at").to_list()
        total = await Order.find(query).count()
        
        return {
            "success": True,
            "data": orders,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")

@router.put("/orders/{order_id}/status", response_model=dict)
async def update_order_status(
    order_id: str,
    data: dict,
    admin: User = Depends(check_admin)
):
    """Update order status."""
    try:
        order = await Order.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        status_val = data.get("status", "pending")
        order.orderStatus = status_val
        order.updated_at = datetime.utcnow()
        await order.save()
        
        return {
            "success": True,
            "message": f"Order status updated to {status_val}",
            "data": {"id": str(order.id), "status": order.orderStatus}
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating order: {str(e)}")

# ============ SERVICE MANAGEMENT ============

@router.get("/services", response_model=dict)
async def get_all_services(admin: User = Depends(check_admin)):
    """Get all services."""
    try:
        services = await Service.find().to_list()
        return {
            "success": True,
            "data": services
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching services: {str(e)}")

@router.post("/services", response_model=dict)
async def create_service(
    data: dict,
    admin: User = Depends(check_admin)
):
    """Create new service."""
    try:
        service = Service(**data)
        await service.insert()
        return {
            "success": True,
            "message": "Service created successfully",
            "data": service
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating service: {str(e)}")

@router.put("/services/{service_id}", response_model=dict)
async def update_service(
    service_id: str,
    data: dict,
    admin: User = Depends(check_admin)
):
    """Update service."""
    try:
        service = await Service.get(service_id)
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")
        
        for field, value in data.items():
            setattr(service, field, value)
        
        service.updated_at = datetime.utcnow()
        await service.save()
        
        return {
            "success": True,
            "message": "Service updated successfully",
            "data": service
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating service: {str(e)}")

# ============ BUSINESS INFO ============

@router.get("/business-info", response_model=dict)
async def get_business_info(admin: User = Depends(check_admin)):
    """Get business information."""
    try:
        info = await BusinessInfo.find_all().limit(1).to_list()
        if info:
            return {
                "success": True,
                "data": info[0]
            }
        return {
            "success": True,
            "data": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching info: {str(e)}")

@router.put("/business-info", response_model=dict)
async def update_business_info(
    data: dict,
    admin: User = Depends(check_admin)
):
    """Update business information."""
    try:
        existing = await BusinessInfo.find_all().limit(1).to_list()
        
        if existing:
            info = existing[0]
            for field, value in data.items():
                setattr(info, field, value)
            info.updated_at = datetime.utcnow()
            await info.save()
        else:
            info = BusinessInfo(**data)
            await info.insert()
        
        return {
            "success": True,
            "message": "Business info updated successfully",
            "data": info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating info: {str(e)}")
