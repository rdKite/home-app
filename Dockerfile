# 1. Build Stage
FROM node:18-alpine AS build
WORKDIR /app

# package.json zuerst kopieren (aus frontend)
COPY frontend/package*.json ./
RUN npm install

# restliche App kopieren
COPY frontend/ ./
RUN npm run build

# 2. Serve Stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# gebaute Dateien ins Nginx-Verzeichnis kopieren
COPY --from=build /app/dist .

# nginx.conf kopieren (liegt im Projekt-Root)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
