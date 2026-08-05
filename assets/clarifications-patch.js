(() => {
  const officialChannelsText =
    "يقصد بوسائل التواصل الرسمية للوزارة مجموع القنوات والوسائط التي تعتمدها الوزارة بصفة رسمية للتواصل العمومي بشأن برنامج الدعم المباشر للسكن، قصد نشر المعلومات المتعلقة بأهدافه وشروط الاستفادة منه ومساطره وإجراءاته ومستجداته، وتمكين المواطنين من الولوج إلى المعطيات والخدمات المرتبطة به. وتشمل، على سبيل المثال لا الحصر، الموقع الإلكتروني الرسمي للوزارة، ومنصة «دعم سكن» وتطبيقها، والصفحات والحسابات الرسمية على شبكات التواصل الاجتماعي، والبلاغات والمنشورات الرسمية، وغيرها من القنوات المعتمدة للتواصل بشأن البرنامج. ولا يُشترط في هذه الوسائل أن تتيح للمواطنين إمكانية التواصل مع الوزارة أو تلقي رد منها، إذ قد يقتصر دورها على نشر المعلومات وإتاحتها للعموم.";

  const interactiveChannelsText =
    "يقصد بوسائل التواصل الرسمية التي تتيح التفاعل القنوات الرسمية التي تعتمدها الوزارة في إطار برنامج الدعم المباشر للسكن، والتي تمكّن المواطنين، إلى جانب الاطلاع على المعلومات، من التواصل مع الوزارة عبر توجيه الأسئلة، وطلب التوضيحات، وتقديم الملاحظات أو المقترحات أو الشكايات، مع إمكانية تلقي رد أو تتبع مآلها. وتشمل، على سبيل المثال لا الحصر، خدمات التواصل والمساعدة المتاحة عبر منصة «دعم سكن» وتطبيقها، والبريد الإلكتروني ورقم المساعدة المخصصين للبرنامج، والبوابة الوطنية للشكايات، والرسائل الموجهة إلى الوزارة عبر حساباتها الرسمية على شبكات التواصل الاجتماعي.";

  const originalStatement =
    "تُمكّن القنوات الرسمية للتواصل مع الوزارة المواطنين من توجيه استفساراتهم بشأن برنامج الدعم المباشر للسكن.";

  const improvedStatement =
    "تتيح القنوات الرسمية للتواصل مع الوزارة للمواطنين إمكانية توجيه استفساراتهم وطلب التوضيحات بشأن برنامج الدعم المباشر للسكن.";

  function replaceStatement() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );

    let replaced = false;
    let node;

    while ((node = walker.nextNode())) {
      if (node.nodeValue?.trim() === originalStatement) {
        node.nodeValue = node.nodeValue.replace(
          originalStatement,
          improvedStatement,
        );
        replaced = true;
      }
    }

    return replaced;
  }

  function replaceClarifications() {
    const details = [...document.querySelectorAll("details")].find(
      (element) => element.querySelector("summary")?.textContent.trim() === "توضيحات",
    );

    if (!details) return false;

    const paragraphs = details.querySelectorAll(".definition-list > p");
    if (paragraphs.length < 3) return false;

    paragraphs[1].innerHTML = "";
    const officialTitle = document.createElement("strong");
    officialTitle.textContent = "وسائل التواصل الرسمية للوزارة:";
    paragraphs[1].append(officialTitle, ` ${officialChannelsText}`);

    paragraphs[2].innerHTML = "";
    const interactiveTitle = document.createElement("strong");
    interactiveTitle.textContent = "وسائل التواصل الرسمية التي تتيح التفاعل:";
    paragraphs[2].append(interactiveTitle, ` ${interactiveChannelsText}`);

    return true;
  }

  function applyPatches() {
    const statementUpdated = replaceStatement();
    const clarificationsUpdated = replaceClarifications();
    return statementUpdated && clarificationsUpdated;
  }

  if (applyPatches()) return;

  const observer = new MutationObserver(() => {
    if (applyPatches()) observer.disconnect();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
