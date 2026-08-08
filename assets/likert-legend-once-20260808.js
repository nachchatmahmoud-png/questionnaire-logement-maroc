(() => {
  const marker = 'يرجى تحديد درجة موافقتكم على العبارات التالية:';

  function cleanupLikertInstructions() {
    const form = document.querySelector('#questionnaire-form, .form-section');
    if (!form) return;

    const cards = Array.from(form.querySelectorAll('.instruction-card')).filter((card) => {
      const strong = card.querySelector('strong');
      return strong && strong.textContent.trim() === marker && card.querySelector('.legend-grid');
    });

    cards.slice(1).forEach((card) => card.remove());
  }

  let scheduled = false;
  function scheduleCleanup() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      cleanupLikertInstructions();
    });
  }

  cleanupLikertInstructions();
  window.addEventListener('DOMContentLoaded', scheduleCleanup);
  window.addEventListener('load', scheduleCleanup);
  window.addEventListener('pageshow', scheduleCleanup);
  new MutationObserver(scheduleCleanup).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
