const fs = require('fs');
const path = require('path');

const DIRS = [
  'D:\\ocafghan.com',
  'D:\\orientalconsultants'
];

// Master template for Desktop Navigation
function getDesktopNav(activeSection) {
  return `<nav aria-label="Primary Navigation">
        <ul class="nav-menu">
          <li class="nav-item"><a href="index.html" class="nav-link${activeSection === 'home' ? ' active' : ''}">Home</a></li>
          
          <!-- Services & Solutions (3-Column Mega Menu) -->
          <li class="nav-item has-mega-menu">
            <a href="services.html" class="nav-link${activeSection === 'services' ? ' active' : ''}">
              Services &amp; Solutions
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </a>
            <div class="dropdown-menu dropdown-menu-mega">
              <div class="mega-menu-grid">
                <!-- Column 1: Financial & Audit Practice -->
                <div class="mega-col">
                  <div class="mega-col-header">
                    <h5 class="mega-col-title">Financial &amp; Audit</h5>
                    <span class="smart-menu-tag">7 Practices</span>
                  </div>
                  <ul class="mega-col-links smart-links">
                    <li>
                      <a href="accounting.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Accounting &amp; Financial Mgmt <span class="smart-pill gold">IFRS / GAAP</span></span>
                          <span class="smart-link-desc">GL, Financial Statements &amp; Year-End Closing</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="audit.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Statutory Audit &amp; Assurance <span class="smart-pill blue">ISA Standards</span></span>
                          <span class="smart-link-desc">Independent Audit &amp; PrimeGlobal USA Defense</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="tax-advisory.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Tax Advisory &amp; BRT Clearance <span class="smart-pill green">MoF Approved</span></span>
                          <span class="smart-link-desc">BRT Art 64, CIT Filing &amp; Withholding Tax</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="donor-audit.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Donor &amp; Grant Project Audit <span class="smart-pill cyan">UN · USAID · WB</span></span>
                          <span class="smart-link-desc">Fiduciary Verification across 34 Provinces</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="forensic-audit.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Forensic Audit &amp; Investigation <span class="smart-pill purple">Fraud &amp; AML</span></span>
                          <span class="smart-link-desc">Asset Tracing, FinTRACA &amp; Dispute Defense</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="asset-valuation.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Fixed Assets Barcoding <span class="smart-pill amber">Valuation</span></span>
                          <span class="smart-link-desc">Physical Tagging &amp; Engineering Appraisals</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="tax-calculator.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Afghanistan Tax Calculator <span class="smart-pill green">Interactive</span></span>
                          <span class="smart-link-desc">Live Salary Withholding &amp; BRT Calculation</span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>

                <!-- Column 2: Cloud & Enterprise ERP Systems -->
                <div class="mega-col">
                  <div class="mega-col-header">
                    <h5 class="mega-col-title">Cloud &amp; Enterprise ERP</h5>
                    <span class="smart-menu-tag">Tier-1 Systems</span>
                  </div>
                  <ul class="mega-col-links smart-links">
                    <li>
                      <a href="sap-erp.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">SAP Business One &amp; S/4HANA <span class="smart-pill blue">Tier-1 ERP</span></span>
                          <span class="smart-link-desc">Supply Chain, MRP, Multi-Currency &amp; Finance</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="ms-dynamics.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Microsoft Dynamics 365 <span class="smart-pill purple">BC &amp; F&amp;O</span></span>
                          <span class="smart-link-desc">Cloud ERP, Copilot AI &amp; Power BI Analytics</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="odoo.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Odoo ERP Implementation <span class="smart-pill green">Ready Partner</span></span>
                          <span class="smart-link-desc">Modular ERP, CRM &amp; Afghan BRT Automation</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="quickbooks.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">QuikBok Enterprise 2025/2026 <span class="smart-pill gold">ProAdvisor</span></span>
                          <span class="smart-link-desc">Intuit Gold Partner, Multi-User Cloud &amp; Stock</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="tsplus.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">TSplus Remote Cloud <span class="smart-pill amber">Hosting</span></span>
                          <span class="smart-link-desc">Web Access for Desktop QuikBok &amp; Windows</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="microsoft-365.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Microsoft 365 Solutions <span class="smart-pill cyan">Cloud Office</span></span>
                          <span class="smart-link-desc">Exchange, Teams, SharePoint &amp; Zero Trust</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="ict.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Google Workspace Deployment <span class="smart-pill blue">Official</span></span>
                          <span class="smart-link-desc">Google Cloud Partner in Afghanistan</span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>

                <!-- Column 3: Strategy & Advisory -->
                <div class="mega-col">
                  <div class="mega-col-header">
                    <h5 class="mega-col-title">Strategy &amp; Advisory</h5>
                    <span class="smart-menu-tag">Advisory</span>
                  </div>
                  <ul class="mega-col-links smart-links">
                    <li>
                      <a href="program-design.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Program Design &amp; Delivery <span class="smart-pill gold">Donor Ready</span></span>
                          <span class="smart-link-desc">Interventions, Logframes &amp; Grants</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="proposal-writing.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Proposal &amp; Business Plans <span class="smart-pill blue">High Win-Rate</span></span>
                          <span class="smart-link-desc">RFP/RFQ Responses &amp; Feasibility</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="monitoring.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Third-Party Monitoring (TPM) <span class="smart-pill green">34 Provinces</span></span>
                          <span class="smart-link-desc">Independent M&amp;E Verification &amp; GPS</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="ai-services.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">AI Integration Services <span class="smart-pill purple">Automation</span></span>
                          <span class="smart-link-desc">Custom LLMs, OCR &amp; Workflow Bots</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="training.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Training &amp; Capacity Building <span class="smart-pill amber">IFC Certified</span></span>
                          <span class="smart-link-desc">Accounting, ERP &amp; Executive Skills</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="research.html">
                        <span class="smart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                        <div class="smart-link-body">
                          <span class="smart-link-title">Research &amp; Evaluation <span class="smart-pill cyan">Baseline / Endline</span></span>
                          <span class="smart-link-desc">Surveys, Impact Studies &amp; Data</span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Mega Menu Bottom Callout Banner (With Dedicated Domain Search Portal) -->
              <div class="mega-menu-footer">
                <div class="mega-footer-text">
                  <strong>Official .AF &amp; Global Domain Registry &bull; DNS Control Portal</strong>
                  <span>Accredited registrar for <code>.af</code>, <code>.com</code>, <code>.org</code> &amp; NGO domains with live automated zone management.</span>
                </div>
                <a href="domains.html" class="blinking-domain-btn" title="Search .AF &amp; Global Domains — Special: Get Free .NGO Domain for Nonprofits">
                  <span class="domain-blink-dot"></span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <span>Search .AF &amp; Global Domains &rarr;</span>
                  <span class="domain-ngo-pill">🎁 Get Free .NGO Domain</span>
                </a>
              </div>
            </div>
          </li>

          <!-- About Us Dropdown -->
          <li class="nav-item">
            <a href="about.html" class="nav-link${activeSection === 'about' ? ' active' : ''}">
              About
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </a>
            <ul class="dropdown-menu">
              <li class="dropdown-item"><a href="about.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Corporate Heritage &amp; 18 Yrs</a></li>
              <li class="dropdown-item"><a href="team.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Executive Leadership &amp; Team</a></li>
              <li class="dropdown-item"><a href="branches.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Global Hubs &amp; Branches</a></li>
            </ul>
          </li>

          <!-- Partnerships Dropdown -->
          <li class="nav-item">
            <a href="primeglobal.html" class="nav-link${activeSection === 'partnerships' ? ' active' : ''}">
              Partnerships
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </a>
            <ul class="dropdown-menu">
              <li class="dropdown-item"><a href="primeglobal.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg> PrimeGlobal USA ($2.93B)</a></li>
              <li class="dropdown-item"><a href="afghanhoster.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg> AfghanHoster (Cloud &amp; .AF)</a></li>
              <li class="dropdown-item"><a href="afghandevelopers.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> AfghanDevelopers (Software house)</a></li>
              <li class="dropdown-item"><a href="tsplus.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg> TSplus (Remote Desktop &amp; Cloud)</a></li>
              <li class="dropdown-item"><a href="wafa-consultants.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Wafa Consultants (Associate)</a></li>
              <li class="dropdown-item"><a href="ict.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/></svg> Google Workspace Partner</a></li>
              <li class="dropdown-item"><a href="microsoft-365.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg> Microsoft 365 Solutions</a></li>
              <li class="dropdown-item"><a href="odoo.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> Official Odoo Ready Partner</a></li>
              <li class="dropdown-item"><a href="quickbooks.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/></svg> QuikBok ProAdvisor</a></li>
              <li class="dropdown-item"><a href="domains.html" style="font-weight: 700; color: #38bdf8;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Domain Search Hub (.af / .com / .ngo)</a></li>
            </ul>
          </li>

          <!-- Insights & Tools Dropdown -->
          <li class="nav-item">
            <a href="case-studies.html" class="nav-link${activeSection === 'insights' ? ' active' : ''}">
              Insights &amp; Tools
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </a>
            <ul class="dropdown-menu">
              <li class="dropdown-item"><a href="case-studies.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Case Studies &amp; Track Record</a></li>
              <li class="dropdown-item"><a href="tax-calculator.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/></svg> Afghanistan Tax Calculator</a></li>
              <li class="dropdown-item"><a href="research.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Research &amp; Evaluation</a></li>
            </ul>
          </li>

          <!-- Dedicated Careers Dropdown -->
          <li class="nav-item">
            <a href="careers.html" class="nav-link${activeSection === 'careers' ? ' active' : ''}">
              Careers &amp; Portals
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </a>
            <ul class="dropdown-menu">
              <li class="dropdown-item"><a href="jobs-hub.html" style="font-weight: 700; color: #38bdf8;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> All Afghanistan Jobs Hub (ACBAR, Jobs.af &amp; Wazifaha)</a></li>
              <li class="dropdown-item"><a href="tenders-hub.html" style="font-weight: 700; color: #fbbf24;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> All Afghanistan Tenders, RFPs &amp; Quotation Hub</a></li>
              <li class="dropdown-item"><a href="careers.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> Oriental Consultants Vacancies</a></li>
              <li class="dropdown-item"><a href="careers.html?type=full-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> Full-Time Positions</a></li>
              <li class="dropdown-item"><a href="careers.html?type=part-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Part-Time Positions</a></li>
              <li class="dropdown-item"><a href="careers.html?type=remote"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Remote Working</a></li>
              <li class="dropdown-item"><a href="careers.html?type=internship"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> Internships &amp; Trainees</a></li>
              <li class="dropdown-item"><a href="careers.html#applyForm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> Our Jobs Portal</a></li>
            </ul>
          </li>

          <li class="nav-item"><a href="contact.html" class="nav-link${activeSection === 'contact' ? ' active' : ''}">Contact</a></li>
        </ul>
      </nav>`;
}

