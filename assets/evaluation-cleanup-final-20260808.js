(() => {
  const TARGET = '4. بصفة عامة، يحظى برنامج الدعم المباشر للسكن بتأييدي.';

  function cleanData() {
    try {
      if (typeof G !== 'undefined' && G.accept?.[0]?.[1]) {
        G.accept[0][1] = G.accept[0][1].filter(([id, label]) => id !== 'accept_4' && label !== TARGET);
      }
      if (typeof G !== 'undefined' && G.generalImpact?.[0]) {
        G.generalImpact[0][0] = 'رابعًا: الأثر العام للبرنامج';
      }
      if (typeof state !== 'undefined' && state.a) delete state.a.accept_4;
    } catch (_) {}
  }

  function cleanDom() {
    document.querySelectorAll('.likert-table tbody tr').forEach((row) => {
      const firstCell = row.querySelector('td:first-child');
      if (firstCell && firstCell.textContent.trim() === TARGET) row.remove();
    });
  }

  let scheduled = false;
  function apply() {
    cleanData();
    cleanDom();
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      apply();
    });
  }

  cleanData();
  if (typeof render === 'function') {
    try { render(); } catch (_) {}
  }
  apply();
  window.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  window.addEventListener('pageshow', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
})();
