FROM node:22-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl \
	&& rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm ci

COPY backend/tsconfig.json backend/prisma.config.ts ./
COPY backend/prisma ./prisma
COPY backend/src ./src
COPY backend/server.ts ./server.ts
ARG DATABASE_URL=postgresql://committee:committee_dev_password@db:5432/committee_management
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate && npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl \
	&& rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build /app/prisma/migrations ./prisma/migrations
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

RUN mkdir -p /app/uploads/minutes

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm start"]