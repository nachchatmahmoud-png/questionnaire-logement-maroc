(() => {
  const targetTitle = "القسم الثاني: شفافية المعلومات الرسمية المتعلقة بالبرنامج";
  const previousTitles = [
    "القسم الثاني: المعلومات حول البرنامج",
    "القسم الثاني: جودة المعلومات الرسمية المتعلقة بالبرنامج",
  ];

  function applySectionTwoTitle() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );

    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue) continue;

      let value = node.nodeValue;
      for (const previousTitle of previousTitles) {
        if (value.includes(previousTitle)) {
          value = value.replaceAll(previousTitle, targetTitle);
        }
      }

      if (value !== node.nodeValue) {
        node.nodeValue = value;
      }
    }
  }

  applySectionTwoTitle();

  const observer = new MutationObserver(applySectionTwoTitle);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
