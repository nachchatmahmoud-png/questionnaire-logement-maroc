(() => {
  const DEFINITIONS = [
    {
      index: 1,
      title: 'وسائل التواصل الرسمية للوزارة',
      text: 'يقصد بوسائل التواصل الرسمية للوزارة مجموع القنوات والوسائط التي تعتمدها الوزارة بصفة رسمية للتواصل العمومي بشأن برنامج الدعم المباشر للسكن، قصد نشر المعلومات المتعلقة بأهدافه وشروط الاستفادة منه ومساطره وإجراءاته ومستجداته، وتمكين المواطنين من الولوج إلى المعطيات والخدمات المرتبطة به. وتشمل، على سبيل المثال لا الحصر، الموقع الإلكتروني الرسمي للوزارة، ومنصة «دعم سكن» وتطبيقها، والصفحات والحسابات الرسمية على شبكات التواصل الاجتماعي، والبلاغات والمنشورات الرسمية، وغيرها من القنوات المعتمدة للتواصل بشأن البرنامج. ولا يُشترط في هذه الوسائل أن تتيح للمواطنين إمكانية التواصل مع الوزارة أو تلقي رد منها، إذ قد يقتصر دورها على نشر المعلومات وإتاحتها للعموم.'
    },
    {
      index: 2,
      title: 'وسائل التواصل الرسمية التي تتيح التفاعل',
      text: 'يقصد بوسائل التواصل الرسمية التي تتيح التفاعل القنوات الرسمية التي تعتمدها الوزارة في إطار برنامج الدعم المباشر للسكن، والتي تمكّن المواطنين، إلى جانب الاطلاع على المعلومات، من التواصل مع الوزارة عبر توجيه الأسئلة، وطلب التوضيحات، وتقديم الملاحظات أو المقترحات أو الشكايات، مع إمكانية تلقي رد أو تتبع مآلها. وتشمل، على سبيل المثال لا الحصر، خدمات التواصل والمساعدة المتاحة عبر منصة «دعم سكن» وتطبيقها، والبريد الإلكتروني ورقم المساعدة المخصصين للبرنامج، والبوابة الوطنية للشكايات، والرسائل الموجهة إلى الوزارة عبر حساباتها الرسمية على شبكات التواصل الاجتماعي.'
    }
  ];

  function applyDefinitions() {
    const list = document.querySelector('.definition-list');
    if (!list) return;

    const paragraphs = list.querySelectorAll(':scope > p');
    DEFINITIONS.forEach(({ index, title, text }) => {
      const paragraph = paragraphs[index];
      if (!paragraph) return;

      const expected = `${title}: ${text}`;
      if (paragraph.textContent.trim() === expected) return;

      paragraph.replaceChildren();
      const strong = document.createElement('strong');
      strong.textContent = `${title}:`;
      paragraph.append(strong, ` ${text}`);
    });
  }

  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyDefinitions();
    });
  }

  applyDefinitions();
  window.addEventListener('load', scheduleApply);
  window.addEventListener('pageshow', scheduleApply);
  new MutationObserver(scheduleApply).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
