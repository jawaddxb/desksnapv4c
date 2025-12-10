"""
Auth Service
Handles user authentication and JWT token management
Follows SOLID-S: Single responsibility (authentication logic)
"""
import uuid
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from packages.common.core.config import settings
from packages.common.models.user import User, AuthProvider
from packages.common.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
    AuthResponse,
)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Token types
ACCESS_TOKEN = "access"
REFRESH_TOKEN = "refresh"


class AuthError(Exception):
    """Authentication error"""

    def __init__(self, message: str, status_code: int = 401):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_token(
    user_id: uuid.UUID,
    token_type: str = ACCESS_TOKEN,
) -> tuple[str, int]:
    """
    Create a JWT token for a user

    Returns:
        tuple: (token, expires_in_seconds)
    """
    if token_type == ACCESS_TOKEN:
        expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    else:
        # Refresh token expires in 7 days
        expires_delta = timedelta(days=7)

    expires_at = datetime.now(timezone.utc) + expires_delta
    expires_in = int(expires_delta.total_seconds())

    payload = {
        "sub": str(user_id),
        "type": token_type,
        "exp": expires_at,
        "iat": datetime.now(timezone.utc),
    }

    token = jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)
    return token, expires_in


def decode_token(token: str) -> dict:
    """
    Decode and validate a JWT token

    Raises:
        AuthError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError as e:
        raise AuthError(f"Invalid token: {e}")


def get_user_by_email(db: Session, email: str) -> User | None:
    """Get a user by email address"""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    """Get a user by ID"""
    return db.query(User).filter(User.id == user_id).first()


def register_user(db: Session, data: UserRegister) -> AuthResponse:
    """
    Register a new user

    Raises:
        AuthError: If email already exists
    """
    # Check if email already exists
    existing_user = get_user_by_email(db, data.email)
    if existing_user:
        raise AuthError("Email already registered", status_code=400)

    # Create new user
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        name=data.name,
        auth_provider=AuthProvider.EMAIL.value,
        is_active=True,
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create tokens
    access_token, access_expires = create_token(user.id, ACCESS_TOKEN)
    refresh_token, _ = create_token(user.id, REFRESH_TOKEN)

    return AuthResponse(
        user=UserResponse.model_validate(user),
        tokens=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=access_expires,
        ),
    )


def login_user(db: Session, data: UserLogin) -> AuthResponse:
    """
    Authenticate a user and return tokens

    Raises:
        AuthError: If credentials are invalid
    """
    user = get_user_by_email(db, data.email)

    if not user:
        raise AuthError("Invalid email or password")

    if not user.password_hash:
        raise AuthError("This account uses social login")

    if not verify_password(data.password, user.password_hash):
        raise AuthError("Invalid email or password")

    if not user.is_active:
        raise AuthError("Account is disabled", status_code=403)

    # Create tokens
    access_token, access_expires = create_token(user.id, ACCESS_TOKEN)
    refresh_token, _ = create_token(user.id, REFRESH_TOKEN)

    return AuthResponse(
        user=UserResponse.model_validate(user),
        tokens=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=access_expires,
        ),
    )


def refresh_tokens(db: Session, refresh_token: str) -> TokenResponse:
    """
    Refresh access token using refresh token

    Raises:
        AuthError: If refresh token is invalid
    """
    payload = decode_token(refresh_token)

    if payload.get("type") != REFRESH_TOKEN:
        raise AuthError("Invalid token type")

    user_id = uuid.UUID(payload["sub"])
    user = get_user_by_id(db, user_id)

    if not user:
        raise AuthError("User not found")

    if not user.is_active:
        raise AuthError("Account is disabled", status_code=403)

    # Create new tokens
    new_access_token, access_expires = create_token(user.id, ACCESS_TOKEN)
    new_refresh_token, _ = create_token(user.id, REFRESH_TOKEN)

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        expires_in=access_expires,
    )


def get_current_user_from_token(db: Session, token: str) -> User:
    """
    Get the current user from an access token

    Raises:
        AuthError: If token is invalid or user not found
    """
    payload = decode_token(token)

    if payload.get("type") != ACCESS_TOKEN:
        raise AuthError("Invalid token type")

    user_id = uuid.UUID(payload["sub"])
    user = get_user_by_id(db, user_id)

    if not user:
        raise AuthError("User not found")

    if not user.is_active:
        raise AuthError("Account is disabled", status_code=403)

    return user


def change_password(
    db: Session, user: User, current_password: str, new_password: str
) -> bool:
    """
    Change a user's password

    Raises:
        AuthError: If current password is wrong
    """
    if not user.password_hash:
        raise AuthError("This account uses social login")

    if not verify_password(current_password, user.password_hash):
        raise AuthError("Current password is incorrect")

    user.password_hash = hash_password(new_password)
    db.commit()
    return True
