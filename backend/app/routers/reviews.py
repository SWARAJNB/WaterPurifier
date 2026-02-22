from fastapi import APIRouter, Depends, HTTPException, status
from app.models.extras import Review
from app.models.product import Product
from app.routers.auth import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

@router.post("/")
async def create_review(
    product_id: str,
    rating: int,
    comment: str,
    user: User = Depends(get_current_user)
):
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
    
    # Update product rating (simple average logic could be added here)
    return review

@router.get("/{product_id}", response_model=List[Review])
async def get_product_reviews(product_id: str):
    reviews = await Review.find(Review.product == product_id).to_list()
    return reviews
