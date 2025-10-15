# Dockerfile for Fly.io deployment
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Production dependencies only
FROM base AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production
ENV PORT=8080

# Copy package files and install production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy server code
COPY server ./server

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "--loader", "tsx", "server/index.ts"]

