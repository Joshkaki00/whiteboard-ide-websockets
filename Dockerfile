# Dockerfile for Fly.io deployment
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production
ENV PORT=8080

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy server code only
COPY server ./server

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server using tsx
CMD ["npx", "tsx", "server/index.ts"]

