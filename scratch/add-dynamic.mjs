import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const targetDir = 'c:/Users/ASUS/Desktop/psb-app/src/app/api';

walkDir(targetDir, (filePath) => {
  if (filePath.endsWith('route.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove force-static if it somehow exists
    content = content.replace(/export\s+const\s+dynamic\s*=\s*['"]force-static['"];?/g, '');
    
    // Add force-dynamic if not exists
    if (!content.includes('force-dynamic')) {
      // Find the last import statement
      const importMatches = [...content.matchAll(/^import.*$/gm)];
      if (importMatches.length > 0) {
        const lastMatch = importMatches[importMatches.length - 1];
        const insertPos = lastMatch.index + lastMatch[0].length;
        
        content = content.slice(0, insertPos) + '\n\nexport const dynamic = "force-dynamic";\n' + content.slice(insertPos);
      } else {
        content = 'export const dynamic = "force-dynamic";\n\n' + content;
      }
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
    }
  }
});
