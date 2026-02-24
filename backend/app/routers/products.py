from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from app.models.product import Product
from app.schemas.product import ProductResponse
from app.routers.auth import get_current_user
from app.models.user import User
from typing import List, Optional
from datetime import datetime
from app.utils.cloudinary import upload_image, delete_image
import json

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=dict)
async def get_products(
    search: Optional[str] = None,
    brand: Optional[str] = None,
    purifierType: Optional[str] = None,
    minPrice: Optional[float] = Query(None),
    maxPrice: Optional[float] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100)
):
    """Get all active products with optional filtering."""
    query = {"isActive": True}
    
    if search:
        query["$text"] = {"$search": search}
    if brand:
        query["brand"] = {"$in": brand.split(",")}
    if purifierType:
        query["purifierType"] = {"$in": purifierType.split(",")}
    
    if minPrice is not None or maxPrice is not None:
        price_query = {}
        if minPrice is not None:
            price_query["$gte"] = minPrice
        if maxPrice is not None:
            price_query["$lte"] = maxPrice
        query["price"] = price_query
    
    try:
        total = await Product.find(query).count()
        products = await Product.find(query).skip((page - 1) * limit).limit(limit).to_list()
        
        return {
            "success": True,
            "data": products,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")

@router.get("/brands", response_model=dict)
async def get_brands():
    """Get all available brands."""
    try:
        brands = await Product.distinct("brand")
        return {
            "success": True,
            "data": sorted(brands)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching brands: {str(e)}")

@router.get("/{id}", response_model=dict)
async def get_product(id: str):
    """Get single product by ID."""
    try:
        product = await Product.get(id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return {
            "success": True,
            "data": product
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")

@router.post("/", response_model=dict)
async def create_product(
    product_data: str = File(...), 
    files: List[UploadFile] = File(...),
    user: User = Depends(get_current_user)
):
    """Create new product (admin only)."""
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        data = json.loads(product_data)
        
        # Upload images
        images = []
        for file in files:
            url = upload_image(file.file)
            if url:
                images.append(url)
        
        product = Product(**data, images=images)
        await product.insert()
        
        return {
            "success": True,
            "message": "Product created successfully",
            "data": product
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid product data format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating product: {str(e)}")

@router.put("/{id}", response_model=dict)
async def update_product(
    id: str,
    product_data: str = File(...),
    files: Optional[List[UploadFile]] = File(None),
    user: User = Depends(get_current_user)
):
    """Update product (admin only)."""
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        product = await Product.get(id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        data = json.loads(product_data)
        
        # Handle new images
        images = product.images or []
        if files:
            for file in files:
                url = upload_image(file.file)
                if url:
                    images.append(url)
        
        # Update fields
        for field, value in data.items():
            setattr(product, field, value)
        
        product.images = images
        product.updated_at = datetime.utcnow()
        await product.save()
        
        return {
            "success": True,
            "message": "Product updated successfully",
            "data": product
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid product data format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating product: {str(e)}")

@router.delete("/{id}", response_model=dict)
async def delete_product(id: str, user: User = Depends(get_current_user)):
    """Delete product (admin only)."""
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    try:
        product = await Product.get(id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Delete images from Cloudinary if needed
        for image_url in product.images:
            delete_image(image_url)
        
        await product.delete()
        return {
            "success": True,
            "message": "Product deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting product: {str(e)}")
