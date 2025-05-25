# JSON Content Viewer

A high-performance desktop and web application for viewing and searching large JSON files (150-250MB) containing customer scoring data. Designed for troubleshooting data ingestion issues.

## 📥 Installation

### Clone from GitHub
```bash
git clone https://github.com/DimDim79/json_viewer.git
cd json_viewer
npm install
```

## 🚀 Quick Start

### Option 1: Web Server (Recommended for restricted environments)
```bash
npm install
npm run build:vite
npm run serve
```
Or use the batch file: `start-web.bat`

### Option 2: Development Mode
```bash
npm install
npm run dev:vite
```
Or use the batch file: `start-dev.bat`

### Option 3: Electron Desktop App
```bash
npm install
npm run dev
```

### Option 4: Docker
```bash
docker-compose up -d
```
See [Docker deployment guide](knowledge_base/deployment/docker.md) for details.

## ✨ Features

- **Large File Support**: Handle JSON files up to 250MB efficiently
- **Fast Search**: 
  - Contract Account search (indexed, <100ms)
  - Key name search (partial match)
  - Value search (any data type)
  - Key-Value pair search
- **Smart Processing**:
  - Streaming parser for Electron mode
  - Web Worker processing for browser mode
  - Progress tracking with cancellation
- **User-Friendly Interface**:
  - Drag-and-drop file upload
  - JSON syntax highlighting
  - In-record search with highlighting
  - Copy to clipboard functionality

## 🛠️ Technology Stack

- **Framework**: Electron + React + TypeScript
- **UI Library**: Ant Design
- **Build Tool**: Vite
- **JSON Processing**: stream-json (Electron), FileReader API (Browser)
- **State Management**: React hooks

## 📁 Project Structure

```
/src
  /main         - Electron main process
  /renderer     - React application
    /components - UI components
    /hooks      - Custom React hooks
    /utils      - Utility functions
  /types        - TypeScript definitions
/knowledge_base - Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start Electron + React development
- `npm run dev:vite` - Start web-only development
- `npm run build` - Build for production
- `npm run serve` - Serve production build
- `npm run dist:win:portable` - Build portable Windows exe
- `npm run typecheck` - Run TypeScript type checking

## 📚 Documentation

- [Setup Guide](knowledge_base/development/setup-guide.md)
- [Testing Guide](knowledge_base/development/testing-guide.md) 
- [Docker Deployment](knowledge_base/deployment/docker.md)
- [Troubleshooting](knowledge_base/development/troubleshooting.md)
- [Architecture Decisions](knowledge_base/architecture/technical-decisions.md)

## 💡 Usage Tips

1. **For best performance**: Use Contract Account search when possible (it's indexed)
2. **Large files**: The app shows progress - be patient with 200MB+ files
3. **Memory usage**: Close other applications when processing very large files
4. **Browser mode**: Supports drag-and-drop, no file system access needed

## 🚧 Known Limitations

- Maximum file size: 250MB (current implementation)
- Memory usage: Up to 4GB for very large files
- Browser mode: Limited by browser memory constraints

## 🔮 Future Enhancements

See [future ideas](knowledge_base/features/future-ideas.md) for planned features including:
- SQLite backend for 1GB+ file support
- Export search results
- Search history
- Advanced filtering options

## 🚀 Deployment on Other Workstations

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DimDim79/json_viewer.git
   cd json_viewer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   - Windows: Double-click `start-web.bat`
   - Command line: `npm run serve`
   - Development: `npm run dev:vite`

## 📦 Example Files

Large example JSON files (>100MB) are not included in the repository due to GitHub size limits. Place your JSON files locally for testing.

## 🤝 Contributing

This is an internal tool. For questions or issues, please contact the development team.

## 📄 License

Internal use only - Public Power Corporation S.A.