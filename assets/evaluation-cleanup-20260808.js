(() => {
  if (typeof G === 'undefined' || !G.accept?.[0]?.[1]) return;

  G.accept[0][1] = G.accept[0][1].filter(([id]) => id !== 'accept_4');

  if (typeof state !== 'undefined' && state.a) {
    delete state.a.accept_4;
  }

  if (typeof render === 'function') render();
})();
