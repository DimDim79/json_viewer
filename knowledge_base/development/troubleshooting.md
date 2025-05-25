# Troubleshooting Guide

## Build Issues

### NSIS Installer Error (Windows)
**Error**: `spawn EPERM` when running `npm run dist`

**Solutions**:
1. Use alternative build formats:
   ```bash
   npm run dist:win:portable  # Portable exe
   npm run dist:win:zip       # ZIP archive
   npm run dist:win:dir       # Directory output
   ```

2. Disable code signing in `package.json`:
   ```json
   "win": {
     "sign": false
   }
   ```

3. Run PowerShell as Administrator

### Docker Build Issues
**Error**: `npm ci` fails with package-lock mismatch

**Solution**: Update package-lock.json:
```bash
npm install
docker-compose build --no-cache
```

### WSL/Linux GUI Issues
**Error**: Electron fails to start in WSL

**Solution**: Use browser mode instead:
```bash
npm run dev:vite
# Access at http://localhost:3000
```

## Runtime Issues

### Port Already in Use
**Error**: Port 3000 is already in use

**Solutions**:
1. Find and kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -i :3000
   kill -9 <PID>
   ```

2. Use a different port:
   ```bash
   PORT=3001 npm run dev:vite
   ```

### Memory Issues with Large Files
**Error**: Browser tab crashes or becomes unresponsive

**Solutions**:
1. Increase browser memory limits
2. Process files in smaller chunks
3. Close other browser tabs
4. Use a 64-bit browser

### File Upload Not Working
**Error**: Drag and drop doesn't respond

**Solutions**:
1. Ensure file is valid JSON
2. Check browser console for errors
3. Try clicking to select file instead
4. Verify file size < 250MB

## Development Issues

### TypeScript Errors
Run type checking:
```bash
npm run typecheck
```

### Module Resolution Errors
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Vite HMR Not Working
1. Check if port 5173 is blocked
2. Disable browser extensions
3. Clear browser cache
4. Try incognito mode

## Deployment Issues

### Docker Container Won't Start
Check logs:
```bash
docker logs json-viewer
docker-compose logs
```

### Can't Access Application
1. Check firewall settings
2. Try http://127.0.0.1:3000 instead of localhost
3. Ensure Docker container is running
4. Verify port mapping is correct

## Browser Compatibility

### Minimum Requirements
- Chrome 80+
- Firefox 75+
- Edge 80+
- Safari 13+

### Known Issues
- IE11 not supported
- Some Safari versions have file API limitations
- Mobile browsers may have memory constraints