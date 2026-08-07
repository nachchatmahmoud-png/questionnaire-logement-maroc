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
    font-size: .62rem !important;
    font-weight: 550 !important;
    line-height: 1.2 !important;
    color: #172033 !important;
    white-space: normal !important;
  }

  .likert-table thead th:not(:first-child) {
    min-width: 78px !important;
    padding: .36rem .18rem !important;
  }

  @media (max-width: 900px) {
    .legend-grid > span,
    .likert-table thead th:not(:first-child) {
      font-size: .56rem !important;
      line-height: 1.16 !important;
    }
    .likert-table thead th:not(:first-child) {
      min-width: 70px !important;
      padding: .32rem .16rem !important;
    }
  }

  @media (max-width: 600px) {
    .legend-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: .3rem !important;
    }
    .legend-grid > span,
    .likert-table thead th:not(:first-child) {
      font-size: .50rem !important;
      font-weight: 550 !important;
      line-height: 1.12 !important;
    }
    .legend-grid > span {
      padding: .32rem .28rem !important;
    }
    .likert-table thead th:not(:first-child) {
      min-width: 62px !important;
      padding: .28rem .12rem !important;
    }
  }
`;
document.head.appendChild(style);
