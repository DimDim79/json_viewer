# Project Structure

## Overview
JSON Content Viewer is a hybrid Electron/Web application built with React and TypeScript for viewing and searching large JSON files (150-250MB).

## Directory Structure
```
JSON_viewer/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── main.ts             # Entry point, IPC handlers, streaming
│   │   └── preload.ts          # Secure bridge between main/renderer
│   ├── renderer/               # React application
│   │   ├── components/         # React components
│   │   │   ├── FileUpload.tsx  # Drag-drop file upload (browser mode)
│   │   │   ├── SearchPanel.tsx # Search interface (4 search types)
│   │   │   ├── SearchResults.tsx # Paginated results display
│   │   │   └── RecordViewer.tsx # JSON viewer with highlighting
│   │   ├── utils/              # Utility functions
│   │   │   ├── electronAPI.ts  # API wrapper with browser fallback
│   │   │   └── webFileProcessor.ts # Browser JSON processing
│   │   ├── styles/             # CSS files
│   │   │   ├── index.css      # Global styles
│   │   │   └── App.css        # App-specific styles
│   │   ├── App.tsx            # Main React component
│   │   └── main.tsx           # React entry point
│   └── types/                  # TypeScript declarations
│       └── stream-json.d.ts    # Types for stream-json library
├── dist/                       # Build output (git ignored)
│   ├── main/                   # Compiled Electron files
│   └── renderer/               # Compiled React app
├── release/                    # Electron-builder output (git ignored)
├── node_modules/              # Dependencies (git ignored)
├── public/                     # Static assets
├── example/                    # Example JSON files for testing
│   └── Blaze_weekly_*.json    # Sample data files
├── knowledge_base/            # Project documentation
├── package.json               # Project configuration
├── tsconfig.json              # TypeScript config (renderer)
├── tsconfig.main.json         # TypeScript config (main process)
├── tsconfig.node.json         # TypeScript config (build tools)
├── vite.config.ts             # Vite bundler configuration
├── index.html                 # HTML template
├── CLAUDE.md                  # AI assistant instructions
├── Requirements_Document*.md   # Project requirements
└── Technology_Recommendations.md # Tech stack decisions
```

## Build Artifacts
- `dist/` - Compiled JavaScript and bundled React app
- `release/` - Platform-specific installers (.exe, .dmg, .AppImage)

## Configuration Files
- `package.json` - Dependencies, scripts, electron-builder config
- `tsconfig*.json` - TypeScript compiler settings
- `vite.config.ts` - Development server and build configuration