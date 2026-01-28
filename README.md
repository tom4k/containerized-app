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
