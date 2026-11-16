const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

const files = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html'));

const results = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
  results.push({
    file,
    hasTopBar: content.includes('class="top-bar"'),
    hasMainHeader: content.includes('class="main-header"'),
    hasMobileDrawer: content.includes('id="mobileDrawer"'),
    hasPrimaryNav: content.includes('aria-label="Primary Navigation"')
  });
});

console.log(JSON.stringify(results, null, 2));
