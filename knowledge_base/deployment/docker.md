# Docker Deployment Guide

## Overview
This guide covers deploying the JSON Viewer application using Docker, ideal for:
- Restricted environments where .exe files cannot run
- Shared deployment across multiple workstations
- Cross-platform compatibility

## Quick Start

### Using Docker Compose (Recommended)
```bash
docker-compose up -d
# Access at http://localhost:3000
```

### Using Docker CLI
```bash
docker build -t json-viewer .
docker run -d -p 3000:3000 --name json-viewer json-viewer
# Access at http://localhost:3000
```

### For Restricted Environments (No Docker)
If you can't use Docker but have Node.js:
```bash
npm install
npm run build:vite
npm run serve
# Access at http://localhost:3000
```

Or use the provided batch files:
- `start-web.bat` - Production server
- `start-dev.bat` - Development server

## Deployment Methods

### Method 1: Docker Image Distribution
```bash
# Save image
docker save json-viewer > json-viewer.tar

# Load on target machine
docker load < json-viewer.tar
docker run -d -p 3000:3000 json-viewer
```

### Method 2: Built Files Distribution
Share `dist/` folder and `server.js`. Recipients run:
```bash
npm install express
node server.js
```

### Method 3: Private Registry
```bash
# Push to registry
docker tag json-viewer your-registry.com/json-viewer:latest
docker push your-registry.com/json-viewer:latest

# Pull on target machines
docker pull your-registry.com/json-viewer:latest
docker run -d -p 3000:3000 your-registry.com/json-viewer:latest
```

## Container Management

### Basic Commands
```bash
# Status
docker ps

# Logs
docker logs json-viewer
docker-compose logs -f

# Stop/Start
docker stop json-viewer
docker start json-viewer
docker-compose down
docker-compose up -d

# Remove
docker rm json-viewer
```

### Port Configuration
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Change 8080 to desired port
```

Or with Docker CLI:
```bash
docker run -d -p 8080:3000 --name json-viewer json-viewer
```

## Features in Docker Mode
- Uses browser-based file processing
- Drag and drop JSON files
- No server-side file storage
- Supports files up to 250MB
- All processing in client browser

## System Requirements
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- 4GB RAM minimum
- Modern web browser

## Troubleshooting

### Build Issues
- **Slow first build**: Normal, downloads dependencies (3-5 min)
- **npm ci errors**: Run `npm install` locally first
- **Permission denied**: Run as Administrator/sudo

### Runtime Issues
- **Port in use**: Change port mapping
- **Cannot access**: Check firewall, try 127.0.0.1
- **Memory errors**: Increase Docker memory limits

### Security Notes
- Read-only application
- No server-side data persistence
- Client-side processing only
- No file uploads to container