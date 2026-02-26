# Docker Compose Guide

This guide explains the `docker-compose.yml` configuration for the Containerized Supermarket App. The application consists of three services: a PostgreSQL database, an Express.js backend, and a React/Vite frontend.

## Services Overview

### 1. Database Service (`db`)
- **Image**: `postgres:15`
- **Port**: `5432` (Mapped to host 5432)
- **Environment Variables**:
  - `POSTGRES_USER`: Database user (default: `user`)
  - `POSTGRES_PASSWORD`: Database password (default: `password`)
  - `POSTGRES_DB`: Default database name (`students_db`)
- **Persistence**: Data is persisted in the `pgdata` volume at `/var/lib/postgresql/data`. This ensures data survives container restarts.

### 2. Backend Service (`backend`)
- **Build Context**: `./backend` directory
- **Port**: `3000` (Mapped to host 3000)
- **Dependencies**: Waits for `db` service to start.
- **Environment Variables**:
  - `DB_HOST`: set to `db` (resolves to the database container's IP)
  - `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Credentials matching the database service.
- **Development Features**:
  - **Volumes**:
    - `./backend:/app`: Mounts local source code for live reloading (Hot Reload).
    - `/app/node_modules`: Prevents local node_modules from conflicting with the container's.

### 3. Frontend Service (`frontend`)
- **Build Context**: `./frontend` directory
- **Port**: `5173` (Mapped to host 5173)
- **Dependencies**: Waits for `backend` service.
- **Environment Variables**:
  - `VITE_API_URL`: Points to the backend API (`http://localhost:3000`). Note that since this is a client-side app, it accesses the backend via the host's localhost, not the internal container network name.
- **Development Features**:
  - **Volumes**:
    - `./frontend:/app`: Mounts local source code for live updates.
    - `/app/node_modules`: Anonymous volume for container dependencies.

## Volumes
- **`pgdata`**: A named volume used by the `db` service for persistent storage.

## Networking
All services are joined to a default network created by Docker Compose.
- **Internal Communication**:
  - The `backend` can reach the `db` using the hostname `db`.
- **External Communication**:
  - The `frontend` (running in the browser) calls the `backend` via `http://localhost:3000`.

## Common Commands

### Start the Application
Run the services in the background:
```bash
docker-compose up -d
```

### View Logs
Follow logs for all services:
```bash
docker-compose logs -f
```
Follow logs for a specific service (e.g., backend):
```bash
docker-compose logs -f backend
```

### Stop the Application
Stop containers but preserve data:
```bash
docker-compose down
```
Stop containers and remove volumes (WARNING: Deletes database data):
```bash
docker-compose down -v
```

### Rebuild Services
If you install new dependencies (in `package.json`), you must rebuild:
```bash
docker-compose up -d --build
```
