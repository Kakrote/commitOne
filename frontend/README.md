This is a [Next.js](https://nextjs.org) frontend for the Convene committee workspace.

## Run the full stack with Docker

From the repository root:

```bash
docker compose up --build
```

Open `http://localhost:3002`. The API is available at `http://localhost:3001`.

The first startup applies Prisma migrations and seeds the administrator configured by `ADMIN_EMAIL` and `ADMIN_PASSWORD`. PostgreSQL data and uploaded PDFs are stored in named Docker volumes. Set those variables, along with `JWT_SECRET`, in a root `.env` file before using this beyond local development.

## Run the frontend directly

From the `frontend` directory, install dependencies and run the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) with your browser. The frontend uses `http://localhost:3001/api` as its default API URL; override it with `NEXT_PUBLIC_API_URL` when the API is hosted elsewhere.

The public meeting-minute archive is available at [http://localhost:3002/public](http://localhost:3002/public).

## Build and start

```bash
npm run lint
npm run build
npm start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
