const fs = require('fs');
const path = require('path');

const files = [
  './public/index.html',
  './public/sw.js',
  './public/manifest.json'
];

console.log('\n📊 Bundle Size Analysis:\n');
files.forEach(file => {
  try {
    const stat = fs.statSync(file);
    const sizeKB = (stat.size / 1024).toFixed(2);
    console.log(`${path.basename(file).padEnd(20)}: ${sizeKB} KB`);
  } catch (e) {
    console.log(`${path.basename(file).padEnd(20)}: ❌ Not found`);
  }
});
console.log('\n');
