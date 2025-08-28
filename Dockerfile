# 1. Build Stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Serve Stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# hier kopieren wir das gebaute Vite-Output nach nginx
COPY --from=build /app/dist .

# hier kommt die nginx.conf rein (liegt im Projektordner neben Dockerfile)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
