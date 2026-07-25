# ==========================================
# Multi-Stage Production Dockerfile for Ashcorp LMS
# Frontend (Next.js) + Backend (Express) + PM2 Auto-Healing
# ==========================================

# 1. Base Node Image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-libc6-compat

# 2. Build Backend
FROM base AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# 3. Build Frontend
FROM base AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 4. Production Runner Stage with PM2 Supervisor
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install PM2 globally inside container for runtime supervision
RUN npm install -g pm2

# Copy Backend Production Files
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/dist ./backend/dist
RUN cd backend && npm ci --only=production

# Copy Frontend Production Files
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/node_modules ./frontend/node_modules

# Copy PM2 ecosystem config
COPY ecosystem.config.js ./

# Expose Frontend (3000) and Backend (5000) Ports
EXPOSE 3000 5000

# PM2 runtime keeps container alive & auto-restarts apps on crash
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
