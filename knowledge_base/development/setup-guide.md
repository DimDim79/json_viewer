# Development Setup Guide

## Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher  
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Platform-Specific Requirements

#### Windows Development
- Windows 10/11
- Visual Studio Build Tools (for native modules)
- Windows SDK (comes with VS Build Tools)

#### WSL/Linux Development
- For Electron GUI: `sudo apt-get install libgtk-3-0 libnotify-dev libnss3 libxss1 libasound2`
- Alternative: Use browser mode only

#### macOS Development
- Xcode Command Line Tools
- macOS 10.15 or higher

## Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/DimDim79/json_viewer.git
cd json_viewer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Modes

#### Browser-Only Mode (Recommended for WSL)
```bash
npm run dev:vite
# Open http://localhost:3000 in browser
```

#### Full Electron Mode
```bash
npm run dev
# Opens Electron app with hot reload
```

## Build Commands

### Development
- `npm run dev` - Start Electron + Vite dev servers
- `npm run dev:vite` - Start only Vite (browser mode)
- `npm run dev:electron` - Start only Electron

### Production Build
- `npm run build` - Build both main and renderer
- `npm run build:vite` - Build renderer only
- `npm run build:electron` - Build main process only

### Distribution
- `npm run dist` - Create installer for current OS
- `npm run dist:win` - Create Windows installer
- `npm run dist:mac` - Create macOS installer
- `npm run dist:linux` - Create Linux installer

### Code Quality
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint (when configured)
- `npm test` - Run tests (when implemented)

## Project Configuration

### TypeScript Configs
- `tsconfig.json` - Renderer process config
- `tsconfig.main.json` - Main process config
- `tsconfig.node.json` - Build tools config

### Important Files
- `vite.config.ts` - Vite bundler settings
- `package.json` - Dependencies and scripts
- `.gitignore` - Excluded files
- `CLAUDE.md` - AI assistant context

## Common Development Tasks

### Adding a New Component
1. Create component in `src/renderer/components/`
2. Follow existing naming conventions
3. Include TypeScript types
4. Export from index if needed

### Adding a New IPC Handler
1. Add handler in `src/main/main.ts`
2. Expose in `src/main/preload.ts`
3. Add types to window interface
4. Use in renderer via `window.electronAPI`

### Modifying Search Logic
1. Browser: Edit `src/renderer/utils/webFileProcessor.ts`
2. Electron: Add handlers in `src/main/main.ts`
3. Update types in components

## Debugging

### Browser DevTools
- Automatically opens in development
- Access via View → Toggle Developer Tools
- Use React DevTools extension

### Main Process Debugging
```bash
# Add to package.json dev:electron script
--inspect=5858
# Then attach VS Code debugger
```

### Performance Profiling
1. Chrome DevTools Performance tab
2. React Profiler for component renders
3. Memory snapshots for leak detection

## Troubleshooting

### Common Issues

#### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Electron won't start (WSL)
- Use browser mode: `npm run dev:vite`
- Or install Linux GUI libraries

#### Build failures
- Check Node.js version
- Clear dist folder
- Verify all TypeScript errors fixed

#### Large file performance
- Ensure using production build
- Check available system memory
- Monitor browser console for errors

## Deployment to Other Workstations

### Quick Deployment Steps
1. **Clone from GitHub:**
   ```bash
   git clone https://github.com/DimDim79/json_viewer.git
   cd json_viewer
   npm install
   ```

2. **Run the application:**
   - Windows: Double-click `start-web.bat`
   - Command line: `npm run serve`
   - Development: `npm run dev:vite`

### For IT Administrators
To deploy without requiring npm install on each workstation:

1. **Pre-build on one machine:**
   ```bash
   git clone https://github.com/DimDim79/json_viewer.git
   cd json_viewer
   npm install
   npm run build:vite
   ```

2. **Create deployment package:**
   - Copy `dist/` folder
   - Copy `server.js`
   - Copy `package.json` (minimal version)
   
3. **On target workstations:**
   - Install Node.js
   - Copy deployment package
   - Run: `npm install express && node server.js`

### Keeping Updated
```bash
# On any workstation with git
git pull origin main
npm install  # Only if dependencies changed
npm run build:vite
```