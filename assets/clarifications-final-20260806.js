(() => {
  const officialTitle = "وسائل التواصل الرسمية للوزارة";
  const officialText =
    "يقصد بوسائل التواصل الرسمية للوزارة مجموع القنوات والوسائط التي تعتمدها الوزارة بصفة رسمية للتواصل العمومي بشأن برنامج الدعم المباشر للسكن، قصد نشر المعلومات المتعلقة بأهدافه وشروط الاستفادة منه ومساطره وإجراءاته ومستجداته، وتمكين المواطنين من الولوج إلى المعطيات والخدمات المرتبطة به. وتشمل، على سبيل المثال لا الحصر، الموقع الإلكتروني الرسمي للوزارة، ومنصة «دعم سكن» وتطبيقها، والصفحات والحسابات الرسمية على شبكات التواصل الاجتماعي، والبلاغات والمنشورات الرسمية، وغيرها من القنوات المعتمدة للتواصل بشأن البرنامج. ولا يُشترط في هذه الوسائل أن تتيح للمواطنين إمكانية التواصل مع الوزارة أو تلقي رد منها، إذ قد يقتصر دورها على نشر المعلومات وإتاحتها للعموم.";

  const interactiveTitle = "وسائل التواصل الرسمية التي تتيح التفاعل";
  const interactiveText =
    "يقصد بوسائل التواصل الرسمية التي تتيح التفاعل القنوات الرسمية التي تعتمدها الوزارة في إطار برنامج الدعم المباشر للسكن، والتي تمكّن المواطنين، إلى جانب الاطلاع على المعلومات، من التواصل مع الوزارة عبر توجيه الأسئلة، وطلب التوضيحات، وتقديم الملاحظات أو المقترحات أو الشكايات، مع إمكانية تلقي رد أو تتبع مآلها. وتشمل، على سبيل المثال لا الحصر، خدمات التواصل والمساعدة المتاحة عبر منصة «دعم سكن» وتطبيقها، والبريد الإلكتروني ورقم المساعدة المخصصين للبرنامج، والبوابة الوطنية للشكايات، والرسائل الموجهة إلى الوزارة عبر حساباتها الرسمية على شبكات التواصل الاجتماعي.";

  function setParagraph(paragraph, title, text) {
    const expected = `${title}: ${text}`;
    if (paragraph.textContent.trim() === expected) return;

    paragraph.replaceChildren();
    const strong = document.createElement("strong");
    strong.textContent = `${title}:`;
    paragraph.append(strong, ` ${text}`);
  }

  function applyClarifications() {
    const details = [...document.querySelectorAll("details")].find(
      (element) => element.querySelector("summary")?.textContent.trim() === "توضيحات",
    );
    if (!details) return;

    const paragraphs = [...details.querySelectorAll("p")];

    let officialParagraph = paragraphs.find((paragraph) => {
      const value = paragraph.textContent.trim();
      return (
        value.startsWith(officialTitle) ||
        value.includes("يقصد بوسائل التواصل الرسمية للوزارة")
      );
    });

    let interactiveParagraph = paragraphs.find((paragraph) => {
      const value = paragraph.textContent.trim();
      return (
        value.startsWith(interactiveTitle) ||
        value.includes("يقصد بوسائل التواصل الرسمية التي تتيح التفاعل")
      );
    });

    const container =
      details.querySelector(".definition-list") ||
      details.querySelector("div") ||
      details;

    if (!officialParagraph) {
      officialParagraph = document.createElement("p");
      container.appendChild(officialParagraph);
    }

    if (!interactiveParagraph) {
      interactiveParagraph = document.createElement("p");
      container.appendChild(interactiveParagraph);
    }

    setParagraph(officialParagraph, officialTitle, officialText);
    setParagraph(interactiveParagraph, interactiveTitle, interactiveText);
  }

  applyClarifications();

  const observer = new MutationObserver(applyClarifications);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  let attempts = 0;
  const timer = window.setInterval(() => {
    applyClarifications();
    attempts += 1;
    if (attempts >= 40) window.clearInterval(timer);
  }, 250);
})();
