# Student Management App

A containerized full-stack application for managing students.

## Stack
- **Frontend**: React (Vite)
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Prerequisites
- Docker & Docker Compose

## Quick Start

1. **Clone the repository** (if applicable)

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:3000/students](http://localhost:3000/students)

## Features
- List all students
- Add a new student
- Edit existing student details
- Delete a student

## Development
The source code is mapped to the containers, so changes in `frontend/src` or `backend/server.js` (with nodemon) should reflect immediately or after a quick refresh.

## CI/CD Pipeline (Jenkins)

This project includes a declarative `Jenkinsfile` for continuous integration and continuous deployment.

### Pipeline Stages
1. **Checkout**: Automatically pulls the latest code from the repository.
2. **Build Frontend**: Navigates to the `frontend` directory, installs dependencies (`npm install`), and builds the React application (`npm run build`).
3. **Build Backend**: Navigates to the `backend` directory and installs dependencies (`npm install`).
4. **Build Docker Images**: Executes `docker-compose build` to build the Docker images for all services defined in `docker-compose.yml`.
5. **Deploy**: Starts the containers in the background using `docker-compose up -d`.

### How to use
1. Setup a new Pipeline project in your Jenkins server.
2. Point the Pipeline script from SCM to your repository containing this code.

**Important requirement for Jenkins in Docker:**
If your Jenkins server is running as a Docker container, it must have access to the host machine's Docker daemon. 
- You must mount the Docker socket when starting Jenkins: `-v /var/run/docker.sock:/var/run/docker.sock`.
- The Jenkins container must have the `docker` CLI and the `docker compose` plugin installed.
