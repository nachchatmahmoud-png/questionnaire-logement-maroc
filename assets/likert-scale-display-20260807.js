(() => {
  const labels = [
    'لا أوافق إطلاقًا',
    'لا أوافق',
    'لا أوافق ولا أعارض',
    'أوافق',
    'أوافق تمامًا',
  ];

  function enhanceLikert() {
    document.querySelectorAll('.legend-grid').forEach((legend) => {
      if (legend.dataset.likertEnhanced === '1') return;
      legend.dataset.likertEnhanced = '1';
      legend.innerHTML = labels.map((text) =>
        `<span class="likert-legend-item">${text}</span>`
      ).join('');
    });

    document.querySelectorAll('.likert-table thead tr').forEach((row) => {
      const headers = Array.from(row.querySelectorAll('th')).slice(1);
      if (headers.length !== labels.length) return;
      headers.forEach((th, index) => {
        const text = labels[index];
        if (th.dataset.fullLikertLabel === '1') return;
        th.dataset.fullLikertLabel = '1';
        th.innerHTML = `<span class="likert-head-text">${text}</span>`;
        th.title = text;
      });
    });
  }

  const style = document.createElement('style');
  style.id = 'likert-scale-display-style';
  style.textContent = `
    .legend-grid {
      display: grid !important;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: .55rem !important;
      margin-top: .8rem;
    }
    .likert-legend-item {
      display: flex !important;
      align-items: center;
      justify-content: center;
      padding: .55rem .65rem;
      border: 1px solid rgba(15,23,42,.10);
      border-radius: 10px;
      background: rgba(15,23,42,.025);
      text-align: center;
      line-height: 1.45;
      font-weight: 500 !important;
      white-space: normal;
    }
    .likert-table thead th:not(:first-child) {
      min-width: 118px;
      white-space: normal;
      line-height: 1.35;
      vertical-align: middle;
    }
    .likert-head-text {
      display: block;
      font-size: .78rem;
      font-weight: 500;
      line-height: 1.4;
    }
    @media (max-width: 900px) {
      .legend-grid {
        grid-template-columns: 1fr !important;
      }
      .likert-legend-item {
        justify-content: flex-start;
        text-align: right;
      }
      .likert-table thead th:not(:first-child) {
        min-width: 105px;
      }
      .likert-head-text {
        font-size: .73rem;
      }
    }
  `;
  document.head.appendChild(style);

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      enhanceLikert();
    });
  }

  window.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  schedule();
})();
