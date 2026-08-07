(() => {
  const labels = [
    ['1', 'لا أوافق إطلاقًا'],
    ['2', 'لا أوافق'],
    ['3', 'لا أوافق ولا أعارض'],
    ['4', 'أوافق'],
    ['5', 'أوافق تمامًا'],
  ];

  function enhanceLikert() {
    document.querySelectorAll('.legend-grid').forEach((legend) => {
      if (legend.dataset.likertEnhanced === '1') return;
      legend.dataset.likertEnhanced = '1';
      legend.innerHTML = labels.map(([n, text]) =>
        `<span class="likert-legend-item"><b>${n}</b><span>— ${text}</span></span>`
      ).join('');
    });

    document.querySelectorAll('.likert-table thead tr').forEach((row) => {
      const headers = Array.from(row.querySelectorAll('th')).slice(1);
      if (headers.length !== labels.length) return;
      headers.forEach((th, index) => {
        const [n, text] = labels[index];
        if (th.dataset.fullLikertLabel === '1') return;
        th.dataset.fullLikertLabel = '1';
        th.innerHTML = `<span class="likert-head-number">${n}</span><span class="likert-head-text">${text}</span>`;
        th.title = `${n} — ${text}`;
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
      gap: .3rem;
      padding: .55rem .65rem;
      border: 1px solid rgba(15,23,42,.10);
      border-radius: 10px;
      background: rgba(15,23,42,.025);
      text-align: center;
      line-height: 1.45;
      font-weight: 400 !important;
      white-space: normal;
    }
    .likert-legend-item b {
      font-weight: 700;
      flex: 0 0 auto;
    }
    .likert-table thead th:not(:first-child) {
      min-width: 118px;
      white-space: normal;
      line-height: 1.35;
      vertical-align: middle;
    }
    .likert-head-number {
      display: block;
      font-weight: 700;
      margin-bottom: .2rem;
    }
    .likert-head-text {
      display: block;
      font-size: .76rem;
      font-weight: 500;
      line-height: 1.35;
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
        font-size: .72rem;
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
