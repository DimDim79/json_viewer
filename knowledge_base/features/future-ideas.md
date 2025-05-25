# Future Feature Ideas

## High Priority Enhancements

### Performance Optimizations
- [ ] Web Worker implementation for search operations
- [ ] SQLite integration for persistent indexing
- [ ] Incremental search with result streaming
- [ ] Virtual scrolling for search results
- [ ] Memory usage warnings and limits

## Scaling to 1GB+ Files with SQLite

### Current Limitations with 1GB Files
- **Memory constraints**: Current in-memory approach loads entire parsed JSON, consuming 4-8GB RAM for 1GB files
- **Parse time**: Full file parsing takes 2-5 minutes for 1GB files
- **Search performance**: Non-indexed searches traverse entire dataset in memory
- **Browser limitations**: FileReader API struggles with files >500MB
- **Session persistence**: Reloading file required on each app restart

### SQLite-Based Solution Architecture

#### Core Concept
Replace in-memory storage with SQLite database for handling files >250MB:
1. Stream parse JSON file once
2. Insert records into SQLite with indexes
3. Use SQL queries for all search operations
4. Keep only visible records in memory

#### Database Schema Design
```sql
-- Main records table
CREATE TABLE records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_account TEXT,
    record_json TEXT,
    record_hash TEXT UNIQUE
);

-- Indexes for fast lookups
CREATE INDEX idx_contract_account ON records(contract_account);
CREATE INDEX idx_record_hash ON records(record_hash);

-- Key-value pairs for searching
CREATE TABLE key_values (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER,
    key_path TEXT,
    value_text TEXT,
    value_type TEXT,
    FOREIGN KEY(record_id) REFERENCES records(id)
);

-- Indexes for search operations
CREATE INDEX idx_key_path ON key_values(key_path);
CREATE INDEX idx_value_text ON key_values(value_text);
CREATE INDEX idx_record_key ON key_values(record_id, key_path);

-- File metadata
CREATE TABLE file_info (
    id INTEGER PRIMARY KEY,
    file_name TEXT,
    file_size INTEGER,
    record_count INTEGER,
    load_date TIMESTAMP,
    schema_version INTEGER
);
```

### Implementation Approach

#### Electron Mode
1. **Dependencies**: 
   - `better-sqlite3` for native SQLite bindings
   - Keep `stream-json` for parsing

2. **Process Flow**:
   ```typescript
   // Main process
   - User selects file
   - Create/open SQLite database in temp directory
   - Stream parse JSON with progress tracking
   - Batch insert records (1000 at a time)
   - Extract and index key-value pairs
   - Send completion signal to renderer
   
   // Renderer process
   - Execute SQL queries via IPC
   - Display paginated results
   - Cache recent queries
   ```

3. **Key Features**:
   - Database file persists between sessions
   - Multiple file support (different DBs)
   - Background indexing for new files
   - Query optimization with EXPLAIN

#### Browser Mode
1. **Dependencies**:
   - `sql.js` - SQLite compiled to WebAssembly
   - `localforage` for IndexedDB storage

2. **Process Flow**:
   ```typescript
   // Web Worker
   - Receive file chunks from main thread
   - Initialize sql.js with in-memory database
   - Parse JSON chunks progressively
   - Insert records in batches
   - Optionally persist to IndexedDB
   
   // Main Thread
   - Send SQL queries to worker
   - Receive paginated results
   - Update UI with progress
   ```

3. **Limitations**:
   - Slower than native SQLite
   - Limited by browser memory
   - Persistence requires IndexedDB (size limits)

### Performance Expectations

#### Load Times (1GB file)
- **Initial load**: 60-90 seconds
  - Parsing: 30-40 seconds
  - Indexing: 30-50 seconds
- **Subsequent loads**: <5 seconds (if DB cached)

#### Search Performance
- **Contract Account** (indexed): <100ms
- **Key search**: 200-500ms
- **Value search**: 1-3 seconds
- **Key-Value pairs**: 500ms-2s

