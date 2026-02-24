from fastapi import APIRouter, Depends, HTTPException
from app.models.extras import Review
from app.models.product import Product
from app.routers.auth import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/")
async def create_review(payload: dict, user: User = Depends(get_current_user)):
    """Create a review for a product. Expects { product: id, rating: int, comment: str }"""
    product_id = payload.get("product")
    rating = payload.get("rating")
    comment = payload.get("comment")

    if not product_id or rating is None or comment is None:
        raise HTTPException(status_code=400, detail="product, rating and comment are required")

    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    review = Review(
        user=str(user.id),
        product=product_id,
        rating=rating,
        comment=comment
    )
    await review.insert()

    return {"success": True, "data": review}


@router.get("/{product_id}")
async def get_product_reviews(product_id: str):
    reviews = await Review.find(Review.product == product_id).to_list()
    return {"success": True, "data": reviews}
