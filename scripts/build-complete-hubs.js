const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

// Read source files
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const acbarJobs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'acbar-jobs.json'), 'utf8')).jobs || [];
const jobsAf = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'jobs-af.json'), 'utf8')).jobs || [];
const afghanTenders = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'afghan-tenders.json'), 'utf8')).tenders || [];
const acbarRfps = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'acbar-rfps.json'), 'utf8')).rfps || [];
const jobsAfTenders = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'jobs-af-tenders.json'), 'utf8')).tenders || [];

// Find boundary points in index.html
const mainStartTag = '<main id="main-content">';
const mainStartIndex = indexHtml.indexOf(mainStartTag);
const footerStartTag = '<footer class="main-footer">';
const footerStartIndex = indexHtml.indexOf(footerStartTag);

// Pre-main (Head, Top Bar, Header, Mobile Nav)
let preMainTemplate = indexHtml.substring(0, mainStartIndex);

// Post-main (Footer, Floating buttons, Scripts)
let postMainTemplate = indexHtml.substring(footerStartIndex);

// Helper to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// -----------------------------------------------------------------
// Extra CSS for directory cards & portal toolbar
// -----------------------------------------------------------------
const extraStyles = `
  <style>
    .portal-banner {
      background: linear-gradient(135deg, #001f3f 0%, #021226 60%, #002855 100%);
      color: #ffffff;
      padding: 2rem 0;
      border-bottom: 1px solid rgba(2, 132, 199, 0.3);
      position: relative;
      z-index: 2;
    }
    .portal-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
    }
    .portal-tabs {
      display: inline-flex;
      background: rgba(255, 255, 255, 0.08);
      padding: 4px;
      border-radius: var(--radius-full);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .portal-tab-btn {
      padding: 0.5rem 1.25rem;
      border-radius: var(--radius-full);
      font-size: 0.88rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
    }
    .portal-tab-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.12);
    }
    .portal-tab-btn.active {
      background: var(--accent-gold);
      color: #001f3f;
      box-shadow: 0 2px 8px rgba(217, 119, 6, 0.35);
    }

    .jobs-directory-section, .tenders-directory-section {
      padding: 3rem 0 5rem 0;
      background: var(--bg-primary);
      position: relative;
    }
    .hub-notice-card {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-left: 4px solid #0284c7;
      border-radius: var(--radius-md);
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      color: #1e3a8a;
    }
    .hub-filters-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: var(--shadow-sm);
    }
    .hub-filter-grid {
      display: grid;
      grid-template-columns: 2fr 1.1fr 1.1fr 1fr auto;
      gap: 1rem;
      align-items: end;
    }
    @media (max-width: 992px) {
      .hub-filter-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 600px) {
      .hub-filter-grid {
        grid-template-columns: 1fr;
      }
    }
    .job-card-row, .tender-card-row {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem 1.75rem;
      margin-bottom: 1.25rem;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1.5rem;
      align-items: center;
      transition: all 0.25s ease;
      box-shadow: var(--shadow-xs);
    }
    .job-card-row:hover, .tender-card-row:hover {
      border-color: var(--accent-blue);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    .job-org-badge, .tender-org-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--brand-bright);
      background: rgba(2, 132, 199, 0.08);
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-sm);
    }
    .job-row-title, .tender-row-title {
      font-size: 1.22rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0.25rem 0 0.5rem 0;
      line-height: 1.35;
    }
    .job-row-meta, .tender-row-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.25rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .job-meta-item, .tender-meta-item {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .job-closing-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: #d97706;
      background: #fef3c7;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-sm);
    }
    .tender-closing-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: #b91c1c;
      background: #fee2e2;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-sm);
    }
    .job-action-col, .tender-action-col {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 175px;
    }
    @media (max-width: 768px) {
      .job-card-row, .tender-card-row {
        grid-template-columns: 1fr;
      }
      .job-action-col, .tender-action-col {
        flex-direction: row;
        width: 100%;
      }
      .job-action-col .btn, .tender-action-col .btn {
        flex: 1;
      }
    }
  </style>
`;

// Insert extra styles before </head>
preMainTemplate = preMainTemplate.replace('</head>', extraStyles + '\n</head>');

// Ensure portal-sync.js is included in postMainTemplate
if (!postMainTemplate.includes('js/portal-sync.js')) {
  postMainTemplate = postMainTemplate.replace('<script src="js/main.js"></script>', '<script src="js/main.js"></script>\n  <script src="js/portal-sync.js"></script>');
}

