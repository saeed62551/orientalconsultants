const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const files = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html'));

const desktopReplacement = `              <li class="dropdown-item"><a href="jobs-hub.html" style="font-weight: 700; color: #38bdf8;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> All Afghanistan Jobs Hub (ACBAR &amp; Jobs.af)</a></li>
              <li class="dropdown-item"><a href="tenders-hub.html" style="font-weight: 700; color: #fbbf24;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> All Afghanistan Tenders, RFPs &amp; Quotation Hub</a></li>`;

const mobileReplacement = `      <li><a href="jobs-hub.html" class="mobile-nav-link" style="color:#38bdf8; font-weight:700;">💼 All Afghanistan Jobs Hub (ACBAR &amp; Jobs.af)</a></li>
      <li><a href="tenders-hub.html" class="mobile-nav-link" style="color:#fbbf24; font-weight:700;">📑 All Afghanistan Tenders, RFPs &amp; Quotation Hub</a></li>`;

// Regex for desktop block: matches list items starting with afghan-tenders/acbar/jobs-af until Oriental Consultants Vacancies or similar
const desktopRegex = /<li class="dropdown-item"><a href="(?:afghan-tenders|acbar-jobs|acbar-rfps|jobs-af-tenders|jobs-af)\.html"[\s\S]*?<\/li>(?:\s*<li class="dropdown-item"><a href="(?:afghan-tenders|acbar-jobs|acbar-rfps|jobs-af-tenders|jobs-af)\.html"[\s\S]*?<\/li>)+/g;

// Regex for mobile block
const mobileRegex = /<li><a href="(?:afghan-tenders|acbar-jobs|acbar-rfps|jobs-af-tenders|jobs-af)\.html"[^>]*class="mobile-nav-link"[^>]*>[\s\S]*?<\/li>(?:\s*<li><a href="(?:afghan-tenders|acbar-jobs|acbar-rfps|jobs-af-tenders|jobs-af)\.html"[^>]*class="mobile-nav-link"[^>]*>[\s\S]*?<\/li>)+/g;

let updatedCount = 0;

for (const file of files) {
  if (file === 'jobs-hub.html' || file === 'tenders-hub.html') continue;
  const filePath = path.join(ROOT_DIR, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (desktopRegex.test(html)) {
    html = html.replace(desktopRegex, desktopReplacement);
    changed = true;
  }

  if (mobileRegex.test(html)) {
    html = html.replace(mobileRegex, mobileReplacement);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    updatedCount++;
    console.log(`Updated navigation in: ${file}`);
  }
}

console.log(`\nSuccessfully updated navigation in ${updatedCount} files.`);
