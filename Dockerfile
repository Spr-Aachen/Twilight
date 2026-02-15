# syntax=docker/dockerfile:1.7

# Stage 1: build Astro site
FROM node:lts-alpine AS builder

WORKDIR /app

RUN corepack enable
ENV NODE_OPTIONS=--no-deprecation

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --prefer-offline

COPY . .
RUN pnpm build

# Stage 2: serve static files with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Add labels for metadata
LABEL org.opencontainers.image.source="https://github.com/Spr-Aachen/Twilight"
LABEL org.opencontainers.image.description="Twilight blog Docker image"
LABEL org.opencontainers.image.licenses="MIT"