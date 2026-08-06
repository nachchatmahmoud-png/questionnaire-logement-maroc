(() => {
  const oldTitle = "القسم الرابع: الاستجابة المؤسسية المدركة";
  const newTitle = "القسم الرابع: الاستجابة المؤسسية";

  function applyTitleChange() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;

    while ((node = walker.nextNode())) {
      if (node.nodeValue?.includes(oldTitle)) {
        node.nodeValue = node.nodeValue.replaceAll(oldTitle, newTitle);
      }
    }
  }

  applyTitleChange();
  window.addEventListener("load", applyTitleChange);

  const observer = new MutationObserver(applyTitleChange);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
