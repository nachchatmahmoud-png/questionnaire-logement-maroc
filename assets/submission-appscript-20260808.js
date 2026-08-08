(() => {
  const APPS_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycby1zRP7s7H6XxbAb3gs-zmnO_mrKv8WmcLAY5Zy7ramem7EUt26FnuAhf599NULbC31/exec';

  if (typeof submit !== 'function') return;

  const markSuccess = (hash) => {
    if (hash) localStorage.setItem('housingSurveyEmailHash', hash);
    state.done = true;
    state.sending = false;
    state.error = '';
    render();
  };

  const markFailure = (message) => {
    state.sending = false;
    state.error = message || 'تعذر إرسال الإجابات إلى Google Forms. يرجى المحاولة مرة أخرى.';
    render();
  };

  const fallbackFormPost = (payload, hash) => {
    const iframe = document.querySelector('iframe[name="google-form-response"]');
    if (!iframe) {
      markFailure('تعذر تهيئة قناة إرسال الإجابات. يرجى إعادة تحميل الصفحة والمحاولة من جديد.');
      return;
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = APPS_SCRIPT_ENDPOINT;
    form.target = 'google-form-response';
    form.acceptCharset = 'UTF-8';
    form.style.display = 'none';

    const payloadInput = document.createElement('input');
    payloadInput.type = 'hidden';
    payloadInput.name = 'payload';
    payloadInput.value = JSON.stringify(payload);
    form.appendChild(payloadInput);
    document.body.appendChild(form);

    let submitted = false;
    let settled = false;
    let timeoutId = null;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      iframe.removeEventListener('load', onLoad);
      form.remove();
    };

    const onLoad = () => {
      if (!submitted || settled) return;
      settled = true;
      cleanup();
      setTimeout(() => markSuccess(hash), 250);
    };

    iframe.addEventListener('load', onLoad);
    submitted = true;

    try {
      form.submit();
      timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        markFailure('تعذر تأكيد إرسال الإجابات إلى Google Forms. يرجى المحاولة مرة أخرى.');
      }, 20000);
    } catch (_) {
      settled = true;
      cleanup();
      markFailure();
    }
  };

  submit = async function () {
    if (!valid()) return render();

    state.sending = true;
    state.error = '';
    render();

    const normalized = (val('email_personal') || '').trim().toLowerCase();
    const hash = normalized ? await emailHash(normalized) : null;

    if (hash && localStorage.getItem('housingSurveyEmailHash') === hash) {
      state.sending = false;
      state.error = 'سبق تسجيل مشاركة بهذا البريد الإلكتروني على هذا الجهاز.';
      return render();
    }

    const payload = {
      schema_version: '2026-08-07-final',
      submitted_at: new Date().toISOString(),
      answers: { ...state.a, email_personal: normalized || null },
      scores: scores(),
      structural_missing: {
        satisfaction: beneficiary() ? false : true,
        personal_impact: beneficiary() ? false : true,
        response_quality: val('contact_reel') === 'نعم' && val('reponse_recue') === 'نعم' ? false : true
      }
    };

    const body = new URLSearchParams();
    body.set('payload', JSON.stringify(payload));

    try {
      const response = await fetch(APPS_SCRIPT_ENDPOINT, {
        method: 'POST',
        body,
        redirect: 'follow',
        credentials: 'omit'
      });

      const text = await response.text();
      let result = null;
      try { result = JSON.parse(text); } catch (_) {}

      if (result && result.ok === true) {
        markSuccess(hash);
        return;
      }

      if (result && result.ok === false) {
        markFailure('تعذر تسجيل الإجابات في Google Forms: ' + (result.error || 'خطأ غير معروف.'));
        return;
      }

      fallbackFormPost(payload, hash);
    } catch (_) {
      fallbackFormPost(payload, hash);
    }
  };
})();
