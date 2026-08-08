(() => {
  if (typeof G === 'undefined') return;

  if (G.accept?.[0]?.[1]) {
    G.accept[0][1] = G.accept[0][1].filter(([id]) => id !== 'accept_4');
  }

  if (G.generalImpact?.[0]) {
    G.generalImpact[0][0] = 'رابعًا: الأثر العام للبرنامج';
  }

  if (typeof state !== 'undefined' && state.a) {
    delete state.a.accept_4;
  }

  if (typeof render === 'function') render();
})();
