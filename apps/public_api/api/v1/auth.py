"""
Auth API Endpoints
User registration, login, and token management
Follows KISS: Simple, clear endpoint structure
"""
from fastapi import APIRouter, HTTPException, status

from apps.public_api.dependencies import CurrentUser, DbSession
from packages.common.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenRefresh,
    PasswordChange,
    UserResponse,
    TokenResponse,
    AuthResponse,
    MessageResponse,
)
from packages.common.services.auth_service import (
    AuthError,
    register_user,
    login_user,
    refresh_tokens,
    change_password,
)

router = APIRouter()


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account with email and password",
)
def register(data: UserRegister, db: DbSession) -> AuthResponse:
    """Register a new user"""
    try:
        return register_user(db, data)
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Login",
    description="Authenticate with email and password to get access tokens",
)
def login(data: UserLogin, db: DbSession) -> AuthResponse:
    """Login and get tokens"""
    try:
        return login_user(db, data)
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh tokens",
    description="Get new access and refresh tokens using a valid refresh token",
)
def refresh(data: TokenRefresh, db: DbSession) -> TokenResponse:
    """Refresh access token"""
    try:
        return refresh_tokens(db, data.refresh_token)
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout",
    description="Logout the current user (client should discard tokens)",
)
def logout(current_user: CurrentUser) -> MessageResponse:
    """
    Logout the current user

    Note: JWT tokens are stateless, so logout is handled client-side
    by discarding the tokens. This endpoint exists for API completeness
    and can be extended to implement token blacklisting if needed.
    """
    return MessageResponse(message="Successfully logged out")


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
    description="Get the profile of the currently authenticated user",
)
def get_me(current_user: CurrentUser) -> UserResponse:
    """Get current user profile"""
    return UserResponse.model_validate(current_user)


@router.put(
    "/password",
    response_model=MessageResponse,
    summary="Change password",
    description="Change the password for the current user",
)
def update_password(
    data: PasswordChange, current_user: CurrentUser, db: DbSession
) -> MessageResponse:
    """Change user password"""
    try:
        change_password(db, current_user, data.current_password, data.new_password)
        return MessageResponse(message="Password changed successfully")
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
