(() => {
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

    const packed = '[STRUCTURED_DATA_V2]\n' + JSON.stringify(payload) + '\n\n[OPEN_SUGGESTION]\n' + (val('suggestion') || '');
    const iframe = document.querySelector('iframe[name="google-form-response"]');

    if (!iframe) {
      state.sending = false;
      state.error = 'تعذر تهيئة قناة إرسال الإجابات إلى Google Forms. يرجى إعادة تحميل الصفحة والمحاولة من جديد.';
      return render();
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = FORM_ACTION;
    form.target = 'google-form-response';
    form.style.display = 'none';

    const add = (id, value) => {
      if (value === undefined || value === null || value === '') return;
      const input = document.createElement('input');
      input.name = 'entry.' + id;
      input.value = value;
      form.appendChild(input);
    };

    add(ENTRY.q1, val('q1'));
    add(ENTRY.q2, val('q2'));
    add(ENTRY.status, backendStatus(val('status')));
    add(ENTRY.suggestion, packed);
    ['age', 'gender', 'education', 'housing', 'residence', 'region', 'country', 'professional']
      .forEach(key => add(ENTRY[key], val(key)));

    document.body.appendChild(form);

    let submitted = false;
    let settled = false;
    let timeoutId = null;

    const finishSuccess = () => {
      if (settled || !submitted) return;
      settled = true;
      if (timeoutId) clearTimeout(timeoutId);
      iframe.removeEventListener('load', onLoad);
      if (hash) localStorage.setItem('housingSurveyEmailHash', hash);
      state.done = true;
      state.sending = false;
      state.error = '';
      render();
    };

    const finishTimeout = () => {
      if (settled) return;
      settled = true;
      iframe.removeEventListener('load', onLoad);
      state.sending = false;
      state.error = 'تعذر تأكيد اكتمال إرسال الإجابات إلى Google Forms. يرجى المحاولة مرة أخرى أو التحقق من إعدادات النموذج.';
      render();
    };

    const onLoad = () => {
      if (!submitted || settled) return;
      setTimeout(finishSuccess, 250);
    };

    iframe.addEventListener('load', onLoad);
    submitted = true;

    try {
      form.submit();
      timeoutId = setTimeout(finishTimeout, 15000);
    } catch (_) {
      finishTimeout();
    }
  };
})();
