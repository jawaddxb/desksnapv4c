"""
Security Headers Middleware

OWASP-recommended security headers for HTTP responses.
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses.

    Headers added:
    - X-Content-Type-Options: Prevent MIME type sniffing
    - X-Frame-Options: Prevent clickjacking
    - X-XSS-Protection: Enable XSS filter (legacy browsers)
    - Referrer-Policy: Control referrer information
    - Content-Security-Policy: Restrict resource loading
    - Permissions-Policy: Restrict browser features
    """

    def __init__(
        self,
        app,
        content_security_policy: str | None = None,
        enable_hsts: bool = False,
    ):
        """
        Initialize security headers middleware.

        Args:
            app: The ASGI application
            content_security_policy: Custom CSP header value
            enable_hsts: Enable HTTP Strict Transport Security (only for HTTPS)
        """
        super().__init__(app)
        self.content_security_policy = content_security_policy or self._default_csp()
        self.enable_hsts = enable_hsts

    def _default_csp(self) -> str:
        """Default Content-Security-Policy for API."""
        return "; ".join([
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",  # Needed for some error pages
            "img-src 'self' data: https:",  # Allow data URIs and HTTPS images
            "font-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ])

    async def dispatch(self, request: Request, call_next) -> Response:
        """Process request and add security headers to response."""
        response = await call_next(request)

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # XSS protection for legacy browsers
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Control referrer information
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Content Security Policy
        response.headers["Content-Security-Policy"] = self.content_security_policy

        # Permissions Policy (formerly Feature-Policy)
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

        # HTTP Strict Transport Security (only for production HTTPS)
        if self.enable_hsts:
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        return response
