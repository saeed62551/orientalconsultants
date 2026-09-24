/**
 * ORIENTAL CONSULTANTS — CORPORATE PORTAL INTERACTIVE JAVASCRIPT (V2 ENHANCED)
 * Modern UX, Dynamic Calculators, Multi-Region Switching, Afghan Tax Engine & Fit-Finder
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initNavigation();
  initServiceFilterAndSearch();
  initTechShowcase();
  initBranchExplorer();
  initEstimatorEngine();
  initTaxCalculatorEngine();
  initFitFinderEngine();
  initFaqAccordion();
  initModalEngine();
  initNetworkFilter();
  initWhatsAppChatWidget();
});

/* ==========================================================================
   1. THEME ENGINE (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeEngine() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('oc_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeIcon(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('oc_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  if (sunIcon && moonIcon) {
    if (theme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }
}

/* ==========================================================================
   2. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (drawerCloseBtn && mobileDrawer) {
    drawerCloseBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });

  // Highlight active nav item on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   3. SERVICE FILTER & LIVE SEARCH
   ========================================================================== */
function initServiceFilterAndSearch() {
  const filterBtns = document.querySelectorAll('.service-tabs .tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  const searchInput = document.getElementById('serviceSearchInput');

  let currentCategory = 'all';

  function applyFiltering() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    serviceCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('.service-card-title').textContent.toLowerCase();
      const desc = card.querySelector('.service-card-desc').textContent.toLowerCase();

      const matchesCat = (currentCategory === 'all' || category === currentCategory);
      const matchesSearch = query === '' || title.includes(query) || desc.includes(query);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 200);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      applyFiltering();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFiltering);
  }
}

function filterServiceTab(category) {
  const targetBtn = document.querySelector(`.service-tabs .tab-btn[data-filter="${category}"]`);
  if (targetBtn) {
    targetBtn.click();
  }
}
window.filterServiceTab = filterServiceTab;

/* ==========================================================================
   4. TECHNOLOGY SHOWCASE TABS (ODOO / QUICKBOOKS / ICT)
   ========================================================================== */
