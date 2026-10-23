const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

// Load JSON data
const acbarJobs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'acbar-jobs.json'), 'utf8')).jobs || [];
const jobsAf = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'jobs-af.json'), 'utf8')).jobs || [];
const afghanTenders = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'afghan-tenders.json'), 'utf8')).tenders || [];
const acbarRfps = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'acbar-rfps.json'), 'utf8')).rfps || [];
const jobsAfTenders = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'jobs-af-tenders.json'), 'utf8')).tenders || [];

// Read acbar-jobs.html to get navbar and footer templates
const sampleHtml = fs.readFileSync(path.join(ROOT_DIR, 'acbar-jobs.html'), 'utf8');

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

// -------------------------------------------------------------
// 1. GENERATE JOBS-HUB.HTML
// -------------------------------------------------------------
function generateJobsHubHtml() {
  const allJobs = [];

  // Add ACBAR jobs
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
      sourceBadgeClass: 'source-badge-acbar'
    });
  });

  // Add Jobs.af jobs
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
      sourceBadgeClass: 'source-badge-jobsaf'
    });
  });

  const cardsHtml = allJobs.map(job => {
    const isAcbar = job.source === 'acbar';
    const sourceIcon = isAcbar
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
      : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
    const btnLabel = isAcbar ? 'Apply on ACBAR &rarr;' : 'Apply on Jobs.af &rarr;';
    const badgeColor = isAcbar ? '#0284c7' : '#0ea5e9';
    const badgeBg = isAcbar ? 'rgba(2, 132, 199, 0.1)' : 'rgba(14, 165, 233, 0.1)';

    return `
        <!-- Job Card: ${escapeHtml(job.id)} -->
        <div class="job-card-row" data-source="${job.source}" data-sector="${job.sector}" data-location="${job.locationCode}">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
              <span class="source-tag" style="background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeColor}33; padding: 0.2rem 0.55rem; border-radius: 4px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem;">
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

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>All Afghanistan Jobs Hub • ACBAR &amp; Jobs.af Unified Directory | Oriental Consultants</title>
  <meta name="description" content="All Afghanistan Jobs Hub: Unified, live verified job board combining active humanitarian, NGO, UN, and commercial opportunities from ACBAR.org and Jobs.af across Afghanistan.">
  <meta name="keywords" content="All Afghanistan Jobs Hub, ACBAR jobs, Jobs.af, NGO jobs Kabul, UN jobs Afghanistan, humanitarian jobs Afghanistan, jobs in Afghanistan, Oriental Consultants">
  <meta name="author" content="Oriental Consultants Afghanistan">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://www.ocafghan.com/jobs-hub.html">

  <!-- Strict Regional SEO Target Afghanistan -->
  <meta name="geo.region" content="AF-KBL">
  <meta name="geo.placename" content="Kabul, Afghanistan">
  <meta name="geo.position" content="34.5169;69.1472">
  <meta name="ICBM" content="34.5169, 69.1472">
  <meta name="target" content="Afghanistan">
  <meta name="coverage" content="Afghanistan Nationwide (Kabul, Herat, Mazar-i-Sharif, Kandahar, Jalalabad, Kunduz, Helmand)">

  <!-- Multilingual & Alternate Links for Afghanistan -->
  <link rel="alternate" hreflang="en-AF" href="https://www.ocafghan.com/jobs-hub.html">
  <link rel="alternate" hreflang="prs-AF" href="https://www.ocafghan.com/jobs-hub.html">
  <link rel="alternate" hreflang="ps-AF" href="https://www.ocafghan.com/jobs-hub.html">
  <link rel="alternate" hreflang="x-default" href="https://www.ocafghan.com/jobs-hub.html">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": "All Afghanistan Jobs Hub • ACBAR & Jobs.af Unified Portal",
    "alternateName": [
      "مرکز سراسری کاریابی افغانستان",
      "د افغانستان د کارموندنې لوی مرکز"
    ],
    "url": "https://www.ocafghan.com/jobs-hub.html",
    "serviceType": "Afghanistan Unified Employment Directory",
    "provider": {
      "@type": "ProfessionalService",
      "name": "Oriental Consultants Afghanistan",
      "url": "https://www.ocafghan.com/",
      "telephone": "+93-799543365",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "House 22, Street 17 Karte 3",
        "addressLocality": "Kabul",
        "addressCountry": "AF"
      }
    },
    "areaServed": {
      "@type": "Country",
      "name": "Afghanistan"
    }
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">

  <style>
    .portal-banner {
      background: linear-gradient(135deg, #001f3f 0%, #021226 60%, #002855 100%);
      color: #ffffff;
      padding: 2rem 0;
      border-bottom: 1px solid rgba(2, 132, 199, 0.3);
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

    .jobs-directory-section {
      padding: 2.5rem 0 5rem 0;
      background: var(--bg-primary);
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
      grid-template-columns: 2fr 1fr 1fr 1fr auto;
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
    .job-card-row {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem 1.75rem;
      margin-bottom: 1rem;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1.5rem;
      align-items: center;
      transition: all 0.25s ease;
      box-shadow: var(--shadow-xs);
    }
    .job-card-row:hover {
      border-color: var(--accent-blue);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    .job-org-badge {
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
    .job-row-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0.25rem 0 0.5rem 0;
      line-height: 1.35;
    }
    .job-row-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.25rem;
      font-size: 0.84rem;
      color: var(--text-secondary);
    }
    .job-meta-item {
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
    .job-action-col {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 170px;
    }
    @media (max-width: 768px) {
      .job-card-row {
        grid-template-columns: 1fr;
      }
      .job-action-col {
        flex-direction: row;
        width: 100%;
      }
      .job-action-col .btn {
        flex: 1;
      }
    }
  </style>
</head>
<body>

  <!-- Top Announcement Bar -->
  <div class="topbar">
    <div class="container topbar-inner">
      <div class="topbar-left">
        <span class="topbar-badge">USA Member</span>
        <span>PrimeGlobal Member Firm &bull; Ministry of Commerce Lic: I-11011 &bull; Kabul, Afghanistan</span>
      </div>
      <div class="topbar-right">
        <a href="mailto:info@ocafghan.com" class="topbar-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          info@ocafghan.com
        </a>
        <a href="tel:+93799543365" class="topbar-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          +93-799543365
        </a>
      </div>
    </div>
  </div>

  <!-- Primary Header & Navigation -->
  <header class="header" id="siteHeader">
    <div class="container header-inner">
      <a href="index.html" class="logo-area">
        <div class="logo-mark">OC</div>
        <div class="logo-text">
          <span class="logo-brand">ORIENTAL CONSULTANTS</span>
          <span class="logo-sub">Audit &bull; Advisory &bull; Technology &bull; PrimeGlobal Member</span>
        </div>
      </a>

      <nav class="desktop-nav" aria-label="Main Navigation">
        <ul class="nav-menu">
          <li class="nav-item"><a href="index.html" class="nav-link">Home</a></li>
          <li class="nav-item"><a href="about.html" class="nav-link">About Us</a></li>
          <li class="nav-item"><a href="services.html" class="nav-link">Services</a></li>

          <!-- Dedicated Careers & Portals Dropdown -->
          <li class="nav-item">
            <a href="careers.html" class="nav-link active">
              Careers &amp; Portals
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </a>
            <ul class="dropdown-menu">
              <li class="dropdown-item"><a href="jobs-hub.html" style="font-weight: 700; color: #38bdf8;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> All Afghanistan Jobs Hub (ACBAR &amp; Jobs.af)</a></li>
              <li class="dropdown-item"><a href="tenders-hub.html" style="font-weight: 700; color: #fbbf24;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> All Afghanistan Tenders, RFPs &amp; Quotation Hub</a></li>
              <li class="dropdown-item"><a href="careers.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> Oriental Consultants Vacancies</a></li>
              <li class="dropdown-item"><a href="careers.html#applyForm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> Join Our Talent Pool</a></li>
            </ul>
          </li>

          <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
        </ul>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <button class="theme-toggle-btn" id="themeToggleBtn" aria-label="Toggle Dark/Light Mode">
          <svg id="moonIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg id="sunIcon" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>

        <a href="contact.html" class="btn btn-primary btn-sm header-cta">Book Consultation</a>

        <button class="hamburger-btn" id="hamburgerBtn" aria-label="Open Mobile Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer Navigation -->
  <div class="mobile-nav" id="mobileNav">
    <ul class="mobile-nav-list">
      <li><a href="index.html" class="mobile-nav-link">Home</a></li>
      <li><a href="about.html" class="mobile-nav-link">About Us &amp; Heritage</a></li>
      <li><a href="services.html" class="mobile-nav-link">Professional Services</a></li>
      <li style="font-size:0.75rem; font-weight:800; color:var(--accent-gold); text-transform:uppercase; letter-spacing:1px; margin-top:0.5rem;">Unified Afghanistan Portals</li>
      <li><a href="jobs-hub.html" class="mobile-nav-link active" style="color:#38bdf8; font-weight:700;">💼 All Afghanistan Jobs Hub (ACBAR &amp; Jobs.af)</a></li>
      <li><a href="tenders-hub.html" class="mobile-nav-link" style="color:#fbbf24; font-weight:700;">📑 All Afghanistan Tenders, RFPs &amp; Quotation Hub</a></li>
      <li><a href="careers.html" class="mobile-nav-link">Careers &amp; Internships</a></li>
      <li><a href="contact.html" class="mobile-nav-link">Contact &amp; Consultations</a></li>
      <li style="margin-top: 1rem;">
        <a href="contact.html" class="btn btn-primary" style="width: 100%; text-align: center;">Book Consultation</a>
      </li>
    </ul>
  </div>

  <!-- In-Window Unified Jobs Hub Controls Banner -->
  <section class="portal-banner">
    <div class="container portal-toolbar">
      <div>
        <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #38bdf8; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.45rem;">
          <span class="pulse-dot" style="background: #22c55e;"></span>
          UNIFIED NATIONAL PORTAL &bull; AFGHANISTAN
        </div>
        <h1 style="font-size: 1.65rem; font-weight: 800; margin: 0; color: #ffffff;">
          All Afghanistan Jobs Hub
        </h1>
        <p style="margin: 0.35rem 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 0.92rem;">
          Verified listings synchronized from <strong>ACBAR.org</strong> and <strong>Jobs.af</strong> with direct application links.
        </p>
      </div>

      <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
        <!-- Dual Mode Tabs -->
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

  <!-- Interactive Unified Jobs Directory Content -->
  <main class="jobs-directory-section">
    <div class="container">
      
      <!-- Notice Card Explaining Unified Integration -->
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

      <!-- Live Sync Status Bar -->
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

      <!-- Search & Multi-Filter Card -->
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

      <!-- Results Count & Source Meta -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
        <span style="font-size: 0.95rem; color: var(--text-muted);">
          Showing <strong id="jobsHubCountDisplay" style="color: var(--text-primary); font-size: 1.1rem;">${allJobs.length}</strong> active verified opportunities across Afghanistan
        </span>
        <div style="font-size: 0.8125rem; color: #16a34a; font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
          <span class="pulse-dot" style="background: #16a34a;"></span>
          Direct Official Application Links Active
        </div>
      </div>

      <!-- Job Cards Container -->
      <div id="jobsHubList">
        ${cardsHtml}
      </div>

    </div>
  </main>

  <!-- Primary Footer -->
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-col footer-col-wide">
        <div class="logo-area logo-footer">
          <div class="logo-mark">OC</div>
          <div class="logo-text">
            <span class="logo-brand">ORIENTAL CONSULTANTS</span>
            <span class="logo-sub">Audit &bull; Advisory &bull; Technology</span>
          </div>
        </div>
        <p class="footer-desc">
          Premier multidisciplinary professional services and audit firm in Afghanistan. Member of PrimeGlobal (USA), serving international organizations, NGOs, commercial enterprises, and Afghan institutions since 2006.
        </p>
        <div class="footer-certifications">
          <span class="cert-pill">PrimeGlobal Member Firm</span>
          <span class="cert-pill">MoCI License: I-11011</span>
          <span class="cert-pill">ISO 9001:2015</span>
          <span class="cert-pill">TIN: 1045181011</span>
        </div>
      </div>

      <div class="footer-col">
        <h4 class="footer-heading">Portals &amp; Opportunities</h4>
        <ul class="footer-links">
          <li><a href="jobs-hub.html" style="color: #38bdf8; font-weight: 700;">All Afghanistan Jobs Hub</a></li>
          <li><a href="tenders-hub.html" style="color: #fbbf24; font-weight: 700;">All Afghanistan Tenders &amp; RFPs Hub</a></li>
          <li><a href="careers.html">Oriental Consultants Careers</a></li>
          <li><a href="careers.html#applyForm">Join Talent Pool</a></li>
          <li><a href="tax-calculator.html">Afghanistan Tax Calculator</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4 class="footer-heading">Services</h4>
        <ul class="footer-links">
          <li><a href="audit.html">Audit &amp; Assurance</a></li>
          <li><a href="accounting.html">Accounting &amp; BPO</a></li>
          <li><a href="tax-advisory.html">Tax Advisory &amp; MoF Clearances</a></li>
          <li><a href="monitoring.html">Third-Party Monitoring (TPM)</a></li>
          <li><a href="asset-valuation.html">Asset Valuation &amp; Barcoding</a></li>
          <li><a href="ict.html">ICT &amp; ERP Solutions</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4 class="footer-heading">Contact Kabul HQ</h4>
        <div class="footer-contact-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>House 22, Street 17 Karte 3, Kabul, Afghanistan</span>
        </div>
        <div class="footer-contact-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <a href="mailto:info@ocafghan.com" style="color: #38bdf8; text-decoration: none;">info@ocafghan.com</a>
        </div>
        <div class="footer-contact-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>+93-799543365 / +93-787098321</span>
        </div>
      </div>
    </div>

    <!-- Live Visitor Counter Widget Container -->
    <div class="container" style="padding-top: 1.5rem; padding-bottom: 0.5rem; display: flex; justify-content: center;">
      <div class="visitor-counter-widget" id="visitorCounterWidget">
        <div class="visitor-counter-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Total Visits: <strong id="vcTotalVisits">148,620</strong></span>
        </div>
        <div class="visitor-counter-sep"></div>
        <div class="visitor-counter-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Today: <strong id="vcTodayVisits">385</strong></span>
        </div>
        <div class="visitor-counter-sep"></div>
        <div class="visitor-counter-item online">
          <span class="visitor-pulse-dot"></span>
          <span>Online: <strong id="vcOnlineNow">19</strong></span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>&copy; 2006 &ndash; 2026 Oriental Consultants Afghanistan. All rights reserved.</p>
        <p class="footer-license">Ministry of Commerce &amp; Industry License: I-11011 &bull; TIN: 1045181011</p>
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
  <script src="js/portal-sync.js"></script>
  <script src="js/visitor-counter.js"></script>
</body>
</html>`;
}

// -------------------------------------------------------------
// 2. GENERATE TENDERS-HUB.HTML
// -------------------------------------------------------------
function generateTendersHubHtml() {
  const allTenders = [];

  // AfghanTenders
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
      sourceBadgeColor: '#d97706',
      sourceBg: 'rgba(217, 119, 6, 0.1)'
    });
  });

  // ACBAR RFPs
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
      sourceBadgeColor: '#0284c7',
      sourceBg: 'rgba(2, 132, 199, 0.1)'
    });
  });

  // Jobs.af Tenders
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
      sourceBadgeColor: '#0ea5e9',
      sourceBg: 'rgba(14, 165, 233, 0.1)'
    });
  });

  const cardsHtml = allTenders.map(tender => {
    return `
        <!-- Tender Card: ${escapeHtml(tender.id)} -->
        <div class="tender-card-row" data-source="${tender.source}" data-type="${tender.type}" data-location="${tender.locationCode}">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
              <span class="source-tag" style="background: ${tender.sourceBg}; color: ${tender.sourceBadgeColor}; border: 1px solid ${tender.sourceBadgeColor}33; padding: 0.2rem 0.55rem; border-radius: 4px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem;">
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

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>All Afghanistan Tenders, RFPs &amp; Quotations Hub • Official Procurement Solicitations | Oriental Consultants</title>
  <meta name="description" content="All Afghanistan Tenders, RFPs & Quotations Hub: Unified national procurement solicitations, RFQs, EOIs, and tenders combining AfghanTenders (همه داوطلبی ها), ACBAR RFPs, and Jobs.af Tenders.">
  <meta name="keywords" content="All Afghanistan Tenders Hub, AfghanTenders, ACBAR RFPs, Jobs.af tenders, داوطلبی های افغانستان, تدارکات افغانستان, Kabul tenders, RFP Afghanistan, Oriental Consultants">
  <meta name="author" content="Oriental Consultants Afghanistan">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://www.ocafghan.com/tenders-hub.html">

  <!-- Strict Regional SEO Target Afghanistan -->
  <meta name="geo.region" content="AF-KBL">
  <meta name="geo.placename" content="Kabul, Afghanistan">
  <meta name="geo.position" content="34.5169;69.1472">
  <meta name="ICBM" content="34.5169, 69.1472">
  <meta name="target" content="Afghanistan">
  <meta name="coverage" content="Afghanistan Nationwide (Kabul, Herat, Mazar-i-Sharif, Kandahar, Jalalabad, Kunduz, Helmand)">

  <!-- Multilingual & Alternate Links for Afghanistan -->
  <link rel="alternate" hreflang="en-AF" href="https://www.ocafghan.com/tenders-hub.html">
  <link rel="alternate" hreflang="prs-AF" href="https://www.ocafghan.com/tenders-hub.html">
  <link rel="alternate" hreflang="ps-AF" href="https://www.ocafghan.com/tenders-hub.html">
  <link rel="alternate" hreflang="x-default" href="https://www.ocafghan.com/tenders-hub.html">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": "All Afghanistan Tenders, RFPs & Quotation Hub",
    "alternateName": [
      "مرکز سراسری داوطلبی ها و تدارکات افغانستان",
      "د افغانستان د داوطلبۍ او آفرونو لوی مرکز"
    ],
    "url": "https://www.ocafghan.com/tenders-hub.html",
    "serviceType": "National Procurement & Tender Solicitations Directory",
    "provider": {
      "@type": "ProfessionalService",
      "name": "Oriental Consultants Afghanistan",
      "url": "https://www.ocafghan.com/",
      "telephone": "+93-799543365",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "House 22, Street 17 Karte 3",
        "addressLocality": "Kabul",
        "addressCountry": "AF"
      }
    },
    "areaServed": {
      "@type": "Country",
      "name": "Afghanistan"
    }
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">

  <style>
    .portal-banner {
      background: linear-gradient(135deg, #001f3f 0%, #021226 60%, #002855 100%);
      color: #ffffff;
      padding: 2rem 0;
      border-bottom: 1px solid rgba(2, 132, 199, 0.3);
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

    .tenders-directory-section {
      padding: 2.5rem 0 5rem 0;
      background: var(--bg-primary);
    }
    .hub-notice-card {
      background: #fefce8;
      border: 1px solid #fde047;
      border-left: 4px solid #ca8a04;
      border-radius: var(--radius-md);
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      color: #713f12;
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
      grid-template-columns: 2fr 1.2fr 1.2fr 1fr auto;
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
    .tender-card-row {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem 1.75rem;
      margin-bottom: 1rem;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1.5rem;
      align-items: center;
      transition: all 0.25s ease;
      box-shadow: var(--shadow-xs);
    }
    .tender-card-row:hover {
      border-color: #fbbf24;
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    .tender-org-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: #b45309;
      background: rgba(245, 158, 11, 0.1);
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-sm);
    }
    .tender-row-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0.25rem 0 0.5rem 0;
      line-height: 1.35;
    }
    .tender-row-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.25rem;
      font-size: 0.84rem;
      color: var(--text-secondary);
    }
    .tender-meta-item {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
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
    .tender-action-col {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 175px;
    }
    @media (max-width: 768px) {
      .tender-card-row {
        grid-template-columns: 1fr;
      }
      .tender-action-col {
        flex-direction: row;
        width: 100%;
      }
      .tender-action-col .btn {
        flex: 1;
      }
    }
  </style>
</head>
<body>

  <!-- Top Announcement Bar -->
  <div class="topbar">
    <div class="container topbar-inner">
      <div class="topbar-left">
        <span class="topbar-badge">USA Member</span>
        <span>PrimeGlobal Member Firm &bull; Ministry of Commerce Lic: I-11011 &bull; Kabul, Afghanistan</span>
      </div>
      <div class="topbar-right">
        <a href="mailto:info@ocafghan.com" class="topbar-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          info@ocafghan.com
        </a>
        <a href="tel:+93799543365" class="topbar-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          +93-799543365
        </a>
      </div>
    </div>
  </div>

  <!-- Primary Header & Navigation -->
  <header class="header" id="siteHeader">
    <div class="container header-inner">
      <a href="index.html" class="logo-area">
        <div class="logo-mark">OC</div>
        <div class="logo-text">
          <span class="logo-brand">ORIENTAL CONSULTANTS</span>
          <span class="logo-sub">Audit &bull; Advisory &bull; Technology &bull; PrimeGlobal Member</span>
        </div>
      </a>

      <nav class="desktop-nav" aria-label="Main Navigation">
        <ul class="nav-menu">
          <li class="nav-item"><a href="index.html" class="nav-link">Home</a></li>
          <li class="nav-item"><a href="about.html" class="nav-link">About Us</a></li>
          <li class="nav-item"><a href="services.html" class="nav-link">Services</a></li>

          <!-- Dedicated Careers & Portals Dropdown -->
          <li class="nav-item">
            <a href="careers.html" class="nav-link active">
              Careers &amp; Portals
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </a>
            <ul class="dropdown-menu">
              <li class="dropdown-item"><a href="jobs-hub.html" style="font-weight: 700; color: #38bdf8;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> All Afghanistan Jobs Hub (ACBAR &amp; Jobs.af)</a></li>
              <li class="dropdown-item"><a href="tenders-hub.html" style="font-weight: 700; color: #fbbf24;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> All Afghanistan Tenders, RFPs &amp; Quotation Hub</a></li>
              <li class="dropdown-item"><a href="careers.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> Oriental Consultants Vacancies</a></li>
              <li class="dropdown-item"><a href="careers.html#applyForm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> Join Our Talent Pool</a></li>
            </ul>
          </li>

          <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
        </ul>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <button class="theme-toggle-btn" id="themeToggleBtn" aria-label="Toggle Dark/Light Mode">
          <svg id="moonIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg id="sunIcon" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>

        <a href="contact.html" class="btn btn-primary btn-sm header-cta">Book Consultation</a>

        <button class="hamburger-btn" id="hamburgerBtn" aria-label="Open Mobile Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer Navigation -->
  <div class="mobile-nav" id="mobileNav">
    <ul class="mobile-nav-list">
      <li><a href="index.html" class="mobile-nav-link">Home</a></li>
      <li><a href="about.html" class="mobile-nav-link">About Us &amp; Heritage</a></li>
      <li><a href="services.html" class="mobile-nav-link">Professional Services</a></li>
      <li style="font-size:0.75rem; font-weight:800; color:var(--accent-gold); text-transform:uppercase; letter-spacing:1px; margin-top:0.5rem;">Unified Afghanistan Portals</li>
      <li><a href="jobs-hub.html" class="mobile-nav-link" style="color:#38bdf8; font-weight:700;">💼 All Afghanistan Jobs Hub (ACBAR &amp; Jobs.af)</a></li>
      <li><a href="tenders-hub.html" class="mobile-nav-link active" style="color:#fbbf24; font-weight:700;">📑 All Afghanistan Tenders, RFPs &amp; Quotation Hub</a></li>
      <li><a href="careers.html" class="mobile-nav-link">Careers &amp; Internships</a></li>
      <li><a href="contact.html" class="mobile-nav-link">Contact &amp; Consultations</a></li>
      <li style="margin-top: 1rem;">
        <a href="contact.html" class="btn btn-primary" style="width: 100%; text-align: center;">Book Consultation</a>
      </li>
    </ul>
  </div>

  <!-- In-Window Unified Tenders Hub Controls Banner -->
  <section class="portal-banner">
    <div class="container portal-toolbar">
      <div>
        <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #fbbf24; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.45rem;">
          <span class="pulse-dot" style="background: #22c55e;"></span>
          NATIONAL PROCUREMENT HUB &bull; AFGHANISTAN
        </div>
        <h1 style="font-size: 1.65rem; font-weight: 800; margin: 0; color: #ffffff;">
          All Afghanistan Tenders, RFPs &amp; Quotations Hub
        </h1>
        <p style="margin: 0.35rem 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 0.92rem;">
          Official procurement notices from <strong>AfghanTenders (همه داوطلبی ها)</strong>, <strong>ACBAR</strong>, and <strong>Jobs.af</strong>.
        </p>
      </div>

      <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
        <!-- Dual Mode Tabs -->
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

  <!-- Interactive Unified Tenders Directory Content -->
  <main class="tenders-directory-section">
    <div class="container">
      
      <!-- Notice Card Explaining Unified Tenders Integration -->
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

      <!-- Live Sync Status Bar -->
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

      <!-- Search & Multi-Filter Card -->
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

      <!-- Results Count & Source Meta -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
        <span style="font-size: 0.95rem; color: var(--text-muted);">
          Showing <strong id="tendersHubCountDisplay" style="color: var(--text-primary); font-size: 1.1rem;">${allTenders.length}</strong> active solicitations, tenders, and RFPs
        </span>
        <div style="font-size: 0.8125rem; color: #ca8a04; font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
          <span class="pulse-dot" style="background: #ca8a04;"></span>
          All Solicitations Verified Active
        </div>
      </div>

      <!-- Tenders Cards Container -->
      <div id="tendersHubList">
        ${cardsHtml}
      </div>

    </div>
  </main>

  <!-- Primary Footer -->
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-col footer-col-wide">
        <div class="logo-area logo-footer">
          <div class="logo-mark">OC</div>
          <div class="logo-text">
            <span class="logo-brand">ORIENTAL CONSULTANTS</span>
            <span class="logo-sub">Audit &bull; Advisory &bull; Technology</span>
          </div>
        </div>
        <p class="footer-desc">
          Premier multidisciplinary professional services and audit firm in Afghanistan. Member of PrimeGlobal (USA), serving international organizations, NGOs, commercial enterprises, and Afghan institutions since 2006.
        </p>
        <div class="footer-certifications">
          <span class="cert-pill">PrimeGlobal Member Firm</span>
          <span class="cert-pill">MoCI License: I-11011</span>
          <span class="cert-pill">ISO 9001:2015</span>
          <span class="cert-pill">TIN: 1045181011</span>
        </div>
      </div>

      <div class="footer-col">
        <h4 class="footer-heading">Portals &amp; Opportunities</h4>
        <ul class="footer-links">
          <li><a href="jobs-hub.html" style="color: #38bdf8; font-weight: 700;">All Afghanistan Jobs Hub</a></li>
          <li><a href="tenders-hub.html" style="color: #fbbf24; font-weight: 700;">All Afghanistan Tenders &amp; RFPs Hub</a></li>
          <li><a href="careers.html">Oriental Consultants Careers</a></li>
          <li><a href="careers.html#applyForm">Join Talent Pool</a></li>
          <li><a href="tax-calculator.html">Afghanistan Tax Calculator</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4 class="footer-heading">Services</h4>
        <ul class="footer-links">
          <li><a href="audit.html">Audit &amp; Assurance</a></li>
          <li><a href="accounting.html">Accounting &amp; BPO</a></li>
          <li><a href="tax-advisory.html">Tax Advisory &amp; MoF Clearances</a></li>
          <li><a href="monitoring.html">Third-Party Monitoring (TPM)</a></li>
          <li><a href="asset-valuation.html">Asset Valuation &amp; Barcoding</a></li>
          <li><a href="ict.html">ICT &amp; ERP Solutions</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4 class="footer-heading">Contact Kabul HQ</h4>
        <div class="footer-contact-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>House 22, Street 17 Karte 3, Kabul, Afghanistan</span>
        </div>
        <div class="footer-contact-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <a href="mailto:info@ocafghan.com" style="color: #38bdf8; text-decoration: none;">info@ocafghan.com</a>
        </div>
        <div class="footer-contact-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>+93-799543365 / +93-787098321</span>
        </div>
      </div>
    </div>

    <!-- Live Visitor Counter Widget Container -->
    <div class="container" style="padding-top: 1.5rem; padding-bottom: 0.5rem; display: flex; justify-content: center;">
      <div class="visitor-counter-widget" id="visitorCounterWidget">
        <div class="visitor-counter-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Total Visits: <strong id="vcTotalVisits">148,620</strong></span>
        </div>
        <div class="visitor-counter-sep"></div>
        <div class="visitor-counter-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Today: <strong id="vcTodayVisits">385</strong></span>
        </div>
        <div class="visitor-counter-sep"></div>
        <div class="visitor-counter-item online">
          <span class="visitor-pulse-dot"></span>
          <span>Online: <strong id="vcOnlineNow">19</strong></span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>&copy; 2006 &ndash; 2026 Oriental Consultants Afghanistan. All rights reserved.</p>
        <p class="footer-license">Ministry of Commerce &amp; Industry License: I-11011 &bull; TIN: 1045181011</p>
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
  <script src="js/portal-sync.js"></script>
  <script src="js/visitor-counter.js"></script>
</body>
</html>`;
}

// Write the files
fs.writeFileSync(path.join(ROOT_DIR, 'jobs-hub.html'), generateJobsHubHtml(), 'utf8');
console.log('✓ Created jobs-hub.html');

fs.writeFileSync(path.join(ROOT_DIR, 'tenders-hub.html'), generateTendersHubHtml(), 'utf8');
console.log('✓ Created tenders-hub.html');
