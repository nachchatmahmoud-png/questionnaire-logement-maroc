(() => {
  const marker = 'يرجى تحديد درجة موافقتكم على العبارات التالية:';
  const legendPattern = /<div class="instruction-card"><strong>يرجى تحديد درجة موافقتكم على العبارات التالية:<\/strong><div class="legend-grid">[\s\S]*?<\/div><\/div>/g;

  function dedupeLegendHtml(html) {
    if (typeof html !== 'string') return html;
    let seen = false;
    return html.replace(legendPattern, (block) => {
      if (!seen) {
        seen = true;
        return block;
      }
      return '';
    });
  }

  if (typeof section === 'function') {
    const baseSection = section;
    section = function () {
      return dedupeLegendHtml(baseSection());
    };
  }

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