// Master template for Mobile Navigation Drawer
function getMobileNav(activeFile) {
  const isAct = (f) => (activeFile === f ? ' active' : '');
  return `<ul class="mobile-nav-links">
      <li><a href="index.html" class="mobile-nav-link${isAct('index.html')}">Home Portal</a></li>
      <li><a href="domains.html" class="mobile-nav-link${isAct('domains.html')}" style="color: #38bdf8; font-weight: 800; display: flex; align-items: center; justify-content: space-between;"><span>🔍 Domain Search (.AF &amp; Global)</span> <span class="domain-ngo-pill">Free .NGO</span></a></li>
      <li><a href="domains.html?tab=manage#portal" class="mobile-nav-link" style="color: #34d399; font-weight: 800;">⚙️ Domain Management &amp; DNS Portal</a></li>
      <li><a href="about.html" class="mobile-nav-link${isAct('about.html')}">About Us &amp; Heritage</a></li>
      <li><a href="services.html" class="mobile-nav-link${isAct('services.html')}">Services Directory</a></li>
      <li style="font-size:0.75rem; font-weight:800; color:var(--accent-gold); text-transform:uppercase; letter-spacing:1px; margin-top:0.5rem;">Dedicated Practice Areas</li>
      <li><a href="accounting.html" class="mobile-nav-link${isAct('accounting.html')}">01. Accounting &amp; Financial Mgmt</a></li>
      <li><a href="audit.html" class="mobile-nav-link${isAct('audit.html')}">02. Statutory Audit &amp; Assurance (ISA)</a></li>
      <li><a href="tax-advisory.html" class="mobile-nav-link${isAct('tax-advisory.html')}" style="color: #34d399; font-weight: 700;">02a. Tax Advisory &amp; BRT Clearance</a></li>
      <li><a href="donor-audit.html" class="mobile-nav-link${isAct('donor-audit.html')}" style="color: #38bdf8; font-weight: 700;">02b. Donor &amp; Grant Project Audit</a></li>
      <li><a href="forensic-audit.html" class="mobile-nav-link${isAct('forensic-audit.html')}" style="color: #c084fc; font-weight: 700;">02c. Forensic Audit &amp; Investigation</a></li>
      <li><a href="sap-erp.html" class="mobile-nav-link${isAct('sap-erp.html')}" style="color: #38bdf8; font-weight: 700;">03. SAP Business One &amp; S/4HANA</a></li>
      <li><a href="ms-dynamics.html" class="mobile-nav-link${isAct('ms-dynamics.html')}" style="color: #c084fc; font-weight: 700;">03a. Microsoft Dynamics 365 ERP</a></li>
      <li><a href="quickbooks.html" class="mobile-nav-link${isAct('quickbooks.html')}">03b. QuikBok Desktop Enterprise 2025/2026</a></li>
      <li><a href="odoo.html" class="mobile-nav-link${isAct('odoo.html')}">04. Odoo ERP Implementation</a></li>
      <li><a href="ict.html" class="mobile-nav-link${isAct('ict.html')}">05. ICT, Google Workspace &amp; MS 365</a></li>
      <li><a href="microsoft-365.html" class="mobile-nav-link${isAct('microsoft-365.html')}">05a. Microsoft 365 &amp; Office 365</a></li>
      <li><a href="domains.html" class="mobile-nav-link" style="color: #38bdf8; font-weight: 700; display: flex; align-items: center; justify-content: space-between;"><span>05b. Premium Domain Search &amp; .AF</span> <span class="domain-ngo-pill">Free .NGO</span></a></li>
      <li><a href="program-design.html" class="mobile-nav-link${isAct('program-design.html')}">06. Program Design &amp; Delivery</a></li>
      <li><a href="proposal-writing.html" class="mobile-nav-link${isAct('proposal-writing.html')}">07. Proposal &amp; Business Plans</a></li>
      <li><a href="training.html" class="mobile-nav-link${isAct('training.html')}">08. Training &amp; Capacity Building</a></li>
      <li><a href="research.html" class="mobile-nav-link${isAct('research.html')}">09. Research &amp; Evaluation</a></li>
      <li><a href="monitoring.html" class="mobile-nav-link${isAct('monitoring.html')}">10. Third-Party Monitoring (TPM)</a></li>
      <li><a href="asset-valuation.html" class="mobile-nav-link${isAct('asset-valuation.html')}">11. Asset Valuation &amp; Barcoding</a></li>
      <li><a href="ai-services.html" class="mobile-nav-link${isAct('ai-services.html')}">12. AI Integration Services</a></li>
      <li style="font-size:0.75rem; font-weight:800; color:var(--accent-gold); text-transform:uppercase; letter-spacing:1px; margin-top:0.5rem;">Partnerships &amp; Alliances</li>
      <li><a href="primeglobal.html" class="mobile-nav-link${isAct('primeglobal.html')}">PrimeGlobal USA ($2.93B)</a></li>
      <li><a href="afghanhoster.html" class="mobile-nav-link${isAct('afghanhoster.html')}">AfghanHoster (Cloud &amp; .AF)</a></li>
      <li><a href="afghandevelopers.html" class="mobile-nav-link${isAct('afghandevelopers.html')}">AfghanDevelopers (Software house)</a></li>
      <li><a href="tsplus.html" class="mobile-nav-link${isAct('tsplus.html')}">TSplus Remote Desktop &amp; Cloud</a></li>
      <li><a href="wafa-consultants.html" class="mobile-nav-link${isAct('wafa-consultants.html')}">Wafa Consultants (Associate)</a></li>
      <li><a href="ict.html" class="mobile-nav-link">Google Workspace &amp; Microsoft 365</a></li>
      <li style="font-size:0.75rem; font-weight:800; color:var(--accent-gold); text-transform:uppercase; letter-spacing:1px; margin-top:0.5rem;">Corporate &amp; Governance</li>
      <li><a href="about.html" class="mobile-nav-link">Corporate Heritage &amp; Accreditations</a></li>
      <li><a href="tax-calculator.html" class="mobile-nav-link${isAct('tax-calculator.html')}">Afghanistan Tax Calculator</a></li>
      <li><a href="case-studies.html" class="mobile-nav-link${isAct('case-studies.html')}">Case Studies &amp; Track Record</a></li>
      <li><a href="team.html" class="mobile-nav-link${isAct('team.html')}">Executive Leadership</a></li>
      <li><a href="careers.html" class="mobile-nav-link${isAct('careers.html')}">Careers &amp; Internships</a></li>
      <li><a href="jobs-hub.html" class="mobile-nav-link${isAct('jobs-hub.html')}" style="color:#38bdf8; font-weight:700;">💼 All Afghanistan Jobs Hub (ACBAR, Jobs.af &amp; Wazifaha)</a></li>
      <li><a href="tenders-hub.html" class="mobile-nav-link${isAct('tenders-hub.html')}" style="color:#fbbf24; font-weight:700;">📑 All Afghanistan Tenders, RFPs &amp; Quotation Hub</a></li>
      <li><a href="contact.html" class="mobile-nav-link${isAct('contact.html')}">Contact &amp; Consultations</a></li>
      <li style="margin-top: 1rem;">
        <a href="contact.html" class="btn btn-primary" style="width: 100%; text-align: center;">Book Consultation</a>
      </li>
    </ul>`;
}

