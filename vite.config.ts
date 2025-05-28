import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Custom plugin to copy service worker file to build directory
function copyServiceWorker() {
  return {
    name: 'copy-service-worker',
    closeBundle() {
      const srcPath = path.resolve(__dirname, 'service-worker.js');
      const destPath = path.resolve(__dirname, 'dist', 'service-worker.js');
      
      if (fs.existsSync(srcPath)) {
        // Create directory if it doesn't exist
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.copyFileSync(srcPath, destPath);
        console.log('Service worker copied to build directory');
      } else {
        console.error('Service worker file not found at:', srcPath);
      }
    }
  };
}

export default defineConfig({
  // Base public path when served from GitHub Pages under /ihahits/
  base: '/ihahits/',
  plugins: [react(), copyServiceWorker()]
});