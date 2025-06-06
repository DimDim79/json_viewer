import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist/renderer')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist/renderer/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`JSON Viewer is running on http://localhost:${PORT}`);
  console.log('Open this URL in your browser to use the application');
});