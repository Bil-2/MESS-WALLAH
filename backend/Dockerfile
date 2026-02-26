# ---- Base Stage ----
FROM node:18-alpine AS base
WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Create uploads directory (for multer file storage)
RUN mkdir -p uploads

# Expose the backend port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:5001/health || exit 1

# Start the server in production mode
CMD ["node", "server.js"]
