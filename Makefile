.PHONY: help install dev up down logs clean lint format test migrate db-reset infra-up infra-down

# Default target
help:
	@echo "DeckSnap Backend - Available Commands"
	@echo "======================================"
	@echo "Setup:"
	@echo "  make install    - Install Python dependencies with Poetry"
	@echo "  make setup      - Initial setup (copy .env, install deps)"
	@echo ""
	@echo "Development:"
	@echo "  make dev        - Start API, Worker, and Frontend (kills existing first)"
	@echo "  make infra-up   - Start postgres + redis in Docker"
	@echo "  make infra-down - Stop postgres + redis"
	@echo "  make up         - Start all services in Docker (background)"
	@echo "  make down       - Stop all Docker services"
	@echo "  make restart    - Restart all Docker services"
	@echo "  make logs       - View logs from all services"
	@echo "  make logs-api   - View API logs only"
	@echo "  make logs-worker - View worker logs only"
	@echo ""
	@echo "Database:"
	@echo "  make migrate    - Run database migrations"
	@echo "  make migrate-create - Create new migration"
	@echo "  make db-reset   - Reset database (WARNING: deletes all data)"
	@echo "  make db-shell   - Open PostgreSQL shell"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint       - Run Ruff linter"
	@echo "  make lint-fix   - Run Ruff linter with auto-fix"
	@echo "  make format     - Format code with Ruff"
	@echo "  make typecheck  - Run mypy type checker"
	@echo ""
	@echo "Testing:"
	@echo "  make test       - Run all tests"
	@echo "  make test-unit  - Run unit tests only"
	@echo "  make test-cov   - Run tests with coverage report"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean      - Remove Python cache files"
	@echo "  make clean-all  - Remove all generated files and volumes"

# Setup commands
install:
	@echo "Installing Python dependencies..."
	poetry install

setup:
	@echo "Setting up DeckSnap Backend..."
	@if [ ! -f .env ]; then \
		echo "Creating .env file from .env.example..."; \
		cp .env.example .env; \
		echo "⚠️  Please edit .env and configure your settings"; \
	fi
	@echo "Installing dependencies..."
	$(MAKE) install
	@echo "✅ Setup complete! Run 'make dev' to start"

# Development commands
dev:
	@echo "=== DeckSnap Full Dev Environment ==="
	@echo ""
	@echo "Step 1: Killing existing processes..."
	@lsof -ti:8000 | xargs kill -9 2>/dev/null || true
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@pkill -f "celery.*worker" 2>/dev/null || true
	@sleep 1
	@echo ""
	@echo "Step 2: Starting infrastructure (postgres, redis)..."
	@docker-compose up -d postgres redis
	@echo "Waiting for postgres to be healthy..."
	@until docker-compose exec -T postgres pg_isready -U decksnap > /dev/null 2>&1; do \
		echo "  Postgres not ready yet, waiting..."; \
		sleep 2; \
	done
	@echo "✅ Postgres ready on localhost:5433"
	@echo "Waiting for redis to be healthy..."
	@until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do \
		echo "  Redis not ready yet, waiting..."; \
		sleep 2; \
	done
	@echo "✅ Redis ready on localhost:6381"
	@echo ""
	@echo "Step 3: Starting API (8000), Worker, and Frontend (3000)..."
	poetry run honcho start -f Procfile.dev

# Infrastructure commands (Docker services)
infra-up:
	@echo "Starting infrastructure services (postgres, redis)..."
	@docker-compose up -d postgres redis
	@echo "Waiting for services to be healthy..."
	@sleep 3
	@echo "✅ Infrastructure ready on postgres:5433, redis:6381"

infra-down:
	@echo "Stopping infrastructure services..."
	@docker-compose stop postgres redis
	@echo "✅ Infrastructure stopped"

up:
	@echo "Starting all services in background (Docker)..."
	docker-compose up -d
	@echo "✅ Services started. Run 'make logs' to view logs"

down:
	@echo "Stopping all services..."
	docker-compose down
	@echo "✅ Services stopped"

restart:
	@echo "Restarting services..."
	docker-compose restart
	@echo "✅ Services restarted"

logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f api

logs-worker:
	docker-compose logs -f worker

# Database commands
migrate:
	@echo "Running database migrations..."
	docker-compose exec api alembic upgrade head
	@echo "✅ Migrations complete"

migrate-create:
	@echo "Creating new migration..."
	@read -p "Enter migration message: " msg; \
	docker-compose exec api alembic revision --autogenerate -m "$$msg"

db-reset:
	@echo "⚠️  WARNING: This will delete all data!"
	@read -p "Are you sure? (yes/no): " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		echo "Resetting database..."; \
		docker-compose down -v; \
		docker-compose up -d postgres redis; \
		sleep 5; \
		docker-compose up -d api; \
		sleep 3; \
		docker-compose exec api alembic upgrade head; \
		echo "✅ Database reset complete"; \
	else \
		echo "Cancelled"; \
	fi

db-shell:
	docker-compose exec postgres psql -U decksnap -d decksnap

# Code quality commands
lint:
	@echo "Running Ruff linter..."
	poetry run ruff check packages apps tests

lint-fix:
	@echo "Running Ruff linter with auto-fix..."
	poetry run ruff check --fix packages apps tests

format:
	@echo "Formatting code with Ruff..."
	poetry run ruff format packages apps tests
	@echo "✅ Code formatted"

typecheck:
	@echo "Running mypy type checker..."
	poetry run mypy packages apps

# Testing commands
test:
	@echo "Running all tests..."
	poetry run pytest

test-unit:
	@echo "Running unit tests..."
	poetry run pytest tests/unit

test-integration:
	@echo "Running integration tests..."
	poetry run pytest tests/integration

test-cov:
	@echo "Running tests with coverage..."
	poetry run pytest --cov --cov-report=html --cov-report=term
	@echo "📊 Coverage report generated in htmlcov/index.html"

# Cleanup commands
clean:
	@echo "Cleaning Python cache files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	rm -rf htmlcov .coverage
	@echo "✅ Cache cleaned"

clean-all: down clean
	@echo "⚠️  Removing all Docker volumes..."
	docker-compose down -v
	@echo "✅ All cleaned"

# Health check and docs
health:
	@curl -s http://localhost:8000/health | python -m json.tool

api-docs:
	@echo "Opening API documentation..."
	@open http://localhost:8000/docs || xdg-open http://localhost:8000/docs

# Build commands (for production)
build:
	@echo "Building Docker images..."
	docker-compose build

build-no-cache:
	@echo "Building Docker images (no cache)..."
	docker-compose build --no-cache
