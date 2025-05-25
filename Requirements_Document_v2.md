**Requirements Document: JSON Content Viewer & Troubleshooting Tool**

**Version:** 2.0
**Date:** May 25, 2025
**Author/Analyst:** (Your AI Assistant)
**Stakeholder:** (Your Name/Department)

**1. Introduction**

*   **1.1. Purpose of this Document:**
    This document outlines the functional and non-functional requirements for a "JSON Content Viewer & Troubleshooting Tool." It is intended to provide a clear understanding of the tool's objectives, features, and constraints to guide its potential development or selection.
*   **1.2. Project Goal:**
    To develop or procure an easy-to-use and fast software tool for a single analyst to inspect the content of large JSON files (150MB-250MB each). These files originate from the "Blaze" customer scoring system and consist of a root-level array of complex objects (referred to as "record objects"). The primary purpose of the tool is to enable efficient verification of specific data values and the presence/absence of data structures, mainly for troubleshooting issues related to data ingestion into SAP ISU during UAT and production phases.
*   **1.3. Document Conventions:**
    *   FR: Functional Requirement
    *   NFR: Non-Functional Requirement
    *   NTH: Nice-to-Have (Future Consideration)

**2. Scope**

*   **2.1. In Scope:**
    *   Opening and processing large JSON files (150MB-250MB) structured as a root-level array of objects.
    *   Displaying individual record objects in a human-readable, pretty-printed format.
    *   Global search capabilities across all record objects in a file based on:
        *   Specific keys.
        *   Specific values.
        *   Specific key-value pairs (with `contractAccount` being a key unique identifier).
    *   Listing matching record objects (e.g., by their `contractAccount`) from global search results.
    *   Selecting a specific record object from search results for detailed viewing.
    *   In-record search functionality to find text within a currently displayed record object.
    *   Clear indication of search success or failure (presence/absence of data).
    *   Operation on a Windows 11 local machine with locally downloaded files.
    *   Progress indicators for long-running operations.
    *   Ability to cancel long-running searches.
*   **2.2. Out of Scope (for this initial version):**
    *   JSON Schema validation.
    *   Comparison between two different JSON files.
    *   Advanced business rule validation within the tool.
    *   Editing, modifying, or saving changes to the JSON files.
    *   Direct integration with the AIX server or SAP ISU systems.
    *   User authentication or multi-user access control.
    *   Reporting or data aggregation features beyond simple match counts.

**3. User Persona & Environment**

*   **3.1. User Persona:**
    *   **Role:** Department Analyst
    *   **Technical Proficiency:** Comfortable with both GUI and CLI tools. Possesses local administrator rights on their workstation.
    *   **Primary Task:** Efficiently open, navigate, search, and verify data within large JSON files to support data validation and troubleshooting.
*   **3.2. Operating Environment:**
    *   **Client Machine:** Windows 11 Laptop/Desktop.
    *   **Minimum RAM:** 8GB (16GB recommended)
    *   **Available Disk Space:** At least 2GB free space for temporary file processing
    *   **File Source:** JSON files are downloaded from an AIX server to the user's local machine for inspection.
    *   **Installation:** The tool can be an installable application.

**4. Functional Requirements (FR)**

*   **FR1: Large File Handling (Priority: High)**
    *   The tool must be able to open and begin processing JSON files (structured as a root-level array of objects) ranging from 150MB to 250MB without crashing or becoming unresponsive.
    *   The tool must employ efficient parsing techniques (e.g., streaming, incremental parsing, indexing) suitable for large array-based JSON structures to avoid loading the entire file into active memory at once if it compromises performance.
    *   The tool shall achieve an initial usable state (e.g., file loaded and ready for global search, or a count of top-level record objects displayed) within **10-20 seconds** of file selection.
    *   Expected constraints:
        *   Maximum 50,000 record objects per file
        *   Average record object size: 3-5KB
        *   Maximum single record object size: 50KB
