FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend ./
ARG NEXT_PUBLIC_API_URL=http://localhost:3000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3002

COPY frontend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts

EXPOSE 3002
CMD ["npm", "start", "--", "--hostname", "0.0.0.0", "--port", "3002"]