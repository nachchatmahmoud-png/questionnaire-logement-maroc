(() => {
  const GOOGLE_FORM_ID = '1FAIpQLSfm5EXmdlOc_4k1wA14rliRwoSo0a23WyryaQK2G9yXn0TKAg';
  const FORM_RESPONSE = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
  const FORM_VIEW = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`;
  const nativeSubmit = HTMLFormElement.prototype.submit;

  function isQuestionnaireGoogleForm(form) {
    try {
      return new URL(form.action, window.location.href).href.startsWith(FORM_RESPONSE);
    } catch (_) {
      return false;
    }
  }

  function openGoogleValidation(form) {
    const params = new URLSearchParams();
    params.set('usp', 'pp_url');

    for (const field of Array.from(form.elements || [])) {
      if (!field.name || !field.name.startsWith('entry.')) continue;
      if (field.disabled) continue;
      params.append(field.name, field.value ?? '');
    }

    try {
      sessionStorage.setItem('housingSurveyGoogleValidationPending', '1');
    } catch (_) {}

    window.location.assign(`${FORM_VIEW}?${params.toString()}`);
  }

  HTMLFormElement.prototype.submit = function patchedSubmit() {
    if (isQuestionnaireGoogleForm(this)) {
      openGoogleValidation(this);
      return;
    }
    return nativeSubmit.call(this);
  };

  function adaptFinalButtons() {
    const labels = {
      submit: 'متابعة إلى Google Forms وإرسال الإجابة',
      'submit-end': 'متابعة إلى Google Forms وإنهاء الاستبيان',
    };

    for (const [id, text] of Object.entries(labels)) {
      const button = document.getElementById(id);
      if (button && !button.disabled && button.textContent !== text) {
        button.textContent = text;
      }
    }

  }

  let scheduled = false;
  function scheduleAdapt() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      adaptFinalButtons();
    });
  }

  adaptFinalButtons();
  window.addEventListener('DOMContentLoaded', scheduleAdapt);
  window.addEventListener('load', scheduleAdapt);
  new MutationObserver(scheduleAdapt).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
