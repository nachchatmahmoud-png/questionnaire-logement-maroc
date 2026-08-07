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

const style = document.createElement('style');
style.textContent = `
  .legend-grid > span,
  .likert-table thead th:not(:first-child) {
    font-size: .74rem !important;
    font-weight: 600 !important;
    line-height: 1.28 !important;
    color: #172033 !important;
    white-space: normal !important;
  }

  .likert-table thead th:not(:first-child) {
    min-width: 92px !important;
    padding: .48rem .28rem !important;
  }

  @media (max-width: 900px) {
    .legend-grid > span,
    .likert-table thead th:not(:first-child) {
      font-size: .68rem !important;
      line-height: 1.24 !important;
    }
    .likert-table thead th:not(:first-child) {
      min-width: 82px !important;
      padding: .42rem .24rem !important;
    }
  }

  @media (max-width: 600px) {
    .legend-grid > span,
    .likert-table thead th:not(:first-child) {
      font-size: .62rem !important;
      line-height: 1.2 !important;
    }
    .likert-table thead th:not(:first-child) {
      min-width: 72px !important;
      padding: .36rem .18rem !important;
    }
  }
`;
document.head.appendChild(style);