function initTechShowcase() {
  const techTabs = document.querySelectorAll('.tech-tab-btn');
  const techPanes = document.querySelectorAll('.tech-tab-pane');

  techTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      techTabs.forEach(t => t.classList.remove('active'));
      techPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. GLOBAL NETWORK & BRANCHES EXPLORER
   ========================================================================== */
const branchData = {
  kabul: {
    name: "Kabul Headquarters (Afghanistan)",
    coords: "34.5553° N, 69.2075° E",
    hubTag: "Principal Headquarters",
    overview: "Established in 2006/2007 and registered under Ministry of Commerce license No. I-11011. Our Kabul headquarters coordinates nationwide operations, senior partner advisory, regulatory compliance, independent audit, and full-scale Odoo & QuickBooks deployments across all 34 provinces.",
    services: ["Independent Audit", "Tax Compliance & BRT", "Odoo ERP Implementation", "QuickBooks Pro & Enterprise", "Managed ICT & Cloud", "Third-Party M&E"],
    address: "Commercial District, Kabul, Afghanistan",
    phone: "+93 (0) 700 000 000 / +93 (0) 20 000 000",
    email: "info@ocafghan.com",
    lead: "Sayyed ul Abrar (President)"
  },
  islamabad: {
    name: "Islamabad Strategic Hub (Pakistan)",
    coords: "33.6844° N, 73.0479° E",
    hubTag: "Regional Operations Hub",
    overview: "Our Islamabad office serves as a bridge for international organizations, donors, and regional corporate entities operating in Pakistan, Afghanistan, and Central Asia. Specializes in cross-border financial advisory, digital transformation, and regional technology infrastructure.",
    services: ["Regional Audit", "Cross-Border Taxation", "Business Advisory", "Digital Transformation", "Offshore ICT Solutions"],
    address: "Islamabad Corporate Center, Sector G-8, Islamabad, Pakistan",
    phone: "+92 300 0000000",
    email: "pk@ocafghan.com",
    lead: "Saeed Anwar (Managing Director, Pakistan & VP ICT)"
  },
  dubai: {
    name: "Dubai Hub (United Arab Emirates)",
    coords: "25.2048° N, 55.2708° E",
    hubTag: "Middle East Strategic Hub",
    overview: "Our Dubai liaison presence facilitates international corporate structuring, regional trade logistics consulting, multi-currency accounting solutions, and cloud infrastructure advisory for entities operating across the GCC, Afghanistan, and South Asia.",
    services: ["International Structuring", "Trade & Logistics Advisory", "Multi-Currency Cloud ERP", "Corporate Feasibility"],
    address: "Business Bay, Dubai, United Arab Emirates",
    phone: "+971 4 000 0000",
    email: "uae@ocafghan.com",
    lead: "Regional Advisory Group"
  },
  london: {
    name: "London Hub (United Kingdom)",
    coords: "51.5074° N, 0.1278° W",
    hubTag: "Europe & Donor Relations",
    overview: "Our London presence interfaces with European donors, international development institutions, and UK-based development partners to manage grant evaluations, compliance reviews, and international proposal development.",
    services: ["Grant Proposal Development", "Donor Compliance Audits", "Third-Party Monitoring", "ESG & Impact Assessment"],
    address: "City of London, EC2, London, UK",
    phone: "+44 20 7000 0000",
    email: "uk@ocafghan.com",
    lead: "UK Liaison Office"
  },
  berlin: {
    name: "Berlin Hub (Germany & EU)",
    coords: "52.5200° N, 13.4050° E",
    hubTag: "EU Operations Hub",
    overview: "Coordinating European technical partnerships, research collaborations, and donor compliance frameworks for projects funded by European agencies and international development partners.",
    services: ["EU Donor Compliance", "Socio-Economic Research", "Institutional Capacity Building", "Technical Oversight"],
    address: "Mitte, Berlin, Germany",
    phone: "+49 30 0000 0000",
    email: "eu@ocafghan.com",
    lead: "EU Strategic Affairs"
  }
};

function initBranchExplorer() {
  const branchBtns = document.querySelectorAll('.branch-nav-btn');
  const titleEl = document.getElementById('branchDetailTitle');
  const coordsEl = document.getElementById('branchCoords');
  const overviewEl = document.getElementById('branchOverview');
  const chipsContainer = document.getElementById('branchChips');
  const addressEl = document.getElementById('branchAddress');
  const phoneEl = document.getElementById('branchPhone');
  const emailEl = document.getElementById('branchEmail');
  const leadEl = document.getElementById('branchLead');

  branchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      branchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const key = btn.getAttribute('data-branch');
      const data = branchData[key];

      if (data && titleEl) {
        titleEl.textContent = data.name;
        coordsEl.textContent = data.coords;
        overviewEl.textContent = data.overview;
        addressEl.textContent = data.address;
        phoneEl.textContent = data.phone;
        emailEl.textContent = data.email;
        leadEl.textContent = data.lead;

        chipsContainer.innerHTML = '';
        data.services.forEach(svc => {
          const chip = document.createElement('span');
          chip.className = 'chip';
          chip.textContent = svc;
          chipsContainer.appendChild(chip);
        });
      }
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE CONSULTATION SCOPE & COST ESTIMATOR
   ========================================================================== */
const estimatorProfiles = {
  orgType: "ngo",
  practice: "odoo",
  scale: "mid"
};

const solutionMatrix = {
  "ngo-odoo-small": { package: "Odoo NGO Starter", timeline: "3 - 5 Weeks", hours: "120 hrs", deliverables: "Core donor accounting, grant tracking, HR payroll, user training for 5 staff." },
  "ngo-odoo-mid": { package: "Odoo NGO Comprehensive", timeline: "6 - 10 Weeks", hours: "240 hrs", deliverables: "Multi-currency donor reporting, project budget control, automated timesheets, Afghan tax withholding." },
  "ngo-odoo-large": { package: "Odoo NGO Enterprise Nationwide", timeline: "12 - 16 Weeks", hours: "450+ hrs", deliverables: "Full multi-province setup, warehouse asset tracking, offline mobile sync, customized M&E dashboards." },

  "ngo-qb-small": { package: "QuickBooks Desktop Pro Plus 2025/2026", timeline: "1 - 2 Weeks", hours: "40 hrs", deliverables: "Chart of accounts setup, 3-user license, donor classes, initial data import from Excel." },
  "ngo-qb-mid": { package: "QuickBooks Premier NGO Edition 2025/2026", timeline: "2 - 3 Weeks", hours: "80 hrs", deliverables: "5-user setup, multi-donor allocation, grant reporting templates, staff certification." },
  "ngo-qb-large": { package: "QuickBooks Enterprise 2025/2026", timeline: "4 - 6 Weeks", hours: "160 hrs", deliverables: "Up to 30 concurrent users, advanced permissions, 64-bit multi-user server hardening, Afghan compliance." },

  "corp-odoo-small": { package: "Odoo Commercial Essentials", timeline: "4 - 6 Weeks", hours: "150 hrs", deliverables: "Sales CRM, invoicing, Afghan BRT tax module, inventory management." },
  "corp-odoo-mid": { package: "Odoo Enterprise Growth", timeline: "8 - 12 Weeks", hours: "300 hrs", deliverables: "Full ERP: Manufacturing (MRP), barcodes, multi-warehouse, automated bank reconciliation, HR attendance." },
  "corp-odoo-large": { package: "Odoo Corporate Flagship", timeline: "14 - 20 Weeks", hours: "600+ hrs", deliverables: "Enterprise multi-company setup, POS retail integration, custom API connectors, 24/7 priority SLA." },

  "corp-qb-small": { package: "QuickBooks Desktop Pro Plus 2025/2026", timeline: "1 - 2 Weeks", hours: "40 hrs", deliverables: "Standard commercial bookkeeping, invoicing, vendor bills, basic inventory." },
  "corp-qb-mid": { package: "QuickBooks Premier 2025/2026", timeline: "2 - 3 Weeks", hours: "80 hrs", deliverables: "Job costing, sales order fulfillment, Afghan tax reporting, 5-user network license." },
  "corp-qb-large": { package: "QuickBooks Enterprise 2025/2026 Platinum", timeline: "4 - 6 Weeks", hours: "160 hrs", deliverables: "Advanced inventory, barcode scanners, multi-location tracking, up to 40 users." },

  "default": { package: "Tailored Advisory Engagement", timeline: "3 - 8 Weeks", hours: "Custom Scope", deliverables: "Detailed fit-gap assessment, strategic roadmap, compliance audit, executive implementation plan." }
};

function initEstimatorEngine() {
  const pillBtns = document.querySelectorAll('.option-pill');
  const pkgEl = document.getElementById('estPackage');
  const timeEl = document.getElementById('estTimeline');
  const hoursEl = document.getElementById('estHours');
  const delivEl = document.getElementById('estDeliverables');
  const applyBtn = document.getElementById('applyEstimatorToModalBtn');

  pillBtns.forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.getAttribute('data-group');
      const val = pill.getAttribute('data-val');

      document.querySelectorAll(`.option-pill[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      estimatorProfiles[group] = val;
      updateEstimatorResults();
    });
  });

  function updateEstimatorResults() {
    const key = `${estimatorProfiles.orgType}-${estimatorProfiles.practice}-${estimatorProfiles.scale}`;
    const result = solutionMatrix[key] || solutionMatrix["default"];

    if (pkgEl) pkgEl.textContent = result.package;
    if (timeEl) timeEl.textContent = result.timeline;
    if (hoursEl) hoursEl.textContent = result.hours;
    if (delivEl) delivEl.textContent = result.deliverables;
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const currentPkg = pkgEl ? pkgEl.textContent : 'Consulting Discovery';
      openModalWithService(currentPkg);
    });
  }

  updateEstimatorResults();
}

/* ==========================================================================
   7. AFGHAN TAX & BRT CALCULATOR ENGINE (POWER TOOL)
   ========================================================================== */
function initTaxCalculatorEngine() {
  const calcTabs = document.querySelectorAll('.calc-tab-btn');
  const brtPanel = document.getElementById('brtCalcPanel');
  const salaryPanel = document.getElementById('salaryCalcPanel');

  // Tab switching
  calcTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      calcTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-calc');
      if (target === 'brt') {
        if (brtPanel) brtPanel.style.display = 'block';
        if (salaryPanel) salaryPanel.style.display = 'none';
      } else {
        if (brtPanel) brtPanel.style.display = 'none';
        if (salaryPanel) salaryPanel.style.display = 'block';
      }
    });
  });

  // BRT Calculation
  const brtRevenueInput = document.getElementById('brtRevenueInput');
  const brtSectorSelect = document.getElementById('brtSectorSelect');
  const brtTaxAmountEl = document.getElementById('brtTaxAmount');
  const brtRateDisplay = document.getElementById('brtRateDisplay');

  function calculateBRT() {
    const revenue = parseFloat(brtRevenueInput ? brtRevenueInput.value : 0) || 0;
    const rate = parseFloat(brtSectorSelect ? brtSectorSelect.value : 0.04) || 0.04;

    const taxAmount = revenue * rate;
    if (brtTaxAmountEl) {
      brtTaxAmountEl.textContent = taxAmount.toLocaleString('en-US', { maximumFractionDigits: 0 }) + " AFN";
    }
    if (brtRateDisplay) {
      brtRateDisplay.textContent = (rate * 100).toFixed(0) + "% BRT Rate";
    }
  }

  if (brtRevenueInput) brtRevenueInput.addEventListener('input', calculateBRT);
  if (brtSectorSelect) brtSectorSelect.addEventListener('change', calculateBRT);

  // Salary Withholding Calculation (Under Afghan Income Tax Law)
  const salaryInput = document.getElementById('salaryInput');
  const salaryTaxEl = document.getElementById('salaryTaxAmount');
  const netSalaryEl = document.getElementById('netSalaryAmount');
  const salaryBracketNote = document.getElementById('salaryBracketNote');

  function calculateSalaryTax() {
    const gross = parseFloat(salaryInput ? salaryInput.value : 0) || 0;
    let tax = 0;
    let note = "Exempt (Up to 5,000 AFN)";

    if (gross <= 5000) {
      tax = 0;
      note = "Bracket 1: 0% Tax (Under 5,000 AFN/mo)";
    } else if (gross <= 12500) {
      tax = (gross - 5000) * 0.02;
      note = "Bracket 2: 2% on excess over 5,000 AFN";
    } else if (gross <= 100000) {
      tax = 150 + ((gross - 12500) * 0.10);
      note = "Bracket 3: 150 AFN + 10% on excess over 12,500 AFN";
    } else {
      tax = 8900 + ((gross - 100000) * 0.20);
      note = "Bracket 4: 8,900 AFN + 20% on excess over 100,000 AFN";
    }

    const net = gross - tax;

    if (salaryTaxEl) {
      salaryTaxEl.textContent = Math.round(tax).toLocaleString('en-US') + " AFN";
    }
    if (netSalaryEl) {
      netSalaryEl.textContent = Math.round(net).toLocaleString('en-US') + " AFN";
    }
    if (salaryBracketNote) {
      salaryBracketNote.textContent = note;
    }
  }

  if (salaryInput) salaryInput.addEventListener('input', calculateSalaryTax);

  // Initial runs
  calculateBRT();
  calculateSalaryTax();
}

/* ==========================================================================
   8. QUICKBOOKS VS. ODOO FIT-FINDER WIZARD
   ========================================================================== */
function initFitFinderEngine() {
  const wizardForm = document.getElementById('fitFinderForm');
  const resultCard = document.getElementById('fitFinderResult');
  const resultTitle = document.getElementById('fitResultTitle');
  const resultDesc = document.getElementById('fitResultDesc');
  const resultBadge = document.getElementById('fitResultBadge');

  if (wizardForm) {
    wizardForm.addEventListener('change', () => {
      const qUsers = document.querySelector('input[name="fitUsers"]:checked')?.value || 'small';
      const qProcess = document.querySelector('input[name="fitProcess"]:checked')?.value || 'simple';
      const qHost = document.querySelector('input[name="fitHost"]:checked')?.value || 'onprem';

      let recommended = "";
      let desc = "";
      let badge = "";

      if (qProcess === 'complex' || qUsers === 'large') {
        recommended = "Odoo ERP 18 (Enterprise)";
        badge = "Full-Scale ERP Recommended";
        desc = "Your organization requires multi-department operations (CRM, automated MRP, multi-warehouse, and HR attendance). Odoo 18 provides an all-in-one database with full Afghan tax and currency localization.";
      } else if (qUsers === 'mid' && qProcess === 'moderate') {
        recommended = "QuickBooks Enterprise 2025/2026";
        badge = "Robust Accounting Suite";
        desc = "QuickBooks Enterprise 2025/2026 is the optimal balance: 64-bit performance, up to 40 users, advanced inventory, and role-based security without the overhead of full ERP customization.";
      } else {
        recommended = "QuickBooks Desktop Premier Plus 2025/2026";
        badge = "Fast & Economical";
        desc = "Perfect for straightforward bookkeeping, donor grant reporting, and rapid setup within 10 business days. Includes 5 user licenses and hands-on staff training from certified Kabul advisors.";
      }

      if (resultTitle) resultTitle.textContent = recommended;
      if (resultDesc) resultDesc.textContent = desc;
      if (resultBadge) resultBadge.textContent = badge;
    });
  }
}

/* ==========================================================================
   9. INTERACTIVE FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Optional: close other items for clean accordion
        faqItems.forEach(i => i.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   10. MODAL ENGINE & INQUIRY FORM
   ========================================================================== */
function initModalEngine() {
  const modal = document.getElementById('consultationModal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-trigger');
  const consultationTriggers = document.querySelectorAll('.open-consultation-btn');
  const form = document.getElementById('consultationForm');
  const formSuccess = document.getElementById('formSuccessState');

  consultationTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'General Business Consulting';
      openModalWithService(serviceName);
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) modal.classList.remove('open');
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    });
  }
}

function openModalWithService(serviceName) {
  const modal = document.getElementById('consultationModal');
  const serviceInput = document.getElementById('modalServiceField');
  const form = document.getElementById('consultationForm');
  const formSuccess = document.getElementById('formSuccessState');

  if (serviceInput) serviceInput.value = serviceName;
  if (form) form.style.display = 'block';
  if (formSuccess) formSuccess.style.display = 'none';
  if (modal) modal.classList.add('open');
}

window.openModalWithService = openModalWithService;

/* ==========================================================================
   11. GLOBAL PRESENCE / OUR NETWORK REGIONAL FILTER
   ========================================================================== */
function initNetworkFilter() {
  const filterBtns = document.querySelectorAll('.network-filter-btn');
  const panels = document.querySelectorAll('#networkGrid .network-panel');
  if (!filterBtns.length || !panels.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        const region = panel.getAttribute('data-region');
        if (filter === 'all' || region === filter) {
          panel.style.display = 'flex';
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   12. INTERACTIVE WHATSAPP CHAT & TOPIC SELECTOR WIDGET
   Options: Jobs, RFP, Proposal Writing, Audit, Google Workspace,
            Microsoft Office 365, .af Domain Registration, Database Development,
            Website Development
   ========================================================================== */
function initWhatsAppChatWidget() {
  const WHATSAPP_NUMBER_1 = '93799543365';
  const WHATSAPP_NUMBER_2 = '93787098321';

  const TOPIC_OPTIONS = [
    {
      id: 'jobs',
      icon: '💼',
      title: 'Jobs & Careers',
      desc: 'Active vacancies, recruitment & internships',
      msg: 'Hello Oriental Consultants, I am inquiring regarding current jobs, vacancies, and employment opportunities at your firm or partner organizations.'
    },
    {
      id: 'rfp',
      icon: '📄',
      title: 'RFPs, RFQs & Tenders',
      desc: 'Institutional bids & tender submissions',
      msg: 'Hello Oriental Consultants, I would like to consult with your team regarding an active RFP / RFQ / institutional tender opportunity.'
    },
    {
      id: 'proposal',
      icon: '✍️',
      title: 'Proposal & Business Plan Writing',
      desc: 'Grants, donor bids & business plans',
      msg: 'Hello Oriental Consultants, I require expert technical proposal writing, donor grant application, or business plan advisory services.'
    },
    {
      id: 'audit',
      icon: '⚖️',
      title: 'Audit & Statutory Assurance (ISA)',
      desc: 'ISA 700/800 audits & tax compliance',
      msg: 'Hello Oriental Consultants, I am inquiring regarding statutory financial audit (ISA 700/800 compliant), donor grant assurance, and Afghanistan tax clearance.'
    },
    {
      id: 'google',
      icon: '☁️',
      title: 'Google Workspace in Afghanistan',
      desc: 'Deployment, cloud tenancy & business email',
      msg: 'Hello Oriental Consultants, our organization needs Google Workspace official cloud tenancy deployment, business email setup, and administrative support in Afghanistan.'
    },
    {
      id: 'm365',
      icon: '🏢',
      title: 'Microsoft Office 365 Solutions',
      desc: 'Enterprise licensing & cloud migration',
      msg: 'Hello Oriental Consultants, we are looking for Microsoft Office 365 enterprise licensing, Exchange cloud migration, and cloud productivity solutions.'
    },
    {
      id: 'domain',
      icon: '🌐',
      title: '.AF Domain & Pro Registration',
      desc: 'Official .af, .com.af & domain hosting',
      msg: 'Hello Oriental Consultants, I would like to register / manage our official .af / .com.af professional domain name and cloud hosting via AfghanHoster.'
    },
    {
      id: 'database',
      icon: '🗄️',
      title: 'Database Development & SQL Solutions',
      desc: 'Custom enterprise SQL & cloud databases',
      msg: 'Hello Oriental Consultants, I am looking for custom enterprise database architecture, secure SQL development, and cloud database optimization.'
    },
    {
      id: 'website',
      icon: '💻',
      title: 'Website & Portal Development',
      desc: 'Enterprise web & portal architecture',
      msg: 'Hello Oriental Consultants, I want to discuss custom website and interactive portal development with your Afghan Developers engineering team.'
    }
  ];

  // 1. Ensure floating WhatsApp button exists on page
  let floatingBtn = document.querySelector('.floating-whatsapp-btn');
  if (!floatingBtn) {
    floatingBtn = document.createElement('a');
    floatingBtn.href = 'https://wa.me/' + WHATSAPP_NUMBER_1;
    floatingBtn.className = 'floating-whatsapp-btn';
    floatingBtn.setAttribute('aria-label', 'Contact us on WhatsApp');
    floatingBtn.setAttribute('title', 'Direct WhatsApp Consultation with Kabul HQ');
    floatingBtn.innerHTML = `
      <span class="floating-whatsapp-ping"></span>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.121.553 4.111 1.517 5.845l-1.611 5.888 6.035-1.583c1.7 1.002 3.688 1.579 5.814 1.579 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/>
      </svg>
    `;
    document.body.appendChild(floatingBtn);
  }

  // 2. Build Interactive Popup Markup
  const popup = document.createElement('div');
  popup.className = 'wa-chat-popup';
  popup.id = 'waChatPopup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-label', 'Oriental Consultants WhatsApp Consultation');

  popup.innerHTML = `
    <div class="wa-chat-header">
      <div class="wa-chat-header-info">
        <div class="wa-avatar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#25d366"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.121.553 4.111 1.517 5.845l-1.611 5.888 6.035-1.583c1.7 1.002 3.688 1.579 5.814 1.579 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/></svg>
          <span class="wa-online-dot"></span>
        </div>
        <div>
          <h4 class="wa-header-title">Oriental Consultants</h4>
          <p class="wa-header-subtitle">Kabul HQ Advisory • Online</p>
        </div>
      </div>
      <button type="button" class="wa-close-btn" id="waCloseBtn" aria-label="Close WhatsApp chat popup">✕</button>
    </div>

    <div class="wa-chat-body">
      <div class="wa-bubble-agent">
        <strong>سلام / Welcome!</strong> How can our Kabul senior consultants assist you today? Please tap your topic of interest below:
      </div>

      <div class="wa-topics-label">Select Your Inquiry Topic:</div>

      <div class="wa-topics-list" id="waTopicsList">
        ${TOPIC_OPTIONS.map((opt, idx) => `
          <button type="button" class="wa-topic-btn ${idx === 0 ? 'selected' : ''}" data-topic-id="${opt.id}" data-topic-msg="${encodeURIComponent(opt.msg)}">
            <div class="wa-topic-left">
              <span class="wa-topic-icon">${opt.icon}</span>
              <div>
                <div class="wa-topic-text">${opt.title}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 500;">${opt.desc}</div>
              </div>
            </div>
            <span class="wa-topic-arrow">&rarr;</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="wa-chat-footer">
      <textarea class="wa-input-preview" id="waInputPreview" rows="2" placeholder="Tap an option above or type your inquiry...">${TOPIC_OPTIONS[0].msg}</textarea>
      <button type="button" class="wa-send-btn" id="waSendBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.121.553 4.111 1.517 5.845l-1.611 5.888 6.035-1.583c1.7 1.002 3.688 1.579 5.814 1.579 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/></svg>
        <span>Open in WhatsApp (+93 799 543365)</span>
      </button>
      <div class="wa-direct-lines">
        <span>Alt WhatsApp: <a href="https://wa.me/${WHATSAPP_NUMBER_2}" target="_blank" rel="noopener">+93 787 098321</a></span>
        <span>•</span>
        <span>Kabul HQ Direct</span>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // 3. Events & Interactions
  const closeBtn = document.getElementById('waCloseBtn');
  const inputPreview = document.getElementById('waInputPreview');
  const sendBtn = document.getElementById('waSendBtn');
  const topicBtns = popup.querySelectorAll('.wa-topic-btn');

  function openPopup() {
    popup.classList.add('active');
  }

  function closePopup() {
    popup.classList.remove('active');
  }

  // Bind to all floating WhatsApp buttons (existing and new)
  document.querySelectorAll('.floating-whatsapp-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (popup.classList.contains('active')) {
        closePopup();
      } else {
        openPopup();
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }

  // Close when clicking outside popup & button
  document.addEventListener('click', (e) => {
    const isClickInside = popup.contains(e.target) || Array.from(document.querySelectorAll('.floating-whatsapp-btn')).some(btn => btn.contains(e.target));
    if (!isClickInside && popup.classList.contains('active')) {
      closePopup();
    }
  });

  // Topic selection
  topicBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      topicBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const rawMsg = decodeURIComponent(btn.getAttribute('data-topic-msg') || '');
      if (inputPreview) {
        inputPreview.value = rawMsg;
        inputPreview.focus();
      }
    });

    // Double-click to launch directly
    btn.addEventListener('dblclick', () => {
      const rawMsg = decodeURIComponent(btn.getAttribute('data-topic-msg') || '');
      launchWhatsApp(rawMsg);
    });
  });

  function launchWhatsApp(text) {
    const msg = text || (inputPreview ? inputPreview.value.trim() : '') || 'Hello Oriental Consultants Afghanistan';
    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER_1}?text=${encoded}`;
    window.open(waUrl, '_blank');
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      launchWhatsApp(inputPreview ? inputPreview.value : '');
    });
  }
}

/* ==========================================================================
   14. INTERACTIVE PREMIUM DOMAIN SEARCH ENGINE (AFGHANISTAN & GLOBAL TLDs)
   Covers: .af, .com.af, .org.af, .ngo, .com, .info, .ai, .io, .net, etc.
   ========================================================================== */
const OC_DOMAIN_REGISTRY = [
  { tld: '.af', name: 'Afghanistan Official ccTLD', category: 'National Premier', retailPrice: 55, salePrice: 45, priceAfn: 3150, popular: true, desc: 'Highest authority national domain for Afghanistan commercial & public entities.' },
  { tld: '.com.af', name: 'Commercial Afghanistan', category: 'Afghan Business', retailPrice: 45, salePrice: 35, priceAfn: 2450, popular: true, desc: 'Recognized standard for registered corporations & trade in Afghanistan.' },
  { tld: '.org.af', name: 'Afghan Organizations', category: 'Afghan Non-Profit', retailPrice: 45, salePrice: 35, priceAfn: 2450, popular: true, desc: 'Designated for Afghan non-profits, foundations & civil society associations.' },
  { tld: '.ngo', name: '.ngo Humanitarian & Non-Profit', category: 'OC • AfghanHoster • AfghanDevelopers', retailPrice: 50, salePrice: 39, priceAfn: 2730, popular: true, desc: 'Verified NGO ecosystem powered by Oriental Consultants (MoEc Verification & Statutory MoF AFN/USD Invoicing TIN: 1045181011), AfghanHoster (NVMe Cloud & Anycast DNS), and AfghanDevelopers (Software house) (Custom NGO Web Portals & M&E Dashboards).' },
  { tld: '.com', name: 'Commercial Worldwide', category: 'Global Business', retailPrice: 18, salePrice: 14, priceAfn: 980, popular: true, desc: 'The most trusted universal global domain for international commerce.' },
  { tld: '.info', name: 'Information & Media', category: 'News & Media', retailPrice: 18, salePrice: 12, priceAfn: 840, popular: false, desc: 'Ideal for informational portals, educational guides, publications & directories.' },
  { tld: '.ai', name: 'Artificial Intelligence', category: 'Next-Gen Tech', retailPrice: 99, salePrice: 79, priceAfn: 5530, popular: true, desc: 'The gold standard domain for AI development, machine learning & automation.' },
  { tld: '.io', name: 'Developer & Cloud Tech', category: 'Tech Startups', retailPrice: 65, salePrice: 49, priceAfn: 3430, popular: true, desc: 'Preferred extension for software engineers, SaaS platforms & cloud startups.' },
  { tld: '.net', name: 'Network Infrastructure', category: 'Enterprise Network', retailPrice: 20, salePrice: 15, priceAfn: 1050, popular: false, desc: 'Enterprise infrastructure, internet service providers & networking systems.' }
];

function sanitizeDomainKeyword(raw) {
  if (!raw) return '';
  let clean = raw.trim().toLowerCase();
  clean = clean.replace(/^(https?:\/\/)?(www\.)?/, '');
  clean = clean.replace(/[/?#].*$/, '');
  // Remove trailing extensions if user typed them
  const allTlds = ['.com.af', '.org.af', '.net.af', '.gov.af', '.edu.af', '.af', '.ngo', '.com', '.info', '.ai', '.io', '.net', '.org', '.biz'];
  for (let t of allTlds) {
    if (clean.endsWith(t)) {
      clean = clean.slice(0, -t.length);
      break;
    }
  }
  clean = clean.replace(/[^a-z0-9-]/g, '');
  return clean;
}

function renderDomainResultCards(cleanName, targetTld) {
  let list = OC_DOMAIN_REGISTRY;
  if (targetTld && targetTld !== 'ALL') {
    list = OC_DOMAIN_REGISTRY.filter(item => item.tld === targetTld);
    if (!list.length) {
      list = [{ tld: targetTld, name: targetTld + ' Domain', category: 'Custom Extension', retailPrice: 40, salePrice: 29, priceAfn: 2030, popular: false, desc: 'Custom requested top-level domain.' }];
    }
  }

  let html = `
    <div style="background: rgba(1, 22, 51, 0.95); border: 1.5px solid rgba(56, 189, 248, 0.4); border-radius: 12px; padding: 1.25rem; margin-top: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 0.75rem;">
        <div>
          <span style="font-size: 0.8rem; color: #38bdf8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Search Query:</span>
          <strong style="color: #fff; font-size: 1.1rem; margin-left: 0.35rem;">"${cleanName}"</strong>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span style="color: #34d399; font-weight: 800; font-size: 0.82rem; background: rgba(16, 185, 129, 0.15); padding: 0.25rem 0.65rem; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.3);">
            ✓ Fast-Track Registration in Kabul
          </span>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.85rem;">
  `;

  list.forEach(item => {
    const fullDomain = `${cleanName}${item.tld}`;
    const waText = item.tld === '.ngo'
      ? encodeURIComponent(`Hello Oriental Consultants, AfghanHoster & AfghanDevelopers, I want to register the .ngo domain: ${fullDomain} ($${item.salePrice}/yr or ${item.priceAfn} AFN). We need MoEc registration, cloud hosting, and non-profit portal solutions.`)
      : encodeURIComponent(`Hello Oriental Consultants, I want to register the domain: ${fullDomain} at your lowest price ($${item.salePrice}/yr or ${item.priceAfn} AFN). Please send activation details.`);
    const waUrl = `https://wa.me/93787881808?text=${waText}`;

    html += `
      <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s ease;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <span style="font-size: 0.7rem; font-weight: 800; color: #38bdf8; background: rgba(56, 189, 248, 0.15); padding: 0.15rem 0.5rem; border-radius: 4px; text-transform: uppercase;">
              ${item.category}
            </span>
            <span style="font-size: 0.72rem; color: #34d399; font-weight: 800;">● Available Now</span>
          </div>
          <div style="font-size: 1.15rem; font-weight: 900; color: #fff; margin-bottom: 0.2rem; word-break: break-all;">
            ${fullDomain}
          </div>
          ${item.tld === '.ngo' ? `
            <div style="background: rgba(0, 176, 144, 0.12); border: 1px solid rgba(0, 176, 144, 0.35); border-radius: 6px; padding: 0.4rem 0.6rem; margin-bottom: 0.65rem; font-size: 0.73rem; color: #a7f3d0; line-height: 1.4;">
              🤝 <strong>Tri-Pillar Feed:</strong> Oriental Consultants (MoEc &amp; Tax) &bull; AfghanHoster (Cloud &amp; DNS) &bull; AfghanDevelopers (Software house) (NGO Portals)
            </div>
          ` : ''}
          <div style="font-size: 0.76rem; color: #94a3b8; margin-bottom: 0.75rem; line-height: 1.4;">
            ${item.desc}
          </div>
          <div style="display: flex; align-items: baseline; gap: 0.45rem; margin-bottom: 0.2rem;">
            <span style="font-size: 0.85rem; color: #94a3b8; text-decoration: line-through;">$${item.retailPrice}</span>
            <span style="font-size: 1.35rem; font-weight: 900; color: #38bdf8;">$${item.salePrice}</span>
            <span style="font-size: 0.75rem; color: #94a3b8;">/ year</span>
          </div>
          <div style="font-size: 0.75rem; color: #fbbf24; font-weight: 700; margin-bottom: 0.85rem;">
            Approx. ${item.priceAfn.toLocaleString()} AFN / year
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.45rem;">
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <a href="domains.html?domain=${encodeURIComponent(cleanName)}&tld=${encodeURIComponent(item.tld)}&tab=register#portal" onclick="if(typeof selectDomainForPortal === 'function'){ selectDomainForPortal('${cleanName}', '${item.tld}'); return false; }" style="flex: 1.2; min-width: 155px; text-align: center; background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%); color: #011633; font-weight: 900; font-size: 0.82rem; padding: 0.55rem 0.65rem; border-radius: 6px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.35rem; box-shadow: 0 2px 10px rgba(56,189,248,0.35);">
              🚀 Take Domain ($${item.salePrice}/yr) &rarr;
            </a>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; min-width: 130px; text-align: center; background: #25d366; color: #075e54; font-weight: 800; font-size: 0.8rem; padding: 0.5rem 0.65rem; border-radius: 6px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
              💬 WhatsApp: 0093 787 881808
            </a>
          </div>
          <div style="display: flex; gap: 0.3rem; flex-wrap: wrap;">
            <a href="https://wa.me/93700567868?text=${encodeURIComponent('Hello Oriental Consultants, I need an official AFN invoice quote for domain ' + fullDomain)}" target="_blank" rel="noopener noreferrer" style="flex: 1; min-width: 85px; text-align: center; background: rgba(255,255,255,0.08); color: #fff; font-weight: 700; font-size: 0.72rem; padding: 0.35rem 0.4rem; border-radius: 5px; text-decoration: none; border: 1px solid rgba(255,255,255,0.18);" title="Official Invoicing & Afghani Payment Desk">
              🧾 0093 700 567868
            </a>
            <a href="https://wa.me/93792002341?text=${encodeURIComponent('Hello Oriental Consultants, I need DNS and technical setup for ' + fullDomain)}" target="_blank" rel="noopener noreferrer" style="flex: 1; min-width: 85px; text-align: center; background: rgba(56, 189, 248, 0.12); color: #38bdf8; font-weight: 700; font-size: 0.72rem; padding: 0.35rem 0.4rem; border-radius: 5px; text-decoration: none; border: 1px solid rgba(56, 189, 248, 0.25);" title="Technical & DNS Config Desk">
              ⚙️ Tech: 0093 792002341
            </a>
            <a href="https://wa.me/923219744347?text=${encodeURIComponent('Hello Oriental Consultants, international domain enquiry for ' + fullDomain)}" target="_blank" rel="noopener noreferrer" style="flex: 1; min-width: 85px; text-align: center; background: rgba(255,255,255,0.08); color: #94a3b8; font-weight: 700; font-size: 0.72rem; padding: 0.35rem 0.4rem; border-radius: 5px; text-decoration: none; border: 1px solid rgba(255,255,255,0.15);" title="Regional Desk">
              🌐 0092 321 9744347
            </a>
          </div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
      <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-size: 0.78rem; color: #94a3b8;">
        <span>🔒 Includes Free DNS Zone Management &bull; WHOIS Privacy &bull; Local Bank Transfer (Azizi/Kabul Bank)</span>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <span>WhatsApp Desks: <a href="https://wa.me/93787881808" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none; font-weight: 700;">0093 787 881808</a> | <a href="https://wa.me/93700567868" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none; font-weight: 700;">0093 700 567868</a> | <a href="https://wa.me/93792002341" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none; font-weight: 700;">0093 792002341</a> | <a href="https://wa.me/923219744347" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none; font-weight: 700;">0092 321 9744347</a></span>
        </div>
      </div>
    </div>
  `;

  return html;
}

function handleMainDomainSearch(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('mainDomainSearchInput');
  const extSelect = document.getElementById('mainDomainExtSelect');
  const resultsContainer = document.getElementById('mainDomainSearchResults');
  if (!input || !resultsContainer) return;

  const raw = input.value;
  const clean = sanitizeDomainKeyword(raw);
  if (!clean) {
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = '<div style="color: #f87171; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 0.75rem 1rem; font-weight: 700; font-size: 0.88rem;">⚠️ Please enter a domain name (e.g. mycompany, kabultech, hopeafghan).</div>';
    return;
  }

  const ext = extSelect ? extSelect.value : 'ALL';
  resultsContainer.style.display = 'block';
  resultsContainer.innerHTML = renderDomainResultCards(clean, ext);
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function handleHeroQuickDomainSearch(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('heroQuickDomainInput');
  const extSelect = document.getElementById('heroQuickDomainExt');
  const resultsContainer = document.getElementById('heroQuickDomainResults');
  if (!input) return;

  const clean = sanitizeDomainKeyword(input.value);
  if (!clean) {
    if (resultsContainer) {
      resultsContainer.innerHTML = '<span style="color: #f87171; font-size: 0.8rem; font-weight: 700;">⚠️ Please enter a domain name</span>';
    }
    return;
  }

  // Also sync with mainDomainSearchInput if present on page
  const mainInput = document.getElementById('mainDomainSearchInput');
  const mainExt = document.getElementById('mainDomainExtSelect');
  if (mainInput) {
    mainInput.value = clean;
    if (mainExt && extSelect) {
      mainExt.value = extSelect.value;
    }
    handleMainDomainSearch();
  } else if (resultsContainer) {
    const ext = extSelect ? extSelect.value : '.af';
    const item = OC_DOMAIN_REGISTRY.find(d => d.tld === ext) || OC_DOMAIN_REGISTRY[0];
    const fullDomain = `${clean}${item.tld}`;
    const waUrl = `https://wa.me/93787881808?text=${encodeURIComponent('Hello Oriental Consultants, I want to register: ' + fullDomain + ' at $' + item.salePrice + '/yr (' + item.priceAfn + ' AFN).')}`;
    resultsContainer.innerHTML = `
      <div style="background: rgba(2, 18, 38, 0.95); border: 1px solid rgba(56, 189, 248, 0.5); border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.35rem;">
        <div>
          <strong style="color: #fff; font-size: 0.92rem;">${fullDomain}</strong>
          <span style="color: #34d399; font-size: 0.75rem; font-weight: 800; margin-left: 0.35rem;">Available</span>
          <div style="font-size: 0.75rem; color: #fbbf24; font-weight: 700;">$${item.salePrice}/yr (~${item.priceAfn} AFN)</div>
        </div>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="background: #25d366; color: #075e54; font-weight: 800; font-size: 0.75rem; padding: 0.4rem 0.75rem; border-radius: 6px; text-decoration: none;">
          💬 WhatsApp: 0093 787 881808 &rarr;
        </a>
      </div>
    `;
  }
}

function handleSlideDomainSearch(e, inputId, extId, resultsId) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById(inputId);
  const extSelect = document.getElementById(extId);
  const resultsContainer = document.getElementById(resultsId);
  if (!input || !resultsContainer) return;

  const clean = sanitizeDomainKeyword(input.value);
  if (!clean) {
    resultsContainer.innerHTML = '<span style="color: #f87171; font-size: 0.8rem; font-weight: 700;">⚠️ Enter a domain name first</span>';
    return;
  }

  const ext = extSelect ? extSelect.value : '.af';
  const item = OC_DOMAIN_REGISTRY.find(d => d.tld === ext) || OC_DOMAIN_REGISTRY[0];
  const fullDomain = `${clean}${item.tld}`;
  const waUrl = `https://wa.me/93787881808?text=${encodeURIComponent('Hello Oriental Consultants, I want to register: ' + fullDomain + ' at $' + item.salePrice + '/yr (' + item.priceAfn + ' AFN).')}`;

  resultsContainer.innerHTML = `
    <div style="background: rgba(2, 18, 38, 0.95); border: 1px solid rgba(56, 189, 248, 0.5); border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.35rem;">
      <div>
        <strong style="color: #fff; font-size: 0.92rem;">${fullDomain}</strong>
        <span style="color: #34d399; font-size: 0.75rem; font-weight: 800; margin-left: 0.35rem;">Available</span>
        <div style="font-size: 0.75rem; color: #fbbf24; font-weight: 700;">$${item.salePrice}/yr (~${item.priceAfn} AFN)</div>
      </div>
      <div style="display: flex; gap: 0.25rem;">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="background: #25d366; color: #075e54; font-weight: 800; font-size: 0.75rem; padding: 0.4rem 0.65rem; border-radius: 6px; text-decoration: none;">
          💬 WhatsApp &rarr;
        </a>
        <a href="https://wa.me/93700567868?text=${encodeURIComponent('Hello, quote for ' + fullDomain)}" target="_blank" rel="noopener noreferrer" style="background: rgba(255,255,255,0.1); color: #fff; font-weight: 700; font-size: 0.72rem; padding: 0.4rem 0.55rem; border-radius: 6px; text-decoration: none;">
          AFN Quote
        </a>
      </div>
    </div>
  `;
}

function selectTldChip(tld) {
  const select = document.getElementById('mainDomainExtSelect');
  if (select) {
    select.value = tld;
  }
  document.querySelectorAll('.tld-chip').forEach(btn => {
    if (btn.getAttribute('data-tld') === tld) {
      btn.style.background = 'rgba(56, 189, 248, 0.25)';
      btn.style.borderColor = '#38bdf8';
      btn.style.color = '#38bdf8';
    } else {
      btn.style.background = 'rgba(255, 255, 255, 0.08)';
      btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      btn.style.color = '#fff';
    }
  });

  const input = document.getElementById('mainDomainSearchInput');
  if (input && input.value.trim()) {
    handleMainDomainSearch();
  }
}

// Auto-run domain search if URL contains query parameter (?domain=... or ?q=...)
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('domain') || urlParams.get('q');
  if (q) {
    const input = document.getElementById('mainDomainSearchInput') || document.getElementById('heroQuickDomainInput');
    if (input) {
      input.value = q;
      handleMainDomainSearch();
    }
  }
});



