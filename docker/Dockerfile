FROM node:16-slim as build-stage

# Set the working directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV VITE_BASE_URL=/api/
RUN npm run build

# Use the official Nginx image as the base image for serving the static files
FROM nginx:latest

# Copy the Nginx configuration file
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application files to the Nginx web root directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
