(() => {
  const OTHER_CHANNEL = 'قناة رسمية أخرى';
  const FINAL_CHANNELS = [
    'البريد الإلكتروني المخصص للدعم عبر «دعم سكن» (contact@daamsakane.ma)',
    'الهاتف المخصص للدعم عبر «دعم سكن»',
    'الموقع الإلكتروني الرسمي للوزارة',
    'البوابة الوطنية للشكايات',
    'الرسائل الخاصة عبر الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي',
    OTHER_CHANNEL
  ];

  const stripLikertLegend = (html) => html.replace(
    /^<div class="instruction-card"><strong>يرجى تحديد درجة موافقتكم على العبارات التالية:<\/strong><div class="legend-grid">[\s\S]*?<\/div><\/div>/,
    ''
  );

  if (typeof contactChannels !== 'undefined' && Array.isArray(contactChannels)) {
    contactChannels.splice(0, contactChannels.length, ...FINAL_CHANNELS);
  }

  if (typeof interaction === 'function') {
    interaction = function () {
      const mainLikertBlock = table([...G.interComm, ...G.interPart]);

      let h = `<div class="instruction-card"><p>يرجى الإجابة استنادًا إلى ما تعرفونه أو عايشتموه بشأن القنوات الرسمية التي تتيح للمواطنين التواصل أو التفاعل حول البرنامج، مثل البريد الإلكتروني والهاتف المخصصين للدعم عبر «دعم سكن»، والموقع الإلكتروني الرسمي للوزارة، والبوابة الوطنية للشكايات، والرسائل الخاصة عبر الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي.</p></div>${mainLikertBlock}<section class="group-card"><div class="group-heading"><h3>ثالثًا: تجربة التواصل الفعلي مع الوزارة</h3></div>${radio('contact_reel','هل سبق لكم استخدام إحدى القنوات الرسمية للتواصل أو التفاعل بشأن البرنامج، لطرح سؤال أو طلب توضيح أو تقديم ملاحظة أو مقترح أو شكاية؟',['نعم','لا'])}`;

      if (val('contact_reel') === 'نعم') {
        h += radio('canal_dernier_contact','من خلال أي قناة رسمية تم آخر تواصل لكم بشأن البرنامج؟',contactChannels);

        if (val('canal_dernier_contact') === OTHER_CHANNEL) {
          h += `<fieldset class="question-card"><legend>إذا اخترتم «قناة رسمية أخرى»، يرجى تحديد وسيلة التواصل التي استخدمتموها: <span class="required-mark">*</span></legend><input class="text-input" type="text" id="canal-dernier-contact-autre" value="${esc(val('canal_dernier_contact_autre'))}" placeholder="يرجى تحديد وسيلة التواصل"></fieldset>`;
        }

        h += radio('reponse_recue','هل توصلتم برد بشأن هذا التواصل؟',['نعم','لا']);
        if (val('reponse_recue') === 'نعم') {
          h += `<p class="question-help">يرجى تقييم الرد الذي توصلتم به:</p>${stripLikertLegend(table(G.response))}`;
        }
      }

      return h + '</section>';
    };
  }

  if (typeof requiredIds === 'function') {
    const baseRequiredIds = requiredIds;
    requiredIds = function (step) {
      const ids = baseRequiredIds(step);
      if (
        step === 'interaction' &&
        val('contact_reel') === 'نعم' &&
        val('canal_dernier_contact') === OTHER_CHANNEL &&
        !ids.includes('canal_dernier_contact_autre')
      ) {
        ids.push('canal_dernier_contact_autre');
      }
      return ids;
    };
  }

  if (typeof bind === 'function') {
    const baseBind = bind;
    bind = function () {
      baseBind();

      const otherInput = document.querySelector('#canal-dernier-contact-autre');
      if (otherInput) {
        otherInput.oninput = () => set('canal_dernier_contact_autre', otherInput.value);
      }

      document.querySelectorAll('input[type="radio"][data-id="canal_dernier_contact"]').forEach((input) => {
        const baseHandler = input.onchange;
        input.onchange = (event) => {
          if (input.value !== OTHER_CHANNEL) del('canal_dernier_contact_autre');
          if (baseHandler) baseHandler.call(input, event);
        };
      });

      document.querySelectorAll('input[type="radio"][data-id="contact_reel"]').forEach((input) => {
        const baseHandler = input.onchange;
        input.onchange = (event) => {
          if (input.value === 'لا') del('canal_dernier_contact_autre');
          if (baseHandler) baseHandler.call(input, event);
        };
      });
    };
  }

  if (typeof render === 'function') render();
})();
