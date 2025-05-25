# Technical Architecture Decisions

## Technology Stack Rationale

### Core Framework: Electron
**Decision**: Use Electron for desktop application
**Rationale**:
- Native file system access without browser restrictions
- Better memory management for large files
- Cross-platform compatibility
- Ability to use Node.js modules (streaming)
**Trade-offs**:
- Larger application size (~80-100MB)
- Additional complexity vs pure web app

### Frontend: React with TypeScript
**Decision**: React 19 + TypeScript
**Rationale**:
- Component reusability
- Strong typing reduces bugs
- Large ecosystem
- Team familiarity
**Alternatives Considered**:
- Vue.js - Less ecosystem support
- Vanilla JS - Too much boilerplate
- Angular - Overkill for this project

### UI Library: Ant Design
**Decision**: antd v5
**Rationale**:
- Comprehensive component set
- Professional appearance
- Built-in accessibility
- Virtual scrolling support
**Trade-offs**:
- Large bundle size
- Opinionated styling

### Build Tool: Vite
**Decision**: Vite over Webpack/CRA
**Rationale**:
- Faster development builds
- Better ES module support
- Simpler configuration
- Native TypeScript support

### JSON Processing: stream-json
**Decision**: stream-json for Electron mode
**Rationale**:
- True streaming parser
- Memory efficient
- Event-based for progress tracking
- Handles files larger than available RAM

## Architectural Patterns

### Dual Mode Architecture
```
┌─────────────────┐     ┌─────────────────┐
│  Electron Mode  │     │  Browser Mode   │
├─────────────────┤     ├─────────────────┤
│ Native File API │     │ File Upload API │
│ Stream Processing│     │ FileReader API  │
│ Node.js Backend │     │ In-Memory Parse │
└─────────────────┘     └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────────────┐
              │ React UI     │
              │ Shared Logic │
              └──────────────┘
```

### State Management
**Decision**: Local component state with prop drilling
**Rationale**:
- Application is relatively simple
- No complex state synchronization
- Easier to understand and debug
**Future**: Consider Zustand if complexity grows

### Search Architecture
```
User Input → Search Type Detection → Index Check (if contractAccount)
                                          ↓
                                   Direct Lookup (O(1))
                                          ↓
Browser: Full File Scan ←──────── Not Indexed
Electron: Stream Scan                     ↓
                                   Progressive Results
```

### IPC Communication
**Pattern**: Command/Query separation
- Commands: openFile, processFile
- Queries: getFileInfo, searchRecords
- Events: progress updates

## Performance Optimizations

### Indexing Strategy
- Build contractAccount index during initial file load
- Trade-off: Slightly slower initial load for instant lookups
- Memory cost: ~200 bytes per record

### Memory Management
- Stream processing in Electron mode
- Chunked processing in browser mode
- Lazy loading of record details
- Aggressive garbage collection hints

### Search Optimization
- Early termination for contractAccount searches
- Parallel processing consideration for future
- Result pagination to limit DOM nodes

## Security Considerations

### Electron Security
- Context isolation enabled
- Node integration disabled
- Preload script for safe IPC
- No remote module usage

### Content Security
- No external resource loading
- No eval() or dynamic code execution
- Sanitized file paths
- Read-only file access

## Scalability Considerations

### File Size Limits
- Electron: Theoretically unlimited (streaming)
- Browser: ~250MB practical limit
- Future: Consider chunked file reading

### Record Count Limits
- Current: Tested with 50k records
- Theoretical: 500k+ with optimizations
- Bottleneck: Browser memory and DOM rendering