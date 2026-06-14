# =============================================================
# Stage 1: Build
#   Compila o front-end com Node.js + Vite + TypeScript
# =============================================================
FROM node:22-alpine AS build

WORKDIR /app

# 1. Copia apenas arquivos de dependência para aproveitar cache Docker
COPY package*.json ./
RUN npm ci

# 2. Copia o resto do código-fonte
COPY . .

# 3. Compila para produção (tsc --noEmit + vite build)
RUN npm run build

# =============================================================
# Stage 2: Production
#   Nginx leve (~5MB imagem base) + assets estáticos compilados
# =============================================================
FROM nginx:alpine AS production

# Cria placeholders para dados do usuário
# (sobrescritos por bind mounts em runtime via docker-compose)
RUN mkdir -p /usr/share/nginx/html/media && \
    touch /usr/share/nginx/html/chat.txt

# Copia a build compilada do Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada do Nginx
# (include /etc/nginx/mime.types é essencial para MIME types corretos)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Porta HTTP
EXPOSE 80

# Healthcheck: Nginx está respondendo na porta 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Nginx em primeiro plano (PID 1)
CMD ["nginx", "-g", "daemon off;"]
