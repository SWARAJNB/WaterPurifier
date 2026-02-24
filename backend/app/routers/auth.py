from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, UserResponse
from app.core.security import create_access_token, verify_token
from typing import Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

class ErrorResponse(BaseModel):
    detail: str
    status: str = "error"

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)):
    """Extract and verify user from JWT token."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        user_id = verify_token(token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await User.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister):
    """Register new user with email and password."""
    try:
        # Check if user already exists
        existing_user = await User.find_one(User.email == user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = User.get_password_hash(user_data.password)
        user = User(
            name=user_data.name,
            email=user_data.email,
            password=hashed_password,
            phone=user_data.phone or "",
            role="user"
        )
        await user.insert()
        
        # Generate token
        token = create_access_token(str(user.id))
        
        return UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
            role=user.role,
            avatar=user.avatar,
            token=token
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=UserResponse)
async def login(user_data: UserLogin):
    """Login user with email and password."""
    try:
        user = await User.find_one(User.email == user_data.email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not user.verify_password(user_data.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Generate token
        token = create_access_token(str(user.id))
        
        return UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
            role=user.role,
            avatar=user.avatar,
            token=token
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/profile", response_model=UserResponse)
async def get_profile(user: User = Depends(get_current_user)):
    """Get current user profile."""
    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        avatar=user.avatar
    )

@router.post("/logout")
async def logout():
    """Logout user (client removes token)."""
    return {"message": "Logged out successfully"}

@router.post("/forgot-password")
async def forgot_password(data: dict):
    """Request password reset OTP."""
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    user = await User.find_one(User.email == email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    import random
    import string
    otp = ''.join(random.choices(string.digits, k=6))
    user.resetPasswordOTP = otp
    user.resetPasswordExpire = datetime.utcnow() + timedelta(minutes=10)
    await user.save()
    
    print(f"🔐 DEBUG: OTP for {email} is {otp}")
    return {"message": "OTP sent to email (Check console for demo)", "otp": otp}

@router.post("/reset-password")
async def reset_password(data: dict):
    """Reset password with OTP."""
    email = data.get("email")
    otp = data.get("otp")
    new_password = data.get("new_password")
    
    if not all([email, otp, new_password]):
        raise HTTPException(status_code=400, detail="Email, OTP, and new password required")
    
    user = await User.find_one(User.email == email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.resetPasswordOTP != otp or not user.resetPasswordExpire or user.resetPasswordExpire < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    user.password = User.get_password_hash(new_password)
    user.resetPasswordOTP = None
    user.resetPasswordExpire = None
    await user.save()
    
    return {"message": "Password reset successfully"}

@router.post("/verify-token")
async def verify_token_endpoint(user: User = Depends(get_current_user)):
    """Verify if token is valid."""
    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        avatar=user.avatar
    )
