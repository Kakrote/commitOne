# Convene Backend

The backend is an Express 5 API written in TypeScript. It uses Prisma 7 with PostgreSQL and stores uploaded meeting-minute PDFs under `uploads/minutes`.

## Local Setup

From this directory:

```bash
npm ci
npx prisma generate
npm run build
```

Set these values in `backend/.env` when running outside Docker:

```env
DATABASE_URL=postgresql://committee:password@localhost:5432/committee_management
PORT=3001
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@committee.local
ADMIN_PASSWORD=replace-with-a-strong-admin-password
```

Apply migrations and seed the administrator:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

The API listens on http://localhost:3001 by default.

## Useful Commands

```bash
npm run build       # Compile TypeScript to dist/
npm start           # Run the compiled server
npx prisma generate # Generate the Prisma client
npx prisma studio   # Open Prisma Studio
```

## Main Routes

- `POST /api/auth/login` - Sign in
- `GET /api/committees` - Authenticated committee list
- `POST /api/committees` - Create a committee as a super administrator
- `POST /api/committees/:committeeId/minutes` - Upload a meeting-minute PDF
- `GET /api/public/committees` - Public committee directory
- `GET /api/public/committees/:committeeId` - Public committee details and minutes
- `GET /api/public/committees/:committeeId/minutes/:minuteId/file` - Public PDF download

Public routes are read-only and do not require a bearer token.
