# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important References

### Knowledge Base Documentation
- 📁 **Project Info**: `knowledge_base/project/`
  - `structure.md` - Directory layout and file purposes
  - `key-features.md` - Feature descriptions and implementation
  
- 🏗️ **Architecture**: `knowledge_base/architecture/`
  - `technical-decisions.md` - Technology choices and patterns
  
- 🚀 **Features**: `knowledge_base/features/`
  - `implemented.md` - Current working features
  - `future-ideas.md` - Roadmap and enhancements
  
- 💻 **Development**: `knowledge_base/development/`
  - `setup-guide.md` - Environment setup
  - `testing-guide.md` - Testing procedures
  - `troubleshooting.md` - Common issues and solutions
  
- 📦 **Deployment**: `knowledge_base/deployment/`
  - `docker.md` - Docker deployment guide

### Original Requirements
- **Requirements v2**: `Requirements_Document_v2.md` - Current requirements with technical details

## Project Overview

JSON Content Viewer - A dual-mode (desktop/web) application for viewing and searching large JSON files (150-250MB) containing customer scoring data. Built with Electron + React + TypeScript.

### Quick Reference
- **Primary Use**: Troubleshooting data ingestion issues
- **File Size**: Handles up to 250MB JSON files efficiently
- **Deployment**: Desktop app (Electron) or Web server (Node.js/Docker)
- **Search Types**: Contract Account (indexed), Key, Value, Key-Value pairs

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite + Electron)
- `npm run build` - Build production app
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run linter (to be configured)

### Running in Browser Mode (WSL/Linux)
If Electron won't run in WSL due to missing GUI libraries:
1. Run `npm run dev:vite` - Starts only the Vite server
2. Open `http://localhost:3000` in your Windows browser
3. Use the drag-and-drop file upload interface

### Implementation Status

✅ **Completed Features**:
- Dual-mode support (Electron desktop + Web browser)
- Large file handling with streaming (Electron) and Web Workers (Browser)
- All search types implemented with Contract Account indexing
- Full UI with Ant Design components
- Progress tracking and cancellation
- JSON viewer with syntax highlighting and in-record search

📍 **Current Architecture**:
- **Electron Mode**: Native file dialog + stream-json parser
- **Browser Mode**: Drag-and-drop + FileReader API
- **UI Framework**: React + TypeScript + Ant Design
- **Performance**: Handles 250MB files in 10-20 seconds


## Key Implementation Notes

1. **Performance Optimizations**:
   - Contract Account field is indexed on load (O(1) lookups)
   - Streaming parser in Electron prevents memory overload
   - Web Workers in browser mode for non-blocking processing

2. **Memory Limits**:
   - Current: 250MB file size limit
   - Future: See SQLite strategy in `knowledge_base/features/future-ideas.md` for 1GB+ support

3. **Search Performance**:
   - Contract Account: <100ms (indexed)
   - Other searches: 2-30 seconds depending on file size

## Quick Start

### Development
```bash
npm install
npm run dev:vite    # Browser mode (recommended for WSL)
npm run dev         # Full Electron mode
```

### Building
```bash
npm run build       # Build for development
npm run dist:win    # Create Windows installer
```

### Testing
See `knowledge_base/development/testing-guide.md` for comprehensive testing procedures.

## Troubleshooting

For common issues (build errors, Docker problems, etc.), see:
- `knowledge_base/development/troubleshooting.md`
- README.md Quick Start section