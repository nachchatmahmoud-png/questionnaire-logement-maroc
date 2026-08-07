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
    const spans = Array.from(legend.querySelectorAll(':scope > span'));
    if (spans.length === 5) {
      spans.forEach((span, index) => { span.textContent = LIKERT_LABELS[index]; });
    } else {
      legend.innerHTML = LIKERT_LABELS.map((label) => `<span>${label}</span>`).join('');
    }
  });

  document.querySelectorAll('.likert-table thead tr').forEach((row) => {
    const headers = Array.from(row.querySelectorAll('th')).slice(1);
    if (headers.length !== 5) return;
    headers.forEach((header, index) => {
      header.textContent = LIKERT_LABELS[index];
      header.title = LIKERT_LABELS[index];
      header.setAttribute('aria-label', LIKERT_LABELS[index]);
      header.classList.add('likert-text-label');
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
window.addEventListener('pageshow', fixLikertDisplay);
window.addEventListener('load', fixLikertDisplay);

const style = document.createElement('style');
style.textContent = `
  .legend-grid > span {
    font-size: 1.02rem !important;
    font-weight: 700 !important;
    line-height: 1.55 !important;
    color: #172033 !important;
  }
  .likert-table thead th:not(:first-child),
  .likert-table thead th.likert-text-label {
    font-size: 1rem !important;
    color: #172033 !important;
    line-height: 1.5 !important;
    font-weight: 700 !important;
    white-space: normal !important;
    min-width: 138px !important;
    padding: .9rem .65rem !important;
  }
  @media (max-width: 900px) {
    .legend-grid > span {
      font-size: .98rem !important;
      font-weight: 700 !important;
    }
    .likert-table thead th:not(:first-child),
    .likert-table thead th.likert-text-label {
      font-size: .92rem !important;
      font-weight: 700 !important;
      min-width: 125px !important;
      line-height: 1.45 !important;
    }
  }
`;
document.head.appendChild(style);
