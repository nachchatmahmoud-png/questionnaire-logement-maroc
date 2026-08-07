(() => {
  const anonymousPlaceholder = `anonymous-${(crypto.randomUUID?.() || Math.random().toString(36).slice(2))}@local.invalid`;

  // Do not keep the temporary value in the structured payload.
  const previousStringify = JSON.stringify.bind(JSON);
  JSON.stringify = (value, ...args) => {
    try {
      if (value && typeof value === 'object') {
        const copy = Array.isArray(value) ? [...value] : { ...value };
        if (copy.answers && typeof copy.answers === 'object') {
          copy.answers = { ...copy.answers };
          delete copy.answers.email_personal;
        }
        delete copy.email_personal;
        return previousStringify(copy, ...args);
      }
    } catch (_) {}
    return previousStringify(value, ...args);
  };

  function removeEmailQuestion() {
    const email = document.querySelector('#email-personal, input[type="email"]');
    if (!email) return;

    // Satisfy the legacy client-side validator without asking for or retaining a real email address.
    if (!email.value) {
      email.value = anonymousPlaceholder;
      email.dispatchEvent(new Event('input', { bubbles: true }));
      email.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const card = email.closest('.question-card, fieldset');
    if (card) {
      card.hidden = true;
      card.setAttribute('aria-hidden', 'true');
      card.style.display = 'none';
    }
  }

  function scrubTemporaryEmailFromDom() {
    document.querySelectorAll('input[type="hidden"]').forEach((input) => {
      const name = (input.name || '').toLowerCase();
      if (input.value === anonymousPlaceholder || name.includes('email_personal')) {
        input.remove();
      }
    });
  }

  function applyCleanup() {
    removeEmailQuestion();
    scrubTemporaryEmailFromDom();
  }

  const style = document.createElement('style');
  style.id = 'ui-cleanup-20260807';
  style.textContent = `
    :root {
      --ui-text: #172033;
      --ui-muted: #667085;
      --ui-border: rgba(15, 23, 42, .10);
      --ui-soft: rgba(15, 23, 42, .035);
    }

    body { color: var(--ui-text); }

    .hero h1 {
      font-weight: 750 !important;
      letter-spacing: -.015em;
      line-height: 1.35;
    }

    .section-heading h2,
    #current-step-title {
      font-weight: 700 !important;
      line-height: 1.45;
      letter-spacing: 0;
    }

    .group-heading h3,
    .group-card h3 {
      font-weight: 650 !important;
      line-height: 1.55;
    }

    .question-card legend,
    .statement-card legend {
      font-weight: 560 !important;
      line-height: 1.75;
    }

    .instruction-card strong,
    .privacy-note strong,
    summary {
      font-weight: 650 !important;
    }

    .question-help,
    .group-heading p,
    .instruction-card p,
    .intro-copy p,
    .privacy-note p {
      font-weight: 400 !important;
      color: var(--ui-muted);
      line-height: 1.85;
    }

    .question-card,
    .group-card,
    .statement-card,
    .instruction-card {
      border-color: var(--ui-border) !important;
      box-shadow: 0 5px 18px rgba(15, 23, 42, .035) !important;
    }

    .group-heading {
      border-bottom: 1px solid var(--ui-border);
      padding-bottom: .75rem;
      margin-bottom: 1rem;
    }

    .choice,
    .scale-choice {
      font-weight: 450 !important;
    }

    .choice-selected {
      box-shadow: 0 0 0 2px rgba(30, 64, 175, .08) inset;
    }

    .likert-table th {
      font-weight: 600 !important;
    }

    .likert-table td:first-child {
      font-weight: 450 !important;
      line-height: 1.7;
    }

    .progress-copy strong {
      font-weight: 650 !important;
    }

    .primary-button,
    .secondary-button,
    button {
      font-weight: 600 !important;
    }

    @media (max-width: 700px) {
      .hero h1 { font-size: clamp(1.55rem, 7vw, 2rem) !important; }
      .section-heading h2, #current-step-title { font-size: 1.3rem !important; }
      .group-heading h3, .group-card h3 { font-size: 1.05rem !important; }
      .question-card legend, .statement-card legend { font-size: .98rem !important; }
      .question-card, .group-card, .statement-card, .instruction-card { border-radius: 14px !important; }
    }
  `;
  document.head.appendChild(style);

  applyCleanup();
  window.addEventListener('DOMContentLoaded', applyCleanup);
  window.addEventListener('load', applyCleanup);
  new MutationObserver(applyCleanup).observe(document.documentElement, { childList: true, subtree: true });
})();
