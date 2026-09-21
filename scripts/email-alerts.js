/**
 * Oriental Consultants — Automated Audit, Consulting & IT/Cloud RFP/Job Alert Dispatcher
 *
 * Scans ACBAR (acbar.org) and Jobs.af feeds for:
 *   1. Audit & Financial Assurance RFPs / Tenders (Statutory audit, ISA 700/800, tax clearance, asset valuation)
 *   2. Management Consulting, Advisory & Third-Party Monitoring (TPM) Solicitations
 *   3. IT, Cloud, Google Workspace, Microsoft 365, Odoo ERP & Software RFPs / Tenders
 *   4. Audit, Financial Compliance & Consulting Hiring Vacancies
 *   5. IT, Software & Cloud Job Vacancies
 *
 * Recipients:
 *   To: sa_nsr@yahoo.com
 *   Cc: ocafghanistan@gmail.com
 *
 * Usage:
 *   node scripts/email-alerts.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const RECIPIENT_TO = 'sa_nsr@yahoo.com';
const RECIPIENT_CC = 'ocafghanistan@gmail.com';

// Target Keywords
const IT_KEYWORDS = [
  'it', 'software', 'google workspace', 'google', 'microsoft', 'office 365',
  'm365', 'cloud', 'erp', 'odoo', 'developer', 'hardware', 'network',
  'telecom', 'data center', 'server', 'ict', 'systems', 'infrastructure', 'fiber'
];

const AUDIT_KEYWORDS = [
  'audit', 'auditor', 'statutory', 'isa 700', 'isa 800', 'isa 805', 'ifrs',
  'financial reporting', 'internal control', 'tax', 'brt', 'withholding',
  'valuation', 'barcoding', 'asset verification', 'compliance', 'clearance'
];

const CONSULTING_KEYWORDS = [
  'consulting', 'consultant', 'advisory', 'tpm', 'third-party monitoring',
  'monitoring', 'evaluation', 'mel', 'eoi', 'proposal development',
  'grants manager', 'hris', 'quality assurance', 'supervision'
];

function loadJson(filename) {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  try {
    const raw = fs.readFileSync(filepath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.jobs || parsed.rfps || parsed.tenders || [];
  } catch (err) {
    console.error(`Error reading ${filename}:`, err.message);
    return [];
  }
}

function matchesKeywords(item, keywords) {
  const haystack = [
    item.title || '',
    item.org || '',
    item.sector || '',
    item.category || '',
    item.type || '',
    item.compliance || '',
    item.salary || ''
  ].join(' ').toLowerCase();

  return keywords.some(kw => {
    // Exact word or phrase boundary match
    const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, 'i');
    return regex.test(haystack);
  });
}

function generateAlert() {
  const acbarJobs = loadJson('acbar-jobs.json');
  const acbarRfps = loadJson('acbar-rfps.json');
  const jobsAf = loadJson('jobs-af.json');
  const jobsAfTenders = loadJson('jobs-af-tenders.json');
  const afghanTenders = loadJson('afghan-tenders.json');

  const allJobs = [
    ...acbarJobs.map(j => ({ ...j, source: 'ACBAR.org' })),
    ...jobsAf.map(j => ({ ...j, source: 'Jobs.af' }))
  ];

  const allTenders = [
    ...acbarRfps.map(t => ({ ...t, source: 'ACBAR.org' })),
    ...jobsAfTenders.map(t => ({ ...t, source: 'Jobs.af' })),
    ...afghanTenders.map(t => ({ ...t, source: 'AfghanTenders.com' }))
  ];

  // Categorize Tenders
  const auditTenders = allTenders.filter(t => matchesKeywords(t, AUDIT_KEYWORDS));
  const consultingTenders = allTenders.filter(t => matchesKeywords(t, CONSULTING_KEYWORDS) && !matchesKeywords(t, AUDIT_KEYWORDS));
  const itTenders = allTenders.filter(t => matchesKeywords(t, IT_KEYWORDS));

  // Categorize Jobs
  const auditConsultingJobs = allJobs.filter(j => matchesKeywords(j, AUDIT_KEYWORDS) || matchesKeywords(j, CONSULTING_KEYWORDS));
  const itJobs = allJobs.filter(j => matchesKeywords(j, IT_KEYWORDS));

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  console.log(`[Alert System] Identified:`);
  console.log(`  - Audit RFPs/Tenders: ${auditTenders.length}`);
  console.log(`  - Consulting & TPM RFPs: ${consultingTenders.length}`);
  console.log(`  - IT/Cloud RFPs/Tenders: ${itTenders.length}`);
  console.log(`  - Audit & Consulting Hiring Vacancies: ${auditConsultingJobs.length}`);
  console.log(`  - IT & Cloud Job Vacancies: ${itJobs.length}`);

  // Build HTML Email
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Audit, Consulting & IT/Cloud RFP & Job Alerts — Oriental Consultants</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f1f5f9; color: #0f172a; margin: 0; padding: 20px; -webkit-font-smoothing: antialiased; }
    .container { max-width: 720px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.07); }
    .header { background: linear-gradient(135deg, #001f3f 0%, #021226 100%); padding: 28px 24px; color: #ffffff; text-align: center; border-bottom: 3px solid #c29b38; }
    .header .tagline { font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
    .header h1 { margin: 0 0 8px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.4px; }
    .header .subtitle { font-size: 13px; color: #fef08a; font-weight: 500; }
    .content { padding: 24px 28px; }
    .greeting { font-size: 14px; line-height: 1.6; margin-top: 0; color: #334155; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 16px 0 24px 0; }
    .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
    .summary-box .num { font-size: 20px; font-weight: 800; color: #001f3f; }
    .summary-box .lbl { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-top: 2px; }
    .section-title { font-size: 14px; font-weight: 800; color: #001f3f; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 2px solid #c29b38; padding-bottom: 6px; margin: 24px 0 14px 0; display: flex; align-items: center; justify-content: space-between; }
    .section-title.blue { border-bottom-color: #0284c7; }
    .section-title.emerald { border-bottom-color: #059669; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; transition: border-color 0.2s; }
    .card:hover { border-color: #cbd5e1; }
    .badge { display: inline-block; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .badge-gold { color: #92400e; background: #fef3c7; border: 1px solid #fde68a; }
    .badge-emerald { color: #065f46; background: #d1fae5; border: 1px solid #a7f3d0; }
    .badge-blue { color: #0369a1; background: #e0f2fe; border: 1px solid #bae6fd; }
    .card-title { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; line-height: 1.4; }
    .card-meta { font-size: 12px; color: #475569; margin-bottom: 10px; line-height: 1.5; }
    .card-meta strong { color: #0f172a; }
    .deadline-highlight { color: #dc2626; font-weight: 800; }
    .btn { display: inline-block; background: #d97706; color: #ffffff !important; text-decoration: none; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 5px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .btn-blue { background: #0284c7; }
    .btn-emerald { background: #059669; }
    .btn-secondary { font-size: 11px; color: #0284c7; margin-left: 10px; font-weight: 700; text-decoration: none; }
    .callout { background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #0284c7; border-radius: 6px; padding: 14px 16px; margin: 24px 0 12px 0; font-size: 12px; line-height: 1.6; color: #1e3a8a; }
    .footer { background: #001f3f; color: #94a3b8; padding: 22px 24px; font-size: 12px; text-align: center; }
    .footer strong { color: #ffffff; }
    .footer a { color: #38bdf8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="tagline">Official Intelligence Feed &bull; ${today}</div>
      <h1>Audit, Consulting &amp; IT/Cloud Solicitations Digest</h1>
      <div class="subtitle">Statutory Audits &bull; Consulting / TPM &bull; Google Workspace &bull; M365 &bull; Odoo ERP</div>
    </div>

    <div class="content">
      <p class="greeting">
        Hello <strong>Saeed Anwar</strong>,<br>
        Here is your synchronized executive intelligence report on active <strong>Audit RFPs, Consulting Hiring, Third-Party Monitoring (TPM) Solicitations</strong>, and <strong>IT / Cloud / Software Opportunities</strong> across Afghanistan from <strong>ACBAR.org</strong> and <strong>Jobs.af</strong>:
      </p>

      <div class="summary-grid">
        <div class="summary-box">
          <div class="num" style="color:#d97706;">${auditTenders.length + consultingTenders.length}</div>
          <div class="lbl">Audit &amp; Consulting RFPs</div>
        </div>
        <div class="summary-box">
          <div class="num" style="color:#0284c7;">${itTenders.length}</div>
          <div class="lbl">IT / Cloud RFPs</div>
        </div>
        <div class="summary-box">
          <div class="num" style="color:#059669;">${auditConsultingJobs.length + itJobs.length}</div>
          <div class="lbl">Professional Vacancies</div>
        </div>
      </div>

      <!-- SECTION 1: AUDIT & FINANCIAL ASSURANCE RFPS -->
      <div class="section-title">
        <span>📡 1. Audit &amp; Financial Assurance RFPs (${auditTenders.length})</span>
      </div>
      ${auditTenders.map(t => `
        <div class="card">
          <span class="badge badge-gold">${t.source} &bull; Ref: ${t.id}</span>
          <div class="card-title">${t.title}</div>
          <div class="card-meta">
            <strong>Client:</strong> ${t.org} &bull; <strong>Coverage:</strong> ${t.location}<br>
            <strong>Standard:</strong> ${t.compliance} &bull; <span class="deadline-highlight">Deadline: ${t.deadline}</span>
          </div>
          <a href="${t.viewUrl}" target="_blank" class="btn">View RFP Details &rarr;</a>
          <a href="https://www.ocafghan.com/audit.html" target="_blank" class="btn-secondary">Audit Practice &rarr;</a>
        </div>
      `).join('')}

      <!-- SECTION 2: MANAGEMENT CONSULTING, ADVISORY & TPM RFPS -->
      <div class="section-title emerald">
        <span>🏢 2. Management Consulting &amp; TPM Solicitations (${consultingTenders.length})</span>
      </div>
      ${consultingTenders.map(t => `
        <div class="card">
          <span class="badge badge-emerald">${t.source} &bull; Ref: ${t.id}</span>
          <div class="card-title">${t.title}</div>
          <div class="card-meta">
            <strong>Client:</strong> ${t.org} &bull; <strong>Scope:</strong> ${t.location}<br>
            <strong>Framework:</strong> ${t.compliance} &bull; <span class="deadline-highlight">Deadline: ${t.deadline}</span>
          </div>
          <a href="${t.viewUrl}" target="_blank" class="btn btn-emerald">View Solicitation &rarr;</a>
          <a href="https://www.ocafghan.com/proposal-writing.html" target="_blank" class="btn-secondary">Advisory Support &rarr;</a>
        </div>
      `).join('')}

      <!-- SECTION 3: IT, CLOUD, GOOGLE WORKSPACE & SOFTWARE RFPS -->
      <div class="section-title blue">
        <span>💻 3. IT, Cloud &amp; Software Solicitations (${itTenders.length})</span>
      </div>
      ${itTenders.map(t => `
        <div class="card">
          <span class="badge badge-blue">${t.source} &bull; Ref: ${t.id}</span>
          <div class="card-title">${t.title}</div>
          <div class="card-meta">
            <strong>Entity:</strong> ${t.org} &bull; <strong>Location:</strong> ${t.location}<br>
            <strong>Technical Scope:</strong> ${t.compliance} &bull; <span class="deadline-highlight">Deadline: ${t.deadline}</span>
          </div>
          <a href="${t.viewUrl}" target="_blank" class="btn btn-blue">View Tender &rarr;</a>
          <a href="https://www.ocafghan.com/ict.html" target="_blank" class="btn-secondary">Cloud &amp; ICT Solutions &rarr;</a>
        </div>
      `).join('')}

      <!-- SECTION 4: AUDIT & CONSULTING HIRING VACANCIES -->
      <div class="section-title">
        <span>💼 4. Audit, Compliance &amp; Consulting Vacancies (${auditConsultingJobs.length})</span>
      </div>
      ${auditConsultingJobs.map(j => `
        <div class="card">
          <span class="badge badge-gold">${j.source} &bull; Ref: ${j.id}</span>
          <div class="card-title">${j.title}</div>
          <div class="card-meta">
            <strong>Organization:</strong> ${j.org} &bull; <strong>Duty Station:</strong> ${j.location}<br>
            <strong>Terms:</strong> ${j.type || j.salary || 'Full-Time'} &bull; <span style="color:#b45309; font-weight:700;">Closing: ${j.closingDate}</span>
          </div>
          <a href="${j.applyUrl}" target="_blank" class="btn">Apply / View Vacancy &rarr;</a>
        </div>
      `).join('')}

      <!-- SECTION 5: IT & SOFTWARE HIRING VACANCIES -->
      <div class="section-title blue">
        <span>💻 5. IT, Software &amp; Cloud Vacancies (${itJobs.length})</span>
      </div>
      ${itJobs.map(j => `
        <div class="card">
          <span class="badge badge-blue">${j.source} &bull; Ref: ${j.id}</span>
          <div class="card-title">${j.title}</div>
          <div class="card-meta">
            <strong>Organization:</strong> ${j.org} &bull; <strong>Duty Station:</strong> ${j.location}<br>
            <strong>Terms:</strong> ${j.type || j.salary || 'Full-Time'} &bull; <span style="color:#0284c7; font-weight:700;">Closing: ${j.closingDate}</span>
          </div>
          <a href="${j.applyUrl}" target="_blank" class="btn btn-blue">Apply / View Vacancy &rarr;</a>
        </div>
      `).join('')}

      <div class="callout">
        <strong>Bid Response &amp; Consortia Advisory:</strong><br>
        Oriental Consultants Afghanistan (Member Firm of PrimeGlobal USA) provides turnkey technical proposal drafting, compliance matrix modeling (Section L &amp; M), financial cost volumetrics, and ISA 700/800 statutory audit compliance.
      </div>
    </div>

    <div class="footer">
      <div>Dispatched to <strong>${RECIPIENT_TO}</strong> &bull; Cc: <strong>${RECIPIENT_CC}</strong></div>
      <div style="margin-top: 8px;">&copy; 2006 – 2026 Oriental Consultants Afghanistan. All rights reserved.</div>
      <div style="margin-top: 6px;">
        <a href="https://www.ocafghan.com/afghan-tenders.html">AfghanTenders (همه داوطلبی ها)</a> &bull;
        <a href="https://www.ocafghan.com/acbar-rfps.html">ACBAR RFPs</a> &bull;
        <a href="https://www.ocafghan.com/jobs-af-tenders.html">Jobs.af Tenders</a> &bull;
        <a href="https://www.ocafghan.com/acbar-jobs.html">ACBAR Jobs</a> &bull;
        <a href="https://www.ocafghan.com/jobs-af.html">Jobs.af Portal</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Write outputs
  const primaryOut = path.join(DATA_DIR, 'latest-rfp-job-alert.html');
  const fallbackOut = path.join(DATA_DIR, 'latest-it-alert.html');
  fs.writeFileSync(primaryOut, html);
  fs.writeFileSync(fallbackOut, html);
  console.log(`✓ Generated comprehensive digest saved to:`);
  console.log(`  - ${primaryOut}`);
  console.log(`  - ${fallbackOut}`);

  // SMTP Dispatch logic
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log(`Sending email via ${process.env.SMTP_HOST} to ${RECIPIENT_TO} (Cc: ${RECIPIENT_CC})...`);
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      transporter.sendMail({
        from: `"Oriental Consultants Alerts" <${process.env.SMTP_USER}>`,
        to: RECIPIENT_TO,
        cc: RECIPIENT_CC,
        subject: `[Daily Alert] Active Audit, Consulting & IT/Cloud RFPs & Jobs — ${today}`,
        html: html
      }, (err, info) => {
        if (err) {
          console.error('Failed to send email:', err.message);
        } else {
          console.log('✓ Email alert dispatched successfully:', info.messageId);
        }
      });
    } catch (e) {
      console.log('Nodemailer not installed or SMTP connection failed. Digest saved to data/latest-rfp-job-alert.html.');
    }
  } else {
    console.log(`Note: SMTP environment variables not configured. The complete HTML alert digest is saved to data/latest-rfp-job-alert.html.`);
    console.log(`Target: ${RECIPIENT_TO}, CC: ${RECIPIENT_CC}`);
  }
}

generateAlert();
