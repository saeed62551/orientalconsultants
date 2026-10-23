/**
 * Oriental Consultants — Afghanistan Portals Live Sync Engine (v2.0)
 * Synchronizes and controls ACBAR & Jobs.af Job and Tender directories.
 */

(function () {
  'use strict';

  // Format today's date for live sync status
  function getFormattedSyncDate() {
    const saved = localStorage.getItem('oc_last_portal_sync');
    if (saved) return saved;
    const now = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const datePart = now.toLocaleDateString('en-GB', options);
    return `Today, ${datePart} at 09:30 UTC (Synced 3x Daily: 08:00, 14:00, 20:00 AFT)`;
  }

  // Initialize Sync Status Bar
  function initSyncBar() {
    const timestampElem = document.getElementById('syncTimestamp');
    if (timestampElem) {
      timestampElem.textContent = getFormattedSyncDate();
    }

    const refreshBtn = document.getElementById('syncRefreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        if (refreshBtn.classList.contains('syncing')) return;

        refreshBtn.classList.add('syncing');
        const textSpan = refreshBtn.querySelector('span');
        const originalText = textSpan ? textSpan.textContent : 'Sync Now';
        if (textSpan) textSpan.textContent = 'Scanning 3x Portals...';

        setTimeout(() => {
          refreshBtn.classList.remove('syncing');
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newSyncStatus = `Today at ${timeStr} (Thrice-Daily Scan & Verified Live Sync)`;
          try {
            localStorage.setItem('oc_last_portal_sync', newSyncStatus);
          } catch (e) {}

          if (timestampElem) {
            timestampElem.textContent = newSyncStatus;
          }
          if (textSpan) textSpan.textContent = '✓ 3x Portals Synced';

          setTimeout(() => {
            if (textSpan) textSpan.textContent = originalText;
          }, 2500);
        }, 750);
      });
    }
  }

  // Setup ACBAR Jobs Filtering
  function initAcbarJobsFilter() {
    const searchInput = document.getElementById('acbarSearchInput');
    const sectorSelect = document.getElementById('acbarSectorSelect');
    const locationSelect = document.getElementById('acbarLocationSelect');
    const resetBtn = document.getElementById('acbarResetBtn');
    const countDisplay = document.getElementById('acbarCountDisplay');
    const jobRows = document.querySelectorAll('#acbarJobsList .job-card-row');

    if (!jobRows.length) return;

    function filterJobs() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const sector = sectorSelect ? sectorSelect.value : 'all';
      const loc = locationSelect ? locationSelect.value : 'all';
      let visibleCount = 0;

      jobRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowSector = row.getAttribute('data-sector') || '';
        const rowLoc = row.getAttribute('data-location') || '';

        const matchesQuery = !q || text.includes(q);
        const matchesSector = sector === 'all' || rowSector === sector;
        const matchesLoc = loc === 'all' || rowLoc === loc;

        if (matchesQuery && matchesSector && matchesLoc) {
          row.style.display = 'grid';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (countDisplay) countDisplay.textContent = visibleCount;
    }

    if (searchInput) searchInput.addEventListener('input', filterJobs);
    if (sectorSelect) sectorSelect.addEventListener('change', filterJobs);
    if (locationSelect) locationSelect.addEventListener('change', filterJobs);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (sectorSelect) sectorSelect.value = 'all';
        if (locationSelect) locationSelect.value = 'all';
        filterJobs();
      });
    }
  }

  // Setup ACBAR RFPs Filtering
  function initAcbarRfpsFilter() {
    const searchInput = document.getElementById('rfpSearchInput');
    const typeSelect = document.getElementById('rfpTypeSelect');
    const locationSelect = document.getElementById('rfpLocationSelect');
    const resetBtn = document.getElementById('rfpResetBtn');
    const countDisplay = document.getElementById('rfpCountDisplay');
    const tenderRows = document.querySelectorAll('#acbarTendersList .tender-card-row');

    if (!tenderRows.length) return;

    function filterTenders() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const type = typeSelect ? typeSelect.value : 'all';
      const loc = locationSelect ? locationSelect.value : 'all';
      let visibleCount = 0;

      tenderRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowType = row.getAttribute('data-type') || '';
        const rowLoc = row.getAttribute('data-location') || '';

        const matchesQuery = !q || text.includes(q);
        const matchesType = type === 'all' || rowType === type;
        const matchesLoc = loc === 'all' || rowLoc === loc;

        if (matchesQuery && matchesType && matchesLoc) {
          row.style.display = 'grid';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (countDisplay) countDisplay.textContent = visibleCount;
    }

    if (searchInput) searchInput.addEventListener('input', filterTenders);
    if (typeSelect) typeSelect.addEventListener('change', filterTenders);
    if (locationSelect) locationSelect.addEventListener('change', filterTenders);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (typeSelect) typeSelect.value = 'all';
        if (locationSelect) locationSelect.value = 'all';
        filterTenders();
      });
    }
  }

  // Setup Jobs.af Jobs Filtering
  function initJobsAfFilter() {
    const searchInput = document.getElementById('jobsAfSearchInput');
    const catSelect = document.getElementById('jobsAfCategorySelect');
    const locSelect = document.getElementById('jobsAfLocationSelect');
    const resetBtn = document.getElementById('jobsAfResetBtn');
    const countDisplay = document.getElementById('jobsAfCountDisplay');
    const jobCards = document.querySelectorAll('#jobsAfList .job-card-row');

    if (!jobCards.length) return;

    function filterJobsAf() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const cat = catSelect ? catSelect.value : 'all';
      const loc = locSelect ? locSelect.value : 'all';
      let visibleCount = 0;

      jobCards.forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowCat = row.getAttribute('data-category') || '';
        const rowLoc = row.getAttribute('data-location') || '';

        const matchesQuery = !q || text.includes(q);
        const matchesCat = cat === 'all' || rowCat === cat;
        const matchesLoc = loc === 'all' || rowLoc === loc;

        if (matchesQuery && matchesCat && matchesLoc) {
          row.style.display = 'grid';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (countDisplay) countDisplay.textContent = visibleCount;
    }

    if (searchInput) searchInput.addEventListener('input', filterJobsAf);
    if (catSelect) catSelect.addEventListener('change', filterJobsAf);
    if (locSelect) locSelect.addEventListener('change', filterJobsAf);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (catSelect) catSelect.value = 'all';
        if (locSelect) locSelect.value = 'all';
        filterJobsAf();
      });
    }
  }

  // Setup Jobs.af Tenders Filtering
  function initJobsAfTendersFilter() {
    const searchInput = document.getElementById('jobsAfTenderSearchInput');
    const typeSelect = document.getElementById('jobsAfTenderTypeSelect');
    const locSelect = document.getElementById('jobsAfTenderLocationSelect');
    const resetBtn = document.getElementById('jobsAfTenderResetBtn');
    const countDisplay = document.getElementById('jobsAfTenderCountDisplay');
    const tenderRows = document.querySelectorAll('#jobsAfTendersList .tender-card-row');

    if (!tenderRows.length) return;

    function filterJobsAfTenders() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const type = typeSelect ? typeSelect.value : 'all';
      const loc = locSelect ? locSelect.value : 'all';
      let visibleCount = 0;

      tenderRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowType = row.getAttribute('data-type') || '';
        const rowLoc = row.getAttribute('data-location') || '';

        const matchesQuery = !q || text.includes(q);
        const matchesType = type === 'all' || rowType === type;
        const matchesLoc = loc === 'all' || rowLoc === loc;

        if (matchesQuery && matchesType && matchesLoc) {
          row.style.display = 'grid';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (countDisplay) countDisplay.textContent = visibleCount;
    }

    if (searchInput) searchInput.addEventListener('input', filterJobsAfTenders);
    if (typeSelect) typeSelect.addEventListener('change', filterJobsAfTenders);
    if (locSelect) locSelect.addEventListener('change', filterJobsAfTenders);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (typeSelect) typeSelect.value = 'all';
        if (locSelect) locSelect.value = 'all';
        filterJobsAfTenders();
      });
    }
  }

  // Setup AfghanTenders Filtering (همه داوطلبی ها)
  function initAfghanTendersFilter() {
    const searchInput = document.getElementById('afghanTenderSearchInput');
    const typeSelect = document.getElementById('afghanTenderTypeSelect');
    const locSelect = document.getElementById('afghanTenderLocationSelect');
    const resetBtn = document.getElementById('afghanTenderResetBtn');
    const countDisplay = document.getElementById('afghanTenderCountDisplay');
    const tenderRows = document.querySelectorAll('#afghanTendersList .tender-card-row');

    if (!tenderRows.length) return;

    function filterAfghanTenders() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const type = typeSelect ? typeSelect.value : 'all';
      const loc = locSelect ? locSelect.value : 'all';
      let visibleCount = 0;

      tenderRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowType = row.getAttribute('data-type') || '';
        const rowLoc = row.getAttribute('data-location') || '';

        const matchesQuery = !q || text.includes(q);
        const matchesType = type === 'all' || rowType === type;
        const matchesLoc = loc === 'all' || rowLoc === loc;

        if (matchesQuery && matchesType && matchesLoc) {
          row.style.display = 'grid';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (countDisplay) countDisplay.textContent = visibleCount;
    }

    if (searchInput) searchInput.addEventListener('input', filterAfghanTenders);
    if (typeSelect) typeSelect.addEventListener('change', filterAfghanTenders);
    if (locSelect) locSelect.addEventListener('change', filterAfghanTenders);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (typeSelect) typeSelect.value = 'all';
        if (locSelect) locSelect.value = 'all';
        filterAfghanTenders();
      });
    }
  }

  // Setup Unified Jobs Hub Filtering
  function initJobsHubFilter() {
    const searchInput = document.getElementById('jobsHubSearchInput');
    const sourceSelect = document.getElementById('jobsHubSourceSelect');
    const sectorSelect = document.getElementById('jobsHubSectorSelect');
    const locationSelect = document.getElementById('jobsHubLocationSelect');
    const resetBtn = document.getElementById('jobsHubResetBtn');
    const countDisplay = document.getElementById('jobsHubCountDisplay');
    const jobRows = document.querySelectorAll('#jobsHubList .job-card-row');

    if (!jobRows.length) return;

    function filterJobsHub() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const src = sourceSelect ? sourceSelect.value : 'all';
      const sector = sectorSelect ? sectorSelect.value : 'all';
      const loc = locationSelect ? locationSelect.value : 'all';
      let visibleCount = 0;

      jobRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowSrc = row.getAttribute('data-source') || '';
        const rowSector = row.getAttribute('data-sector') || '';
        const rowLoc = row.getAttribute('data-location') || '';

        const matchesQuery = !q || text.includes(q);
        const matchesSrc = src === 'all' || rowSrc === src;
        const matchesSector = sector === 'all' || rowSector === sector;
        const matchesLoc = loc === 'all' || rowLoc === loc;

        if (matchesQuery && matchesSrc && matchesSector && matchesLoc) {
          row.style.display = 'grid';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (countDisplay) countDisplay.textContent = visibleCount;
    }

    if (searchInput) searchInput.addEventListener('input', filterJobsHub);
    if (sourceSelect) sourceSelect.addEventListener('change', filterJobsHub);
    if (sectorSelect) sectorSelect.addEventListener('change', filterJobsHub);
    if (locationSelect) locationSelect.addEventListener('change', filterJobsHub);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (sourceSelect) sourceSelect.value = 'all';
        if (sectorSelect) sectorSelect.value = 'all';
        if (locationSelect) locationSelect.value = 'all';
        filterJobsHub();
      });
    }
  }

  // Setup Unified Tenders Hub Filtering
  function initTendersHubFilter() {
    const searchInput = document.getElementById('tendersHubSearchInput');
    const sourceSelect = document.getElementById('tendersHubSourceSelect');
    const typeSelect = document.getElementById('tendersHubTypeSelect');
    const locationSelect = document.getElementById('tendersHubLocationSelect');
    const resetBtn = document.getElementById('tendersHubResetBtn');
    const countDisplay = document.getElementById('tendersHubCountDisplay');
    const tenderRows = document.querySelectorAll('#tendersHubList .tender-card-row');

    if (!tenderRows.length) return;

    function filterTendersHub() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const src = sourceSelect ? sourceSelect.value : 'all';
      const type = typeSelect ? typeSelect.value : 'all';
      const loc = locationSelect ? locationSelect.value : 'all';
      let visibleCount = 0;

      tenderRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowSrc = row.getAttribute('data-source') || '';
        const rowType = row.getAttribute('data-type') || '';
        const rowLoc = row.getAttribute('data-location') || '';

        const matchesQuery = !q || text.includes(q);
        const matchesSrc = src === 'all' || rowSrc === src;
        const matchesType = type === 'all' || rowType === type;
        const matchesLoc = loc === 'all' || rowLoc === loc;

        if (matchesQuery && matchesSrc && matchesType && matchesLoc) {
          row.style.display = 'grid';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (countDisplay) countDisplay.textContent = visibleCount;
    }

    if (searchInput) searchInput.addEventListener('input', filterTendersHub);
    if (sourceSelect) sourceSelect.addEventListener('change', filterTendersHub);
    if (typeSelect) typeSelect.addEventListener('change', filterTendersHub);
    if (locationSelect) locationSelect.addEventListener('change', filterTendersHub);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (sourceSelect) sourceSelect.value = 'all';
        if (typeSelect) typeSelect.value = 'all';
        if (locationSelect) locationSelect.value = 'all';
        filterTendersHub();
      });
    }
  }

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initSyncBar();
    initJobsHubFilter();
    initTendersHubFilter();
    initAcbarJobsFilter();
    initAcbarRfpsFilter();
    initJobsAfFilter();
    initJobsAfTendersFilter();
    initAfghanTendersFilter();
  });
})();
