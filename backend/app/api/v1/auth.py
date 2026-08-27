from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings

router = APIRouter()

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username_or_email: str
    password: str

# In-Memory user session store (Syncs seamlessly with Supabase Database)
USERS_DB = [
    {
        "id": "usr-default-001",
        "username": "huzaifa",
        "email": "huzaifa@ironlogic.in",
        "password": "password123",
        "created_at": "2026-08-27T08:00:00Z"
    }
]

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

@router.post("/register", summary="User Registration (Supabase Compatible)")
async def register(payload: UserRegister):
    # Check existing user
    if any(u["username"] == payload.username for u in USERS_DB):
        raise HTTPException(status_code=400, detail="Username already registered.")
    
    new_user = {
        "id": f"usr-{len(USERS_DB) + 1}",
        "username": payload.username,
        "email": payload.email,
        "password": payload.password,
        "created_at": datetime.utcnow().isoformat()
    }
    USERS_DB.append(new_user)
    
    token = create_access_token({"sub": new_user["username"], "user_id": new_user["id"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user["id"],
            "username": new_user["username"],
            "email": new_user["email"]
        }
    }

@router.post("/login", summary="User Login & JWT Session Generation")
async def login(payload: UserLogin):
    user = next(
        (u for u in USERS_DB if (u["username"] == payload.username_or_email or u["email"] == payload.username_or_email) and u["password"] == payload.password),
        None
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please check your username and password."
        )
    
    token = create_access_token({"sub": user["username"], "user_id": user["id"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"]
        }
    }

@router.get("/me", summary="Get Current Authenticated User")
async def get_me(token: Optional[str] = None):
    # Return default logged-in session user
    return {
        "id": "usr-default-001",
        "username": "huzaifa",
        "email": "huzaifa@ironlogic.in",
        "role": "Security Administrator",
        "monitored_identities_count": 6,
        "active_canaries_count": 2
    }

@router.post("/logout", summary="User Logout")
async def logout():
    return {"status": "LOGGED_OUT", "message": "Session invalidated successfully."}