// -------------------------------------------------------------
// 1. GENERATE JOBS-HUB.HTML
// -------------------------------------------------------------
function generateJobsHubHtml() {
  const allJobs = [];

  acbarJobs.forEach(j => {
    allJobs.push({
      id: j.id,
      title: j.title,
      org: j.org,
      location: j.location,
      sector: j.sector || 'audit',
      locationCode: j.locationCode || 'kabul',
      type: j.type || 'Full-Time',
      closingDate: j.closingDate || 'Open',
      applyUrl: j.applyUrl || 'https://www.acbar.org/en/jobs',
      source: 'acbar',
      sourceLabel: 'ACBAR.org Verified',
      sourceColor: '#0284c7',
      sourceBg: 'rgba(2, 132, 199, 0.1)'
    });
  });

  jobsAf.forEach(j => {
    allJobs.push({
      id: j.id,
      title: j.title,
      org: j.org,
      location: j.location,
      sector: j.category || 'audit',
      locationCode: j.locationCode || 'kabul',
      type: j.salary ? `Full-Time • ${j.salary}` : 'Full-Time',
      closingDate: j.closingDate || 'Open',
      applyUrl: j.applyUrl || 'https://jobs.af/public/job',
      source: 'jobsaf',
      sourceLabel: 'Jobs.af Verified',
      sourceColor: '#0ea5e9',
      sourceBg: 'rgba(14, 165, 233, 0.1)'
    });
  });

  const cardsHtml = allJobs.map(job => {
    const isAcbar = job.source === 'acbar';
    const sourceIcon = isAcbar
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
      : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
    const btnLabel = isAcbar ? 'Apply on ACBAR &rarr;' : 'Apply on Jobs.af &rarr;';

    return `
        <!-- Job Card: ${escapeHtml(job.id)} -->
        <div class="job-card-row" data-source="${job.source}" data-sector="${job.sector}" data-location="${job.locationCode}">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
              <span class="source-tag" style="background: ${job.sourceBg}; color: ${job.sourceColor}; border: 1px solid ${job.sourceColor}33; padding: 0.2rem 0.55rem; border-radius: 4px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem;">
                ${sourceIcon}
                ${job.sourceLabel}
              </span>
              <div class="job-org-badge" style="margin-bottom: 0;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                ${escapeHtml(job.org)} &bull; Ref: ${escapeHtml(job.id)}
              </div>
            </div>
            <h3 class="job-row-title">${escapeHtml(job.title)}</h3>
            <div class="job-row-meta">
              <span class="job-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${escapeHtml(job.location)}
              </span>
              <span class="job-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${escapeHtml(job.type)}
              </span>
              <span class="job-closing-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                Closing: ${escapeHtml(job.closingDate)}
              </span>
            </div>
          </div>
          <div class="job-action-col">
            <a href="${escapeHtml(job.applyUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm" style="font-weight: 800; text-align: center;">
              ${btnLabel}
            </a>
            <a href="careers.html#applyForm" class="btn btn-outline btn-sm" style="font-size: 0.78rem; text-align: center;">
              OC Talent Pool
            </a>
          </div>
        </div>`;
  }).join('\n');

  // Customize pre-main for Jobs Hub
  let headAndNav = preMainTemplate
    .replace(/<title>[\s\S]*?<\/title>/, '<title>All Afghanistan Jobs Hub • ACBAR &amp; Jobs.af Unified Directory | Oriental Consultants</title>')
    .replace(/<meta name="description"[\s\S]*?>/, '<meta name="description" content="All Afghanistan Jobs Hub: Unified national employment directory combining verified humanitarian, NGO, UN, and commercial career openings from ACBAR.org and Jobs.af across Afghanistan.">')
    .replace(/<link rel="canonical"[\s\S]*?>/, '<link rel="canonical" href="https://www.ocafghan.com/jobs-hub.html">');

  const mainContent = `
  <main id="main-content">
    <!-- ==========================================================================
         HERO SECTION: UNIQUE HERO WITH SLIDERS & LIVE TICKER
         ========================================================================== -->
    <section class="unique-hero" id="home">
      <!-- Architectural Background Accents -->
      <div class="hero-bg-grid"></div>
      <div class="hero-accent-line-right"></div>
      <div class="hero-accent-line-left"></div>

      <div class="hero-shell">
        <div class="hero-grid-split">
          
          <!-- Left Column: Copy, CTAs & Proof Rail -->
          <div class="hero-copy" style="display: flex; flex-direction: column;">
            <div class="hero-badge-pill">
              <span class="pulse-dot" style="width: 8px; height: 8px; background: #38bdf8; box-shadow: 0 0 10px #38bdf8;"></span>
              <span class="hero-badge-pill-text">All Afghanistan Jobs Hub &bull; <strong style="color: #38bdf8; font-weight: 800;">⭐ ACBAR &amp; Jobs.af Verified</strong></span>
            </div>

            <h1 class="hero-title-editorial">
              Find verified NGO, UN &amp; corporate jobs in <span class="serif-light">Afghanistan</span>.
            </h1>

            <p class="hero-lead-quote">
              Oriental Consultants unifies verified humanitarian, UN, development, and commercial employment opportunities from <strong>ACBAR.org</strong> and <strong>Jobs.af</strong> with thrice-daily automated synchronization across Kabul and all 34 provinces.
            </p>

            <div class="hero-btn-group">
              <a href="#jobsDirectory" class="btn-lovable-primary">
                <span>Explore All Vacancies</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a href="tenders-hub.html" class="btn-lovable-outline">
                Browse Tenders &amp; RFPs Hub
              </a>
            </div>

            <!-- Proof Rail (3 Metric Columns) -->
            <div class="proof-rail">
              <div class="proof-item">
                <div class="proof-num">16+</div>
                <div class="proof-label">Active Vacancies</div>
                <div class="proof-sub" style="color: #38bdf8; font-weight: 800; display: inline-flex; align-items: center; gap: 0.3rem;"><span>⭐</span> <span>ACBAR &amp; Jobs.af</span></div>
                <div class="proof-bar"></div>
              </div>

              <div class="proof-item">
                <div class="proof-num">34</div>
                <div class="proof-label">Provinces</div>
                <div class="proof-sub">Nationwide Coverage</div>
                <div class="proof-bar"></div>
              </div>

              <div class="proof-item">
                <div class="proof-num">3x Daily</div>
                <div class="proof-label">Live Synchronized</div>
                <div class="proof-sub">Kabul Time (AFT)</div>
                <div class="proof-bar"></div>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive Featured Opportunities Carousel Slider -->
          <div class="hero-slider-wrap" style="position: relative;">
            <!-- Blinking Status Corner Badge -->
            <a href="#jobsDirectory" class="slider-corner-tax-badge" title="Live Synced Directory">
              <span class="blinking-tax-dot" style="background: #22c55e; box-shadow: 0 0 10px #22c55e;"></span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Thrice-Daily Sync</span>
              <span class="tax-badge-pill" style="background: #22c55e; color: #011633; font-weight: 800;">LIVE</span>
            </a>

            <div class="service-showcase" id="serviceShowcase" role="region" aria-roledescription="carousel" aria-label="Featured Opportunities Slider">
              <!-- Decorative Grid Lines & Corner Accents -->
              <div class="showcase-bg-pattern"></div>
              <div class="showcase-corner-accent-1"></div>
              <div class="showcase-corner-accent-2"></div>

              <!-- Slide 1: ACBAR Humanitarian & NGO Jobs -->
              <div class="service-slide active" data-slide="0" role="tabpanel" aria-label="ACBAR Jobs — slide 1 of 4">
                <div class="slide-tag" style="background: linear-gradient(135deg, rgba(2, 132, 199, 0.22) 0%, rgba(56, 189, 248, 0.25) 100%); border: 1.5px solid #38bdf8; color: #38bdf8; font-weight: 800; display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.35rem 0.85rem; border-radius: 9999px; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.2);">
                  <span>⭐</span>
                  <span>ACBAR.org Humanitarian Board</span>
                  <span style="opacity: 0.5;">•</span>
                  <span style="color: #fbbf24;">Verified NGOs</span>
                </div>
                <div class="slide-icon-box" style="border-color: rgba(56, 189, 248, 0.4); background: rgba(56, 189, 248, 0.1); color: #38bdf8;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </div>
                <div class="slide-title">ACBAR <span class="bright">Humanitarian Jobs</span></div>
                <div class="slide-subtitle" style="color: #38bdf8; font-weight: 800; font-size: 0.98rem; display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
                  <span>CARE International &bull; NRC &bull; ACTED &bull; IRC &bull; Save the Children</span>
                </div>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  Explore verified humanitarian, internal audit, third-party monitoring (TPM), grant management, and engineering vacancies published by leading international NGOs across Afghanistan with direct official application pathways.
                </p>
                <div class="slide-stats-grid slide-stats-4col" style="grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                  <div class="slide-stat-cell" style="border-color: rgba(56, 189, 248, 0.35); background: rgba(56, 189, 248, 0.08);">
                    <div class="slide-stat-val" style="color: #38bdf8; font-size: 1.15rem;">10 Roles</div>
                    <div class="slide-stat-lbl" style="color: #bae6fd;">ACBAR Feed</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Kabul &amp; Reg.</div>
                    <div class="slide-stat-lbl">Provinces</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Full-Time</div>
                    <div class="slide-stat-lbl">Contract</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Direct</div>
                    <div class="slide-stat-lbl">ACBAR Link</div>
                  </div>
                </div>
                <a href="#jobsDirectory" class="slide-cta" style="background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%); color: #011633; font-weight: 900; box-shadow: 0 4px 18px rgba(56, 189, 248, 0.4);">
                  <span>View All 10 ACBAR Vacancies</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Slide 2: Jobs.af Banking & Commercial Careers -->
              <div class="service-slide" data-slide="1" role="tabpanel" aria-label="Jobs.af Careers — slide 2 of 4">
                <div class="slide-tag" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(2, 132, 199, 0.25) 100%); border: 1.5px solid #fbbf24; color: #fbbf24; font-weight: 800;">
                  <span>⭐ Jobs.af Commercial Feed</span>
                </div>
                <div class="slide-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <div class="slide-title">Jobs.af <span class="bright">Corporate Careers</span></div>
                <div class="slide-subtitle">AIB &bull; NETLINKS &bull; AWCC &bull; Roshan &bull; DABS</div>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  Verified openings in commercial banking, corporate financial reporting (IFRS), software engineering (Python/Odoo), power grid engineering, and provincial operations with top corporate employers in Afghanistan.
                </p>
                <div class="slide-stats-grid slide-stats-4col" style="grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val" style="color: #fbbf24;">110K AFN</div>
                    <div class="slide-stat-lbl">Top Salary</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Verified</div>
                    <div class="slide-stat-lbl">Employers</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">ICT &amp; Fin</div>
                    <div class="slide-stat-lbl">Sectors</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Jobs.af</div>
                    <div class="slide-stat-lbl">Direct Portal</div>
                  </div>
                </div>
                <a href="#jobsDirectory" class="slide-cta">
                  <span>Browse Jobs.af Vacancies</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Slide 3: Oriental Consultants Practice Vacancies -->
              <div class="service-slide" data-slide="2" role="tabpanel" aria-label="OC Practice Roles — slide 3 of 4">
                <div class="slide-tag" style="background: rgba(34, 197, 94, 0.15); border: 1.5px solid #22c55e; color: #22c55e; font-weight: 800;">
                  <span>⭐ PrimeGlobal Member Firm &bull; Kabul HQ</span>
                </div>
                <div class="slide-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                </div>
                <div class="slide-title">Oriental <span class="bright">Consultants Careers</span></div>
                <div class="slide-subtitle">Senior Statutory Auditors &bull; MoF Tax Advisors &bull; Odoo ERP Leads</div>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  Build your career at Afghanistan's premier audit and professional services firm. We offer competitive international compensation, ACCA/CPA study support, and opportunities to lead multi-million dollar donor and corporate engagements.
                </p>
                <div class="slide-stats-grid slide-stats-4col" style="grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Since 2006</div>
                    <div class="slide-stat-lbl">Heritage</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">PrimeGlobal</div>
                    <div class="slide-stat-lbl">USA Member</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">ISA / MoF</div>
                    <div class="slide-stat-lbl">Standards</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Karte 3</div>
                    <div class="slide-stat-lbl">Kabul HQ</div>
                  </div>
                </div>
                <a href="careers.html#applyForm" class="slide-cta" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff;">
                  <span>Apply to OC Talent Pool</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Slide 4: Provincial & Field Specialist Roles -->
              <div class="service-slide" data-slide="3" role="tabpanel" aria-label="Provincial Roles — slide 4 of 4">
                <div class="slide-tag" style="background: rgba(168, 85, 247, 0.15); border: 1.5px solid #a855f7; color: #c084fc; font-weight: 800;">
                  <span>⭐ Regional Hubs &bull; Herat, Balkh, Kandahar, Nangarhar</span>
                </div>
                <div class="slide-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div class="slide-title">Provincial <span class="bright">Field Opportunities</span></div>
                <div class="slide-subtitle">Field Coordination &bull; M&amp;E Specialists &bull; Regional Finance</div>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  Nationwide humanitarian and commercial initiatives require skilled provincial leaders in Herat, Mazar-e-Sharif, Kandahar, Jalalabad, and regional field offices. Filter opportunities by province below.
                </p>
                <div class="slide-stats-grid slide-stats-4col" style="grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">34</div>
                    <div class="slide-stat-lbl">Provinces</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">KoBo</div>
                    <div class="slide-stat-lbl">Field Audits</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Healthcare</div>
                    <div class="slide-stat-lbl">Grants</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Local</div>
                    <div class="slide-stat-lbl">Talent</div>
                  </div>
                </div>
                <a href="#jobsDirectory" class="slide-cta">
                  <span>Filter by Province</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Carousel Navigation Arrows -->
              <button class="showcase-nav-btn showcase-prev" id="showcasePrevBtn" aria-label="Previous Slide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button class="showcase-nav-btn showcase-next" id="showcaseNextBtn" aria-label="Next Slide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              <!-- Carousel Dynamic Indicators -->
              <div class="showcase-indicators" role="tablist" aria-label="Choose Slide">
                <button class="indicator-pill active" data-slide-to="0" role="tab" aria-selected="true" aria-label="Go to ACBAR Jobs"></button>
                <button class="indicator-pill" data-slide-to="1" role="tab" aria-selected="false" aria-label="Go to Jobs.af Careers"></button>
                <button class="indicator-pill" data-slide-to="2" role="tab" aria-selected="false" aria-label="Go to OC Practice Roles"></button>
                <button class="indicator-pill" data-slide-to="3" role="tab" aria-selected="false" aria-label="Go to Provincial Roles"></button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ==========================================================================
         INFINITE MARQUEE TICKER
         ========================================================================== -->
    <div class="marquee-mask" aria-hidden="true">
      <div class="marquee-track">
        <span class="marquee-item"><span class="marquee-dot"></span>ACBAR.org Verified Opportunities</span>
        <span class="marquee-item"><span class="marquee-dot"></span>Jobs.af Official Career Board</span>
        <span class="marquee-item"><span class="marquee-dot"></span>PrimeGlobal USA Alliance Member ($2.93B)</span>
        <span class="marquee-item"><span class="marquee-dot"></span>Thrice-Daily Automated Portal Synchronization</span>
        <span class="marquee-item"><span class="marquee-dot"></span>All 34 Afghanistan Provinces Covered</span>
        <span class="marquee-item"><span class="marquee-dot"></span>ACBAR.org Verified Opportunities</span>
        <span class="marquee-item"><span class="marquee-dot"></span>Jobs.af Official Career Board</span>
        <span class="marquee-item"><span class="marquee-dot"></span>PrimeGlobal USA Alliance Member ($2.93B)</span>
        <span class="marquee-item"><span class="marquee-dot"></span>Thrice-Daily Automated Portal Synchronization</span>
        <span class="marquee-item"><span class="marquee-dot"></span>All 34 Afghanistan Provinces Covered</span>
      </div>
    </div>

    <!-- ==========================================================================
         PORTAL CONTROLS BANNER
         ========================================================================== -->
    <section class="portal-banner" id="jobsDirectory">
      <div class="container portal-toolbar">
        <div>
          <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #38bdf8; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.45rem;">
            <span class="pulse-dot" style="background: #22c55e;"></span>
            UNIFIED NATIONAL PORTAL &bull; AFGHANISTAN
          </div>
          <h2 style="font-size: 1.65rem; font-weight: 800; margin: 0; color: #ffffff;">
            All Afghanistan Jobs Directory
          </h2>
          <p style="margin: 0.35rem 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 0.92rem;">
            Verified listings synchronized from <strong>ACBAR.org</strong> and <strong>Jobs.af</strong> with direct application links.
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <div class="portal-tabs">
            <a href="jobs-hub.html" class="portal-tab-btn active">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>All Jobs Hub</span>
            </a>
            <a href="tenders-hub.html" class="portal-tab-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              <span>Tenders &amp; RFPs Hub</span>
            </a>
          </div>

          <a href="careers.html" class="btn btn-sm btn-outline" style="color: #ffffff; border-color: rgba(255, 255, 255, 0.4); padding: 0.5rem 0.95rem; font-size: 0.8125rem;">
            <span>OC Careers &rarr;</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ==========================================================================
         INTERACTIVE DIRECTORY & MULTI-FILTER ENGINE
         ========================================================================== -->
    <section class="jobs-directory-section">
      <div class="container">
        
        <div class="hub-notice-card">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <strong style="font-weight: 800; color: #0369a1;">National Unified Employment Feed:</strong>
              <span style="font-size: 0.9rem; color: #1e3a8a;"> This portal aggregates verified NGO, UN, humanitarian, and commercial opportunities across all 34 provinces of Afghanistan. Choose between ACBAR and Jobs.af, or view all opportunities simultaneously.</span>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <a href="https://www.acbar.org/en/jobs" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary" style="font-size: 0.8125rem; font-weight: 700; white-space: nowrap;">
              ACBAR.org &rarr;
            </a>
            <a href="https://jobs.af/public/job" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-gold" style="font-size: 0.8125rem; font-weight: 700; white-space: nowrap;">
              Jobs.af &rarr;
            </a>
          </div>
        </div>

        <div class="sync-status-bar">
          <div class="sync-status-info">
            <span class="sync-pulse-dot"></span>
            <span><strong>Thrice-Daily Scan Active:</strong> Synchronized 3x Daily with <strong>ACBAR.org</strong> &amp; <strong>Jobs.af</strong> (08:00, 14:00, 20:00 AFT) &bull; Status: <span id="syncTimestamp">Verified Live Sync</span></span>
          </div>
          <div class="sync-actions">
            <button type="button" class="btn-sync-refresh" id="syncRefreshBtn" title="Check for latest updates from Afghanistan portals">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              <span>Sync Now</span>
            </button>
          </div>
        </div>

        <div class="hub-filters-card">
          <div class="hub-filter-grid">
            <div class="filter-group">
              <label for="jobsHubSearchInput" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; text-transform: uppercase;">Search Opportunities</label>
              <div style="position: relative;">
                <input type="text" id="jobsHubSearchInput" placeholder="Job title, organization, or keyword..." style="width: 100%; padding: 0.65rem 1rem 0.65rem 2.25rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
            </div>

            <div class="filter-group">
              <label for="jobsHubSourceSelect" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; text-transform: uppercase;">Portal Source</label>
              <select id="jobsHubSourceSelect" style="width: 100%; padding: 0.65rem 0.75rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;">
                <option value="all">All Portals (ACBAR + Jobs.af)</option>
                <option value="acbar">ACBAR.org Only</option>
                <option value="jobsaf">Jobs.af Only</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="jobsHubSectorSelect" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; text-transform: uppercase;">Sector / Field</label>
              <select id="jobsHubSectorSelect" style="width: 100%; padding: 0.65rem 0.75rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;">
                <option value="all">All Sectors</option>
                <option value="audit">Audit &amp; Financial Compliance</option>
                <option value="ict">ICT &amp; Software Engineering</option>
                <option value="tpm">Third-Party Monitoring (TPM)</option>
                <option value="prog">Programs &amp; Grants</option>
                <option value="log">Logistics &amp; Assets</option>
                <option value="mgmt">Operations &amp; Management</option>
                <option value="eng">Engineering</option>
                <option value="health">Healthcare &amp; Grants</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="jobsHubLocationSelect" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; text-transform: uppercase;">Location</label>
              <select id="jobsHubLocationSelect" style="width: 100%; padding: 0.65rem 0.75rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;">
                <option value="all">All Afghanistan</option>
                <option value="kabul">Kabul (HQ)</option>
                <option value="herat">Herat</option>
                <option value="balkh">Mazar-i-Sharif (Balkh)</option>
                <option value="kandahar">Kandahar</option>
                <option value="jalalabad">Jalalabad (Nangarhar)</option>
              </select>
            </div>

            <div>
              <button type="button" id="jobsHubResetBtn" class="btn btn-outline" style="padding: 0.65rem 1rem; font-size: 0.85rem; width: 100%;">
                Reset
              </button>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <span style="font-size: 0.95rem; color: var(--text-muted);">
            Showing <strong id="jobsHubCountDisplay" style="color: var(--text-primary); font-size: 1.1rem;">${allJobs.length}</strong> active verified opportunities across Afghanistan
          </span>
          <div style="font-size: 0.8125rem; color: #16a34a; font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
            <span class="pulse-dot" style="background: #16a34a;"></span>
            Direct Official Application Links Active
          </div>
        </div>

        <div id="jobsHubList">
          ${cardsHtml}
        </div>

      </div>
    </section>
  </main>
  `;

  return headAndNav + mainContent + postMainTemplate;
}