*   **FR2: Data Viewing (Priority: High)**
    *   When a specific record object (an element from the root-level array) is selected for viewing, its **entire content** must be displayed in a human-readable, pretty-printed JSON format (clear indentation, key-value separation).
    *   Navigation (e.g., scrolling) within a large, displayed record object must be smooth and responsive.
    *   The tool must display the JSON path to any selected element within the record.
*   **FR3: Global Key-Based Search**
    *   The user must be able to perform a search for specific JSON keys *across all record objects* within the loaded file.
    *   The search should identify all record objects that contain the specified key at any level of nesting within them.
    *   Search must support:
        *   Case-sensitive and case-insensitive modes (default: case-insensitive)
        *   Partial key matching with wildcard support (e.g., "contract*" matches "contractAccount", "contractDate")
*   **FR4: Global Value-Based Search**
    *   The user must be able to perform a search for specific JSON values *across all record objects* within the loaded file.
    *   The search must allow for precise value matching, distinguishing between data types:
        *   String `"711"` vs. number `711`
        *   String `"null"` vs. null value
        *   String `"true"` vs. boolean `true`
        *   Numeric precision: exact match for integers, configurable precision for decimals
    *   Search must support:
        *   Partial string matching (substring search)
        *   Case-sensitive and case-insensitive modes for strings
    *   The search should identify all record objects that contain the specified value at any level of nesting within them.
*   **FR5: Global Key-Value Pair Search (Primary Search Method)**
    *   The user must be able to perform a search for specific key-value pairs *across all record objects* within the loaded file (e.g., find records where `contractAccount` is `"300013144585"`, or where a nested key `behKPIrange` is `0.0`).
    *   The `contractAccount` key is recognized as a unique identifier for each record object. Searches involving `contractAccount` should be optimized using indexing.
*   **FR6: Search Result Handling & Display**
    *   Upon completion of a global search (FR3, FR4, FR5), the tool must:
        *   Clearly indicate the total number of record objects that match the search criteria.
        *   If multiple record objects match, display a navigable list of the `contractAccount` values (or another pre-defined primary identifier) for each matching record object.
        *   Allow the user to select a `contractAccount` (or identifier) from this list. Upon selection, the tool will display the full content of the corresponding record object as per FR2.
        *   If only one record object matches the global search, its full content may be displayed directly as per FR2.
        *   Within the displayed content of a matching record object, the specific key(s) or key-value pair(s) that caused this record to be included in the global search results should be highlighted.
        *   Show the JSON path to each match within the record.
*   **FR7: Presence/Absence Check**
    *   The global search functionalities (FR3, FR4, FR5) must clearly indicate to the user if no record objects matching the search criteria are found within the file.
*   **FR8: In-Record Search/Navigation**
    *   Once a specific record object is fully displayed (as per FR2, typically after selection via FR6), the user must be able to perform a simple text search *within the content of that currently displayed single record object*.
    *   This search should help the user quickly locate specific keys or values within the displayed record, facilitating detailed inspection.
    *   Must support "Find Next/Previous" functionality to navigate between multiple matches.
*   **FR9: Search History**
    *   The tool must maintain a history of recent searches (last 20 searches) within the current session.
    *   Users should be able to quickly re-execute previous searches.
*   **FR10: Progress and Cancellation**
    *   All long-running operations must show a progress indicator with:
        *   Percentage complete (when determinable)
        *   Estimated time remaining
        *   Records processed count
    *   Users must be able to cancel any long-running operation without corrupting the application state.

**5. Non-Functional Requirements (NFR)**

*   **NFR1: Performance**
    *   **File Opening/Initial Load:** As specified in FR1 (usable state within 10-20 seconds).
    *   **Indexing:** Initial indexing of contractAccount fields should complete within 30 seconds for maximum file size.
    *   **Global Search Operations:** 
        *   Simple searches by indexed fields (e.g., contractAccount): < 2 seconds
        *   Complex searches across all data: < 30 seconds for 250MB files
        *   Search operations should use no more than 2GB of additional RAM
    *   **In-Record Search Operations:** Should be near-instantaneous (< 100ms).
    *   **UI Responsiveness:** The UI should remain responsive during file processing and search operations.
    *   **Memory Usage:** Total application memory usage should not exceed 4GB for maximum file size.
