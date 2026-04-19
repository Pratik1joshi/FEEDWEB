const fs = require('fs');
let c = fs.readFileSync('app/admin/news/add/page.jsx', 'utf8');
const lines = c.split('\n');
let newLines = [];
let skip = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Author Title')) {
    skip = true;
    newLines.pop(); // remove <div>
    newLines.pop(); 
  }
  if (skip && lines[i].includes('</div') && lines[i].includes('              </div>')) {
    // End of block it seems, wait no we just want to skip to excerpt
  }
}
