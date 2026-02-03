#!/usr/bin/env node
/**
 * Check EXIF data in image files
 * Usage: node check-exif.js <image-path> or node check-exif.js <folder>
 */

const fs = require('fs');
const path = require('path');
const ExifParser = require('exif-parser');

function checkFile(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const parser = new ExifParser.create(buffer);
    const result = parser.parse();
    
    if (result.tags) {
      console.log(`\n✅ EXIF data found in: ${path.basename(filePath)}`);
      console.log('  ISO:', result.tags.ISO);
      console.log('  F-Number:', result.tags.FNumber);
      console.log('  Exposure Time:', result.tags.ExposureTime);
      console.log('  Lens Model:', result.tags.LensModel);
      console.log('  Camera Model:', result.tags.Model);
      console.log('  Date:', result.tags.DateTime);
      return true;
    } else {
      console.log(`\n❌ No EXIF data found in: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return false;
  }
}

function checkFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|tiff?)$/i.test(f));
  
  if (imageFiles.length === 0) {
    console.log('No image files found in folder');
    return;
  }
  
  console.log(`Checking ${imageFiles.length} image files...`);
  imageFiles.forEach(file => {
    checkFile(path.join(folderPath, file));
  });
}

const targetPath = process.argv[2];
if (!targetPath) {
  console.log('Usage: node check-exif.js <image-file-or-folder>');
  process.exit(1);
}

const fullPath = path.resolve(targetPath);
const stats = fs.statSync(fullPath);

if (stats.isDirectory()) {
  checkFolder(fullPath);
} else {
  checkFile(fullPath);
}
