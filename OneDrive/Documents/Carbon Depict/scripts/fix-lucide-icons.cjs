const fs = require('fs');
const path = require('path');

// List of all Lucide icons used in your project based on the errors
const icons = [
  'ArrowLeft', 'Factory', 'Zap', 'Globe', 'Building', 'Download', 'File',
  'Upload', 'Alert', 'Plus', 'User', 'Leaf', 'TrendingDown', 'Shield',
  'Check', 'Save', 'Info', 'TrendingUp', 'BookOpen', 'Cloud', 'Recycle',
  'BarChart3'
];

// Create regex pattern for all icons
const iconPattern = new RegExp(
  `<(${icons.join('|')})([^>]*?)>(?!\s*</)`,
  'g'
);

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace all unclosed icon tags with self-closing tags
    const newContent = content.replace(iconPattern, (match, iconName, attributes) => {
      modified = true;
      // Check if it already has a closing slash
      if (attributes.trim().endsWith('/')) {
        return match;
      }
      return `<${iconName}${attributes} />`;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir, fileCallback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other non-source directories
      if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
        walkDirectory(filePath, fileCallback);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
      fileCallback(filePath);
    }
  });
}

// Main execution
const srcDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve('src');
let fixedCount = 0;

console.log('🔍 Scanning for JSX files with Lucide icon errors...\n');

walkDirectory(srcDir, (filePath) => {
  if (fixFile(filePath)) {
    fixedCount++;
  }
});

console.log(`\n✨ Complete! Fixed ${fixedCount} files.`);
console.log('🚀 Your dev server should now work!');
