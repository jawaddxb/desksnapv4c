"""
Celery application configuration
Follows SOLID-S principle: single responsibility (task queue)
"""
from celery import Celery

from packages.common.core.config import settings

# Create Celery instance
# Following KISS principle: simple Celery configuration
celery_app = Celery(
    "decksnap",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)

# Configure Celery
celery_app.conf.update(
    # Task settings
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    # Task execution
    task_time_limit=settings.celery_task_time_limit,
    task_soft_time_limit=settings.celery_task_soft_time_limit,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    # Worker settings
    worker_prefetch_multiplier=1,
    worker_concurrency=4,
    # Result settings
    result_expires=3600,  # 1 hour
    # Task routing
    task_routes={
        "packages.common.tasks.thumbnail_task.*": {"queue": "thumbnails"},
        "packages.common.tasks.analytics_task.*": {"queue": "analytics"},
        "packages.common.tasks.image_tasks.*": {"queue": "images"},
        "packages.common.tasks.beautify_tasks.*": {"queue": "default"},
    },
    # Default queue
    task_default_queue="default",
)

# Auto-discover tasks from packages
celery_app.autodiscover_tasks(["packages.common.tasks"])

# Explicitly import tasks to ensure registration
# This is needed when autodiscover doesn't work in certain environments
import packages.common.tasks.image_tasks  # noqa: F401, E402
import packages.common.tasks.beautify_tasks  # noqa: F401, E402
