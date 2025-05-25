#!/bin/bash

echo "🚀 Starting JSON Viewer in Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Build and run with docker-compose
if command -v docker-compose &> /dev/null; then
    echo "📦 Building the application..."
    docker-compose build
    
    echo "🏃 Starting the container..."
    docker-compose up -d
    
    echo "✅ JSON Viewer is running!"
    echo "🌐 Open http://localhost:3000 in your browser"
    echo ""
    echo "📋 Useful commands:"
    echo "  - View logs: docker-compose logs -f"
    echo "  - Stop: docker-compose down"
    echo "  - Restart: docker-compose restart"
else
    echo "⚠️  docker-compose not found, using docker directly..."
    
    echo "📦 Building the application..."
    docker build -t json-viewer .
    
    echo "🏃 Starting the container..."
    docker run -d -p 3000:3000 --name json-viewer --restart unless-stopped json-viewer
    
    echo "✅ JSON Viewer is running!"
    echo "🌐 Open http://localhost:3000 in your browser"
    echo ""
    echo "📋 Useful commands:"
    echo "  - View logs: docker logs -f json-viewer"
    echo "  - Stop: docker stop json-viewer"
    echo "  - Restart: docker restart json-viewer"
fi