(() => {
  function removeLegacyGoogleNote() {
    document.querySelectorAll('.google-validation-note').forEach((note) => note.remove());
    const forbiddenText = 'سيتم فتح نموذج Google في الخطوة الأخيرة للتحقق من المشاركة وإرسال الإجابة. لا يطلب هذا الموقع بريدكم الإلكتروني الشخصي.';
    document.querySelectorAll('p,div,section').forEach((node) => {
      if ((node.textContent || '').trim() !== forbiddenText) return;
      const card = node.closest('.instruction-card, .google-validation-note');
      (card || node).remove();
    });
  }

  function adaptFinalButtons() {
    const labels = {
      submit: 'إرسال الإجابات',
      'submit-end': 'إرسال الإجابة وإنهاء الاستبيان',
    };
    for (const [id, text] of Object.entries(labels)) {
      const button = document.getElementById(id);
      if (button && !button.disabled && button.textContent !== text) button.textContent = text;
    }
    removeLegacyGoogleNote();
  }

  const style = document.createElement('style');
  style.textContent = '.google-validation-note{display:none!important}';
  document.head.appendChild(style);

  let scheduled = false;
  function scheduleAdapt() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; adaptFinalButtons(); });
  }

  adaptFinalButtons();
  window.addEventListener('DOMContentLoaded', scheduleAdapt);
  window.addEventListener('load', scheduleAdapt);
  window.addEventListener('pageshow', scheduleAdapt);
  new MutationObserver(scheduleAdapt).observe(document.documentElement, { childList:true, subtree:true });
})();
