const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

// Extract the header and mobile drawer from index.html
function extractNavParts(html) {
  const topBarMatch = html.match(/<!-- Top Bar[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
  const headerMatch = html.match(/<header class="main-header">[\s\S]*?<\/header>/);
  const drawerMatch = html.match(/<div class="mobile-drawer"[^>]*>[\s\S]*?<\/div>\s*<\/div>/);
  const navMenuMatch = html.match(/<nav aria-label="Primary Navigation">[\s\S]*?<\/nav>/);
  return {
    topBar: topBarMatch ? topBarMatch[0] : null,
    header: headerMatch ? headerMatch[0] : null,
    drawer: drawerMatch ? drawerMatch[0] : null,
    navMenu: navMenuMatch ? navMenuMatch[0] : null
  };
}

const indexParts = extractNavParts(indexHtml);
console.log('index.html extracted:');
console.log('topBar found:', !!indexParts.topBar);
console.log('header found:', !!indexParts.header);
console.log('drawer found:', !!indexParts.drawer);
console.log('navMenu found:', !!indexParts.navMenu);

const files = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html'));
console.log('Total HTML files:', files.length);

const differences = [];

files.forEach(file => {
  if (file === 'index.html') return;
  const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
  const parts = extractNavParts(content);

  const diffs = [];
  if (!parts.navMenu) {
    diffs.push('NO_NAV_MENU');
  } else if (parts.navMenu !== indexParts.navMenu) {
    // Check key differences
    const indexHasJobsHub = indexParts.navMenu.includes('jobs-hub.html');
    const fileHasJobsHub = parts.navMenu.includes('jobs-hub.html');
    const indexHasTendersHub = indexParts.navMenu.includes('tenders-hub.html');
    const fileHasTendersHub = parts.navMenu.includes('tenders-hub.html');
    
    diffs.push(`NAV_DIFFERENT (jobs-hub: ${fileHasJobsHub}, tenders-hub: ${fileHasTendersHub}, lengthDiff: ${parts.navMenu.length - indexParts.navMenu.length})`);
  }

  if (diffs.length > 0) {
    differences.push({ file, diffs });
  }
});

console.log('Files with nav differences:', differences.length);
differences.forEach(d => console.log(`- ${d.file}: ${d.diffs.join(', ')}`));
