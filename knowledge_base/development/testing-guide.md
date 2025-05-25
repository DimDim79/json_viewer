# Testing Guide

## Test Data

### Sample Files Location
- `example/Blaze_weekly_20250513_001.json` - 166MB production sample
- Contains 50,443 records with real data structure

### JSON Structure
```json
[
  {
    "contractAccount": "300013144585",
    "decisionEnd": "2025-05-14T07:15:39.583",
    "derivations": {
      "other": { ... },
      "prep": { ... },
      "scorecard": { ... }
    },
    "risk": { ... },
    "riskClass": { ... },
    "segmentation": { ... }
  },
  // ... more records
]
```

## Manual Testing Checklist

### File Loading
- [ ] Drag and drop JSON file
- [ ] Click to browse for file
- [ ] Load 150MB+ file
- [ ] Load 250MB+ file (should show warning)
- [ ] Load non-JSON file (should reject)
- [ ] Load malformed JSON (should show error)
- [ ] Cancel file selection
- [ ] Load another file after one is loaded

### Search Functionality

#### Contract Account Search
- [ ] Search existing account: "300013144585"
- [ ] Search non-existent account: "999999999999"
- [ ] Verify instant response time
- [ ] Verify exact match only

#### Key Search
- [ ] Search common key: "behavioralKPI"
- [ ] Search nested key: "behKPIrange"
- [ ] Search partial key: "KPI"
- [ ] Case insensitive: "kpi" vs "KPI"
- [ ] Non-existent key: "foobar"

#### Value Search
- [ ] String value: "Active"
- [ ] Number value: "0.0"
- [ ] Large number: "999"
- [ ] Boolean: "true"
- [ ] Partial string: "act"
- [ ] Special characters: "-999.0"

#### Key-Value Search
- [ ] Common pair: key="accountStatus", value="Active"
- [ ] Numeric pair: key="behKPIrange", value="0.0"
- [ ] Nested pair: key="restructuringKPI", value="1.0"
- [ ] Non-matching pair: key="accountStatus", value="Deleted"

### Search Results
- [ ] Verify result count accuracy
- [ ] Test pagination (10, 20, 50, 100 per page)
- [ ] Click "View Record" on result
- [ ] Verify matched keys are shown
- [ ] Check search time display

### Record Viewer
- [ ] Open record from search results
- [ ] Verify JSON is properly formatted
- [ ] Search within record for "account"
- [ ] Verify search highlighting works
- [ ] Copy JSON to clipboard
- [ ] Close modal with X
- [ ] Close modal with Escape key
- [ ] Scroll through large record

### Performance Testing

#### Load Times
- 50MB file: < 5 seconds
- 100MB file: < 10 seconds
- 166MB file: < 20 seconds
- 250MB file: < 30 seconds

#### Search Performance
- Contract Account: < 100ms
- Key Search: < 5 seconds
- Value Search: < 10 seconds
- Key-Value: < 5 seconds

#### Memory Usage
Monitor in Task Manager/Activity Monitor:
- Initial load: ~200MB
- After file load: < 1GB
- During search: < 1.5GB
- Should stabilize after operations

### Edge Cases
- [ ] Empty JSON array: `[]`
- [ ] Single record: `[{...}]`
- [ ] Records without contractAccount
- [ ] Deeply nested objects (10+ levels)
- [ ] Very long string values
- [ ] Unicode characters in values
- [ ] Multiple files in sequence

### Browser Compatibility
Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on Mac)

### Responsive Design
- [ ] Full desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (not optimized, basic check)

## Automated Testing (Future)

### Unit Tests
```javascript
// Example test structure
describe('WebFileProcessor', () => {
  test('should parse JSON file correctly', async () => {
    const file = new File(['[{"test": "data"}]'], 'test.json')
    const result = await WebFileProcessor.processFile(file)
    expect(result.recordCount).toBe(1)
  })
})
```

### Integration Tests
- File upload flow
- Search workflows
- Record viewing flow

### E2E Tests
- Complete user journey
- Performance benchmarks
- Error scenarios

## Bug Reporting Template

```markdown
### Description
Brief description of the issue

### Steps to Reproduce
1. Load file X
2. Search for Y
3. Click Z

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Environment
- OS: Windows 11
- Browser: Chrome 120
- File size: 166MB
- Record count: 50,443

### Screenshots
If applicable
```