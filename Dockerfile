# =============================================================
# Stage 1: Build
#   Builds the front-end with Node.js + Vite + TypeScript
# =============================================================
FROM node:22-alpine AS build

WORKDIR /app

# 1. Copy only dependency files to leverage Docker layer caching
COPY package*.json ./
RUN npm ci

# 2. Copy the rest of the source code
COPY . .

# 3. Build for production (tsc --noEmit + vite build)
RUN npm run build

# =============================================================
# Stage 2: Production
#   Lightweight Nginx (~5MB base image) + compiled static assets
# =============================================================
FROM nginx:alpine AS production

# Create placeholders for user data
# (overwritten by bind mounts at runtime via docker-compose)
RUN mkdir -p /usr/share/nginx/html/media && \
    touch /usr/share/nginx/html/chat.txt

# Copy the compiled Vite build
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
# (include /etc/nginx/mime.types is essential for correct MIME types)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# HTTP port
EXPOSE 80

# Healthcheck: Nginx is responding on port 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Nginx in foreground (PID 1)
CMD ["nginx", "-g", "daemon off;"]