function getActiveSection(filename) {
  if (filename === 'index.html') return 'home';
  if (['about.html', 'team.html', 'branches.html'].includes(filename)) return 'about';
  if (['primeglobal.html', 'afghanhoster.html', 'afghandevelopers.html', 'wafa-consultants.html'].includes(filename)) return 'partnerships';
  if (['case-studies.html'].includes(filename)) return 'insights';
  if (['careers.html', 'jobs-hub.html', 'tenders-hub.html', 'acbar-jobs.html', 'acbar-rfps.html', 'jobs-af.html', 'jobs-af-tenders.html', 'afghan-tenders.html'].includes(filename)) return 'careers';
  if (filename === 'contact.html') return 'contact';
  // All service / ERP / advisory pages
  return 'services';
}

const SKIP_FILES = ['404.html', 'client-portal.html', 'domain-search.html', 'office-365.html'];

DIRS.forEach(targetDir => {
  if (!fs.existsSync(targetDir)) return;
  console.log(`\n========================================\nProcessing Directory: ${targetDir}\n========================================`);

  const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.html') && !SKIP_FILES.includes(f));
  let updatedCount = 0;

  files.forEach(file => {
    const filePath = path.join(targetDir, file);
    let html = fs.readFileSync(filePath, 'utf8');

    const activeSection = getActiveSection(file);
    const newDesktopNav = getDesktopNav(activeSection);
    const newMobileNav = getMobileNav(file);

    let changed = false;

    // 1. Replace <nav aria-label="Primary Navigation">...</nav>
    const navRegex = /<nav aria-label="Primary Navigation">[\s\S]*?<\/nav>/;
    if (navRegex.test(html)) {
      html = html.replace(navRegex, newDesktopNav);
      changed = true;
    } else {
      console.warn(`[WARN] ${file}: Desktop nav tag not found!`);
    }

    // 2. Replace <ul class="mobile-nav-links">...</ul>
    const mobileRegex = /<ul class="mobile-nav-links">[\s\S]*?<\/ul>/;
    if (mobileRegex.test(html)) {
      html = html.replace(mobileRegex, newMobileNav);
      changed = true;
    } else {
      console.warn(`[WARN] ${file}: Mobile nav links tag not found!`);
    }

    if (changed) {
      fs.writeFileSync(filePath, html, 'utf8');
      updatedCount++;
      console.log(`✓ Updated navigation in: ${file} (active: ${activeSection})`);
    }
  });

  console.log(`\nDirectory complete: ${updatedCount} / ${files.length} pages standardized.`);
});