#### Memory Usage
- **Electron**: 200-500MB (only SQLite + UI)
- **Browser**: 500MB-1GB (WASM overhead)

### Required Dependencies

```json
// Electron mode
"better-sqlite3": "^9.0.0",
"@types/better-sqlite3": "^7.6.0"

// Browser mode  
"sql.js": "^1.8.0",
"localforage": "^1.10.0",
"@types/sql.js": "^1.4.0"
```

### Migration Strategy

1. **Threshold-based approach**:
   - Files <250MB: Use current in-memory system
   - Files >250MB: Automatically use SQLite
   - User preference override option

2. **Gradual implementation**:
   ```typescript
   interface StorageBackend {
     loadFile(path: string): Promise<void>;
     searchContractAccount(value: string): Promise<SearchResult[]>;
     searchByKey(key: string): Promise<SearchResult[]>;
     searchByValue(value: string): Promise<SearchResult[]>;
     searchByKeyValue(key: string, value: string): Promise<SearchResult[]>;
   }
   
   class InMemoryBackend implements StorageBackend { /* current */ }
   class SQLiteBackend implements StorageBackend { /* new */ }
   ```

3. **Feature flags**:
   - Enable SQLite for testing
   - A/B test performance
   - Gradual rollout

4. **Data migration**:
   - Import existing indexed data
   - Convert search history format
   - Maintain backwards compatibility

### Additional Benefits
- **Persistent sessions**: Reload last file instantly
- **Advanced queries**: SQL enables complex filtering
- **Multiple files**: Compare data across files
- **Incremental updates**: Add new records without full reload
- **Export capabilities**: Direct SQL to CSV/Excel

### Search Enhancements
- [ ] Regular expression support
- [ ] Search history with autocomplete
- [ ] Saved searches / bookmarks
- [ ] JSONPath query support
- [ ] Search within search results
- [ ] Case sensitivity toggle

### Data Export
- [ ] Export search results to CSV
- [ ] Export selected records to new JSON file
- [ ] Copy formatted table data
- [ ] Generate summary reports
- [ ] Export to Excel format

## Medium Priority Features

### UI/UX Improvements
- [ ] Dark mode theme
- [ ] Customizable JSON formatting (indent size, colors)
- [ ] Keyboard shortcuts (Ctrl+F for search, etc.)
- [ ] Recent files list
- [ ] Pinned/favorite contract accounts
- [ ] Split view for comparing records

### Advanced Search
- [ ] Complex query builder UI
- [ ] Search templates for common queries
- [ ] Bulk search (multiple values at once)
- [ ] Search across multiple files
- [ ] Date range filtering
- [ ] Numeric range queries

### Data Visualization
- [ ] Tree view for JSON structure
- [ ] Statistics dashboard
- [ ] Data distribution charts
- [ ] Search result heatmap
- [ ] Relationship viewer

## Low Priority / Future Considerations

### Collaboration Features
- [ ] Shareable search links
- [ ] Comments on records
- [ ] Change tracking
- [ ] Export search sessions

### Integration Options
- [ ] Command-line interface
- [ ] REST API for searches
- [ ] Plugin system
- [ ] External tool integration

### Advanced Processing
- [ ] JSON Schema validation
- [ ] Data quality checks
- [ ] Automatic data type detection
- [ ] Compression support (.gz files)
- [ ] Streaming from remote URLs

## Technical Debt & Improvements

### Code Quality
- [ ] Comprehensive test suite
- [ ] E2E testing with Playwright
- [ ] Performance benchmarks
- [ ] Memory leak detection
- [ ] Code coverage reports

### Build & Deployment
- [ ] Auto-update functionality
- [ ] Code signing for releases
- [ ] Multi-platform builds (Mac, Linux)
- [ ] Portable version
- [ ] MSI installer option

### Developer Experience
- [ ] Hot module replacement for Electron
- [ ] Better TypeScript types
- [ ] API documentation
- [ ] Contributing guidelines
- [ ] Development mode tools