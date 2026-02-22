from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from app.models.product import Product
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate
from app.routers.auth import get_current_user
from app.models.user import User
from typing import List, Optional
import json

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=dict)
async def get_products(
    search: Optional[str] = None,
    brand: Optional[str] = None,
    purifierType: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    page: int = 1,
    limit: int = 12
):
    query = {"isActive": True}
    if search:
        query["$text"] = {"$search": search}
    if brand:
        query["brand"] = {"$in": brand.split(",")}
    if purifierType:
        query["purifierType"] = {"$in": purifierType.split(",")}
    
    # Add price filter logic if needed
    
    total = await Product.find(query).count()
    products = await Product.find(query).skip((page - 1) * limit).limit(limit).to_list()
    
    return {
        "products": products,
        "page": page,
        "pages": (total + limit - 1) // limit,
        "total": total
    }

@router.get("/{id}", response_model=ProductResponse)
async def get_product(id: str):
    product = await Product.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductResponse)
async def create_product(
    product_data: str, # Received as JSON string from form-data
    files: List[UploadFile] = File(...),
    user: User = Depends(get_current_user)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    try:
        data = json.loads(product_data)
        validated = ProductCreate(**data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid product data: {e}")

    # Cloudinary upload logic would go here
    # images = [upload_image(f.file) for f in files]
    images = [] # Placeholder
    
    product = Product(**validated.dict(), images=images)
    await product.insert()
    return product
