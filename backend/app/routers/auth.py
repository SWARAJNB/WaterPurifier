from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, UserResponse
from app.core.security import create_access_token, verify_token
from typing import List
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session expired or invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
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
        password=hashed_password,
        phone=user_data.phone or ""
    )
    await user.insert()
    
    token = create_access_token(user.id)
    response.set_cookie(key="token", value=token, httponly=True)
    
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "token": token
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
        "avatar": user.avatar,
        "token": token
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

@router.post("/forgot-password")
async def forgot_password(data: dict):
    email = data.get("email")
    user = await User.find_one(User.email == email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    import random
    import string
    otp = ''.join(random.choices(string.digits, k=6))
    user.resetPasswordOTP = otp
    user.resetPasswordExpire = datetime.utcnow() + timedelta(minutes=10)
    await user.save()
    
    print(f"DEBUG: OTP for {email} is {otp}")
    return {"message": "OTP sent to email (Check console for demo)"}

@router.post("/reset-password")
async def reset_password(data: dict):
    email = data.get("email")
    otp = data.get("otp")
    new_password = data.get("newPassword")
    
    user = await User.find_one(User.email == email)
    if not user or user.resetPasswordOTP != otp or user.resetPasswordExpire < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    user.password = User.get_password_hash(new_password)
    user.resetPasswordOTP = None
    user.resetPasswordExpire = None
    await user.save()
    
    return {"message": "Password reset successfully"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out successfully"}
