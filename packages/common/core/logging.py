"""
Logging configuration for DeckSnap backend
Follows KISS principle: simple, structured logging setup
"""
import logging
import sys
from typing import Optional

from packages.common.core.config import settings


def setup_logging(level: Optional[str] = None) -> None:
    """
    Configure logging for the application

    Args:
        level: Optional log level override. Uses settings.log_level if not provided.

    Following KISS principle: simple logging configuration
    """
    log_level = level or settings.log_level

    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format=settings.log_format,
        handlers=[
            logging.StreamHandler(sys.stdout),
        ],
    )

    # Set log levels for noisy libraries
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.database_echo else logging.WARNING
    )
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("celery").setLevel(logging.INFO)


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance with the given name

    Args:
        name: Logger name (typically __name__)

    Returns:
        logging.Logger: Configured logger instance

    Usage:
        logger = get_logger(__name__)
        logger.info("Processing request")
    """
    return logging.getLogger(name)


class LoggerMixin:
    """
    Mixin class to add logging capability to any class

    Usage:
        class MyService(LoggerMixin):
            def do_something(self):
                self.logger.info("Doing something")

    Following DRY principle: reusable logging for classes
    """

    @property
    def logger(self) -> logging.Logger:
        """Get logger named after the class"""
        return logging.getLogger(self.__class__.__name__)
