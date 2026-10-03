# Convene

Convene is a committee management application for organizing committees, officers, members, and meeting minutes.

## Features

- Faculty and administrator authentication
- Committee creation and membership management
- Chairman and secretary assignments
- PDF meeting-minute uploads
- Public read-only committee directory
- Public PDF minute downloads without login
- PostgreSQL persistence with Prisma
- Docker Compose development and deployment setup

## Application URLs

When running locally:

- Frontend: http://localhost:3002
- Public meeting-minute archive: http://localhost:3002/public
- Backend API: http://localhost:3001/api

## Requirements

- Node.js 22 or newer
- Docker Desktop with Docker Compose
- PostgreSQL, when running the backend outside Docker

## Run With Docker

Create a root `.env` file from `.env.example` and replace the development secrets with strong values.

```bash
copy .env.example .env
docker compose up --build
```

Open http://localhost:3002 after the containers start. The backend applies Prisma migrations and seeds the administrator during container startup. Uploaded PDFs and PostgreSQL data are stored in Docker named volumes.

To stop the stack:

```bash
docker compose down
```

To stop it and remove stored database and upload data:

```bash
docker compose down -v
```

## Run Without Docker

Start PostgreSQL and provide `DATABASE_URL` in `backend/.env`, then run the backend:

```bash
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm run dev
```

In another terminal, start the frontend:

```bash
cd frontend
npm ci
npm run dev
```

The frontend expects `NEXT_PUBLIC_API_URL` to be `http://localhost:3001/api` by default.

## Public API

The public archive does not require authentication:

- `GET /api/public/committees`
- `GET /api/public/committees/:committeeId`
- `GET /api/public/committees/:committeeId/minutes/:minuteId/file`

The public view exposes committee details, chairman and secretary names, and downloadable meeting-minute PDFs. It does not expose committee member management or mutation actions.

## Project Structure

```text
backend/                 Express API, Prisma schema, migrations, and uploads
frontend/                Next.js web application
.github/workflows/       GitHub Actions container publishing workflow
docker-compose.yml       Local full-stack container configuration
```

## GitHub Actions Deployment

The workflow at `.github/workflows/deploy.yml` runs on pushes to `main` and manual dispatch. It validates both applications, then publishes backend and frontend images to GitHub Container Registry.

Set the repository variable `NEXT_PUBLIC_API_URL` to the public API URL before publishing the frontend image. Without it, the workflow defaults to `http://localhost:3001/api`.
