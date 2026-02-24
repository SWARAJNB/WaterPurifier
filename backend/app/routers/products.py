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
    
    if minPrice is not None or maxPrice is not None:
        price_query = {}
        if minPrice is not None:
            price_query["$gte"] = minPrice
        if maxPrice is not None:
            price_query["$lte"] = maxPrice
        query["price"] = price_query
    
    total = await Product.find(query).count()
    products = await Product.find(query).skip((page - 1) * limit).limit(limit).to_list()
    
    return {
        "products": products,
        "page": page,
        "pages": (total + limit - 1) // limit,
        "total": total
    }
@router.get("/brands", response_model=List[str])
async def get_brands():
    brands = await Product.distinct("brand")
    return brands

@router.get("/{id}", response_model=ProductResponse)
async def get_product(id: str):
    product = await Product.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductResponse)
async def create_product(
    product_data: str = File(...), 
    files: List[UploadFile] = File(...),
    user: User = Depends(get_current_user)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    try:
        data = json.loads(product_data)
        # validated = ProductCreate(**data) # Can use Pydantic validation here
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid product data: {e}")

    images = []
    for file in files:
        url = upload_image(file.file)
        if url:
            images.append(url)
    
    product = Product(**data, images=images)
    await product.insert()
    return product

@router.put("/{id}", response_model=ProductResponse)
async def update_product(
    id: str,
    product_data: str = File(...),
    files: Optional[List[UploadFile]] = File(None),
    user: User = Depends(get_current_user)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    product = await Product.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    data = json.loads(product_data)
    
    if files:
        images = []
        for file in files:
            url = upload_image(file.file)
            if url:
                images.append(url)
        data["images"] = images
    
    await product.update({"$set": {**data, "updated_at": datetime.utcnow()}})
    return await Product.get(id)

@router.delete("/{id}")
async def delete_product(id: str, user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    product = await Product.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await product.delete()
    return {"message": "Product deleted successfully"}
