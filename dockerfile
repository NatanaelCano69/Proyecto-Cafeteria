# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build --omit=dev

# ---------- Runtime Stage ----------
FROM nginx:alpine

COPY --from=builder /app/dist/cafeteria-frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]