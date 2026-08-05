(() => {
  const oldTitle = "القسم الثاني: المعلومات حول البرنامج";
  const newTitle = "القسم الثاني: شفافية المعلومات الرسمية المتعلقة بالبرنامج";

  function replaceSectionTwoTitle() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );

    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue?.includes(oldTitle)) {
        node.nodeValue = node.nodeValue.replaceAll(oldTitle, newTitle);
      }
    }
  }

  replaceSectionTwoTitle();

  const observer = new MutationObserver(replaceSectionTwoTitle);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
