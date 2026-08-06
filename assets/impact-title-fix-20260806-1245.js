(() => {
  const OLD_FRAGMENT = "الأثر العام المدرك للبرنامج";
  const NEW_FRAGMENT = "الأثر العام للبرنامج";

  function applyImpactTitleFix() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;

    while ((node = walker.nextNode())) {
      if (node.nodeValue?.includes(OLD_FRAGMENT)) {
        node.nodeValue = node.nodeValue.replaceAll(OLD_FRAGMENT, NEW_FRAGMENT);
      }
    }
  }

  applyImpactTitleFix();
  window.addEventListener("load", applyImpactTitleFix);

  const observer = new MutationObserver(applyImpactTitleFix);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  window.setInterval(applyImpactTitleFix, 300);
})();
