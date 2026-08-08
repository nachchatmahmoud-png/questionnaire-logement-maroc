(() => {
  const GOOGLE_FORM_ID = '1FAIpQLScGEubgpATNTz90NztM1zAqKboGOS1p5ePQzg5e703l_JRx0g';
  const FORM_RESPONSE = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
  const FORM_VIEW = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`;
  const nativeSubmit = HTMLFormElement.prototype.submit;

  function isQuestionnaireGoogleForm(form) {
    try { return new URL(form.action, window.location.href).href.startsWith(FORM_RESPONSE); }
    catch (_) { return false; }
  }

  function openGoogleValidation(form) {
    const params = new URLSearchParams();
    params.set('usp', 'pp_url');
    for (const field of Array.from(form.elements || [])) {
      if (!field.name || !field.name.startsWith('entry.') || field.disabled) continue;
      params.append(field.name, field.value ?? '');
    }
    try { sessionStorage.setItem('housingSurveyGoogleValidationPending', '1'); } catch (_) {}
    window.location.assign(`${FORM_VIEW}?${params.toString()}`);
  }

  HTMLFormElement.prototype.submit = function patchedSubmit() {
    if (isQuestionnaireGoogleForm(this)) { openGoogleValidation(this); return; }
    return nativeSubmit.call(this);
  };

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
      submit: 'متابعة إلى Google Forms وإرسال الإجابة',
      'submit-end': 'متابعة إلى Google Forms وإنهاء الاستبيان',
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
