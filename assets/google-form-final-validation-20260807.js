(() => {
  const GOOGLE_FORM_ID = '1FAIpQLScGEubgpATNTz90NztM1zAqKboGOS1p5ePQzg5e703l_JRx0g';
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
      if (button && !button.disabled) button.textContent = text;
    }

    const nav = document.querySelector('.form-actions');
    if (nav && (document.getElementById('submit') || document.getElementById('submit-end'))) {
      const section = nav.closest('#questionnaire-form, .form-section');
      if (section && !section.querySelector('.google-validation-note')) {
        const note = document.createElement('div');
        note.className = 'instruction-card compact google-validation-note';
        note.innerHTML = '<p>سيتم فتح نموذج Google في الخطوة الأخيرة للتحقق من المشاركة وإرسال الإجابة. لا يطلب هذا الموقع بريدكم الإلكتروني الشخصي.</p>';
        nav.before(note);
      }
    }
  }

  const style = document.createElement('style');
  style.textContent = `
    .google-validation-note {
      margin-top: 1rem;
      margin-bottom: .75rem;
    }
    .google-validation-note p {
      margin: 0;
      font-size: .94rem;
      line-height: 1.75;
      font-weight: 400 !important;
    }
  `;
  document.head.appendChild(style);

  adaptFinalButtons();
  window.addEventListener('DOMContentLoaded', adaptFinalButtons);
  window.addEventListener('load', adaptFinalButtons);
  new MutationObserver(adaptFinalButtons).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
