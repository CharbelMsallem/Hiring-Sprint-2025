# --- Build Stage ---
# Use a Node LTS (Long Term Support) image for building the app
FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json first
COPY frontend/package.json frontend/package-lock.json ./

# Use 'npm ci' for cleaner, more reliable installs in CI
RUN npm ci

# Copy the rest of the frontend source code
COPY frontend/ .

# Build the static files
RUN npm run build

# --- Final Stage ---
# Use a lightweight Nginx image to serve the static files
FROM nginx:stable-alpine

# Copy the built static files from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration template
# This file will be processed by Nginx to allow environment variables
COPY frontend/nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose the default Nginx port
EXPOSE 80

# The default Nginx entrypoint will automatically substitute environment
# variables (like ${BACKEND_API_URL}) in the .template file
CMD ["nginx", "-g", "daemon off;"]