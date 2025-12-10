"""
Error Handling Decorators

DRY pattern for consistent error handling across services.
"""

import functools
import logging
import time
from typing import Callable, TypeVar, ParamSpec

from packages.common.core.exceptions import ApplicationError, ExternalServiceError

P = ParamSpec("P")
T = TypeVar("T")

logger = logging.getLogger(__name__)


def handle_service_errors(
    error_message: str = "Service error",
    error_class: type[ApplicationError] = ApplicationError,
):
    """
    Decorator to handle and transform exceptions in service functions.

    Catches exceptions and wraps them in the specified ApplicationError subclass.
    Logs the original exception for debugging.

    Args:
        error_message: Default message if exception has no message
        error_class: ApplicationError subclass to raise

    Usage:
        @handle_service_errors("Failed to create presentation")
        def create_presentation(db, user, data):
            ...
    """

    def decorator(func: Callable[P, T]) -> Callable[P, T]:
        @functools.wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
            try:
                return func(*args, **kwargs)
            except ApplicationError:
                # Already an ApplicationError, re-raise as-is
                raise
            except Exception as e:
                logger.error(
                    f"{func.__name__} failed: {str(e)}",
                    extra={"function": func.__name__, "error": str(e)},
                    exc_info=True,
                )
                raise error_class(
                    message=f"{error_message}: {str(e)}",
                )

        return wrapper

    return decorator


def log_execution(func: Callable[P, T]) -> Callable[P, T]:
    """
    Decorator to log function entry, exit, and timing.

    Logs at INFO level for entry/exit, DEBUG for arguments.

    Usage:
        @log_execution
        def my_function(arg1, arg2):
            ...
    """

    @functools.wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        func_name = func.__name__
        start_time = time.time()

        logger.info(f"Entering {func_name}")
        logger.debug(f"{func_name} args: {args}, kwargs: {kwargs}")

        try:
            result = func(*args, **kwargs)
            elapsed = time.time() - start_time
            logger.info(f"Exiting {func_name} (took {elapsed:.3f}s)")
            return result
        except Exception as e:
            elapsed = time.time() - start_time
            logger.warning(f"{func_name} failed after {elapsed:.3f}s: {str(e)}")
            raise

    return wrapper


def retry_on_error(
    max_attempts: int = 3,
    delay_seconds: float = 1.0,
    exceptions: tuple[type[Exception], ...] = (ExternalServiceError,),
):
    """
    Decorator to retry a function on specific exceptions.

    Useful for external service calls that may temporarily fail.

    Args:
        max_attempts: Maximum number of attempts
        delay_seconds: Delay between attempts
        exceptions: Tuple of exception types to catch and retry

    Usage:
        @retry_on_error(max_attempts=3, delay_seconds=2)
        def call_external_api():
            ...
    """

    def decorator(func: Callable[P, T]) -> Callable[P, T]:
        @functools.wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
            last_exception = None

            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt < max_attempts:
                        logger.warning(
                            f"{func.__name__} attempt {attempt}/{max_attempts} failed: {e}. "
                            f"Retrying in {delay_seconds}s..."
                        )
                        time.sleep(delay_seconds)
                    else:
                        logger.error(f"{func.__name__} failed after {max_attempts} attempts")

            raise last_exception  # type: ignore

        return wrapper

    return decorator


def validate_required_fields(*field_names: str):
    """
    Decorator to validate that required fields are present in first argument.

    Assumes first argument is a Pydantic model or object with attributes.

    Args:
        field_names: Names of required fields

    Usage:
        @validate_required_fields("email", "password")
        def register_user(data: UserRegister):
            ...
    """

    def decorator(func: Callable[P, T]) -> Callable[P, T]:
        @functools.wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
            from packages.common.core.exceptions import ValidationError

            if args:
                data = args[0]
                for field in field_names:
                    value = getattr(data, field, None)
                    if value is None or (isinstance(value, str) and not value.strip()):
                        raise ValidationError(
                            message=f"Field '{field}' is required",
                            field=field,
                        )

            return func(*args, **kwargs)

        return wrapper

    return decorator
