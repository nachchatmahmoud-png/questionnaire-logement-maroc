(() => {
  const target = 'لن تُعرض الإجابات الصحيحة أثناء الاستبيان.';

  function clean() {
    const root = document.getElementById('root') || document.body;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const node of nodes) {
      if (!node.nodeValue || !node.nodeValue.includes(target)) continue;
      node.nodeValue = node.nodeValue.replace(target, '').replace(/\s{2,}/g, ' ').trimStart();
    }
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      clean();
    });
  }

  clean();
  window.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  window.addEventListener('pageshow', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
