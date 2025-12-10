"""
Auth Schemas
Pydantic models for authentication requests and responses
Follows SOLID-S: Single responsibility (data validation)
"""
import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


# Request Schemas
class UserRegister(BaseModel):
    """User registration request"""

    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    name: str | None = Field(None, max_length=255)

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength"""
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserLogin(BaseModel):
    """User login request"""

    email: EmailStr
    password: str


class PasswordChange(BaseModel):
    """Password change request"""

    current_password: str
    new_password: str = Field(..., min_length=8, max_length=100)

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength"""
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class TokenRefresh(BaseModel):
    """Token refresh request"""

    refresh_token: str


# Response Schemas
class UserResponse(BaseModel):
    """User response (safe for client)"""

    id: uuid.UUID
    email: str
    name: str | None
    avatar_url: str | None
    auth_provider: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    """JWT token response"""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class AuthResponse(BaseModel):
    """Complete auth response with user and tokens"""

    user: UserResponse
    tokens: TokenResponse


class MessageResponse(BaseModel):
    """Simple message response"""

    message: str
    success: bool = True
