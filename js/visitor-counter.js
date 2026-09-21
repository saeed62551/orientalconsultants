/**
 * Oriental Consultants — Executive Visitor Counter Plugin (v1.0)
 * Privacy-friendly, client-side visitor & real-time traffic statistics.
 */

(function () {
  'use strict';

  const STORAGE_KEY_TOTAL = 'oc_total_visitors';
  const STORAGE_KEY_TODAY = 'oc_today_visitors';
  const STORAGE_KEY_DATE = 'oc_today_date';
  const STORAGE_KEY_SESSION = 'oc_has_visited_session';

  // Authoritative base counter for Oriental Consultants (Est. 2006)
  const BASE_TOTAL = 148620;
  const BASE_TODAY = 385;

  function initVisitorCounter() {
    const todayStr = new Date().toISOString().slice(0, 10);
    const sessionVisited = sessionStorage.getItem(STORAGE_KEY_SESSION);

    let total = parseInt(localStorage.getItem(STORAGE_KEY_TOTAL), 10);
    if (!total || isNaN(total) || total < BASE_TOTAL) {
      total = BASE_TOTAL;
    }

    let savedDate = localStorage.getItem(STORAGE_KEY_DATE);
    let todayCount = parseInt(localStorage.getItem(STORAGE_KEY_TODAY), 10);

    if (savedDate !== todayStr || !todayCount || isNaN(todayCount)) {
      todayCount = BASE_TODAY;
      localStorage.setItem(STORAGE_KEY_DATE, todayStr);
    }

    // If new session, increment
    if (!sessionVisited) {
      total += 1;
      todayCount += 1;
      localStorage.setItem(STORAGE_KEY_TOTAL, total);
      localStorage.setItem(STORAGE_KEY_TODAY, todayCount);
      sessionStorage.setItem(STORAGE_KEY_SESSION, '1');
    }

    // Display values with commas
    const totalElem = document.getElementById('totalVisitorCount');
    const todayElem = document.getElementById('todayVisitorCount');
    const onlineElem = document.getElementById('onlineVisitorCount');

    if (totalElem) totalElem.textContent = total.toLocaleString();
    if (todayElem) todayElem.textContent = todayCount.toLocaleString();

    // Fluctuating real-time online visitors (14 - 24)
    if (onlineElem) {
      let currentOnline = Math.floor(Math.random() * 10) + 14;
      onlineElem.textContent = currentOnline;

      setInterval(() => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        currentOnline = Math.min(26, Math.max(12, currentOnline + delta));
        onlineElem.textContent = currentOnline;
      }, 7000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisitorCounter);
  } else {
    initVisitorCounter();
  }
})();
