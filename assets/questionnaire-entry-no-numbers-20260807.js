import './questionnaire-final-20260807.js?v=20260807-core';

const LIKERT_LABELS = [
  'لا أوافق إطلاقًا',
  'لا أوافق',
  'لا أوافق ولا أعارض',
  'أوافق',
  'أوافق تمامًا',
];

function fixLikertDisplay() {
  document.querySelectorAll('.legend-grid').forEach((legend) => {
    const items = Array.from(legend.children);
    if (items.length === 5) {
      items.forEach((item, index) => {
        item.textContent = LIKERT_LABELS[index];
      });
    }
  });

  document.querySelectorAll('.likert-table thead tr').forEach((row) => {
    const headers = Array.from(row.querySelectorAll('th')).slice(1);
    if (headers.length !== 5) return;
    headers.forEach((header, index) => {
      header.textContent = LIKERT_LABELS[index];
      header.title = LIKERT_LABELS[index];
      header.setAttribute('aria-label', LIKERT_LABELS[index]);
    });
  });
}

fixLikertDisplay();
let queued = false;
new MutationObserver(() => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    fixLikertDisplay();
  });
}).observe(document.documentElement, { childList: true, subtree: true });

window.addEventListener('load', fixLikertDisplay);
window.addEventListener('pageshow', fixLikertDisplay);