*   **NFR2: Usability**
    *   The tool must be intuitive and easy to use for the target analyst user with minimal training.
    *   Search inputs and result displays must be clear and unambiguous.
    *   Error messages must be user-friendly and actionable.
    *   Common operations should be accessible via keyboard shortcuts.
*   **NFR3: Operating Environment Compatibility**
    *   The tool must be fully compatible with Windows 11.
    *   It will operate on JSON files stored locally on the user's machine.
    *   Must support high-DPI displays.
*   **NFR4: Reliability & Stability**
    *   The tool must be stable and not crash or hang during normal operation with files within the specified size range and structure.
    *   Error handling:
        *   Gracefully handle files exceeding 250MB with appropriate user messaging
        *   Detect and report malformed JSON with specific error location
        *   Handle out-of-memory scenarios with data preservation
        *   Recover from partial file corruption when possible
*   **NFR5: Data Integrity**
    *   The tool must never modify the source JSON files.
    *   All viewing and searching operations must be read-only.

**6. User Interface (UI) Considerations**

*   **Recommended Approach:** Desktop GUI application (e.g., Electron-based) for optimal performance and native file system access.
*   **Key UI Elements:**
    *   File selection dialog with drag-and-drop support
    *   Search input area with search type selection
    *   Results list panel
    *   JSON viewer panel with syntax highlighting
    *   Status bar showing file info and operation progress
    *   Search history dropdown

**7. Technical Architecture Recommendations**

*   **Parsing Strategy:** Stream-based JSON parsing with indexing of key fields
*   **Storage:** Use temporary SQLite database for indexing large files
*   **Search Implementation:** 
    *   B-tree index for contractAccount field
    *   Full-text search index for value searching
    *   Background worker threads for search operations
*   **Memory Management:** 
    *   Virtual scrolling for large result sets
    *   Lazy loading of record details
    *   Automatic garbage collection triggers

**8. Assumptions**

*   The JSON files, while large, are generally well-formed and adhere to the structure of a root-level array of objects.
*   The `contractAccount` field is present in each record object in the array and serves as a unique identifier within a single file.
*   The user has sufficient permissions to install and run the tool on their Windows 11 machine.
*   The primary need is for read-only inspection; data modification is not required.

**9. Future Considerations / Nice-to-Haves (NTH)**
*(These are features that would add value but are not essential for the initial version.)*

*   **NTH1: Enhanced Pretty Printing:** Syntax highlighting, customizable indentation, and themes for displayed JSON.
*   **NTH2: Tree View Navigation:** For a selected record object, provide a collapsible/expandable tree view of its JSON structure.
*   **NTH3: Advanced Search Options:**
    *   Regular expression support for all search types.
    *   JSONPath query support.
*   **NTH4: Data Extraction:** 
    *   Copy full JSON of selected record to clipboard
    *   Export search results to CSV/Excel
    *   Export selected JSON paths to file
*   **NTH5: Configurable Context Display:** Option for global search to show a more limited context (e.g., just the parent object of a match, or the JSON path to the match) instead of the entire record object by default.
*   **NTH6: File Summary:** Display a brief summary upon loading a file (e.g., "File `[filename]` contains `X` records.").
*   **NTH7: Bookmarks:** Save frequently accessed contractAccounts or search queries.
*   **NTH8: Comparison Mode:** Basic comparison between two record objects.
*   **NTH9: Recent Files List:** Quick access to recently opened files with pinning capability.

**10. Success Criteria**

*   Tool successfully opens and processes 250MB JSON files within specified time limits
*   Search operations complete within performance requirements
*   Zero data corruption or modification of source files
*   Analyst can locate specific contractAccount records in under 30 seconds
*   Tool remains stable during 8-hour work sessions