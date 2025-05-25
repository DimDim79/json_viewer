# Key Features

## Core Functionality

### 1. Large File Handling
- **Electron Mode**: Streaming JSON parser (stream-json) processes files without loading into memory
- **Browser Mode**: In-memory processing with progress tracking
- **Performance**: Handles 150-250MB files, loads 166MB file in ~3.6 seconds
- **Limitations**: Browser mode limited by available RAM

### 2. Dual Mode Architecture
- **Auto-detection**: Automatically detects Electron vs Browser environment
- **Electron Mode**: 
  - Native file dialogs
  - Streaming file processing
  - Better memory management
- **Browser Mode**: 
  - Drag-and-drop file upload
  - Web FileReader API
  - Cross-platform compatibility

### 3. Search Capabilities

#### Contract Account Search (Indexed)
- Pre-built index during file load
- O(1) lookup time
- Exact match only
- Primary use case for troubleshooting

#### Key Search
- Searches all nested object keys
- Case-insensitive partial matching
- Shows full path to matched keys
- Useful for finding specific data structures

#### Value Search
- Searches all values (strings, numbers, booleans)
- Type-aware comparison
- Case-insensitive for strings
- Partial match support

#### Key-Value Pair Search
- Find records where specific key = specific value
- Supports nested paths
- Exact value matching
- Common for business logic queries

### 4. Data Indexing
- Automatic contractAccount indexing on file load
- HashMap structure for O(1) lookups
- Progress tracking during indexing
- Memory-efficient storage

### 5. Record Viewer
- Pretty-printed JSON display
- Syntax highlighting with search term highlighting
- In-record search functionality
- Copy to clipboard support
- Modal overlay for focused viewing

### 6. User Interface
- Built with Ant Design components
- Responsive layout (mobile-friendly)
- Real-time progress indicators
- Pagination for search results
- Statistics dashboard

## Technical Implementation

### Streaming Architecture (Electron)
```javascript
fs.createReadStream(filePath)
  .pipe(parser())
  .pipe(streamArray())
  .on('data', processRecord)
```

### Memory Management
- Virtual scrolling for large result sets
- Lazy loading of record details
- Aggressive garbage collection
- Memory usage monitoring

### Search Optimization
- B-tree index for contractAccount
- Background processing in web workers
- Result streaming for progressive display
- Search result caching within session