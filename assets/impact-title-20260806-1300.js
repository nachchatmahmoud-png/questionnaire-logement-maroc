(() => {
  const oldTitle = "رابعًا: الأثر العام المدرك للبرنامج";
  const newTitle = "رابعًا: الأثر العام للبرنامج";

  function applyChange() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue?.includes(oldTitle)) {
        node.nodeValue = node.nodeValue.replaceAll(oldTitle, newTitle);
      }
    }
  }

  applyChange();
  window.addEventListener("load", applyChange);
  const observer = new MutationObserver(applyChange);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
