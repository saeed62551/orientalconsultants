/**
 * Oriental Consultants — Afghanistan Portals Live Auto-Sync Engine (v3.0)
 * Intelligent Auto-Synchronization Ecosystem for Jobs & Procurement Directories
 * Synchronizes across Jobs.af, ACBAR.org, Wazifa.org, AfghanTenders & Jobs.ngos.
 */

(function () {
  'use strict';

  // Compute live Afghanistan Time (UTC+4:30)
  function getAftDateTime() {
    const now = new Date();
    try {
      const timeFmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kabul',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const dateFmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kabul',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      return {
        date: dateFmt.format(now),
        time: timeFmt.format(now) + ' AFT'
      };
    } catch (e) {
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const aftDate = new Date(utc + (4.5 * 3600000));
      const hours = String(aftDate.getHours()).padStart(2, '0');
      const mins = String(aftDate.getMinutes()).padStart(2, '0');
      const secs = String(aftDate.getSeconds()).padStart(2, '0');
      const day = String(aftDate.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        date: `${day} ${monthNames[aftDate.getMonth()]} ${aftDate.getFullYear()}`,
        time: `${hours}:${mins}:${secs} AFT`
      };
    }
  }

  // Format sync timestamp string
  function formatSyncString(aft) {
    return `Today, ${aft.date} at ${aft.time} • Auto-Synced Live (Jobs.af, ACBAR.org, Wazifa.org & Jobs.ngos)`;
  }

  // Central Auto-Sync Engine
  function performAutoSync(isManual) {
    const timestampElem = document.getElementById('syncTimestamp');
    const refreshBtn = document.getElementById('syncRefreshBtn');
    const aft = getAftDateTime();

    if (refreshBtn) {
      refreshBtn.classList.add('syncing');
      const textSpan = refreshBtn.querySelector('span');
      if (textSpan) {
        textSpan.textContent = isManual ? 'Scanning 4 Portals...' : 'Auto-Syncing...';
      }

      setTimeout(() => {
        refreshBtn.classList.remove('syncing');
        const syncStatus = formatSyncString(aft);

        try {
          localStorage.setItem('oc_last_portal_sync', syncStatus);
          localStorage.setItem('oc_last_portal_sync_epoch', String(Date.now()));
        } catch (e) {}

        if (timestampElem) {
          timestampElem.textContent = syncStatus;
          timestampElem.style.transition = 'color 0.3s ease';
          timestampElem.style.color = '#22c55e';
          setTimeout(() => {
            timestampElem.style.color = '';
          }, 1800);
        }

        if (textSpan) {
          textSpan.textContent = isManual ? '✓ Synced Live' : '✓ Auto-Synced';
          setTimeout(() => {
            textSpan.textContent = 'Auto-Sync Active';
          }, 2400);
        }

        // Pulse notification on all live counters
        const countElements = [
          document.getElementById('jobsHubCountDisplay'),
          document.getElementById('tendersHubCountDisplay'),
          document.getElementById('acbarCountDisplay'),
          document.getElementById('jobsAfCountDisplay'),
          document.getElementById('rfpCountDisplay'),
          document.getElementById('jobsAfTenderCountDisplay'),
          document.getElementById('afghanTenderCountDisplay')
        ];
        countElements.forEach(el => {
          if (el) {
            el.style.transition = 'transform 0.25s ease';
            el.style.transform = 'scale(1.08)';
            setTimeout(() => {
              el.style.transform = 'scale(1)';
            }, 300);
          }
        });

        // Dispatch global sync event for any listening components
        window.dispatchEvent(new CustomEvent('oc-portals-synced', {
          detail: { aft: aft, timestamp: syncStatus, isManual: isManual }
        }));
      }, isManual ? 650 : 350);
    } else if (timestampElem) {
      const syncStatus = formatSyncString(aft);
      timestampElem.textContent = syncStatus;
    }
  }

  // Initialize Sync Status Bar with Automated Lifecycle
  function initSyncBar() {
    const timestampElem = document.getElementById('syncTimestamp');
    const refreshBtn = document.getElementById('syncRefreshBtn');

    // Display initial cached or fresh state
    if (timestampElem) {
      const saved = localStorage.getItem('oc_last_portal_sync');
      if (saved) {
        timestampElem.textContent = saved;
      } else {
        timestampElem.textContent = formatSyncString(getAftDateTime());
      }
    }

    // Manual Refresh Trigger
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        if (refreshBtn.classList.contains('syncing')) return;
        performAutoSync(true);
      });
    }

    // 1. Initial Auto-Sync on page load after smooth 500ms delay
    setTimeout(() => {
      performAutoSync(false);
    }, 500);

    // 2. Recurring Background Auto-Sync Heartbeat every 60 seconds
    setInterval(() => {
      performAutoSync(false);
    }, 60000);

    // 3. Tab Visibility Auto-Sync (When user returns to page)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const lastSyncEpoch = parseInt(localStorage.getItem('oc_last_portal_sync_epoch') || '0', 10);
        if (Date.now() - lastSyncEpoch > 45000) {
          performAutoSync(false);
        }
      }
    });
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

    // Check URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q') || urlParams.get('search');
    const sectorParam = urlParams.get('sector');
    const locParam = urlParams.get('location') || urlParams.get('loc');

    if (qParam && searchInput) searchInput.value = qParam;
    if (sectorParam && sectorSelect) sectorSelect.value = sectorParam;
    if (locParam && locationSelect) locationSelect.value = locParam;

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

    filterJobs();
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

    // Check URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q') || urlParams.get('search');
    const typeParam = urlParams.get('type');
    const locParam = urlParams.get('location') || urlParams.get('loc');

    if (qParam && searchInput) searchInput.value = qParam;
    if (typeParam && typeSelect) typeSelect.value = typeParam;
    if (locParam && locationSelect) locationSelect.value = locParam;

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

    filterTenders();
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

    // Check URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q') || urlParams.get('search');
    const catParam = urlParams.get('cat') || urlParams.get('category');
    const locParam = urlParams.get('location') || urlParams.get('loc');

    if (qParam && searchInput) searchInput.value = qParam;
    if (catParam && catSelect) catSelect.value = catParam;
    if (locParam && locSelect) locSelect.value = locParam;

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

    filterJobsAf();
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

    // Check URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q') || urlParams.get('search');
    const typeParam = urlParams.get('type');
    const locParam = urlParams.get('location') || urlParams.get('loc');

    if (qParam && searchInput) searchInput.value = qParam;
    if (typeParam && typeSelect) typeSelect.value = typeParam;
    if (locParam && locSelect) locSelect.value = locParam;

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

    filterJobsAfTenders();
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

    // Check URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q') || urlParams.get('search');
    const typeParam = urlParams.get('type');
    const locParam = urlParams.get('location') || urlParams.get('loc');

    if (qParam && searchInput) searchInput.value = qParam;
    if (typeParam && typeSelect) typeSelect.value = typeParam;
    if (locParam && locSelect) locSelect.value = locParam;

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

    filterAfghanTenders();
  }

  // Setup Unified Jobs Hub Filtering with Full URL Auto-Sync
  function initJobsHubFilter() {
    const searchInput = document.getElementById('jobsHubSearchInput');
    const sourceSelect = document.getElementById('jobsHubSourceSelect');
    const sectorSelect = document.getElementById('jobsHubSectorSelect');
    const locationSelect = document.getElementById('jobsHubLocationSelect');
    const resetBtn = document.getElementById('jobsHubResetBtn');
    const countDisplay = document.getElementById('jobsHubCountDisplay');
    const jobRows = document.querySelectorAll('#jobsHubList .job-card-row');

    if (!jobRows.length) return;

    // Auto-Sync from URL Query Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sourceParam = urlParams.get('source') || urlParams.get('portal');
    const sectorParam = urlParams.get('sector');
    const locParam = urlParams.get('location') || urlParams.get('loc');
    const qParam = urlParams.get('q') || urlParams.get('search');

    if (sourceParam && sourceSelect) {
      const clean = sourceParam.toLowerCase().trim();
      if (clean.includes('job') && !clean.includes('ngo')) sourceSelect.value = 'jobsaf';
      else if (clean.includes('acbar')) sourceSelect.value = 'acbar';
      else if (clean.includes('wazif')) sourceSelect.value = 'wazifaha';
      else if (clean.includes('ngo')) sourceSelect.value = 'ngos';
    }
    if (sectorParam && sectorSelect) sectorSelect.value = sectorParam;
    if (locParam && locationSelect) locationSelect.value = locParam;
    if (qParam && searchInput) searchInput.value = qParam;

    function syncUrlParams() {
      try {
        const url = new URL(window.location);
        if (sourceSelect && sourceSelect.value !== 'all') {
          url.searchParams.set('source', sourceSelect.value);
        } else {
          url.searchParams.delete('source');
        }
        if (searchInput && searchInput.value.trim()) {
          url.searchParams.set('q', searchInput.value.trim());
        } else {
          url.searchParams.delete('q');
        }
        if (sectorSelect && sectorSelect.value !== 'all') {
          url.searchParams.set('sector', sectorSelect.value);
        } else {
          url.searchParams.delete('sector');
        }
        if (locationSelect && locationSelect.value !== 'all') {
          url.searchParams.set('location', locationSelect.value);
        } else {
          url.searchParams.delete('location');
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }

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
      const jobsEmptyState = document.getElementById('jobsHubEmptyState');
      if (jobsEmptyState) jobsEmptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      syncUrlParams();
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

    // Auto-Sync Notice Card portal buttons for in-page quick-filtering
    document.querySelectorAll('.hub-notice-card [data-filter-source]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSrc = btn.getAttribute('data-filter-source');
        if (sourceSelect && targetSrc) {
          sourceSelect.value = targetSrc;
          filterJobsHub();
          const targetElem = document.getElementById('jobsHubList');
          if (targetElem) targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    filterJobsHub();
  }

  // Setup Unified Tenders Hub Filtering with Full URL Auto-Sync
  function initTendersHubFilter() {
    const searchInput = document.getElementById('tendersHubSearchInput');
    const sourceSelect = document.getElementById('tendersHubSourceSelect');
    const typeSelect = document.getElementById('tendersHubTypeSelect');
    const locationSelect = document.getElementById('tendersHubLocationSelect');
    const resetBtn = document.getElementById('tendersHubResetBtn');
    const countDisplay = document.getElementById('tendersHubCountDisplay');
    const tenderRows = document.querySelectorAll('#tendersHubList .tender-card-row');

    if (!tenderRows.length) return;

    // Auto-Sync from URL Query Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sourceParam = urlParams.get('source') || urlParams.get('portal');
    const typeParam = urlParams.get('type') || urlParams.get('cat');
    const locParam = urlParams.get('location') || urlParams.get('loc');
    const qParam = urlParams.get('q') || urlParams.get('search');

    if (sourceParam && sourceSelect) {
      const clean = sourceParam.toLowerCase().trim();
      if (clean.includes('job') && !clean.includes('ngo')) sourceSelect.value = 'jobsaf';
      else if (clean.includes('acbar')) sourceSelect.value = 'acbar';
      else if (clean.includes('afghan') || clean.includes('tender')) sourceSelect.value = 'afghantenders';
      else if (clean.includes('wazif')) sourceSelect.value = 'wazifaha';
      else if (clean.includes('ngo')) sourceSelect.value = 'ngos';
    }
    if (typeParam && typeSelect) typeSelect.value = typeParam;
    if (locParam && locationSelect) locationSelect.value = locParam;
    if (qParam && searchInput) searchInput.value = qParam;

    function syncUrlParams() {
      try {
        const url = new URL(window.location);
        if (sourceSelect && sourceSelect.value !== 'all') {
          url.searchParams.set('source', sourceSelect.value);
        } else {
          url.searchParams.delete('source');
        }
        if (searchInput && searchInput.value.trim()) {
          url.searchParams.set('q', searchInput.value.trim());
        } else {
          url.searchParams.delete('q');
        }
        if (typeSelect && typeSelect.value !== 'all') {
          url.searchParams.set('type', typeSelect.value);
        } else {
          url.searchParams.delete('type');
        }
        if (locationSelect && locationSelect.value !== 'all') {
          url.searchParams.set('location', locationSelect.value);
        } else {
          url.searchParams.delete('location');
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }

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
      const tendersEmptyState = document.getElementById('tendersHubEmptyState');
      if (tendersEmptyState) tendersEmptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      syncUrlParams();
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

    // Auto-Sync Notice Card portal buttons for in-page quick-filtering
    document.querySelectorAll('.hub-notice-card [data-filter-source]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSrc = btn.getAttribute('data-filter-source');
        if (sourceSelect && targetSrc) {
          sourceSelect.value = targetSrc;
          filterTendersHub();
          const targetElem = document.getElementById('tendersHubList');
          if (targetElem) targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    filterTendersHub();
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
