# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build
RUN npm run server:test

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    API_HOST=0.0.0.0 \
    API_PORT=8080 \
    STATIC_DIR=/app/dist \
    API_DATA_FILE=/app/data/database.json

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/server ./server

RUN mkdir -p /app/data \
  && cp /app/server/data/database.json /app/data/database.json \
  && chown -R node:node /app

USER node
EXPOSE 8080

CMD ["node", "server/index.js"]
