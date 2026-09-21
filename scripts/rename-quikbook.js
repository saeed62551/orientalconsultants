const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, '..'),
  path.join(__dirname, '..', '..', 'oriental-consultants')
];

dirs.forEach(targetDir => {
  if (!fs.existsSync(targetDir)) return;
  console.log(`Processing directory: ${targetDir}`);

  const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.html'));

  files.forEach(file => {
    const filePath = path.join(targetDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace "QuickBooks" -> "QuikBook"
    let updated = content.replace(/QuickBooks/g, 'QuikBook');
    // Replace "quickbooks" -> "quikbook"
    updated = updated.replace(/quickbooks/g, 'quikbook');
    // Replace "QUICKBOOKS" -> "QUIKBOOK"
    updated = updated.replace(/QUICKBOOKS/g, 'QUIKBOOK');

    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`Updated: ${file}`);
    }
  });

  // Also create quikbook.html from quickbooks.html if quickbooks.html exists
  const qbOld = path.join(targetDir, 'quickbooks.html');
  const qbNew = path.join(targetDir, 'quikbook.html');
  if (fs.existsSync(qbOld) && !fs.existsSync(qbNew)) {
    fs.copyFileSync(qbOld, qbNew);
    console.log(`Created: quikbook.html`);
  }
});

console.log('Finished renaming to QuikBook.');
