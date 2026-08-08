(() => {
  const noteToRemove = 'لن تُعرض الإجابات الصحيحة أثناء الاستبيان.';

  function isUnderstandingSection() {
    const heading = document.querySelector('#questionnaire-form .section-heading h2');
    return heading && heading.textContent.includes('فهم البرنامج');
  }

  function cleanInstruction() {
    if (!isUnderstandingSection()) return;
    const cards = document.querySelectorAll('#questionnaire-form .instruction-card');
    for (const card of cards) {
      const p = card.querySelector('p');
      if (!p || !p.textContent.includes(noteToRemove)) continue;
      p.textContent = p.textContent.replace(noteToRemove, '').trim();
    }
  }

  function numberQuestions() {
    if (!isUnderstandingSection()) return;
    const legends = Array.from(document.querySelectorAll('#questionnaire-form .question-card legend'));
    legends.forEach((legend, index) => {
      const number = index + 1;
      const mark = legend.querySelector('.required-mark');
      const markText = mark ? mark.outerHTML : '';
      const plainText = Array.from(legend.childNodes)
        .filter(node => !(node.nodeType === Node.ELEMENT_NODE && node.classList?.contains('required-mark')))
        .map(node => node.textContent || '')
        .join('')
        .trim()
        .replace(/^\d+[\.\-–—]\s*/, '');

      const expected = `${number}. ${plainText}`;
      const currentText = legend.textContent.replace('*', '').trim();
      if (currentText === expected) return;
      legend.innerHTML = `${number}. ${plainText}${markText}`;
    });
  }

  function apply() {
    cleanInstruction();
    numberQuestions();
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      apply();
    });
  }

  apply();
  window.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  window.addEventListener('pageshow', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
