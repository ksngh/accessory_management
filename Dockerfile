## Multi-stage build: build with node, serve with nginx
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# copy package manifests first for cached installs
COPY package.json package-lock.json* ./

# install deps (use ci when lockfile present)
RUN sh -c "if [ -f package-lock.json ]; then npm ci; else npm install; fi"

# copy source and build
COPY . .
RUN npm run build

## Production image
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
