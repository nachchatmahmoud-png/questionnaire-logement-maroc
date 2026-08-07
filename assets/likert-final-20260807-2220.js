import './questionnaire-final-20260807.js?v=20260807-core-final';

const LABELS = [
  'لا أوافق إطلاقًا',
  'لا أوافق',
  'لا أوافق ولا أعارض',
  'أوافق',
  'أوافق تمامًا',
];

function applyLikertLayout() {
  document.querySelectorAll('.legend-grid').forEach((legend) => {
    const items = Array.from(legend.children);
    if (items.length !== 5) return;
    items.forEach((item, index) => {
      const text = `${index + 1} — ${LABELS[index]}`;
      if (item.textContent !== text) item.textContent = text;
    });
  });

  document.querySelectorAll('.likert-table thead tr').forEach((row) => {
    const headers = Array.from(row.querySelectorAll('th')).slice(1, 6);
    if (headers.length !== 5) return;
    headers.forEach((header, index) => {
      if (header.textContent !== '') header.textContent = '';
      header.removeAttribute('title');
      header.setAttribute('aria-label', LABELS[index]);
    });
  });
}

applyLikertLayout();
let scheduled = false;
new MutationObserver(() => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    applyLikertLayout();
  });
}).observe(document.documentElement, { childList: true, subtree: true });

window.addEventListener('load', applyLikertLayout);
window.addEventListener('pageshow', applyLikertLayout);
