# Docker Starter

This repository provides a basic setup for a full-stack application with a React frontend and an Express backend, using Docker for containerization. The frontend is hosted on Vercel, and the backend is hosted on Render.

## Table of Contents

-   [Docker Starter](#docker-starter)
    -   [Table of Contents](#table-of-contents)
    -   [Features](#features)
    -   [Prerequisites](#prerequisites)
    -   [Setup](#setup)
    -   [Running Locally](#running-locally)
    -   [Docker Compose](#docker-compose)
    -   [CI/CD Pipeline](#cicd-pipeline)
    -   [Deployment](#deployment)
    -   [Environment Variables](#environment-variables)

## Features

-   React frontend built with Vite
-   Express backend
-   MongoDB database
-   Docker for containerization
-   Docker Compose for orchestration
-   CI/CD pipeline for building and pushing Docker images to Docker Hub
-   Hosting on Vercel (frontend) and Render (backend)

## Prerequisites

-   Docker and Docker Compose installed
-   Node.js and npm installed
-   Vercel account
-   Render account

## Setup

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/docker-starter.git
    cd docker-starter
    ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory with the following content:
    ```env
    MONGODB_URI=mongodb://admin:password@mongodb:27017/docker_starter?authSource=admin
    ```

## Running Locally

### Running the Frontend

```sh
cd frontend
npm install
npm run dev
```

### Running the Backend

```sh
cd backend
npm install
npm start
```

## Docker Compose

To run the entire stack using Docker Compose:

1. **Create a Docker volume for image uploads:**

    ```sh
    docker volume create image_uploads
    ```

2. **Start services:**
    ```sh
    docker-compose up --build
    ```

This will start the frontend, backend, and MongoDB services.

## CI/CD Pipeline

The repository includes a GitHub Actions workflow to build and push the frontend Docker image to Docker Hub on every push to the `main` branch.

## Deployment

### Frontend (Vercel)

1. **Deploy:**

-   Set the environment variables: - `VITE_BACKEND_URL`

### Backend (Render)

1. **Create a new web service on Render:**

    - Connect your GitHub repository
    - Set the environment variables:
        - `MONGODB_URI`
    - Define the start command as `npm start`

2. **Deploy:**
    - Render will automatically build and deploy the backend from your repository.

## Environment Variables

Make sure to set the following environment variables:

-   `MONGODB_URI`: MongoDB connection string
-   `REACT_APP_API_BASE_URL`: Backend URL for the frontend to communicate with

You can set these variables in the respective deployment platforms (Vercel for frontend, Render for backend).
