import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Custom plugin to copy PWA files to build directory
function copyPwaFiles() {
  return {
    name: 'copy-pwa-files',
    closeBundle() {
      const filesToCopy = [
        'service-worker.js',
        'manifest.json',
        'icon-192.png',
        'icon-512.png'
      ];
      
      filesToCopy.forEach(file => {
        const srcPath = path.resolve(__dirname, file);
        const destPath = path.resolve(__dirname, 'dist', file);
        
        if (fs.existsSync(srcPath)) {
          // Create directory if it doesn't exist
          const dir = path.dirname(destPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied ${file} to build directory`);
        } else {
          console.error(`File not found at: ${srcPath}`);
        }
      });
    }
  };
}

export default defineConfig({
  // Base public path when served from GitHub Pages under /ihahits/
  base: '/ihahits/',
  plugins: [react(), copyPwaFiles()]
});