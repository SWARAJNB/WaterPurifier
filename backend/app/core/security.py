from datetime import datetime, timedelta
from typing import Optional, Any, Union
from jose import jwt, JWTError, ExpiredSignatureError
from app.core.config import settings

ALGORITHM = "HS256"

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token with expiry."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return user ID if valid."""
    try:
        # Remove "Bearer " prefix if present
        if token.startswith("Bearer "):
            token = token[7:]
        
        decoded_token = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = decoded_token.get("sub")
        if user_id is None:
            return None
        return user_id
    except ExpiredSignatureError:
        raise ValueError("Token has expired")
    except JWTError:
        raise ValueError("Invalid token")
    except Exception as e:
        raise ValueError(f"Token error: {str(e)}")
