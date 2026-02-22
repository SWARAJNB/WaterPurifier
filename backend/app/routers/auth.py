from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, UserResponse
from app.core.security import create_access_token, verify_token
from typing import List

router = APIRouter(prefix="/api/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister, response: Response):
    exists = await User.find_one(User.email == user_data.email)
    if exists:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = User.get_password_hash(user_data.password)
    user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password
    )
    await user.insert()
    
    token = create_access_token(user.id)
    response.set_cookie(key="token", value=token, httponly=True)
    
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "role": user.role
    }

@router.post("/login")
async def login(user_data: UserLogin, response: Response):
    user = await User.find_one(User.email == user_data.email)
    if not user or not user.verify_password(user_data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(user.id)
    response.set_cookie(key="token", value=token, httponly=True)
    
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "avatar": user.avatar
    }

@router.get("/profile", response_model=UserResponse)
async def get_profile(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "avatar": user.avatar
    }

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out successfully"}
