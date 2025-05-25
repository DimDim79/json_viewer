# Deployment Guide for JSON Content Viewer

## 🚀 Quick Start for End Users

### Prerequisites
- Node.js 18+ installed
- Git (optional, for updates)

### Installation Steps

1. **Download the application:**
   ```bash
   git clone https://github.com/DimDim79/json_viewer.git
   cd json_viewer
   ```
   
   Or download as ZIP from: https://github.com/DimDim79/json_viewer/archive/refs/heads/main.zip

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   - **Windows:** Double-click `start-web.bat`
   - **Command line:** `npm run serve`
   - **Development mode:** `npm run dev:vite`

4. **Access the application:**
   - Open http://localhost:3000 in your browser
   - Drag and drop your JSON files

## 📦 Deployment Options

### Option 1: Simple Deployment (Recommended)
Best for workstations with internet access:
```bash
git clone https://github.com/DimDim79/json_viewer.git
cd json_viewer
npm install
start-web.bat
```

### Option 2: Pre-built Package
For restricted environments without internet:

**On build machine:**
```bash
git clone https://github.com/DimDim79/json_viewer.git
cd json_viewer
npm install
npm run build:vite
```

**Create deployment package:**
1. Create folder `json-viewer-portable`
2. Copy these files/folders:
   - `dist/` folder
   - `server.js`
   - `package.json`
   - `start-web.bat`

**On target workstation:**
1. Copy the `json-viewer-portable` folder
2. Install Node.js if not present
3. Run:
   ```bash
   cd json-viewer-portable
   npm install express
   start-web.bat
   ```

### Option 3: Docker Deployment
For environments with Docker:
```bash
git clone https://github.com/DimDim79/json_viewer.git
cd json_viewer
docker-compose up -d
```
Access at http://localhost:3000

### Option 4: Shared Network Drive
1. Build once on admin machine
2. Copy to network drive: `\\server\apps\json-viewer\`
3. Users run: `\\server\apps\json-viewer\start-web.bat`

## 🔄 Updating the Application

### With Git (Recommended)
```bash
cd json_viewer
git pull origin main
npm install
npm run build:vite
```

### Without Git
1. Download latest ZIP from GitHub
2. Extract and replace files
3. Run `npm install` and `npm run build:vite`

## 🛠️ Troubleshooting

### Port 3000 is already in use
- Close other applications using port 3000
- Or modify `server.js` to use a different port

### Application won't start
1. Verify Node.js is installed: `node --version`
2. Check for errors: `npm run serve`
3. Ensure all files were copied correctly

### Performance issues
- Close unnecessary browser tabs
- Ensure sufficient RAM (4GB minimum)
- Use production build, not development mode

## 📋 System Requirements

### Minimum
- Windows 10, macOS 10.15, or Ubuntu 18.04
- Node.js 18+
- 4GB RAM
- Modern browser (Chrome, Firefox, Edge)

### Recommended
- 8GB RAM for files over 100MB
- SSD for better performance
- Latest browser version

## 🔒 Security Notes

- Application runs locally only
- No data is sent to external servers
- Files are processed in your browser
- Safe for sensitive data

## 📞 Support

For issues or questions:
1. Check the [troubleshooting guide](knowledge_base/development/troubleshooting.md)
2. Review [known limitations](README.md#-known-limitations)
3. Contact your IT administrator