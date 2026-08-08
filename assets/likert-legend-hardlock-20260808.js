(() => {
  let scheduled = false;

  function enforceSingleLikertLegend() {
    const form = document.querySelector('#questionnaire-form, .form-section');
    if (!form) return;

    const cards = [];
    const seen = new Set();

    form.querySelectorAll('.legend-grid').forEach((grid) => {
      const card = grid.closest('.instruction-card') || grid.parentElement;
      if (!card || seen.has(card)) return;
      seen.add(card);
      cards.push(card);
    });

    cards.forEach((card, index) => {
      if (index === 0) {
        card.dataset.likertLegendPrimary = 'true';
        card.hidden = false;
        card.style.removeProperty('display');
        return;
      }
      card.remove();
    });
  }

  function scheduleEnforce() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      enforceSingleLikertLegend();
    });
  }

  enforceSingleLikertLegend();
  window.addEventListener('DOMContentLoaded', scheduleEnforce);
  window.addEventListener('load', scheduleEnforce);
  window.addEventListener('pageshow', scheduleEnforce);

  new MutationObserver(scheduleEnforce).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
