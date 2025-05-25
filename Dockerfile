# Simple single-stage build for faster development
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install for better compatibility)
RUN npm install --production=false

# Copy all source files
COPY . .

# Build the application
RUN npm run build:vite

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]