@echo off
echo Starting JSON Viewer in Docker...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed. Please install Docker Desktop.
    echo Visit: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

REM Build and run with docker-compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo docker-compose not found, using docker directly...
    
    echo Building the application...
    docker build -t json-viewer .
    
    echo Starting the container...
    docker run -d -p 3000:3000 --name json-viewer --restart unless-stopped json-viewer
    
    echo.
    echo JSON Viewer is running!
    echo Open http://localhost:3000 in your browser
    echo.
    echo Useful commands:
    echo   - View logs: docker logs -f json-viewer
    echo   - Stop: docker stop json-viewer
    echo   - Restart: docker restart json-viewer
) else (
    echo Building the application...
    docker-compose build
    
    echo Starting the container...
    docker-compose up -d
    
    echo.
    echo JSON Viewer is running!
    echo Open http://localhost:3000 in your browser
    echo.
    echo Useful commands:
    echo   - View logs: docker-compose logs -f
    echo   - Stop: docker-compose down
    echo   - Restart: docker-compose restart
)

pause