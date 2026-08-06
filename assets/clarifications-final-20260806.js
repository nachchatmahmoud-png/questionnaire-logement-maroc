(() => {
  const definitions = [
    {
      title: "وسائل التواصل الرسمية للوزارة",
      marker: "يقصد بوسائل التواصل الرسمية للوزارة",
      text: "يقصد بوسائل التواصل الرسمية للوزارة مجموع القنوات والوسائط التي تعتمدها الوزارة بصفة رسمية للتواصل العمومي بشأن برنامج الدعم المباشر للسكن، قصد نشر المعلومات المتعلقة بأهدافه وشروط الاستفادة منه ومساطره وإجراءاته ومستجداته، وتمكين المواطنين من الولوج إلى المعطيات والخدمات المرتبطة به. وتشمل، على سبيل المثال لا الحصر، الموقع الإلكتروني الرسمي للوزارة، ومنصة «دعم سكن» وتطبيقها، والصفحات والحسابات الرسمية على شبكات التواصل الاجتماعي، والبلاغات والمنشورات الرسمية، وغيرها من القنوات المعتمدة للتواصل بشأن البرنامج. ولا يُشترط في هذه الوسائل أن تتيح للمواطنين إمكانية التواصل مع الوزارة أو تلقي رد منها، إذ قد يقتصر دورها على نشر المعلومات وإتاحتها للعموم.",
    },
    {
      title: "وسائل التواصل الرسمية التي تتيح التفاعل",
      marker: "يقصد بوسائل التواصل الرسمية التي تتيح التفاعل",
      text: "يقصد بوسائل التواصل الرسمية التي تتيح التفاعل القنوات الرسمية التي تعتمدها الوزارة في إطار برنامج الدعم المباشر للسكن، والتي تمكّن المواطنين، إلى جانب الاطلاع على المعلومات، من التواصل مع الوزارة عبر توجيه الأسئلة، وطلب التوضيحات، وتقديم الملاحظات أو المقترحات أو الشكايات، مع إمكانية تلقي رد أو تتبع مآلها. وتشمل، على سبيل المثال لا الحصر، خدمات التواصل والمساعدة المتاحة عبر منصة «دعم سكن» وتطبيقها، والبريد الإلكتروني ورقم المساعدة المخصصين للبرنامج، والبوابة الوطنية للشكايات، والرسائل الموجهة إلى الوزارة عبر حساباتها الرسمية على شبكات التواصل الاجتماعي.",
    },
  ];

  function normalize(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function findDeepestElement(marker) {
    const candidates = [...document.querySelectorAll("p, li, div, span")].filter(
      (element) => normalize(element.textContent || "").includes(marker),
    );

    return candidates.find(
      (element) =>
        ![...element.children].some((child) =>
          normalize(child.textContent || "").includes(marker),
        ),
    );
  }

  function applyDefinition({ title, marker, text }) {
    const element = findDeepestElement(marker);
    if (!element) return false;

    const current = normalize(element.textContent || "");
    const combined = normalize(`${title}: ${text}`);
    const textOnly = normalize(text);

    if (current === combined || current === textOnly) return true;

    const containsTitle = current.startsWith(title);
    element.replaceChildren();

    if (containsTitle) {
      const strong = document.createElement("strong");
      strong.textContent = `${title}:`;
      element.append(strong, ` ${text}`);
    } else {
      element.textContent = text;
    }

    return true;
  }

  function applyClarifications() {
    definitions.forEach(applyDefinition);
  }

  applyClarifications();

  const observer = new MutationObserver(applyClarifications);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  window.addEventListener("load", applyClarifications);
  window.addEventListener("hashchange", applyClarifications);
  window.addEventListener("popstate", applyClarifications);

  let attempts = 0;
  const timer = window.setInterval(() => {
    applyClarifications();
    attempts += 1;
    if (attempts >= 120) window.clearInterval(timer);
  }, 250);
})();
