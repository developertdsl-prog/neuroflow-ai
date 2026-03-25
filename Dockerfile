# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Final Runtime Image
FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=5000

# Install curl for healthcheck validation
RUN apk add --no-cache curl

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./
COPY server/ ./server/

EXPOSE 5000

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/v1/ping || exit 1

CMD ["node", "server/server.js"]
