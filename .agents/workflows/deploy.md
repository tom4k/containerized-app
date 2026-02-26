---
description: how to deploy the application
---
Follow these steps to deploy the containerized application using Docker Compose. This will build the frontend and backend Docker images and start them alongside the PostgreSQL database.

// turbo
1. Build the images and start the containers in detached mode:
```bash
docker-compose up -d --build
```

2. Check the status of the running containers:
```bash
docker-compose ps
```

Once running, the application will be accessible at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/students
