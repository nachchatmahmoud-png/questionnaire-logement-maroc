(() => {
  const officialChannelsText =
    "يقصد بوسائل التواصل الرسمية للوزارة مجموع القنوات والوسائط التي تعتمدها الوزارة بصفة رسمية للتواصل العمومي بشأن برنامج الدعم المباشر للسكن، قصد نشر المعلومات المتعلقة بأهدافه وشروط الاستفادة منه ومساطره وإجراءاته ومستجداته، وتمكين المواطنين من الولوج إلى المعطيات والخدمات المرتبطة به. وتشمل، على سبيل المثال لا الحصر، الموقع الإلكتروني الرسمي للوزارة، ومنصة «دعم سكن» وتطبيقها، والصفحات والحسابات الرسمية على شبكات التواصل الاجتماعي، والبلاغات والمنشورات الرسمية، وغيرها من القنوات المعتمدة للتواصل بشأن البرنامج. ولا يُشترط في هذه الوسائل أن تتيح للمواطنين إمكانية التواصل مع الوزارة أو تلقي رد منها، إذ قد يقتصر دورها على نشر المعلومات وإتاحتها للعموم.";

  const interactiveChannelsText =
    "يقصد بوسائل التواصل الرسمية التي تتيح التفاعل القنوات الرسمية التي تعتمدها الوزارة في إطار برنامج الدعم المباشر للسكن، والتي تمكّن المواطنين، إلى جانب الاطلاع على المعلومات، من التواصل مع الوزارة عبر توجيه الأسئلة، وطلب التوضيحات، وتقديم الملاحظات أو المقترحات أو الشكايات، مع إمكانية تلقي رد أو تتبع مآلها. وتشمل، على سبيل المثال لا الحصر، خدمات التواصل والمساعدة المتاحة عبر منصة «دعم سكن» وتطبيقها، والبريد الإلكتروني ورقم المساعدة المخصصين للبرنامج، والبوابة الوطنية للشكايات، والرسائل الموجهة إلى الوزارة عبر حساباتها الرسمية على شبكات التواصل الاجتماعي.";

  const sectionThreeStatements = new Map([
    [
      "تتيح وسائل التواصل الرسمية التي تتيح التفاعل مع الوزارة للمواطنين توجيه استفساراتهم إلى الوزارة بشأن البرنامج",
      "تتيح وسائل التواصل الرسمية التي تتيح التفاعل مع الوزارة للمواطنين توجيه استفساراتهم بشأن البرنامج",
    ],
    [
      "تتيح هذه الوسائل للمواطنين طلب توضيحات إضافية حول المعلومات المتعلقة بالبرنامج",
      "تتيح هذه الوسائل للمواطنين طلب توضيحات إضافية بشأن المعلومات المتعلقة بالبرنامج",
    ],
    [
      "تتيح هذه الوسائل للمواطنين مواصلة التواصل مع الوزارة عند الحاجة إلى معلومات إضافية",
      "تتيح هذه الوسائل للمواطنين متابعة التواصل مع الوزارة عند الحاجة إلى معلومات إضافية",
    ],
    [
      "تتيح وسائل التواصل الرسمية التي تتيح التفاعل مع الوزارة للمواطنين تقديم ملاحظاتهم بشأن البرنامج",
      "تتيح وسائل التواصل الرسمية التي تتيح التفاعل مع الوزارة للمواطنين إبداء ملاحظاتهم بشأن البرنامج",
    ],
    [
      "تتيح هذه الوسائل للمواطنين تقديم مقترحات لتحسين البرنامج أو التواصل المرتبط به",
      "تتيح هذه الوسائل للمواطنين تقديم مقترحات بشأن البرنامج أو التواصل المرتبط به",
    ],
    [
      "تتيح هذه الوسائل للمواطنين التعبير عن الصعوبات أو الشكايات التي يواجهونها بشأن البرنامج",
      "تتيح هذه الوسائل للمواطنين عرض الصعوبات التي يواجهونها بشأن البرنامج أو تقديم شكاياتهم",
    ],
    [
      "بصفة عامة، أرى أن وسائل التواصل الرسمية تتيح للمواطنين التفاعل مع الوزارة بشأن البرنامج",
      "بصفة عامة، أرى أن وسائل التواصل الرسمية التي تتيح التفاعل تمكّن المواطنين من التواصل مع الوزارة بشأن البرنامج",
    ],
    [
      "بصفة عامة، أقيّم جودة تواصل الوزارة حول البرنامج تقييمًا إيجابيًا",
      "بصفة عامة، أقيّم جودة تواصل الوزارة بشأن البرنامج تقييمًا إيجابيًا",
    ],
  ]);

  function replaceSectionThreeStatements() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let replacedCount = 0;
    let node;

    while ((node = walker.nextNode())) {
      if (!node.nodeValue) continue;

      for (const [original, improved] of sectionThreeStatements) {
        if (node.nodeValue.includes(original)) {
          node.nodeValue = node.nodeValue.replace(original, improved);
          replacedCount += 1;
          break;
        }
      }
    }

    return replacedCount === sectionThreeStatements.size;
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
    const statementsUpdated = replaceSectionThreeStatements();
    const clarificationsUpdated = replaceClarifications();
    return statementsUpdated && clarificationsUpdated;
  }

  if (applyPatches()) return;

  const observer = new MutationObserver(() => {
    if (applyPatches()) observer.disconnect();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
