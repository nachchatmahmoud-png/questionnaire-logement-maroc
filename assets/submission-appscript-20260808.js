(() => {
  const APPS_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzWv9vYyyvLkP0htcW7ch4w6rn-CcFNK8BA2L04eVbmAVtE05w0i1yiJwnMgZSOpyNZ/exec';

  if (typeof submit !== 'function') return;

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

    const iframe = document.querySelector('iframe[name="google-form-response"]');
    if (!iframe) {
      state.sending = false;
      state.error = 'تعذر تهيئة قناة إرسال الإجابات. يرجى إعادة تحميل الصفحة والمحاولة من جديد.';
      return render();
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

    const finishSuccess = () => {
      if (settled || !submitted) return;
      settled = true;
      cleanup();
      if (hash) localStorage.setItem('housingSurveyEmailHash', hash);
      state.done = true;
      state.sending = false;
      state.error = '';
      render();
    };

    const finishTimeout = () => {
      if (settled) return;
      settled = true;
      cleanup();
      state.sending = false;
      state.error = 'تعذر تأكيد إرسال الإجابات إلى Google Forms. يرجى المحاولة مرة أخرى.';
      render();
    };

    const onLoad = () => {
      if (!submitted || settled) return;
      setTimeout(finishSuccess, 350);
    };

    iframe.addEventListener('load', onLoad);
    submitted = true;

    try {
      form.submit();
      timeoutId = setTimeout(finishTimeout, 20000);
    } catch (_) {
      finishTimeout();
    }
  };
})();