// -------------------------------------------------------------
// 2. GENERATE TENDERS-HUB.HTML
// -------------------------------------------------------------
function generateTendersHubHtml() {
  const allTenders = [];

  afghanTenders.forEach(t => {
    allTenders.push({
      id: t.id,
      org: t.org,
      title: t.title,
      location: t.location,
      type: t.type || 'consulting',
      locationCode: t.locationCode || 'kabul',
      compliance: t.compliance || 'Statutory / Standard',
      deadline: t.deadline || 'Open',
      viewUrl: t.viewUrl || 'https://www.afghantenders.com/',
      source: 'afghantenders',
      sourceLabel: 'AfghanTenders (همه داوطلبی ها)',
      sourceColor: '#d97706',
      sourceBg: 'rgba(217, 119, 6, 0.1)'
    });
  });

  acbarRfps.forEach(t => {
    allTenders.push({
      id: t.id,
      org: t.org,
      title: t.title,
      location: t.location,
      type: t.type || 'consulting',
      locationCode: t.locationCode || 'kabul',
      compliance: t.compliance || 'Standard NGO Compliance',
      deadline: t.deadline || 'Open',
      viewUrl: t.viewUrl || 'https://www.acbar.org/RFQs/RFPs',
      source: 'acbar',
      sourceLabel: 'ACBAR RFQ / RFP',
      sourceColor: '#0284c7',
      sourceBg: 'rgba(2, 132, 199, 0.1)'
    });
  });

  jobsAfTenders.forEach(t => {
    allTenders.push({
      id: t.id,
      org: t.org,
      title: t.title,
      location: t.location,
      type: t.type || 'goods',
      locationCode: t.locationCode || 'kabul',
      compliance: t.compliance || 'Commercial Procurement',
      deadline: t.deadline || 'Open',
      viewUrl: t.viewUrl || 'https://jobs.af/tenders',
      source: 'jobsaf',
      sourceLabel: 'Jobs.af Tender',
      sourceColor: '#0ea5e9',
      sourceBg: 'rgba(14, 165, 233, 0.1)'
    });
  });

  const cardsHtml = allTenders.map(tender => {
    return `
        <!-- Tender Card: ${escapeHtml(tender.id)} -->
        <div class="tender-card-row" data-source="${tender.source}" data-type="${tender.type}" data-location="${tender.locationCode}">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
              <span class="source-tag" style="background: ${tender.sourceBg}; color: ${tender.sourceColor}; border: 1px solid ${tender.sourceColor}33; padding: 0.2rem 0.55rem; border-radius: 4px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                ${tender.sourceLabel}
              </span>
              <div class="tender-org-badge" style="margin-bottom: 0;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                ${escapeHtml(tender.org)} &bull; ${escapeHtml(tender.id)}
              </div>
            </div>
            <h3 class="tender-row-title">${escapeHtml(tender.title)}</h3>
            <div class="tender-row-meta">
              <span class="tender-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${escapeHtml(tender.location)}
              </span>
              <span class="tender-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                ${escapeHtml(tender.compliance)}
              </span>
              <span class="tender-closing-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                Deadline: ${escapeHtml(tender.deadline)}
              </span>
            </div>
          </div>
          <div class="tender-action-col">
            <a href="${escapeHtml(tender.viewUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm" style="font-weight: 800; text-align: center;">
              View Solicitations &rarr;
            </a>
            <a href="contact.html?rfp=${encodeURIComponent(tender.id)}" class="btn btn-outline btn-sm" style="font-size: 0.78rem; text-align: center;">
              Bid Jointly with OC
            </a>
          </div>
        </div>`;
  }).join('\n');

  let headAndNav = preMainTemplate
    .replace(/<title>[\s\S]*?<\/title>/, '<title>All Afghanistan Tenders, RFPs &amp; Quotations Hub • Official Solicitations | Oriental Consultants</title>')
    .replace(/<meta name="description"[\s\S]*?>/, '<meta name="description" content="All Afghanistan Tenders, RFPs & Quotations Hub: Unified national procurement solicitations, RFQs, EOIs, and tenders combining AfghanTenders (همه داوطلبی ها), ACBAR RFPs, and Jobs.af Tenders.">')
    .replace(/<link rel="canonical"[\s\S]*?>/, '<link rel="canonical" href="https://www.ocafghan.com/tenders-hub.html">');

  const mainContent = `
  <main id="main-content">
    <!-- ==========================================================================
         HERO SECTION: UNIQUE HERO WITH TENDERS SLIDERS & LIVE TICKER
         ========================================================================== -->
    <section class="unique-hero" id="home">
      <!-- Architectural Background Accents -->
      <div class="hero-bg-grid"></div>
      <div class="hero-accent-line-right"></div>
      <div class="hero-accent-line-left"></div>

      <div class="hero-shell">
        <div class="hero-grid-split">
          
          <!-- Left Column: Copy, CTAs & Proof Rail -->
          <div class="hero-copy" style="display: flex; flex-direction: column;">
            <div class="hero-badge-pill">
              <span class="pulse-dot" style="width: 8px; height: 8px; background: #fbbf24; box-shadow: 0 0 10px #fbbf24;"></span>
              <span class="hero-badge-pill-text">All Afghanistan Tenders Hub &bull; <strong style="color: #fbbf24; font-weight: 800;">⭐ AfghanTenders, ACBAR &amp; Jobs.af</strong></span>
            </div>

            <h1 class="hero-title-editorial">
              Official institutional tenders, RFPs &amp; EOIs in <span class="serif-light">Afghanistan</span>.
            </h1>

            <p class="hero-lead-quote">
              Access verified public and private procurement opportunities across Afghanistan — including central banking audits, UN third-party monitoring, datacenter infrastructure, and nationwide fixed assets valuation.
            </p>

            <div class="hero-btn-group">
              <a href="#tendersDirectory" class="btn-lovable-primary">
                <span>Explore All Solicitations</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a href="contact.html?subject=Joint%20Venture%20Bidding" class="btn-lovable-outline">
                Bid Jointly with OC
              </a>
            </div>

            <!-- Proof Rail (3 Metric Columns) -->
            <div class="proof-rail">
              <div class="proof-item">
                <div class="proof-num">23+</div>
                <div class="proof-label">Active Solicitations</div>
                <div class="proof-sub" style="color: #fbbf24; font-weight: 800; display: inline-flex; align-items: center; gap: 0.3rem;"><span>⭐</span> <span>3 Top Portals</span></div>
                <div class="proof-bar"></div>
              </div>

              <div class="proof-item">
                <div class="proof-num">100%</div>
                <div class="proof-label">Verified Notices</div>
                <div class="proof-sub">UN · MoF · DAB · NGOs</div>
                <div class="proof-bar"></div>
              </div>

              <div class="proof-item">
                <div class="proof-num">3x Daily</div>
                <div class="proof-label">Live Synchronized</div>
                <div class="proof-sub">Kabul Time (AFT)</div>
                <div class="proof-bar"></div>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive Featured Tenders Carousel Slider -->
          <div class="hero-slider-wrap" style="position: relative;">
            <!-- Blinking Status Corner Badge -->
            <a href="#tendersDirectory" class="slider-corner-tax-badge" title="Live Synced Directory">
              <span class="blinking-tax-dot" style="background: #fbbf24; box-shadow: 0 0 10px #fbbf24;"></span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              <span>Live Procurement</span>
              <span class="tax-badge-pill" style="background: #fbbf24; color: #011633; font-weight: 800;">VERIFIED</span>
            </a>

            <div class="service-showcase" id="serviceShowcase" role="region" aria-roledescription="carousel" aria-label="Featured Tenders Slider">
              <!-- Decorative Grid Lines & Corner Accents -->
              <div class="showcase-bg-pattern"></div>
              <div class="showcase-corner-accent-1"></div>
              <div class="showcase-corner-accent-2"></div>

              <!-- Slide 1: AfghanTenders Central Bank & MoF Audits -->
              <div class="service-slide active" data-slide="0" role="tabpanel" aria-label="Central Bank & MoF — slide 1 of 4">
                <div class="slide-tag" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(2, 132, 199, 0.25) 100%); border: 1.5px solid #fbbf24; color: #fbbf24; font-weight: 800;">
                  <span>⭐ AfghanTenders (همه داوطلبی ها)</span>
                </div>
                <div class="slide-icon-box" style="border-color: rgba(251, 191, 36, 0.4); background: rgba(251, 191, 36, 0.1); color: #fbbf24;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                </div>
                <div class="slide-title">Statutory Audit <span class="bright">&amp; Tax Consultancies</span></div>
                <div class="slide-subtitle">Da Afghanistan Bank (DAB) &bull; Ministry of Finance (MoF)</div>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  Official high-level government solicitations for annual external statutory audits of national banking systems (ISA 700/800 compliant) and nationwide corporate tax compliance consulting.
                </p>
                <div class="slide-stats-grid slide-stats-4col" style="grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                  <div class="slide-stat-cell" style="border-color: rgba(251, 191, 36, 0.35); background: rgba(251, 191, 36, 0.08);">
                    <div class="slide-stat-val" style="color: #fbbf24; font-size: 1.15rem;">8 Notices</div>
                    <div class="slide-stat-lbl">AfghanTenders</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">ISA 800</div>
                    <div class="slide-stat-lbl">Compliance</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Central Bank</div>
                    <div class="slide-stat-lbl">National Scope</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Verified</div>
                    <div class="slide-stat-lbl">Active</div>
                  </div>
                </div>
                <a href="#tendersDirectory" class="slide-cta" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #011633; font-weight: 900;">
                  <span>Explore AfghanTenders Solicitations</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Slide 2: ACBAR International NGO Audits & TPM RFPs -->
              <div class="service-slide" data-slide="1" role="tabpanel" aria-label="ACBAR RFPs — slide 2 of 4">
                <div class="slide-tag" style="background: rgba(2, 132, 199, 0.15); border: 1.5px solid #0284c7; color: #38bdf8; font-weight: 800;">
                  <span>⭐ ACBAR Humanitarian Procurement Feed</span>
                </div>
                <div class="slide-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <div class="slide-title">NGO Audits <span class="bright">&amp; Third-Party Monitoring</span></div>
                <div class="slide-subtitle">CARE &bull; NRC &bull; ACTED &bull; DACAAR &bull; Save the Children</div>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  Active solicitations for multi-donor statutory grant audits, 12-province beneficiary verification monitoring via KoBoToolbox, enterprise cloud servers, and fixed assets physical tagging registries.
                </p>
                <div class="slide-stats-grid slide-stats-4col" style="grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">8 RFPs</div>
                    <div class="slide-stat-lbl">ACBAR Portals</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">KoBo</div>
                    <div class="slide-stat-lbl">TPM Verification</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Multi-Donor</div>
                    <div class="slide-stat-lbl">UN &amp; EU Grants</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Direct</div>
                    <div class="slide-stat-lbl">Official RFP Link</div>
                  </div>
                </div>
                <a href="#tendersDirectory" class="slide-cta">
                  <span>View All ACBAR RFPs</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Slide 3: Jobs.af Infrastructure & Medical Tenders -->
              <div class="service-slide" data-slide="2" role="tabpanel" aria-label="Jobs.af Tenders — slide 3 of 4">
                <div class="slide-tag" style="background: rgba(14, 165, 233, 0.15); border: 1.5px solid #0ea5e9; color: #38bdf8; font-weight: 800;">
                  <span>⭐ Jobs.af Commercial Procurement</span>
                </div>
                <div class="slide-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/></svg>
                </div>
                <div class="slide-title">Infrastructure <span class="bright">&amp; Equipment LTAs</span></div>
                <div class="slide-subtitle">Tier-3 Data Center Servers &bull; Fiber Optics &bull; Solar Hybrid PV</div>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  Procurement notices from NETLINKS, Afghan Telecom, Kabul University green energy campus, and ICRC long-term agreements for medical supplies and construction quality assurance.
                </p>
                <div class="slide-stats-grid slide-stats-4col" style="grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">7 Tenders</div>
                    <div class="slide-stat-lbl">Jobs.af Board</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Tier-3</div>
                    <div class="slide-stat-lbl">Datacenter Specs</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">250kW</div>
                    <div class="slide-stat-lbl">Hybrid Solar PV</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Goods &amp; Works</div>
                    <div class="slide-stat-lbl">Procurement</div>
                  </div>
                </div>
                <a href="#tendersDirectory" class="slide-cta">
                  <span>Browse Jobs.af Tenders</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Slide 4: Joint Bidding with Oriental Consultants -->
              <div class="service-slide" data-slide="3" role="tabpanel" aria-label="Joint Bidding — slide 4 of 4">
                <div class="slide-tag" style="background: rgba(34, 197, 94, 0.15); border: 1.5px solid #22c55e; color: #22c55e; font-weight: 800;">
                  <span>⭐ Consortium &amp; Joint Venture Partnering</span>
                </div>
                <div class="slide-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="slide-title">Joint Bidding <span class="bright">&amp; Proposal Support</span></div>
                <div class="slide-subtitle">Partner with Oriental Consultants Afghanistan on Complex RFPs</div>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  Leverage our 18+ years of countrywide track record, PrimeGlobal USA member status, and Ministry of Finance accreditations to submit winning consortium proposals for national and donor projects.
                </p>
                <div class="slide-stats-grid slide-stats-4col" style="grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">500+</div>
                    <div class="slide-stat-lbl">Audits Done</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">MoCI I-11011</div>
                    <div class="slide-stat-lbl">Licensed</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">ISO 9001</div>
                    <div class="slide-stat-lbl">Certified</div>
                  </div>
                  <div class="slide-stat-cell">
                    <div class="slide-stat-val">Turnkey</div>
                    <div class="slide-stat-lbl">Proposals</div>
                  </div>
                </div>
                <a href="contact.html?subject=Joint%20Venture%20Proposal" class="slide-cta" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff;">
                  <span>Initiate Joint Venture Discussion</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Carousel Navigation Arrows -->
              <button class="showcase-nav-btn showcase-prev" id="showcasePrevBtn" aria-label="Previous Slide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button class="showcase-nav-btn showcase-next" id="showcaseNextBtn" aria-label="Next Slide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              <!-- Carousel Dynamic Indicators -->
              <div class="showcase-indicators" role="tablist" aria-label="Choose Slide">
                <button class="indicator-pill active" data-slide-to="0" role="tab" aria-selected="true" aria-label="Go to AfghanTenders"></button>
                <button class="indicator-pill" data-slide-to="1" role="tab" aria-selected="false" aria-label="Go to ACBAR RFPs"></button>
                <button class="indicator-pill" data-slide-to="2" role="tab" aria-selected="false" aria-label="Go to Jobs.af Tenders"></button>
                <button class="indicator-pill" data-slide-to="3" role="tab" aria-selected="false" aria-label="Go to Joint Bidding"></button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ==========================================================================
         INFINITE MARQUEE TICKER
         ========================================================================== -->
    <div class="marquee-mask" aria-hidden="true">
      <div class="marquee-track">
        <span class="marquee-item"><span class="marquee-dot"></span>AfghanTenders (همه داوطلبی ها) Official Notices</span>
        <span class="marquee-item"><span class="marquee-dot"></span>ACBAR Humanitarian Procurement &amp; TPM</span>
        <span class="marquee-item"><span class="marquee-dot"></span>Jobs.af Commercial Solicitations &amp; LTAs</span>
        <span class="marquee-item"><span class="marquee-dot"></span>PrimeGlobal USA Member Firm Consortium Bidding</span>
        <span class="marquee-item"><span class="marquee-dot"></span>Ministry of Finance &amp; DAB Statutory Clearances</span>
        <span class="marquee-item"><span class="marquee-dot"></span>AfghanTenders (همه داوطلبی ها) Official Notices</span>
        <span class="marquee-item"><span class="marquee-dot"></span>ACBAR Humanitarian Procurement &amp; TPM</span>
        <span class="marquee-item"><span class="marquee-dot"></span>Jobs.af Commercial Solicitations &amp; LTAs</span>
        <span class="marquee-item"><span class="marquee-dot"></span>PrimeGlobal USA Member Firm Consortium Bidding</span>
        <span class="marquee-item"><span class="marquee-dot"></span>Ministry of Finance &amp; DAB Statutory Clearances</span>
      </div>
    </div>

    <!-- ==========================================================================
         PORTAL CONTROLS BANNER
         ========================================================================== -->
    <section class="portal-banner" id="tendersDirectory">
      <div class="container portal-toolbar">
        <div>
          <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #fbbf24; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.45rem;">
            <span class="pulse-dot" style="background: #22c55e;"></span>
            NATIONAL PROCUREMENT HUB &bull; AFGHANISTAN
          </div>
          <h2 style="font-size: 1.65rem; font-weight: 800; margin: 0; color: #ffffff;">
            All Afghanistan Tenders &amp; RFPs Directory
          </h2>
          <p style="margin: 0.35rem 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 0.92rem;">
            Official procurement notices from <strong>AfghanTenders (همه داوطلبی ها)</strong>, <strong>ACBAR</strong>, and <strong>Jobs.af</strong>.
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <div class="portal-tabs">
            <a href="jobs-hub.html" class="portal-tab-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>All Jobs Hub</span>
            </a>
            <a href="tenders-hub.html" class="portal-tab-btn active">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              <span>Tenders &amp; RFPs Hub</span>
            </a>
          </div>

          <a href="contact.html" class="btn btn-sm btn-gold" style="font-weight: 800; padding: 0.5rem 1rem; font-size: 0.8125rem;">
            <span>Submit Proposal / Joint Venture &rarr;</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ==========================================================================
         INTERACTIVE TENDERS DIRECTORY & MULTI-FILTER ENGINE
         ========================================================================== -->
    <section class="tenders-directory-section">
      <div class="container">
        
        <div class="hub-notice-card">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" stroke-width="2" style="flex-shrink:0;"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <div>
              <strong style="font-weight: 800; color: #854d0e;">National Unified Solicitations &amp; Tenders Directory:</strong>
              <span style="font-size: 0.9rem; color: #713f12;"> Official solicitations, RFQs, RFPs, and EOIs published by government ministries, UN agencies, international donors, and commercial institutions across Afghanistan. Filter by source or view all nationwide notices.</span>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <a href="https://www.afghantenders.com/" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary" style="font-size: 0.8125rem; font-weight: 700; white-space: nowrap;">
              AfghanTenders &rarr;
            </a>
            <a href="https://www.acbar.org/RFQs/RFPs" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-gold" style="font-size: 0.8125rem; font-weight: 700; white-space: nowrap;">
              ACBAR RFPs &rarr;
            </a>
          </div>
        </div>

        <div class="sync-status-bar">
          <div class="sync-status-info">
            <span class="sync-pulse-dot"></span>
            <span><strong>Thrice-Daily Scan Active:</strong> Synchronized with <strong>AfghanTenders</strong>, <strong>ACBAR</strong> &amp; <strong>Jobs.af</strong> (08:00, 14:00, 20:00 AFT) &bull; Status: <span id="syncTimestamp">Verified Live Sync</span></span>
          </div>
          <div class="sync-actions">
            <button type="button" class="btn-sync-refresh" id="syncRefreshBtn" title="Check for latest updates from all tender portals">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              <span>Sync Now</span>
            </button>
          </div>
        </div>

        <div class="hub-filters-card">
          <div class="hub-filter-grid">
            <div class="filter-group">
              <label for="tendersHubSearchInput" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; text-transform: uppercase;">Search Solicitations</label>
              <div style="position: relative;">
                <input type="text" id="tendersHubSearchInput" placeholder="Tender title, donor agency, or ref number..." style="width: 100%; padding: 0.65rem 1rem 0.65rem 2.25rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
            </div>

            <div class="filter-group">
              <label for="tendersHubSourceSelect" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; text-transform: uppercase;">Portal Source</label>
              <select id="tendersHubSourceSelect" style="width: 100%; padding: 0.65rem 0.75rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;">
                <option value="all">All Portals (AfghanTenders + ACBAR + Jobs.af)</option>
                <option value="afghantenders">AfghanTenders (همه داوطلبی ها)</option>
                <option value="acbar">ACBAR RFQs &amp; RFPs</option>
                <option value="jobsaf">Jobs.af Tenders</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="tendersHubTypeSelect" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; text-transform: uppercase;">Procurement Category</label>
              <select id="tendersHubTypeSelect" style="width: 100%; padding: 0.65rem 0.75rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;">
                <option value="all">All Categories</option>
                <option value="audit">Audits &amp; Financial Advisory</option>
                <option value="consulting">Consulting Services &amp; Studies</option>
                <option value="tpm">Third-Party Monitoring (TPM) &amp; Evaluation</option>
                <option value="goods">Supply of Goods &amp; IT Equipment</option>
                <option value="works">Works, Construction &amp; Solar Power</option>
                <option value="ict">Cloud, Datacenter &amp; Software</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="tendersHubLocationSelect" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem; text-transform: uppercase;">Location</label>
              <select id="tendersHubLocationSelect" style="width: 100%; padding: 0.65rem 0.75rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;">
                <option value="all">Nationwide / All Afghanistan</option>
                <option value="kabul">Kabul Headquarters</option>
                <option value="provinces">Provincial &amp; Regional Hubs</option>
              </select>
            </div>

            <div>
              <button type="button" id="tendersHubResetBtn" class="btn btn-outline" style="padding: 0.65rem 1rem; font-size: 0.85rem; width: 100%;">
                Reset
              </button>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <span style="font-size: 0.95rem; color: var(--text-muted);">
            Showing <strong id="tendersHubCountDisplay" style="color: var(--text-primary); font-size: 1.1rem;">${allTenders.length}</strong> active solicitations, tenders, and RFPs
          </span>
          <div style="font-size: 0.8125rem; color: #ca8a04; font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
            <span class="pulse-dot" style="background: #ca8a04;"></span>
            All Solicitations Verified Active
          </div>
        </div>

        <div id="tendersHubList">
          ${cardsHtml}
        </div>

      </div>
    </section>
  </main>
  `;

  return headAndNav + mainContent + postMainTemplate;
}

// Generate the files
fs.writeFileSync(path.join(ROOT_DIR, 'jobs-hub.html'), generateJobsHubHtml(), 'utf8');
console.log('✓ Successfully generated jobs-hub.html');

fs.writeFileSync(path.join(ROOT_DIR, 'tenders-hub.html'), generateTendersHubHtml(), 'utf8');
console.log('✓ Successfully generated tenders-hub.html');
