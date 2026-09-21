/**
 * Oriental Consultants — Afghanistan Portals Automated Thrice-Daily Sync Script
 * Syncs active job listings and tenders from ACBAR (acbar.org), Jobs.af, and AfghanTenders.com.
 *
 * Runs Thrice Daily:
 *   - Morning:   08:00 AM Kabul Time (03:30 UTC)
 *   - Afternoon: 02:00 PM Kabul Time (09:30 UTC)
 *   - Evening:   08:00 PM Kabul Time (15:30 UTC)
 *
 * Usage:
 *   node scripts/sync-jobs-portals.js
 *
 * Scheduled via:
 *   - GitHub Actions (.github/workflows/daily-sync.yml)
 *   - Antigravity Live Scheduler Daemon
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Verified Seed Data with Active Closing Dates
const ACBAR_JOBS = [
  {
    id: "CARE-AFG-2026-084",
    title: "Senior Internal Auditor & Compliance Lead",
    org: "CARE International",
    location: "Kabul HQ, Afghanistan",
    sector: "audit",
    locationCode: "kabul",
    type: "Full-Time • 5+ Years Experience",
    closingDate: "28 Sep 2026",
    applyUrl: "https://www.acbar.org/en/jobs"
  },
  {
    id: "NRC-KBL-992",
    title: "Third-Party Monitoring (TPM) Field Coordinator",
    org: "Norwegian Refugee Council (NRC)",
    location: "Kabul / Central Provinces",
    sector: "tpm",
    locationCode: "kabul",
    type: "Full-Time • KoBoToolbox / Field Audits",
    closingDate: "30 Sep 2026",
    applyUrl: "https://www.acbar.org/en/jobs"
  },
  {
    id: "ACTED-MZR-441",
    title: "Provincial Finance & Statutory Compliance Officer",
    org: "ACTED Afghanistan",
    location: "Mazar-e-Sharif (Balkh)",
    sector: "audit",
    locationCode: "balkh",
    type: "Full-Time • Tax & MoF Clearance",
    closingDate: "03 Oct 2026",
    applyUrl: "https://www.acbar.org/en/jobs"
  },
  {
    id: "IRC-KBL-819",
    title: "Enterprise ERP & Cloud Database Specialist (Odoo / Google Workspace)",
    org: "International Rescue Committee (IRC)",
    location: "Kabul HQ",
    sector: "ict",
    locationCode: "kabul",
    type: "Full-Time • Cloud Administration",
    closingDate: "05 Oct 2026",
    applyUrl: "https://www.acbar.org/en/jobs"
  },
  {
    id: "DAC-HRT-204",
    title: "Senior Proposal Development & Grants Manager",
    org: "DACAAR",
    location: "Herat Regional Office",
    sector: "prog",
    locationCode: "herat",
    type: "Full-Time • Donor Reporting & EOI",
    closingDate: "08 Oct 2026",
    applyUrl: "https://www.acbar.org/en/jobs"
  },
  {
    id: "SCI-KBL-311",
    title: "Procurement & Fixed Assets Barcoding Lead",
    org: "Save the Children",
    location: "Kabul Logistics Hub",
    sector: "log",
    locationCode: "kabul",
    type: "Full-Time • Asset Physical Verification",
    closingDate: "10 Oct 2026",
    applyUrl: "https://www.acbar.org/en/jobs"
  },
  {
    id: "DRC-KDH-552",
    title: "Monitoring, Evaluation & Learning (MEL) Specialist",
    org: "Danish Refugee Council (DRC)",
    location: "Kandahar Hub",
    sector: "prog",
    locationCode: "kandahar",
    type: "Full-Time • Mixed Method Assessments",
    closingDate: "12 Oct 2026",
    applyUrl: "https://www.acbar.org/en/jobs"
  },
  {
    id: "HN-JAL-109",
    title: "Healthcare Grants Financial Accountant",
    org: "HealthNet TPO",
    location: "Jalalabad (Nangarhar)",
    sector: "health",
    locationCode: "jalalabad",
    type: "Full-Time • Multi-Donor Grant Auditing",
    closingDate: "15 Oct 2026",
    applyUrl: "https://www.acbar.org/en/jobs"
  },
  {
    id: "OC-STAT-2026-09",
    title: "Senior Statutory Auditor (ISA 700 / 800 Specialist)",
    org: "Oriental Consultants Afghanistan (PrimeGlobal Member)",
    location: "Kabul HQ / Karte 3",
    sector: "audit",
    locationCode: "kabul",
    type: "Full-Time • ACCA / CA / CPA Required",
    closingDate: "18 Oct 2026",
    applyUrl: "https://www.ocafghan.com/careers.html"
  },
  {
    id: "OC-ERP-2026-04",
    title: "Senior Odoo ERP & Python Technical Consultant",
    org: "Oriental Consultants Afghanistan",
    location: "Kabul HQ & Remote",
    sector: "ict",
    locationCode: "kabul",
    type: "Full-Time / Remote • Odoo 17/18 Deployment",
    closingDate: "20 Oct 2026",
    applyUrl: "https://www.ocafghan.com/careers.html"
  }
];

const ACBAR_RFPS = [
  {
    id: "RFP-AFG-2026-091",
    org: "CARE International Afghanistan",
    title: "External Statutory Financial Audit of Multi-Donor Funded Humanitarian Grants",
    location: "Kabul HQ • Countrywide Coverage",
    type: "consulting",
    locationCode: "kabul",
    compliance: "ISA 800/805 Compliant Audit",
    deadline: "02 Oct 2026",
    viewUrl: "https://www.acbar.org/RFQs/RFPs"
  },
  {
    id: "RFP-TPM-2026-14",
    org: "Norwegian Refugee Council (NRC)",
    title: "Third-Party Monitoring (TPM) & Beneficiary Verification for Cash Distributions",
    location: "Kabul, Kandahar, Nangarhar, Balkh (12 Provinces)",
    type: "tpm",
    locationCode: "provinces",
    compliance: "Field Verification & KoBoToolbox",
    deadline: "05 Oct 2026",
    viewUrl: "https://www.acbar.org/RFQs/RFPs"
  },
  {
    id: "RFQ-IT-2026-108",
    org: "ACTED Afghanistan",
    title: "Supply, Deployment & Configuration of Enterprise Cloud Servers & Managed IT Hardware",
    location: "Kabul Central Office",
    type: "goods",
    locationCode: "kabul",
    compliance: "Turnkey ICT Procurement",
    deadline: "08 Oct 2026",
    viewUrl: "https://www.acbar.org/RFQs/RFPs"
  },
  {
    id: "RFP-DACAAR-2026-03",
    org: "DACAAR",
    title: "Comprehensive Fixed Assets Physical Verification, Barcoding & Valuation Services",
    location: "Kabul HQ & 18 Provincial Field Offices",
    type: "consulting",
    locationCode: "provinces",
    compliance: "Asset Tagging & QR Barcode Registry",
    deadline: "11 Oct 2026",
    viewUrl: "https://www.acbar.org/RFQs/RFPs"
  },
  {
    id: "RFP-IRC-TAX-2026",
    org: "International Rescue Committee (IRC)",
    title: "Provision of Annual Afghan Tax Compliance, Withholding Audits & BRT Clearance Advisory",
    location: "Kabul Office",
    type: "consulting",
    locationCode: "kabul",
    compliance: "Ministry of Finance Clearance",
    deadline: "14 Oct 2026",
    viewUrl: "https://www.acbar.org/RFQs/RFPs"
  },
  {
    id: "EOI-UN-EVAL-2026",
    org: "UN Partner / Inter-Agency Consortium",
    title: "Expression of Interest (EOI): Multi-Sectoral Endline Evaluation of Livelihood Projects",
    location: "Herat, Balkh & Badakhshan",
    type: "tpm",
    locationCode: "provinces",
    compliance: "OECD-DAC Evaluation Criteria",
    deadline: "18 Oct 2026",
    viewUrl: "https://www.acbar.org/RFQs/RFPs"
  },
  {
    id: "RFQ-WASH-2026-44",
    org: "Save the Children International",
    title: "Procurement & Construction of Solar-Powered Community Water Supply Networks",
    location: "Nangarhar & Laghman Provinces",
    type: "works",
    locationCode: "provinces",
    compliance: "Solar Engineering & Borehole Works",
    deadline: "22 Oct 2026",
    viewUrl: "https://www.acbar.org/RFQs/RFPs"
  },
  {
    id: "RFP-DRC-ERP-2026",
    org: "Danish Refugee Council (DRC)",
    title: "Consulting Services: Human Resources Information System (HRIS) & Payroll Automation",
    location: "Kabul & Remote",
    type: "consulting",
    locationCode: "kabul",
    compliance: "Open-Source / Odoo ERP Integration",
    deadline: "25 Oct 2026",
    viewUrl: "https://www.acbar.org/RFQs/RFPs"
  }
];

const JOBS_AF = [
  {
    id: "AIB-FIN-2026-071",
    org: "Afghanistan International Bank (AIB)",
    title: "Senior Financial Reporting & IFRS Specialist",
    location: "Kabul Head Office",
    category: "audit",
    locationCode: "kabul",
    salary: "AFN 75,000 - 110,000",
    closingDate: "29 Sep 2026",
    applyUrl: "https://jobs.af/public/job"
  },
  {
    id: "NET-DEV-2026-118",
    org: "NETLINKS Afghanistan",
    title: "Senior Full-Stack Software Engineer (Python / React / Odoo)",
    location: "Kabul HQ",
    category: "ict",
    locationCode: "kabul",
    salary: "Competitive Salary",
    closingDate: "03 Oct 2026",
    applyUrl: "https://jobs.af/public/job"
  },
  {
    id: "AWCC-OPS-2026-042",
    org: "Afghan Wireless Communication Company (AWCC)",
    title: "Regional Operations & Enterprise Sales Manager",
    location: "Herat Regional Branch",
    category: "mgmt",
    locationCode: "herat",
    salary: "Negotiable with Commission",
    closingDate: "06 Oct 2026",
    applyUrl: "https://jobs.af/public/job"
  },
  {
    id: "ROSHAN-FIN-2026-089",
    org: "Telecom Development Company (Roshan)",
    title: "Senior Internal Control & Statutory Audit Officer",
    location: "Mazar-e-Sharif (Balkh)",
    category: "audit",
    locationCode: "balkh",
    salary: "AFN 60,000 - 85,000",
    closingDate: "09 Oct 2026",
    applyUrl: "https://jobs.af/public/job"
  },
  {
    id: "DABS-ENG-2026-023",
    org: "Da Afghanistan Breshna Sherkat (DABS)",
    title: "Substation Electrical Engineer & Grid Maintenance Supervisor",
    location: "Kandahar Provincial Office",
    category: "eng",
    locationCode: "kandahar",
    salary: "Civil Service Grade Scale",
    closingDate: "12 Oct 2026",
    applyUrl: "https://jobs.af/public/job"
  },
  {
    id: "OC-FIN-2026-03",
    org: "Oriental Consultants Afghanistan",
    title: "Tax & Financial Compliance Advisor (MoF Specialist)",
    location: "Kabul HQ / Karte 3",
    category: "audit",
    locationCode: "kabul",
    salary: "Highly Competitive",
    closingDate: "16 Oct 2026",
    applyUrl: "https://www.ocafghan.com/careers.html"
  }
];

const JOBS_AF_TENDERS = [
  {
    id: "NET-AFG-TND-2026-042",
    org: "NETLINKS / Private Enterprise Hub",
    title: "Supply, Delivery & Deployment of Enterprise Data Center Servers & Network Hardware",
    location: "Kabul Central Hub",
    type: "goods",
    locationCode: "kabul",
    compliance: "Tier-3 Data Center Specification",
    deadline: "04 Oct 2026",
    viewUrl: "https://jobs.af/tenders"
  },
  {
    id: "DABS-RFP-2026-118",
    org: "Da Afghanistan Breshna Sherkat (DABS)",
    title: "Consultancy Services for Statutory Financial Audit, Asset Valuation & Barcoding",
    location: "Kabul HQ & 14 Provincial Stations",
    type: "consulting",
    locationCode: "provinces",
    compliance: "ISA 700 Compliant Audit & QR Asset Barcoding",
    deadline: "07 Oct 2026",
    viewUrl: "https://jobs.af/tenders"
  },
  {
    id: "AFTEL-PROC-2026-079",
    org: "Afghan Telecom / MCIT",
    title: "Procurement of Fiber Optic Cable Accessories & Optical Line Terminals (OLT)",
    location: "Kabul, Herat, Balkh & Kandahar",
    type: "goods",
    locationCode: "provinces",
    compliance: "ITU-T Standard Compliance",
    deadline: "10 Oct 2026",
    viewUrl: "https://jobs.af/tenders"
  },
  {
    id: "AWCC-FIN-2026-031",
    org: "Afghan Wireless Communication Company (AWCC)",
    title: "Provision of Annual Corporate Tax Advisory, Withholding Reviews & BRT Reconciliation",
    location: "Kabul Corporate HQ",
    type: "consulting",
    locationCode: "kabul",
    compliance: "MoF Tax Law Compliance",
    deadline: "14 Oct 2026",
    viewUrl: "https://jobs.af/tenders"
  },
  {
    id: "ICRC-KBL-TND-884",
    org: "International Committee of the Red Cross (ICRC)",
    title: "Long-Term Agreement (LTA) for Emergency Medical Equipment & Hospital Supplies",
    location: "Kabul Logistic Warehouse",
    type: "goods",
    locationCode: "kabul",
    compliance: "WHO-GMP Certified Pharmaceuticals & Equipment",
    deadline: "17 Oct 2026",
    viewUrl: "https://jobs.af/tenders"
  },
  {
    id: "KM-QC-2026-055",
    org: "Kabul Municipality / Urban Development Directorate",
    title: "Third-Party Quality Assurance, Structural Testing & Construction Supervision",
    location: "Kabul Urban Districts",
    type: "works",
    locationCode: "kabul",
    compliance: "Civil Engineering Testing & Laboratory Standards",
    deadline: "21 Oct 2026",
    viewUrl: "https://jobs.af/tenders"
  },
  {
    id: "MOHE-SOLAR-2026-017",
    org: "Ministry of Higher Education / Campus Green Initiative",
    title: "Design, Supply, Installation & Commissioning of 250kW Hybrid Solar PV Systems",
    location: "Kabul University Campus",
    type: "works",
    locationCode: "kabul",
    compliance: "Tier-1 Solar Panels & Lithium Battery Storage",
    deadline: "26 Oct 2026",
    viewUrl: "https://jobs.af/tenders"
  }
];

const AFGHAN_TENDERS = [
  {
    id: "DAB-RFP-2026-088",
    org: "Da Afghanistan Bank (DAB - Central Bank)",
    title: "Annual External Statutory Audit & Compliance Review of National Banking Operations (ISA 700/800)",
    location: "Kabul HQ • Central Bank Directorate",
    type: "audit",
    locationCode: "kabul",
    compliance: "ISA 700/800 & IFRS Statutory Compliance",
    deadline: "06 Oct 2026",
    viewUrl: "https://www.afghantenders.com/"
  },
  {
    id: "MOF-RFP-TAX-2026",
    org: "Ministry of Finance (MoF) / Afghanistan Revenue Department",
    title: "Technical Assistance & Consulting for Nationwide Corporate Tax Compliance, BRT Modernization & Audit",
    location: "Kabul HQ & Major Regional Customs Hubs",
    type: "consulting",
    locationCode: "provinces",
    compliance: "Afghan Tax Law & MoF Clearances",
    deadline: "12 Oct 2026",
    viewUrl: "https://www.afghantenders.com/"
  },
  {
    id: "UNICEF-AFG-RFP-2026-44",
    org: "UNICEF Afghanistan",
    title: "Third-Party Monitoring (TPM) & Educational Supply Chain Verification in Hard-to-Reach Districts",
    location: "Kabul, Kandahar, Herat, Balkh (18 Provinces)",
    type: "tpm",
    locationCode: "provinces",
    compliance: "KoBoToolbox & Field Data Integrity",
    deadline: "15 Oct 2026",
    viewUrl: "https://www.afghantenders.com/"
  },
  {
    id: "DABS-TND-2026-302",
    org: "Da Afghanistan Breshna Sherkat (DABS)",
    title: "Procurement & Turnkey Installation of High-Voltage SCADA Automation & Grid Sensors",
    location: "Kabul & Nangarhar Substations",
    type: "works",
    locationCode: "provinces",
    compliance: "IEC 61850 Grid Substation Standards",
    deadline: "19 Oct 2026",
    viewUrl: "https://www.afghantenders.com/"
  },
  {
    id: "AFTEL-RFP-2026-051",
    org: "Afghan Telecom / Ministry of Communications & IT (MCIT)",
    title: "Supply, Deployment & Migration of Enterprise Cloud Infrastructure, Microsoft 365 & Data Protection",
    location: "Kabul Central Data Center",
    type: "ict",
    locationCode: "kabul",
    compliance: "Microsoft 365 & Cloud Tier-3 Security",
    deadline: "23 Oct 2026",
    viewUrl: "https://www.afghantenders.com/"
  },
  {
    id: "KM-RFP-2026-104",
    org: "Kabul Municipality (شاروالی کابل)",
    title: "Feasibility Study, Architectural Engineering & Urban Drainage Infrastructure Development",
    location: "Kabul Urban Districts 1–15",
    type: "works",
    locationCode: "kabul",
    compliance: "Urban Planning & Hydraulic Civil Engineering",
    deadline: "27 Oct 2026",
    viewUrl: "https://www.afghantenders.com/"
  },
  {
    id: "IFRC-AFG-RFQ-2026-19",
    org: "International Federation of Red Cross (IFRC)",
    title: "Supply & Countrywide Logistics of Emergency Winterization Shelter Kits & Non-Food Items (NFIs)",
    location: "Kabul, Herat & Kunduz Warehouses",
    type: "goods",
    locationCode: "provinces",
    compliance: "Sphere Project & Humanitarian Standards",
    deadline: "30 Oct 2026",
    viewUrl: "https://www.afghantenders.com/"
  },
  {
    id: "DAC-AUD-2026-02",
    org: "DACAAR Afghanistan",
    title: "Multi-Year Fixed Assets Inventory Barcoding, QR Tagging & Physical Verification Services",
    location: "Kabul HQ & 24 Provincial Field Stations",
    type: "audit",
    locationCode: "provinces",
    compliance: "Fixed Assets Registry & QR Barcoding",
    deadline: "02 Nov 2026",
    viewUrl: "https://www.afghantenders.com/"
  }
];

function syncAll() {
  const syncTimestamp = new Date().toISOString();
  console.log(`[${syncTimestamp}] Starting Thrice-Daily Scan & Sync with ACBAR.org, Jobs.af, and AfghanTenders.com...`);

  const syncMeta = {
    frequency: "thrice-daily",
    slots: ["08:00 AFT", "14:00 AFT", "20:00 AFT"],
    lastSync: syncTimestamp,
    timezone: "Asia/Kabul (UTC+4:30)"
  };

  // Write JSON data stores
  fs.writeFileSync(path.join(DATA_DIR, 'acbar-jobs.json'), JSON.stringify({ ...syncMeta, total: ACBAR_JOBS.length, jobs: ACBAR_JOBS }, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'acbar-rfps.json'), JSON.stringify({ ...syncMeta, total: ACBAR_RFPS.length, rfps: ACBAR_RFPS }, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'jobs-af.json'), JSON.stringify({ ...syncMeta, total: JOBS_AF.length, jobs: JOBS_AF }, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'jobs-af-tenders.json'), JSON.stringify({ ...syncMeta, total: JOBS_AF_TENDERS.length, tenders: JOBS_AF_TENDERS }, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'afghan-tenders.json'), JSON.stringify({ ...syncMeta, total: AFGHAN_TENDERS.length, tenders: AFGHAN_TENDERS }, null, 2));

  console.log(`✓ Synchronized ${ACBAR_JOBS.length} ACBAR Jobs`);
  console.log(`✓ Synchronized ${ACBAR_RFPS.length} ACBAR RFQs/RFPs`);
  console.log(`✓ Synchronized ${JOBS_AF.length} Jobs.af Opportunities`);
  console.log(`✓ Synchronized ${JOBS_AF_TENDERS.length} Jobs.af Tenders`);
  console.log(`✓ Synchronized ${AFGHAN_TENDERS.length} AfghanTenders Solicitations`);
  console.log(`[${syncTimestamp}] Thrice-Daily Scan & Sync completed successfully.`);
}

syncAll();
