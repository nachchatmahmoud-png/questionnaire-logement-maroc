/**
 * VERSION 30.2 — CORRECTION ENVOI ET RÉFÉRENCE TECHNIQUE — 28/10/2026
 *
 * Optimisation de la v27 :
 * - ne bloque plus la création du cache quand une spécification appartient
 *   à un parcours absent/inactif ;
 * - conserve l'accès direct Form.getItemById(id) pour éviter getItems() à
 *   chaque envoi ;
 * - fallback lent uniquement pour un ID réellement non résolu ;
 * - circuit inchangé : Site -> Apps Script -> Google Form natif -> Google Sheet ;
 * - contrôle une participation/compte inchangé ;
 * - compte test nachchatmahmoud@gmail.com inchangé.
 *
 * IMPORTANT :
 * - remplacer TOUT le contenu du fichier Apps Script actuel par ce fichier ;
 * - enregistrer ;
 * - NE LANCER AUCUNE fonction manuellement ;
 * - mettre à jour le déploiement Web existant avec une nouvelle version.
 */

/**
 * CODE UNIQUE RAPIDE v18 — Site → Apps Script → Google Form natif → Google Sheet.
 * Contrôle « un compte Google = une participation » + anti-doublon submissionId.
 *
 * Installation :
 * 1. Remplacer tout l'ancien code Apps Script par CE FICHIER UNIQUE.
 * 2. Exécuter INSTALLER_CODE_UNIQUE_RAPIDE() une seule fois.
 * 3. Redéployer l'application Web sur le déploiement existant :
 *    exécuter en tant que propriétaire, accès autorisé à « Tout le monde ».
 * 4. Conserver la même URL /exec si le déploiement existant est mis à jour.
 *
 * L'adresse Google n'est jamais enregistrée. Seule une empreinte salée et
 * irréversible du compte est conservée dans la feuille technique masquée.
 */

const CONTROLE_PARTICIPATION = Object.freeze({
  CLIENT_ID: '285878510024-7dhdojiucp6ff20m2snuro018t70c6s5.apps.googleusercontent.com',
  FORM_ID: '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo',
  SUBMISSION_ENTRY_ID: '1955032181',
  PENDING_MARKER: 'PENDING',
  TOKEN_CACHE_SECONDS: 600,
  TEST_EXEMPT_EMAIL: 'nachchatmahmoud@gmail.com',
  SPREADSHEET_ID: '1VcNjC6_eF-9GiKALC7lVvgE1q_F3RM6CJUcs4RKyt-Q',
  RESPONSE_SHEET_NAME: 'Réponses au formulaire',
  SHEET_NAME: 'Contrôle participations',
  SUBMISSION_ID_TITLE: 'مرجع تقني للتحقق من تسجيل الإجابة',
  CONFIRMATION_WINDOW_MS: 30 * 60 * 1000,
  SITE_ORIGIN: 'https://nachchatmahmoud-png.github.io',
  CHANNEL: 'questionnaire-logement-auth-v1',
  TOKENINFO_URL: 'https://oauth2.googleapis.com/tokeninfo?id_token=',
  ENTRY_ITEM_MAP_PROPERTY: 'FORM_ENTRY_ITEM_MAP_V1',
  PROVENANCE_SECRET_PROPERTY: 'FORM_SUBMISSION_PROVENANCE_SECRET_V1',
  PROVENANCE_TRIGGER_HANDLER: 'rejeterSoumissionDirecteNonAutorisee',
  QUESTIONNAIRE_UPDATE_PROPERTY: 'QUESTIONNAIRE_UPDATE_20260813_V3',
});

const MISE_A_JOUR_QUESTIONNAIRE = Object.freeze({
  PREFERRED_CHANNEL_TITLE: 'عبر أي وسيلة تفضلون التوصل بمعلومات حول البرامج العمومية؟',
  PREFERRED_CHANNEL_CHOICES: [
    'التلفزيون أو الإذاعة',
    'المواقع الإلكترونية الرسمية للإدارات والمؤسسات العمومية',
    'الصفحات والحسابات الرسمية على شبكات التواصل الاجتماعي',
    'الصحافة الإلكترونية أو الورقية',
    'اللقاءات أو الحملات التواصلية الميدانية',
  ],
  Q2_TITLE: 'س2. هل سبق أن اطلعتم على معلومات حول برنامج الدعم المباشر للسكن من خلال إحدى القنوات الرسمية للوزارة؟',
  Q2_LEGACY_PREFIX: 'س2. هل سبق',
  NO_OFFICIAL_REASON_TITLE: 'س2-ب. ما السبب الرئيسي لعدم اطلاعكم على معلومات حول البرنامج عبر القنوات الرسمية للوزارة؟',
  NO_OFFICIAL_REASON_HELP: 'يرجى اختيار جواب واحد فقط.',
  NO_OFFICIAL_REASON_LEGACY_PREFIX: 'ما السبب الرئيسي لعدم اطلاعكم على معلومات حول البرنامج عبر ',
  NO_OFFICIAL_REASON_CHOICES: [
    'لم أكن أعلم بوجود قنوات رسمية توفر معلومات حول البرنامج.',
    'كنت أعلم بوجود قنوات رسمية، لكن لم يكن واضحًا لي ما هي القنوات أو الحسابات الرسمية المعتمدة.',
    'لم أفكر في الرجوع إلى القنوات الرسمية للحصول على معلومات حول البرنامج.',
    'فضّلت الاعتماد على مصادر أخرى لأنها بدت لي أسهل أو أنسب للحصول على المعلومات.',
    'حاولت الوصول إلى القنوات الرسمية، لكن واجهت صعوبة في العثور عليها أو الوصول إليها.',
    'وصلت إلى القنوات الرسمية، لكن واجهت صعوبة في استخدامها أو تصفح محتواها.',
    'وصلت إلى القنوات الرسمية، لكنني لم أجد المعلومات التي كنت أبحث عنها.',
    'لا أستخدم عادةً القنوات الرقمية للحصول على معلومات حول البرامج العمومية.',
  ],
  TRUST_COMMON_TITLE: 'الثقة العامة المشتركة بين مسارات الاستبيان',
  TRUST_COMMON_ROW: 'بصفة عامة، أثق في الوزارة فيما يتعلق بتدبير برنامج الدعم المباشر للسكن.',
  LIKERT_COLUMNS: [
    '1 — لا أوافق إطلاقًا',
    '2 — لا أوافق',
    '3 — لا أوافق ولا أعارض',
    '4 — أوافق',
    '5 — أوافق تمامًا',
  ],
  OFFICIAL_SOURCES_TITLE: 'من خلال أي من وسائل التواصل الرسمية التالية اطلعتم على معلومات حول البرنامج؟',
  EXTERNAL_SOURCES_TITLE: 'من خلال أي من المصادر التالية اطلعتم على معلومات حول البرنامج؟',
  PRIMARY_SOURCE_TITLE: 'من بين وسائل التواصل الرسمية التي اخترتموها، ما هي الوسيلة الرئيسية التي اعتمدتم عليها للاطلاع على معلومات حول البرنامج؟',
  OFFICIAL_SOURCE_OTHER_VALUE: 'مصدر رسمي آخر',
  EXTERNAL_SOURCE_OTHER_VALUE: 'مصدر آخر',
  CONTACT_CHANNEL_OTHER_VALUE: 'قناة رسمية أخرى',
  OFFICIAL_SOURCE_OTHER_DETAIL_TITLE: 'المصدر الرسمي الآخر (يرجى التحديد)',
  EXTERNAL_SOURCE_OTHER_DETAIL_TITLE: 'المصدر الآخر (يرجى التحديد)',
  CONTACT_CHANNEL_OTHER_DETAIL_TITLE: 'القناة الرسمية الأخرى لآخر تواصل (يرجى التحديد)',
});

/**
 * SEULE fonction d'installation à lancer manuellement.
 * Elle prépare le Form natif, la correspondance entryId -> itemId,
 * l'anti-doublon et le contrôle de provenance.
 */
function INSTALLER_CODE_UNIQUE_RAPIDE() {
  PREPARER_CODE_UNIQUE_ENVOI_NATIF_20260815();
}

/**
 * À exécuter manuellement une seule fois par le propriétaire du projet.
 * Crée la feuille technique, le sel privé et la question de confirmation,
 * puis désactive la limite native Google Forms. La règle une réponse par compte
 * est appliquée par le contrôle backend, avec exception explicite pour le compte de test.
 */
function installerControleParticipationGoogle() {
  const proprietes = PropertiesService.getScriptProperties();

  if (!proprietes.getProperty('PARTICIPATION_HASH_SALT')) {
    proprietes.setProperty(
      'PARTICIPATION_HASH_SALT',
      Utilities.getUuid() + Utilities.getUuid()
    );
  }
  if (!proprietes.getProperty(CONTROLE_PARTICIPATION.PROVENANCE_SECRET_PROPERTY)) {
    proprietes.setProperty(
      CONTROLE_PARTICIPATION.PROVENANCE_SECRET_PROPERTY,
      Utilities.getUuid() + Utilities.getUuid()
    );
  }

  const feuille = obtenirFeuilleControle_(true);
  protegerFeuilleControle_(feuille);

  const formulaire = obtenirFormulaire_();
  const questionReference = obtenirQuestionReferenceTechnique_(formulaire, true);
  garantirMiseAJourQuestionnaire_(formulaire, true);
  const correspondance = actualiserCorrespondanceFormulaire_(formulaire);
  formulaire.setLimitOneResponsePerUser(false);
  formulaire.setShowLinkToRespondAgain(false);
  installerDeclencheurProvenance_(formulaire);

  console.log('CONTROLE_PARTICIPATION_INSTALLE: oui');
  console.log('LIMITE_NATIVE_UNE_REPONSE: ' + formulaire.hasLimitOneResponsePerUser());
  console.log(
    'QUESTION_REFERENCE_ENTRY_ID: ' +
      obtenirEntryIdQuestion_(correspondance, questionReference)
  );
  console.log('NOM_FEUILLE_TECHNIQUE: ' + CONTROLE_PARTICIPATION.SHEET_NAME);
  console.log('CONTROLE_ORIGINE_SOUMISSION: actif');
}

/**
 * À exécuter manuellement si l'on souhaite préparer les nouveaux champs avant
 * la première participation. Le backend effectue aussi cette opération de
 * manière idempotente lors de la première vérification après redéploiement.
 */
function installerMiseAJourQuestionnaire20260812() {
  const formulaire = obtenirFormulaire_();
  garantirMiseAJourQuestionnaire_(formulaire, true);
  const correspondance = actualiserCorrespondanceFormulaire_(formulaire);
  console.log('MISE_A_JOUR_QUESTIONNAIRE_20260812: oui');
  console.log('CORRESPONDANCE_ENTRY_ITEM_ACTUALISEE: ' + Object.keys(correspondance).length);
}

/**
 * À exécuter manuellement si Apps Script n'a pas encore demandé l'autorisation
 * d'accéder au service externe de validation des jetons Google.
 */
function autoriserEtTesterServiceGoogle() {
  const reponse = UrlFetchApp.fetch(
    CONTROLE_PARTICIPATION.TOKENINFO_URL + 'invalid',
    { muteHttpExceptions: true, followRedirects: true }
  );
  const code = reponse.getResponseCode();

  console.log('URL_FETCH_AUTORISE: oui');
  console.log('CODE_TEST_TOKENINFO: ' + code);

  if (code !== 400) {
    throw new Error('Réponse inattendue du service Google Tokeninfo : ' + code);
  }
}

/** Affiche uniquement l'état du service lorsqu'on ouvre directement l'URL /exec. */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<!doctype html><html><head><meta charset="utf-8"></head>' +
    '<body><p>Service de contrôle des participations actif.</p></body></html>'
  ).setTitle('Contrôle de participation');
}

/**
 * Reçoit le jeton par formulaire POST dans un iframe invisible.
 * Le jeton ne figure donc ni dans l'URL, ni dans l'historique du navigateur.
 */
function doPost(e) {
  const parametres = (e && e.parameter) || {};
  const requestId = String(parametres.requestId || '');
  const requestIdValide = /^[A-Za-z0-9_-]{8,128}$/.test(requestId);
  const resultat = requestIdValide
    ? verifierParticipationGoogle({
        idToken: String(parametres.idToken || ''),
        action: String(parametres.action || ''),
        submissionId: String(parametres.submissionId || ''),
        payload: String(parametres.payload || ''),
        supplemental: String(parametres.supplemental || ''),
        schemaVersion: String(parametres.schemaVersion || ''),
      })
    : resultatRefus_('invalid_request');

  const message = JSON.stringify({
    channel: CONTROLE_PARTICIPATION.CHANNEL,
    type: 'response',
    requestId: requestId,
    result: resultat,
  }).replace(/</g, '\\u003c');
  const origine = JSON.stringify(CONTROLE_PARTICIPATION.SITE_ORIGIN);

  return HtmlService.createHtmlOutput(
    '<!doctype html><html><head><meta charset="utf-8"></head><body>' +
    '<script>window.top.postMessage(' + message + ',' + origine + ');<\/script>' +
    '</body></html>'
  )
    .setTitle('Contrôle de participation')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * action=check : vérifie le compte et renvoie l'identifiant du champ technique.
 * action=submit : crée la réponse côté serveur après vérification du compte,
 *                 puis marque le compte comme ayant participé.
 * action=confirm : compatibilité avec les envois de l'ancienne version.
 */

/* =====================================================================
 * V30 — CACHE DE SESSION + LECTURE UNIQUE DES ITEMS GOOGLE FORM
 * Objectif : supprimer les appels getItemById() répétés au clic final.
 * ===================================================================== */

function cleEligibiliteRapideV30_(empreinte) {
  return 'ELIG_V30_' + String(empreinte || '');
}

function cleSoumissionRapideV30_(submissionId) {
  return 'SUB_V30_' + String(submissionId || '');
}

/**
 * V30.1 — correspondances directes pour les champs ajoutés après le cache V24.
 * Aucun appel Google supplémentaire : lookup purement local.
 */
function descripteurAjoutsDirectsV301_(entryId) {
  const fixes = {
    // Niveau d'études supérieures — question créée le 16/08/2026
    '54285798': { itemId: '1032234847' },
  };
  return fixes[String(entryId)] || null;
}

function chargerItemsFormulaireV30_(formulaire) {
  const items = formulaire.getItems();
  const parId = {};
  items.forEach(function (item) {
    parId[String(item.getId())] = item;
  });
  return {
    items: items,
    parId: parId,
    indexFallback: null,
  };
}

function obtenirItemMemoireV30_(bundle, itemId) {
  const id = String(itemId || '');
  if (!/^\d+$/.test(id)) {
    throw new Error('CONFIGURATION_MISSING:itemId_invalide=' + id);
  }
  const item = bundle && bundle.parId && bundle.parId[id];
  if (!item) {
    throw new Error('CONFIGURATION_MISSING:itemId_absent=' + id);
  }
  return item;
}

function obtenirIndexFallbackV30_(formulaire, bundle) {
  if (!bundle.indexFallback) {
    bundle.indexFallback = construireIndexItemsResolution_(bundle.items);
  }
  return bundle.indexFallback;
}

function verifierParticipationGoogle(requete) {
  let ligneReservation = 0;
  let soumissionLancee = false;

  const perf = {
    debut: Date.now(),
    jeton: 0,
    parsing: 0,
    feuilleControle: 0,
    attenteVerrou: 0,
    rechercheReservation: 0,
    controleParticipation: 0,
    reservation: 0,
    ouvertureFormulaire: 0,
    chargementPlan: 0,
    preparationReponse: 0,
    submitNatif: 0,
    finalisation: 0,
    total: 0,
    cachePlan: false,
  };

  try {
    const action = String((requete && requete.action) || '');
    const jeton = String((requete && requete.idToken) || '');

    if (action !== 'check' && action !== 'confirm' && action !== 'submit') {
      return resultatRefus_('invalid_action');
    }

    let chrono = Date.now();
    const identite = verifierJetonGoogle_(jeton);
    perf.jeton = Date.now() - chrono;
    if (!identite) return resultatRefus_('reauthentication_required');

    const compteTestExempte = estCompteTestExempte_(identite);
    const empreinte = creerEmpreinteCompte_(identite.sub);
    const cacheRapideV30 = CacheService.getScriptCache();
    const cleEligibiliteV30 = cleEligibiliteRapideV30_(empreinte);

    if (action === 'check') {
      if (compteTestExempte) {
        return {
          ok: true,
          allowed: true,
          exempt: true,
          reason: 'test_account_exempt',
          submissionEntryId: CONTROLE_PARTICIPATION.SUBMISSION_ENTRY_ID,
        };
      }

      const feuilleCheck = obtenirFeuilleControle_();
      const participation = lireParticipation_(feuilleCheck, empreinte);
      if (!participation) {
        // Le contrôle complet a déjà été fait à l'entrée du questionnaire.
        // Le clic final peut donc éviter une seconde recherche dans le Sheet.
        cacheRapideV30.put(cleEligibiliteV30, '1', 3600);
      } else {
        cacheRapideV30.remove(cleEligibiliteV30);
      }
      return {
        ok: true,
        allowed: !participation,
        exempt: false,
        reason: participation ? 'already_submitted' : 'eligible',
        submissionEntryId: CONTROLE_PARTICIPATION.SUBMISSION_ENTRY_ID,
      };
    }

    const submissionId = String((requete && requete.submissionId) || '');
    if (!/^[A-Za-z0-9_-]{16,128}$/.test(submissionId)) {
      return resultatRefus_('invalid_submission_id');
    }

    chrono = Date.now();
    let charge = null;
    let supplementaires = {};
    if (action === 'submit') {
      charge = parserChargeReponses_(String((requete && requete.payload) || ''));
      supplementaires = parserReponsesSupplementaires_(
        String((requete && requete.supplemental) || '')
      );
      if (
        /^2026-08-12-parcours-v[45]$/.test(
          String((requete && requete.schemaVersion) || '')
        ) &&
        !Object.keys(supplementaires).length
      ) {
        throw new Error('INVALID_ANSWERS');
      }
    }
    perf.parsing = Date.now() - chrono;

    chrono = Date.now();
    const feuille = obtenirFeuilleControle_();
    perf.feuilleControle = Date.now() - chrono;

    const verrou = LockService.getScriptLock();
    chrono = Date.now();
    verrou.waitLock(12000);
    perf.attenteVerrou = Date.now() - chrono;

    try {
      const cleSoumissionV30 = cleSoumissionRapideV30_(submissionId);
      const etatSoumissionCacheV30 = cacheRapideV30.get(cleSoumissionV30);
      let reservation = null;

      // Cas normal : le submissionId vient d'être généré côté site.
      // Aucun balayage du Sheet n'est nécessaire.
      if (etatSoumissionCacheV30 && etatSoumissionCacheV30.indexOf('CONFIRMED:') === 0) {
        return {
          ok: true,
          allowed: true,
          exempt: compteTestExempte,
          reason: 'already_confirmed',
        };
      }

      // Le chemin lent n'est utilisé que si un envoi précédent est resté PENDING
      // (ex. coupure réseau après submit()).
      if (etatSoumissionCacheV30 === 'PENDING' || action === 'confirm') {
        chrono = Date.now();
        reservation = lireSoumissionParId_(feuille, submissionId);
        perf.rechercheReservation = Date.now() - chrono;
      } else {
        perf.rechercheReservation = 0;
      }

      if (reservation && reservation.responseId !== CONTROLE_PARTICIPATION.PENDING_MARKER) {
        cacheRapideV30.put(
          cleSoumissionV30,
          'CONFIRMED:' + String(reservation.responseId || 'FORM_OK'),
          21600
        );
        return {
          ok: true,
          allowed: true,
          exempt: compteTestExempte,
          reason: 'already_confirmed',
        };
      }

      if (!reservation && !compteTestExempte) {
        // Si action=check a déjà certifié l'éligibilité, on ne relit pas le Sheet.
        if (cacheRapideV30.get(cleEligibiliteV30) !== '1') {
          chrono = Date.now();
          const participation = lireParticipation_(feuille, empreinte);
          perf.controleParticipation = Date.now() - chrono;
          if (participation) return resultatRefus_('already_submitted');
        } else {
          perf.controleParticipation = 0;
        }
      }

      let formulaire = null;
      let questionReference = null;

      if (reservation && reservation.responseId === CONTROLE_PARTICIPATION.PENDING_MARKER) {
        chrono = Date.now();
        formulaire = obtenirFormulaire_();
        perf.ouvertureFormulaire += Date.now() - chrono;

        questionReference = obtenirQuestionReferenceTechnique_(formulaire, false);
        if (!questionReference) return resultatRefus_('configuration_error');

        const recuperee = trouverReponseConfirmee_(
          formulaire,
          questionReference,
          submissionId,
          reservation.date || null
        );
        if (recuperee) {
          finaliserReservation_(
            feuille,
            reservation.row,
            String(recuperee.getId() || 'FORM_OK')
          );
          return {
            ok: true,
            allowed: true,
            exempt: compteTestExempte,
            reason: 'already_confirmed',
          };
        }
      }

      if (action === 'confirm') return resultatRefus_('submission_not_found');

      chrono = Date.now();
      if (!reservation) {
        ligneReservation = reserverSoumission_(
          feuille,
          empreinte,
          submissionId
        );
        reservation = {
          row: ligneReservation,
          date: new Date(),
          responseId: CONTROLE_PARTICIPATION.PENDING_MARKER,
        };
      } else {
        ligneReservation = reservation.row;
      }
      cacheRapideV30.put(cleSoumissionV30, 'PENDING', 600);
      perf.reservation = Date.now() - chrono;

      if (!formulaire) {
        chrono = Date.now();
        formulaire = obtenirFormulaire_();
        perf.ouvertureFormulaire += Date.now() - chrono;
      }

      const bundleItemsV30 = chargerItemsFormulaireV30_(formulaire);
      const correspondance = obtenirCorrespondanceFormulaire_(formulaire, bundleItemsV30);

      chrono = Date.now();
      const resultatPlan = obtenirPlanRapideV23_(formulaire, correspondance, bundleItemsV30);
      const planRapide = resultatPlan.plan;
      perf.cachePlan = resultatPlan.cache;
      perf.chargementPlan = Date.now() - chrono;

      chrono = Date.now();

      // V30 : UNE SEULE lecture de tous les items du Form.
      // Ensuite, toutes les recherches d'items sont faites en mémoire.
      const itemReference = obtenirItemMemoireV30_(
        bundleItemsV30,
        planRapide.technicalItemId
      );
      if (
        !itemReference ||
        itemReference.getType() !== FormApp.ItemType.TEXT ||
        String(itemReference.getTitle() || '') !== CONTROLE_PARTICIPATION.SUBMISSION_ID_TITLE
      ) {
        throw new Error('CONFIGURATION_MISSING');
      }
      questionReference = itemReference.asTextItem();

      const brouillon = preparerReponseUltraRapideV30_(
        formulaire,
        questionReference,
        submissionId,
        charge,
        supplementaires,
        correspondance,
        planRapide,
        bundleItemsV30
      );
      perf.preparationReponse = Date.now() - chrono;

      chrono = Date.now();
      soumissionLancee = true;
      const reponse = brouillon.submit();
      perf.submitNatif = Date.now() - chrono;

      chrono = Date.now();
      const responseIdFinalV30 = String(reponse.getId() || 'FORM_OK');
      finaliserReservation_(
        feuille,
        ligneReservation,
        responseIdFinalV30
      );
      cacheRapideV30.put(
        cleSoumissionV30,
        'CONFIRMED:' + responseIdFinalV30,
        21600
      );
      if (!compteTestExempte) cacheRapideV30.remove(cleEligibiliteV30);
      perf.finalisation = Date.now() - chrono;
      perf.total = Date.now() - perf.debut;

      try {
        enregistrerDiagnosticEnvoiV23_(
          feuille,
          submissionId,
          perf,
          compteTestExempte
        );
      } catch (erreurDiagnostic) {
        console.error('DIAGNOSTIC_ENVOI_V24: ' + erreurDiagnostic);
      }

      return {
        ok: true,
        allowed: true,
        exempt: compteTestExempte,
        reason: compteTestExempte ? 'test_account_exempt' : 'submitted',
      };
    } catch (erreurInterne) {
      if (ligneReservation && !soumissionLancee) {
        supprimerReservationSiPending_(feuille, ligneReservation, submissionId);
        try {
          cacheRapideV30.remove(cleSoumissionRapideV30_(submissionId));
        } catch (_) {}
      }
      throw erreurInterne;
    } finally {
      verrou.releaseLock();
    }
  } catch (erreur) {
    console.error(erreur && erreur.stack ? erreur.stack : erreur);
    try {
      enregistrerDiagnosticEchecV26_(requete, erreur, perf, soumissionLancee);
    } catch (erreurDiagnosticEchec) {
      console.error('DIAGNOSTIC_ECHEC_V27: ' + erreurDiagnosticEchec);
    }
    const message = String((erreur && erreur.message) || '');
    if (message.indexOf('TOKEN_SERVICE_UNAVAILABLE') !== -1) {
      return resultatRefus_('token_service_unavailable');
    }
    if (message.indexOf('CONFIGURATION_MISSING') !== -1) {
      return resultatRefus_('configuration_error');
    }
    if (message.indexOf('INVALID_ANSWERS') !== -1) {
      return resultatRefus_('invalid_answers');
    }
    return resultatRefus_('server_error');
  }
}

function idsSpeciauxPlanRapideV23_() {
  return [
    '3871385',
    '89167698',
    '91257242',
    '157757540',
    '222082286',
    '258582065',
    '271992870',
    '301943015',
    '397729049',
    '411578762',
    '471635203',
    '500642904',
    '520351974',
    '634945297',
    '664408094',
    '674993537',
    '800971163',
    '825450485',
    '833854624',
    '844136116',
    '844787965',
    '883213170',
    '901308624',
    '917543744',
    '933937764',
    '961995117',
    '1009069255',
    '1011219132',
    '1032356922',
    '1092411069',
    '1119108321',
    '1151297594',
    '1155871809',
    '1182559343',
    '1198945725',
    '1200558200',
    '1229613680',
    '1248958122',
    '1258806770',
    '1265924651',
    '1300161676',
    '1319006138',
    '1321206863',
    '1344743776',
    '1388444923',
    '1415343217',
    '1486461560',
    '1513964979',
    '1537513608',
    '1587790851',
    '1641681581',
    '1645334930',
    '1677021184',
    '1744035836',
    '1808656211',
    '1864877569',
    '1896687752',
    '1904067536',
    '1948347725',
    '1992870685',
    '2008127058',
    '2037118212',
    '2085038932',
    '2143980090',
    '990000000000000001',
    '990000000000000002',
    '990000000000000003',
    '990000000000000004',
    '990000000000000005',
    '990000000000000011',
    '990000000000000012',
    '990000000000000013',
    '990000000000000014',
    '990000000000000015',
    '990000000000000021',
    '990000000000000022',
    '990000000000000023',
    '990000000000000024',
    '990000000000000025',
    '990000000000000031',
    '990000000000000032',
    '990000000000000033',
    '990000000000000034',
    '990000000000000035',
    '990000000000000041',
    '990000000000000042',
    '990000000000000043',
    '990000000000000044',
    '990000000000000045',
    '990000000000000051',
    '990000000000000052',
    '990000000000000053',
    '990000000000000054',
    '990000000000000055'
  ];
}

function obtenirPlanRapideV23_(formulaire, correspondance, bundleItems) {
  const propriete = 'FORM_FAST_PLAN_20260815_V24';
  const proprietes = PropertiesService.getScriptProperties();
  const memorise = proprietes.getProperty(propriete);

  if (memorise) {
    try {
      const plan = JSON.parse(memorise);
      if (
        plan &&
        plan.version === '2026-10-28-v30.2' &&
        plan.technicalItemId &&
        plan.descripteurs &&
        plan.supplementaires &&
        plan.technicalItemId === String((correspondance[String(CONTROLE_PARTICIPATION.SUBMISSION_ENTRY_ID)] || {}).itemId || '') &&
        (!bundleItems || [plan.technicalItemId]
          .concat(Object.keys(plan.descripteurs).map(function (k) { return plan.descripteurs[k]; }))
          .concat(Object.keys(plan.supplementaires).map(function (k) { return plan.supplementaires[k]; }))
          .every(function (d) { return descripteurExisteV302_(d, bundleItems); }))
      ) {
        return { plan: plan, cache: true };
      }
    } catch (_) {}
  }

  // Ce chemin lent n'est exécuté qu'une seule fois après déploiement
  // ou après une modification structurelle du Google Form.
  const indexItems = construireIndexItemsResolution_(bundleItems ? bundleItems.items : formulaire.getItems());
  const descripteurs = {};

  idsSpeciauxPlanRapideV23_().forEach(function (entryId) {
    let descripteur = null;

    // Certaines spécifications appartiennent à des parcours qui ne sont pas
    // présents dans la structure active du Form. Elles ne doivent pas bloquer
    // la construction du cache pour les parcours valides.
    try {
      descripteur = resoudreDescripteurBlocActuel_(
        formulaire,
        correspondance,
        entryId,
        indexItems
      );
    } catch (_) {
      descripteur = null;
    }

    if (!descripteur) {
      try {
        descripteur = resoudreDescripteurPlaceholder_(
          formulaire,
          correspondance,
          entryId,
          indexItems
        );
      } catch (_) {
        descripteur = null;
      }
    }

    if (descripteur) {
      descripteurs[String(entryId)] = descripteur;
    }
  });

  const descripteurTechnique =
    correspondance[String(CONTROLE_PARTICIPATION.SUBMISSION_ENTRY_ID)];
  const technicalItemId = String(
    descripteurTechnique && typeof descripteurTechnique === 'object'
      ? descripteurTechnique.itemId || ''
      : descripteurTechnique || ''
  );
  if (!technicalItemId) throw new Error('CONFIGURATION_MISSING');

  function trouverUnique(type, titre) {
    const trouves = indexItems.metas.filter(function (meta) {
      return meta.type === type && meta.title === titre;
    });
    // Un champ supplémentaire inutilisé ne doit pas bloquer les autres parcours.
    // Sa présence reste contrôlée au moment où une valeur est réellement fournie.
    if (trouves.length !== 1) return null;
    return String(trouves[0].id);
  }

  const supplementaires = {
    preferred_public_channel: trouverUnique(
      FormApp.ItemType.MULTIPLE_CHOICE,
      MISE_A_JOUR_QUESTIONNAIRE.PREFERRED_CHANNEL_TITLE
    ),
    no_official_reason: trouverUnique(
      FormApp.ItemType.MULTIPLE_CHOICE,
      MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_TITLE
    ),
    trust_general_common: trouverUnique(
      FormApp.ItemType.GRID,
      MISE_A_JOUR_QUESTIONNAIRE.TRUST_COMMON_TITLE
    ),
    official_source_other_detail: trouverUnique(
      FormApp.ItemType.TEXT,
      MISE_A_JOUR_QUESTIONNAIRE.OFFICIAL_SOURCE_OTHER_DETAIL_TITLE
    ),
    external_source_other_detail: trouverUnique(
      FormApp.ItemType.TEXT,
      MISE_A_JOUR_QUESTIONNAIRE.EXTERNAL_SOURCE_OTHER_DETAIL_TITLE
    ),
    contact_channel_other_detail: trouverUnique(
      FormApp.ItemType.TEXT,
      MISE_A_JOUR_QUESTIONNAIRE.CONTACT_CHANNEL_OTHER_DETAIL_TITLE
    ),
  };

  Object.keys(supplementaires).forEach(function (cle) {
    if (!supplementaires[cle]) delete supplementaires[cle];
  });

  const plan = {
    version: '2026-10-28-v30.2',
    technicalItemId: technicalItemId,
    descripteurs: descripteurs,
    supplementaires: supplementaires,
  };

  proprietes.setProperty(propriete, JSON.stringify(plan));
  return { plan: plan, cache: false };
}

function obtenirItemRapideV23_(formulaire, itemId, cacheItems) {
  const id = String(itemId || '');
  if (!/^\d+$/.test(id)) throw new Error('CONFIGURATION_MISSING');

  if (cacheItems && cacheItems[id]) return cacheItems[id];

  const item = formulaire.getItemById(Number(id));
  if (!item) throw new Error('CONFIGURATION_MISSING');

  if (cacheItems) cacheItems[id] = item;
  return item;
}

/**
 * v25 — mapping direct et vérifié des 3 items d'interactivité utilisés
 * dans les deux parcours officiels.
 *
 * Ces items existent déjà dans le Google Form et sont également référencés
 * par FORM_NATIF_20260815.ROUTES_OFFICIELLES. Le mapping direct évite qu'un
 * descripteur synthétique 990... absent du cache rapide fasse échouer
 * la préparation de la réponse avant brouillon.submit().
 */
function descripteurInteractionOfficielleV26_(entryId) {
  const fixes = {
    // Parcours officiel — bénéficiaire personnel
    '990000000000000023': { itemId: '984260886', rowIndex: 0 },
    '990000000000000024': { itemId: '1489177863', rowIndex: 0 },
    '990000000000000025': { itemId: '65348748', rowIndex: 0 },

    // Parcours officiel — autre situation
    '990000000000000033': { itemId: '547508310', rowIndex: 0 },
    '990000000000000034': { itemId: '1017244650', rowIndex: 0 },
    '990000000000000035': { itemId: '1579501699', rowIndex: 0 },
  };
  return fixes[String(entryId)] || null;
}


/**
 * V26 — Compatibilité robuste des choix uniques.
 * Le site et Google Forms peuvent contenir le même canal avec une ponctuation
 * ou une formulation légèrement différente. On résout d'abord par égalité,
 * puis par normalisation, puis par signature sémantique du canal.
 */
function normaliserValeurChoixV26_(valeur) {
  return String(valeur == null ? '' : valeur)
    .normalize('NFKC')
    .replace(/[\u200E\u200F\u061C]/g, '')
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[«»“”"'’‘`´]/g, '')
    .replace(/[‐‑‒–—−→←↔➡➜>]/g, ' ')
    .replace(/[()[\]{}]/g, ' ')
    .replace(/[.,،؛;:!?؟\/\\|_+=]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function signatureCanalV26_(valeur) {
  const n = normaliserValeurChoixV26_(valeur);
  const compact = n.replace(/\s+/g, '');
  // Reconnaître le canal avant le domaine : une adresse e-mail peut contenir daamsakane.ma.
  if (n.indexOf('@') !== -1 || n.indexOf('البريد الإلكتروني') !== -1) return 'EMAIL';
  if (n.indexOf('الهاتف') !== -1 || n.indexOf('مركز الاتصال') !== -1 ||
      compact.indexOf('212537718181') !== -1 || compact.indexOf('0537718181') !== -1) return 'PHONE';
  if (compact.indexOf('daamsakanema') !== -1 ||
      (n.indexOf('اتصل بنا') !== -1 && n.indexOf('دعم سكن') !== -1)) return 'DAAMSAKANE_CONTACT';
  if (compact.indexOf('mhpvgovma') !== -1 || n.indexOf('الموقع الرسمي للوزارة') !== -1 ||
      n.indexOf('الموقع الإلكتروني الرسمي للوزارة') !== -1) return 'MHPV_CONTACT';
  if (compact.indexOf('chikayama') !== -1 || n.indexOf('البوابة الوطنية للشكايات') !== -1) return 'CHIKAYA';
  if (n.indexOf('شبكات التواصل الاجتماعي') !== -1 || n.indexOf('مواقع التواصل الاجتماعي') !== -1) return 'SOCIAL';
  if (n.indexOf('قناة رسمية أخرى') !== -1 || n.indexOf('وسيلة رسمية أخرى') !== -1) return 'OTHER';
  return '';
}

function creerReponseChoixUniqueCompatibleV26_(question, valeur) {
  const texte = String(valeur == null ? '' : valeur);
  const choix = question.getChoices();

  // 1) Correspondance exacte.
  const exact = choix.filter(function (c) {
    return c.getValue() === texte;
  });
  if (exact.length === 1) {
    return question.createResponse(exact[0].getValue());
  }

  // 2) Même texte après suppression des différences de ponctuation/Unicode.
  const normalise = normaliserValeurChoixV26_(texte);
  const normalises = choix.filter(function (c) {
    return normaliserValeurChoixV26_(c.getValue()) === normalise;
  });
  if (normalises.length === 1) {
    return question.createResponse(normalises[0].getValue());
  }

  // 3) Correspondance sémantique des canaux officiels.
  const signature = signatureCanalV26_(texte);
  if (signature) {
    const correspondants = choix.filter(function (c) {
      return signatureCanalV26_(c.getValue()) === signature;
    });
    if (correspondants.length === 1) {
      return question.createResponse(correspondants[0].getValue());
    }
  }

  // 4) Inclusion normalisée uniquement si elle donne un résultat unique.
  if (normalise.length >= 10) {
    const proches = choix.filter(function (c) {
      const candidate = normaliserValeurChoixV26_(c.getValue());
      return candidate.indexOf(normalise) !== -1 || normalise.indexOf(candidate) !== -1;
    });
    if (proches.length === 1) {
      return question.createResponse(proches[0].getValue());
    }
  }

  throw new Error(
    'INVALID_CHOICE_V26 | ' +
    question.getTitle() +
    ' | valeur reçue=' + texte +
    ' | choix Forms=' +
    choix.map(function (c) { return c.getValue(); }).join(' || ')
  );
}


/**
 * V27 — Canonicalisation locale sans appel Google Forms.
 * Évite getChoices() pour le canal dont la formulation du site diffère
 * de la valeur native réellement enregistrée dans Google Forms.
 */
function canoniserValeurChoixRapideV27_(valeur) {
  const texte = String(valeur == null ? '' : valeur);

  if (
    texte === 'منصة دعم سكن – DaamSakane.ma → عبر خدمة «اتصل بنا» على المنصة الرسمية.' ||
    texte === 'منصة دعم سكن - DaamSakane.ma → عبر خدمة «اتصل بنا» على المنصة الرسمية.'
  ) {
    return 'خدمة «اتصل بنا» على منصة «دعم سكن»';
  }

  return texte;
}


/**
 * V30 — préparation ultra-rapide.
 * Aucun getItemById() dans la boucle : les Item ont été chargés une seule fois.
 */
function preparerReponseUltraRapideV30_(
  formulaire,
  questionReference,
  submissionId,
  charge,
  supplementaires,
  correspondance,
  planRapide,
  bundleItems
) {
  const reponse = formulaire.createResponse();
  const reponsesGroupees = {};
  const chargeComplete = Object.assign({}, charge);

  chargeComplete[String(CONTROLE_PARTICIPATION.SUBMISSION_ENTRY_ID)] =
    creerReferenceTechniqueSignee_(submissionId);

  Object.keys(chargeComplete).forEach(function (entryId) {
    let descripteurBrut = [
      descripteurAjoutsDirectsV301_(entryId),
      descripteurInteractionOfficielleV26_(entryId),
      planRapide.descripteurs[String(entryId)],
      correspondance[String(entryId)]
    ].find(function (d) { return descripteurExisteV302_(d, bundleItems); }) || null;

    // Fallback rare : utilise les items DÉJÀ chargés, sans second formulaire.getItems().
    if (!descripteurBrut) {
      const indexFallback = obtenirIndexFallbackV30_(formulaire, bundleItems);

      try {
        descripteurBrut =
          resoudreDescripteurBlocActuel_(
            formulaire,
            correspondance,
            entryId,
            indexFallback
          );
      } catch (_) {}

      if (!descripteurBrut) {
        try {
          descripteurBrut =
            resoudreDescripteurPlaceholder_(
              formulaire,
              correspondance,
              entryId,
              indexFallback
            );
        } catch (_) {}
      }
    }

    const descripteur =
      descripteurBrut && typeof descripteurBrut === 'object'
        ? descripteurBrut
        : { itemId: String(descripteurBrut || '') };

    const itemId = String(descripteur.itemId || '');
    const item = obtenirItemMemoireV30_(bundleItems, itemId);
    const valeur = chargeComplete[entryId];
    const type = item.getType();
    let reponseItem;

    if (type === FormApp.ItemType.GRID || type === FormApp.ItemType.CHECKBOX_GRID) {
      const rowIndex = Number(descripteur.rowIndex);
      if (!Number.isInteger(rowIndex) || rowIndex < 0) {
        throw new Error('INVALID_ANSWERS');
      }
      if (!reponsesGroupees[itemId]) {
        reponsesGroupees[itemId] = {
          item: item,
          type: type,
          lignes: {},
          maxRowIndex: -1,
        };
      }
      reponsesGroupees[itemId].lignes[rowIndex] = valeur;
      reponsesGroupees[itemId].maxRowIndex =
        Math.max(reponsesGroupees[itemId].maxRowIndex, rowIndex);
      return;
    }

    if (type === FormApp.ItemType.TEXT) {
      reponseItem = item.asTextItem().createResponse(String(valeur));
    } else if (type === FormApp.ItemType.PARAGRAPH_TEXT) {
      reponseItem = item.asParagraphTextItem().createResponse(String(valeur));
    } else if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
      const valeurChoix = canoniserValeurChoixRapideV27_(valeur);
      try {
        reponseItem = item.asMultipleChoiceItem().createResponse(valeurChoix);
      } catch (erreurChoixExact) {
        reponseItem = creerReponseChoixUniqueCompatibleV26_(
          item.asMultipleChoiceItem(),
          valeurChoix
        );
      }
    } else if (type === FormApp.ItemType.LIST) {
      reponseItem = item.asListItem().createResponse(String(valeur));
    } else if (type === FormApp.ItemType.CHECKBOX) {
      const choix = Array.isArray(valeur) ? valeur : [String(valeur)];
      reponseItem = item.asCheckboxItem().createResponse(choix);
    } else if (type === FormApp.ItemType.SCALE) {
      const resultatNote = String(valeur).match(/^\d+/);
      const note = Number(resultatNote ? resultatNote[0] : NaN);
      if (!Number.isFinite(note)) throw new Error('INVALID_ANSWERS');
      reponseItem = item.asScaleItem().createResponse(note);
    } else {
      throw new Error('INVALID_ANSWERS');
    }

    reponse.withItemResponse(reponseItem);
  });

  // Les lignes reçues sont obligatoires côté site. On recompose donc les grilles
  // à partir des index déjà présents, sans appeler getRows() sur chaque grille.
  Object.keys(reponsesGroupees).forEach(function (itemId) {
    const groupe = reponsesGroupees[itemId];
    const lignes = [];

    for (let index = 0; index <= groupe.maxRowIndex; index += 1) {
      const valeur = groupe.lignes[index];
      if (valeur == null || valeur === '') throw new Error('INVALID_ANSWERS');
      lignes.push(
        groupe.type === FormApp.ItemType.CHECKBOX_GRID
          ? (Array.isArray(valeur) ? valeur.map(String) : [String(valeur)])
          : String(valeur)
      );
    }

    if (groupe.type === FormApp.ItemType.GRID) {
      reponse.withItemResponse(
        groupe.item.asGridItem().createResponse(lignes)
      );
    } else {
      reponse.withItemResponse(
        groupe.item.asCheckboxGridItem().createResponse(lignes)
      );
    }
  });

  ajouterReponsesSupplementairesUltraRapideV30_(
    reponse,
    supplementaires || {},
    planRapide,
    bundleItems
  );

  return reponse;
}

function ajouterReponsesSupplementairesUltraRapideV30_(
  reponse,
  donnees,
  planRapide,
  bundleItems
) {
  if (!Object.keys(donnees).length) return;

  function item(cle, type) {
    const itemId = planRapide.supplementaires[cle];
    const resultat = obtenirItemMemoireV30_(bundleItems, itemId);
    if (resultat.getType() !== type) throw new Error('CONFIGURATION_MISSING');
    return resultat;
  }

  const preference = String(donnees.preferred_public_channel || '');
  const raison = String(donnees.no_official_reason || '');
  const confiance = String(donnees.trust_general_common || '');
  const detailOfficiel = String(donnees.official_source_other_detail || '');
  const detailExterne = String(donnees.external_source_other_detail || '');
  const detailContact = String(donnees.contact_channel_other_detail || '');

  if (preference) {
    reponse.withItemResponse(
      item('preferred_public_channel', FormApp.ItemType.MULTIPLE_CHOICE)
        .asMultipleChoiceItem()
        .createResponse(preference)
    );
  }
  if (raison) {
    reponse.withItemResponse(
      item('no_official_reason', FormApp.ItemType.MULTIPLE_CHOICE)
        .asMultipleChoiceItem()
        .createResponse(raison)
    );
  }
  if (confiance) {
    if (MISE_A_JOUR_QUESTIONNAIRE.LIKERT_COLUMNS.indexOf(confiance) === -1) {
      throw new Error('INVALID_ANSWERS');
    }
    reponse.withItemResponse(
      item('trust_general_common', FormApp.ItemType.GRID)
        .asGridItem()
        .createResponse([confiance])
    );
  }
  if (detailOfficiel) {
    reponse.withItemResponse(
      item('official_source_other_detail', FormApp.ItemType.TEXT)
        .asTextItem()
        .createResponse(detailOfficiel)
    );
  }
  if (detailExterne) {
    reponse.withItemResponse(
      item('external_source_other_detail', FormApp.ItemType.TEXT)
        .asTextItem()
        .createResponse(detailExterne)
    );
  }
  if (detailContact) {
    reponse.withItemResponse(
      item('contact_channel_other_detail', FormApp.ItemType.TEXT)
        .asTextItem()
        .createResponse(detailContact)
    );
  }
}

function preparerReponseRapideV23_(
  formulaire,
  questionReference,
  submissionId,
  charge,
  supplementaires,
  correspondance,
  planRapide
) {
  const reponse = formulaire.createResponse();
  const cacheItems = {};
  const reponsesGroupees = {};
  const chargeComplete = Object.assign({}, charge);
  let indexFallback = null;

  chargeComplete[String(CONTROLE_PARTICIPATION.SUBMISSION_ENTRY_ID)] =
    creerReferenceTechniqueSignee_(submissionId);

  Object.keys(chargeComplete).forEach(function (entryId) {
    let descripteurBrut =
      descripteurInteractionOfficielleV26_(entryId) ||
      planRapide.descripteurs[String(entryId)] ||
      correspondance[String(entryId)];

    // Fallback uniquement si cet ID n'a pas pu être mis en cache.
    // Le coûteux getItems() ne se produit donc que pour un cas réellement
    // non résolu, pas à chaque envoi.
    if (!descripteurBrut) {
      if (!indexFallback) {
        indexFallback = construireIndexItemsResolution_(formulaire.getItems());
      }

      try {
        descripteurBrut =
          resoudreDescripteurBlocActuel_(
            formulaire,
            correspondance,
            entryId,
            indexFallback
          );
      } catch (_) {}

      if (!descripteurBrut) {
        try {
          descripteurBrut =
            resoudreDescripteurPlaceholder_(
              formulaire,
              correspondance,
              entryId,
              indexFallback
            );
        } catch (_) {}
      }
    }

    const descripteur =
      descripteurBrut && typeof descripteurBrut === 'object'
        ? descripteurBrut
        : { itemId: String(descripteurBrut || '') };

    const itemId = String(descripteur.itemId || '');
    const item = obtenirItemRapideV23_(formulaire, itemId, cacheItems);
    const valeur = chargeComplete[entryId];
    const type = item.getType();
    let reponseItem;

    if (type === FormApp.ItemType.GRID || type === FormApp.ItemType.CHECKBOX_GRID) {
      if (!Number.isInteger(Number(descripteur.rowIndex))) {
        throw new Error('INVALID_ANSWERS');
      }
      if (!reponsesGroupees[itemId]) {
        reponsesGroupees[itemId] = { item: item, lignes: {} };
      }
      reponsesGroupees[itemId].lignes[Number(descripteur.rowIndex)] = valeur;
      return;
    }

    if (type === FormApp.ItemType.TEXT) {
      reponseItem = item.asTextItem().createResponse(String(valeur));
    } else if (type === FormApp.ItemType.PARAGRAPH_TEXT) {
      reponseItem = item.asParagraphTextItem().createResponse(String(valeur));
    } else if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
      const valeurChoix = canoniserValeurChoixRapideV27_(valeur);
      try {
        reponseItem = item.asMultipleChoiceItem().createResponse(valeurChoix);
      } catch (erreurChoixExact) {
        reponseItem = creerReponseChoixUniqueCompatibleV26_(item.asMultipleChoiceItem(), valeurChoix);
      }
    } else if (type === FormApp.ItemType.LIST) {
      reponseItem = item.asListItem().createResponse(String(valeur));
    } else if (type === FormApp.ItemType.CHECKBOX) {
      const choix = Array.isArray(valeur) ? valeur : [String(valeur)];
      reponseItem = item.asCheckboxItem().createResponse(choix);
    } else if (type === FormApp.ItemType.SCALE) {
      const resultatNote = String(valeur).match(/^\d+/);
      const note = Number(resultatNote ? resultatNote[0] : NaN);
      if (!Number.isFinite(note)) throw new Error('INVALID_ANSWERS');
      reponseItem = item.asScaleItem().createResponse(note);
    } else {
      throw new Error('INVALID_ANSWERS');
    }

    reponse.withItemResponse(reponseItem);
  });

  Object.keys(reponsesGroupees).forEach(function (itemId) {
    const groupe = reponsesGroupees[itemId];
    const item = groupe.item;

    if (item.getType() === FormApp.ItemType.GRID) {
      const lignes = item.asGridItem().getRows().map(function (_, index) {
        const valeur = groupe.lignes[index];
        if (!valeur) throw new Error('INVALID_ANSWERS');
        return String(valeur);
      });
      reponse.withItemResponse(item.asGridItem().createResponse(lignes));
    } else {
      const lignes = item.asCheckboxGridItem().getRows().map(function (_, index) {
        const valeur = groupe.lignes[index];
        if (!valeur) throw new Error('INVALID_ANSWERS');
        return Array.isArray(valeur) ? valeur.map(String) : [String(valeur)];
      });
      reponse.withItemResponse(item.asCheckboxGridItem().createResponse(lignes));
    }
  });

  ajouterReponsesSupplementairesRapideV23_(
    reponse,
    formulaire,
    supplementaires || {},
    planRapide,
    cacheItems
  );

  return reponse;
}

function ajouterReponsesSupplementairesRapideV23_(
  reponse,
  formulaire,
  donnees,
  planRapide,
  cacheItems
) {
  if (!Object.keys(donnees).length) return;

  function item(cle, type) {
    const itemId = planRapide.supplementaires[cle];
    const resultat = obtenirItemRapideV23_(formulaire, itemId, cacheItems);
    if (resultat.getType() !== type) throw new Error('CONFIGURATION_MISSING');
    return resultat;
  }

  const preference = String(donnees.preferred_public_channel || '');
  const raison = String(donnees.no_official_reason || '');
  const confiance = String(donnees.trust_general_common || '');
  const detailOfficiel = String(donnees.official_source_other_detail || '');
  const detailExterne = String(donnees.external_source_other_detail || '');
  const detailContact = String(donnees.contact_channel_other_detail || '');

  if (preference) {
    reponse.withItemResponse(
      item('preferred_public_channel', FormApp.ItemType.MULTIPLE_CHOICE)
        .asMultipleChoiceItem()
        .createResponse(preference)
    );
  }
  if (raison) {
    reponse.withItemResponse(
      item('no_official_reason', FormApp.ItemType.MULTIPLE_CHOICE)
        .asMultipleChoiceItem()
        .createResponse(raison)
    );
  }
  if (confiance) {
    if (MISE_A_JOUR_QUESTIONNAIRE.LIKERT_COLUMNS.indexOf(confiance) === -1) {
      throw new Error('INVALID_ANSWERS');
    }
    reponse.withItemResponse(
      item('trust_general_common', FormApp.ItemType.GRID)
        .asGridItem()
        .createResponse([confiance])
    );
  }
  if (detailOfficiel) {
    reponse.withItemResponse(
      item('official_source_other_detail', FormApp.ItemType.TEXT)
        .asTextItem()
        .createResponse(detailOfficiel)
    );
  }
  if (detailExterne) {
    reponse.withItemResponse(
      item('external_source_other_detail', FormApp.ItemType.TEXT)
        .asTextItem()
        .createResponse(detailExterne)
    );
  }
  if (detailContact) {
    reponse.withItemResponse(
      item('contact_channel_other_detail', FormApp.ItemType.TEXT)
        .asTextItem()
        .createResponse(detailContact)
    );
  }
}


/**
 * v25 — diagnostic des échecs.
 * Écrit uniquement lorsqu'un envoi échoue, afin de ne pas ralentir les
 * soumissions normales.
 */
function enregistrerDiagnosticEchecV26_(requete, erreur, perf, soumissionLancee) {
  const classeur = SpreadsheetApp.openById(CONTROLE_PARTICIPATION.SPREADSHEET_ID);
  const nom = 'DIAGNOSTIC_ECHEC_V27';
  let feuille = classeur.getSheetByName(nom);
  if (!feuille) feuille = classeur.insertSheet(nom);

  const entetes = [
    'Date',
    'Submission ID',
    'Étape',
    'Message erreur',
    'Soumission native lancée',
    'Plan rapide depuis cache',
    'Chargement plan ms',
    'Préparation réponse ms',
    'Google Form submit ms',
  ];
  if (feuille.getLastRow() === 0) {
    feuille.getRange(1, 1, 1, entetes.length).setValues([entetes]);
    feuille.setFrozenRows(1);
  }

  const message = String((erreur && erreur.message) || erreur || '');
  let etape = 'AVANT_PREPARATION';
  if (perf && perf.chargementPlan > 0) etape = 'PREPARATION_REPONSE';
  if (soumissionLancee) etape = 'GOOGLE_FORM_SUBMIT';

  feuille.appendRow([
    new Date(),
    String((requete && requete.submissionId) || ''),
    etape,
    message.slice(0, 1000),
    soumissionLancee ? 'oui' : 'non',
    perf && perf.cachePlan ? 'oui' : 'non',
    perf ? Number(perf.chargementPlan || 0) : 0,
    perf ? Number(perf.preparationReponse || 0) : 0,
    perf ? Number(perf.submitNatif || 0) : 0,
  ]);
}

function enregistrerDiagnosticEnvoiV23_(feuilleControle, submissionId, perf, compteTestExempte) {
  const classeur = feuilleControle.getParent();
  let feuilleDiagnostic = classeur.getSheetByName('DIAGNOSTIC_ENVOI_V24');

  const entetes = [
    'Date du test',
    'Submission ID',
    'Compte test exempté',
    'Plan rapide depuis cache',
    'Jeton Google ms',
    'Parsing réponses ms',
    'Ouverture feuille contrôle ms',
    'Attente verrou ms',
    'Recherche submissionId ms',
    'Contrôle participation ms',
    'Réservation PENDING ms',
    'Ouverture Google Form ms',
    'Chargement/construction plan ms',
    'Préparation réponse ciblée ms',
    'Google Form submit ms',
    'Finalisation contrôle ms',
    'Total ms',
    'Total secondes'
  ];

  if (!feuilleDiagnostic) {
    feuilleDiagnostic = classeur.insertSheet('DIAGNOSTIC_ENVOI_V24');
    feuilleDiagnostic.setFrozenRows(1);
    feuilleDiagnostic.getRange(1, 1, 1, entetes.length).setValues([entetes]);
  }

  feuilleDiagnostic.appendRow([
    new Date(),
    submissionId,
    compteTestExempte ? 'oui' : 'non',
    perf.cachePlan ? 'oui' : 'non',
    perf.jeton,
    perf.parsing,
    perf.feuilleControle,
    perf.attenteVerrou,
    perf.rechercheReservation,
    perf.controleParticipation,
    perf.reservation,
    perf.ouvertureFormulaire,
    perf.chargementPlan,
    perf.preparationReponse,
    perf.submitNatif,
    perf.finalisation,
    perf.total,
    Math.round(perf.total / 100) / 10
  ]);
}

function parserChargeReponses_(texte) {
  if (!texte || texte.length > 120000) throw new Error('INVALID_ANSWERS');

  let donnees;
  try {
    donnees = JSON.parse(texte);
  } catch (_) {
    throw new Error('INVALID_ANSWERS');
  }

  if (!donnees || Array.isArray(donnees) || typeof donnees !== 'object') {
    throw new Error('INVALID_ANSWERS');
  }

  const ids = Object.keys(donnees);
  if (!ids.length || ids.length > 250) throw new Error('INVALID_ANSWERS');

  const charge = {};
  ids.forEach(function (id) {
    if (!/^\d+$/.test(id)) throw new Error('INVALID_ANSWERS');
    const valeur = donnees[id];
    const valeurs = Array.isArray(valeur) ? valeur : [valeur];
    if (!valeurs.length || valeurs.length > 30) throw new Error('INVALID_ANSWERS');
    const nettoyees = valeurs.map(function (element) {
      const texteElement = String(element == null ? '' : element);
      if (!texteElement || texteElement.length > 4000) throw new Error('INVALID_ANSWERS');
      return texteElement;
    });
    charge[id] = Array.isArray(valeur) ? nettoyees : nettoyees[0];
  });
  return charge;
}

function parserReponsesSupplementaires_(texte) {
  if (!texte) return {};
  if (texte.length > 12000) throw new Error('INVALID_ANSWERS');

  let donnees;
  try {
    donnees = JSON.parse(texte);
  } catch (_) {
    throw new Error('INVALID_ANSWERS');
  }
  if (!donnees || Array.isArray(donnees) || typeof donnees !== 'object') {
    throw new Error('INVALID_ANSWERS');
  }

  const autorisees = {
    preferred_public_channel: true,
    no_official_reason: true,
    trust_general_common: true,
    official_source_other_detail: true,
    external_source_other_detail: true,
    contact_channel_other_detail: true,
  };
  const resultat = {};
  Object.keys(donnees).forEach(function (cle) {
    if (!autorisees[cle]) throw new Error('INVALID_ANSWERS');
    const valeur = String(donnees[cle] == null ? '' : donnees[cle]).trim();
    if (!valeur || valeur.length > 500) throw new Error('INVALID_ANSWERS');
    resultat[cle] = valeur;
  });
  return resultat;
}


function obtenirItemIdDepuisEntryId_(correspondance, entryId) {
  const descripteur = correspondance[String(entryId)];
  return String(
    descripteur && typeof descripteur === 'object'
      ? descripteur.itemId || ''
      : descripteur || ''
  );
}



function construireIndexItemsResolution_(items) {
  const metas = [];
  const positionParId = {};
  const itemParId = {};

  items.forEach(function (item, index) {
    const id = String(item.getId());
    const type = item.getType();
    const meta = {
      item: item,
      id: id,
      type: type,
      title: String(item.getTitle() || '').trim(),
      rows: null,
    };

    if (type === FormApp.ItemType.GRID) {
      meta.rows = item.asGridItem().getRows();
    } else if (type === FormApp.ItemType.CHECKBOX_GRID) {
      meta.rows = item.asCheckboxGridItem().getRows();
    }

    metas.push(meta);
    positionParId[id] = index;
    itemParId[id] = item;
  });

  return {
    metas: metas,
    positionParId: positionParId,
    itemParId: itemParId,
  };
}

function normaliserIndexItemsResolution_(formulaire, source) {
  if (source && source.metas && source.positionParId && source.itemParId) {
    return source;
  }
  return construireIndexItemsResolution_(
    Array.isArray(source) ? source : formulaire.getItems()
  );
}

function resoudreDescripteurBlocActuel_(formulaire, correspondance, entryId, itemsDisponibles) {
  const TRUST_ROWS = [
    '1. المعلومات التي تنشرها الوزارة بشأن البرنامج دقيقة وموثوقة.',
    '2. لدى الوزارة القدرة على تدبير البرنامج بكفاءة.',
    '3. تُعالج طلبات الاستفادة وفق القواعد المعلنة.',
    '4. تطبق الوزارة معايير الاستفادة على جميع طالبي الدعم بصورة عادلة ودون تمييز.',
    '5. تفي الوزارة بالتزاماتها المعلنة بشأن البرنامج.',
  ];
  const LEGIT_ROWS = [
    '1. تخصيص برنامج لامتلاك السكن أمر جيد.',
    '2. يساهم برنامج الدعم المباشر للسكن في تسهيل امتلاك السكن.',
    '3. تخصيص موارد عمومية لتمويل برنامج الدعم المباشر للسكن أمر مناسب.',
    '4. معايير الاستفادة المعتمدة في البرنامج عادلة.',
  ];
  const EASE_ROWS = [
    '1. شروط الاستفادة المحددة في البرنامج قابلة للاستيفاء (أي يمكن تحقيقها).',
    '2. إجراءات طلب الاستفادة من البرنامج ميسرة.',
    '3. الوثائق المطلوبة للاستفادة من البرنامج يمكن توفيرها دون صعوبة كبيرة.',
  ];
  const ACCEPT_ROWS = [
    '1. الاستفادة من برنامج الدعم المباشر للسكن خيار مناسب لاقتناء السكن.',
    '2. برنامج الدعم المباشر للسكن جدير بالاستمرار.',
    '3. أوصي أصدقائي وأفراد أسرتي المؤهلين بالاستفادة من برنامج الدعم المباشر للسكن.',
  ];
  const BENEFICIARY_ROWS = [
    '1. مكنني البرنامج من اقتناء السكن.',
    '2. شروط وإجراءات الاستفادة من البرنامج ميسرة.',
    '3. كانت المدة بين معالجة ملف الاستفادة واقتناء السكن مناسبة.',
    '4. ساهمت الاستفادة من البرنامج في تحسين ظروفي السكنية والمعيشية.',
    '5. خفف الدعم العبء المالي المرتبط باقتناء السكن.',
  ];
  const GENERAL_IMPACT_ROWS = [
    '1. يساهم برنامج الدعم المباشر للسكن في تحسين الأوضاع السكنية.',
    '2. يساهم برنامج الدعم المباشر للسكن في تخفيف العبء المالي المرتبط باقتناء السكن.',
  ];

  function group(ids, start, end, title, rows) {
    ids.forEach(function (id, rowIndex) {
      specs[String(id)] = { start:start, end:end, title:title, rows:rows, rowIndex:rowIndex };
    });
  }

  const specs = {};

  // G2 bénéficiaire
  group(['990000000000000041','990000000000000042','990000000000000043','990000000000000044','990000000000000045'],
        '882397137','704695728','آراؤكم حول تدبير الوزارة للبرنامج',TRUST_ROWS);
  group(['1486461560','1904067536','1513964979','1092411069'],
        '882397137','704695728','آراؤكم حول بعض جوانب البرنامج',LEGIT_ROWS);
  group(['1248958122','1537513608','664408094'],
        '882397137','704695728','شروط وإجراءات الاستفادة من البرنامج',EASE_ROWS);
  group(['1011219132','1200558200','844136116'],
        '882397137','704695728','آراؤكم حول البرنامج',ACCEPT_ROWS);
  group(['2008127058','1587790851','411578762','271992870','301943015'],
        '882397137','704695728','تجربتكم في الاستفادة من البرنامج وأثرها على وضعكم السكني',BENEFICIARY_ROWS);

  // G2 autre
  group(['990000000000000051','990000000000000052','990000000000000053','990000000000000054','990000000000000055'],
        '1729249596','159882139','آراؤكم حول تدبير الوزارة للبرنامج',TRUST_ROWS);
  group(['1677021184','520351974','1645334930','961995117'],
        '1729249596','159882139','آراؤكم حول بعض جوانب البرنامج',LEGIT_ROWS);
  group(['1198945725','1009069255','258582065'],
        '1729249596','159882139','شروط وإجراءات الاستفادة من البرنامج',EASE_ROWS);
  group(['1265924651','1744035836','89167698'],
        '1729249596','159882139','آراؤكم حول البرنامج',ACCEPT_ROWS);
  group(['471635203','1258806770'],
        '1729249596','159882139','آثار البرنامج',GENERAL_IMPACT_ROWS);

  // Officiel bénéficiaire
  group(['933937764','844787965','1182559343','91257242','674993537'],
        '2009753717','317816934','آراؤكم حول تدبير الوزارة للبرنامج',TRUST_ROWS);
  group(['1896687752','500642904','1151297594','1948347725'],
        '2009753717','317816934','آراؤكم حول بعض جوانب البرنامج',LEGIT_ROWS);
  group(['2143980090','1321206863','833854624'],
        '2009753717','317816934','شروط وإجراءات الاستفادة من البرنامج',EASE_ROWS);
  group(['1229613680','3871385','1641681581'],
        '2009753717','317816934','آراؤكم حول البرنامج',ACCEPT_ROWS);
  group(['1415343217','1319006138','1388444923','1864877569','800971163'],
        '2009753717','317816934','تجربتكم في الاستفادة من البرنامج وأثرها على وضعكم السكني',BENEFICIARY_ROWS);

  // Officiel autre
  group(['1808656211','1992870685','1344743776','2037118212','1300161676'],
        '1608907783','217452855','آراؤكم حول تدبير الوزارة للبرنامج',TRUST_ROWS);
  group(['1119108321','825450485','901308624','2085038932'],
        '1608907783','217452855','آراؤكم حول بعض جوانب البرنامج',LEGIT_ROWS);
  group(['883213170','1032356922','634945297'],
        '1608907783','217452855','شروط وإجراءات الاستفادة من البرنامج',EASE_ROWS);
  group(['1155871809','917543744','397729049'],
        '1608907783','217452855','آراؤكم حول البرنامج',ACCEPT_ROWS);
  group(['157757540','222082286'],
        '1608907783','217452855','آثار البرنامج',GENERAL_IMPACT_ROWS);

  const spec = specs[String(entryId)];
  if (!spec) return null;

  const indexItems = normaliserIndexItemsResolution_(formulaire, itemsDisponibles);
  const startItemId = obtenirItemIdDepuisEntryId_(correspondance, spec.start);
  const endItemId = obtenirItemIdDepuisEntryId_(correspondance, spec.end);
  if (!startItemId || !endItemId) throw new Error('CONFIGURATION_MISSING');

  const startIndex = indexItems.positionParId[String(startItemId)];
  const endIndex = indexItems.positionParId[String(endItemId)];
  if (
    !Number.isInteger(startIndex) ||
    !Number.isInteger(endIndex) ||
    endIndex <= startIndex
  ) {
    throw new Error('CONFIGURATION_MISSING');
  }

  const candidats = [];
  for (let index = startIndex + 1; index < endIndex; index += 1) {
    const meta = indexItems.metas[index];
    if (
      !meta ||
      meta.type !== FormApp.ItemType.GRID ||
      meta.title !== spec.title
    ) continue;

    const rows = meta.rows || [];
    if (
      JSON.stringify(rows) !== JSON.stringify(spec.rows) ||
      spec.rowIndex < 0 ||
      spec.rowIndex >= rows.length
    ) continue;

    candidats.push({ itemId: meta.id, rowIndex: spec.rowIndex });
  }

  if (!candidats.length) throw new Error('CONFIGURATION_MISSING');
  return candidats[candidats.length - 1];
}

function resoudreDescripteurPlaceholder_(formulaire, correspondance, placeholderId, itemsDisponibles) {
  const specs = {
    // Parcours G2 — bénéficiaire
    '990000000000000001': { start: '237635013', end: '1845717094', type: FormApp.ItemType.MULTIPLE_CHOICE, title: 'ما السبب الرئيسي الذي دفعكم إلى التواصل مع الوزارة بشأن البرنامج؟' },
    '990000000000000002': { start: '237635013', end: '1845717094', type: FormApp.ItemType.MULTIPLE_CHOICE, title: 'ما السبب الرئيسي لعدم تواصلكم مع الوزارة بشأن البرنامج؟' },
    '990000000000000003': { start: '237635013', end: '1845717094', type: FormApp.ItemType.GRID, title: 'الاستفسارات وطلب التوضيحات', rowIndex: 0 },
    '990000000000000004': { start: '237635013', end: '1845717094', type: FormApp.ItemType.GRID, title: 'الملاحظات والمقترحات', rowIndex: 0 },
    '990000000000000005': { start: '237635013', end: '1845717094', type: FormApp.ItemType.GRID, title: 'الشكايات المتعلقة بالبرنامج', rowIndex: 0 },

    // Parcours G2 — autre situation
    '990000000000000011': { start: '328033588', end: '1374327145', type: FormApp.ItemType.MULTIPLE_CHOICE, title: 'ما السبب الرئيسي الذي دفعكم إلى التواصل مع الوزارة بشأن البرنامج؟' },
    '990000000000000012': { start: '328033588', end: '1374327145', type: FormApp.ItemType.MULTIPLE_CHOICE, title: 'ما السبب الرئيسي لعدم تواصلكم مع الوزارة بشأن البرنامج؟' },
    '990000000000000013': { start: '328033588', end: '1374327145', type: FormApp.ItemType.GRID, title: 'الاستفسارات وطلب التوضيحات', rowIndex: 0 },
    '990000000000000014': { start: '328033588', end: '1374327145', type: FormApp.ItemType.GRID, title: 'الملاحظات والمقترحات', rowIndex: 0 },
    '990000000000000015': { start: '328033588', end: '1374327145', type: FormApp.ItemType.GRID, title: 'الشكايات المتعلقة بالبرنامج', rowIndex: 0 },

    // Parcours officiel — bénéficiaire
    '990000000000000021': { start: '1807617813', end: '366290689', type: FormApp.ItemType.MULTIPLE_CHOICE, title: 'ما السبب الرئيسي الذي دفعكم إلى التواصل مع الوزارة بشأن البرنامج؟' },
    '990000000000000022': { start: '1807617813', end: '366290689', type: FormApp.ItemType.MULTIPLE_CHOICE, title: 'ما السبب الرئيسي لعدم تواصلكم مع الوزارة بشأن البرنامج؟' },
    '990000000000000023': { start: '1807617813', end: '366290689', type: FormApp.ItemType.GRID, title: 'الاستفسارات وطلب التوضيحات', rowIndex: 0 },
    '990000000000000024': { start: '1807617813', end: '366290689', type: FormApp.ItemType.GRID, title: 'الملاحظات والمقترحات', rowIndex: 0 },
    '990000000000000025': { start: '1807617813', end: '366290689', type: FormApp.ItemType.GRID, title: 'الشكايات المتعلقة بالبرنامج', rowIndex: 0 },

    // Parcours officiel — autre situation
    '990000000000000031': { start: '1924533978', end: '850668692', type: FormApp.ItemType.MULTIPLE_CHOICE, title: 'ما السبب الرئيسي الذي دفعكم إلى التواصل مع الوزارة بشأن البرنامج؟' },
    '990000000000000032': { start: '1924533978', end: '850668692', type: FormApp.ItemType.MULTIPLE_CHOICE, title: 'ما السبب الرئيسي لعدم تواصلكم مع الوزارة بشأن البرنامج؟' },
    '990000000000000033': { start: '1924533978', end: '850668692', type: FormApp.ItemType.GRID, title: 'الاستفسارات وطلب التوضيحات', rowIndex: 0 },
    '990000000000000034': { start: '1924533978', end: '850668692', type: FormApp.ItemType.GRID, title: 'الملاحظات والمقترحات', rowIndex: 0 },
    '990000000000000035': { start: '1924533978', end: '850668692', type: FormApp.ItemType.GRID, title: 'الشكايات المتعلقة بالبرنامج', rowIndex: 0 },

    // Confiance — G2 bénéficiaire
    '990000000000000041': { start: '882397137', end: '1486461560', type: FormApp.ItemType.GRID, title: 'آراؤكم حول تدبير الوزارة للبرنامج', rowIndex: 0 },
    '990000000000000042': { start: '882397137', end: '1486461560', type: FormApp.ItemType.GRID, title: 'آراؤكم حول تدبير الوزارة للبرنامج', rowIndex: 1 },
    '990000000000000043': { start: '882397137', end: '1486461560', type: FormApp.ItemType.GRID, title: 'آراؤكم حول تدبير الوزارة للبرنامج', rowIndex: 2 },
    '990000000000000044': { start: '882397137', end: '1486461560', type: FormApp.ItemType.GRID, title: 'آراؤكم حول تدبير الوزارة للبرنامج', rowIndex: 3 },
    '990000000000000045': { start: '882397137', end: '1486461560', type: FormApp.ItemType.GRID, title: 'آراؤكم حول تدبير الوزارة للبرنامج', rowIndex: 4 },

    // Confiance — G2 autre situation
    '990000000000000051': { start: '1729249596', end: '1677021184', type: FormApp.ItemType.GRID, title: 'آراؤكم حول تدبير الوزارة للبرنامج', rowIndex: 0 },
    '990000000000000052': { start: '1729249596', end: '1677021184', type: FormApp.ItemType.GRID, title: 'آراؤكم حول تدبير الوزارة للبرنامج', rowIndex: 1 },
    '990000000000000053': { start: '1729249596', end: '1677021184', type: FormApp.ItemType.GRID, title: 'آراؤكم حول تدبير الوزارة للبرنامج', rowIndex: 2 },
    '990000000000000054': { start: '1729249596', end: '1677021184', type: FormApp.ItemType.GRID, title: 'آراؤكم حول تدبير الوزارة للبرنامج', rowIndex: 3 },
    '990000000000000055': { start: '1729249596', end: '1677021184', type: FormApp.ItemType.GRID, title: 'آراؤكم حول تدبير الوزارة للبرنامج', rowIndex: 4 },
  };

  const spec = specs[String(placeholderId)];
  if (!spec) return null;

  const indexItems = normaliserIndexItemsResolution_(formulaire, itemsDisponibles);
  const startItemId = obtenirItemIdDepuisEntryId_(correspondance, spec.start);
  const endItemId = obtenirItemIdDepuisEntryId_(correspondance, spec.end);
  if (!startItemId || !endItemId) throw new Error('CONFIGURATION_MISSING');

  const startIndex = indexItems.positionParId[String(startItemId)];
  const endIndex = indexItems.positionParId[String(endItemId)];
  if (
    !Number.isInteger(startIndex) ||
    !Number.isInteger(endIndex) ||
    endIndex <= startIndex
  ) {
    throw new Error('CONFIGURATION_MISSING');
  }

  const candidats = [];
  for (let index = startIndex + 1; index < endIndex; index += 1) {
    const meta = indexItems.metas[index];
    if (!meta || meta.type !== spec.type || meta.title !== spec.title) continue;

    if (spec.type === FormApp.ItemType.GRID) {
      const rowIndex = Number(spec.rowIndex);
      const rows = meta.rows || [];
      if (
        !Number.isInteger(rowIndex) ||
        rowIndex < 0 ||
        rowIndex >= rows.length
      ) continue;
      candidats.push({ itemId: meta.id, rowIndex: rowIndex });
    } else {
      candidats.push({ itemId: meta.id });
    }
  }

  if (!candidats.length) throw new Error('CONFIGURATION_MISSING');
  return candidats[candidats.length - 1];
}

function preparerReponseDepuisCharge_(
  formulaire,
  questionReference,
  submissionId,
  charge,
  supplementaires,
  correspondancePrete,
  indexItemsPrets
) {
  const reponse = formulaire.createResponse();
  const indexItems =
    indexItemsPrets || construireIndexItemsResolution_(formulaire.getItems());
  const itemsParId = indexItems.itemParId;
  const reponsesGroupees = {};

  const correspondance =
    correspondancePrete || obtenirCorrespondanceFormulaire_(formulaire);
  const chargeComplete = Object.assign({}, charge);
  delete chargeComplete[String(questionReference.getId())];
  chargeComplete[obtenirEntryIdQuestion_(correspondance, questionReference)] =
    creerReferenceTechniqueSignee_(submissionId);

  Object.keys(chargeComplete).forEach(function (entryId) {
    const descripteurBrut =
      resoudreDescripteurBlocActuel_(formulaire, correspondance, entryId, indexItems) ||
      correspondance[entryId] ||
      resoudreDescripteurPlaceholder_(formulaire, correspondance, entryId, indexItems);
    const descripteur =
      descripteurBrut && typeof descripteurBrut === 'object'
        ? descripteurBrut
        : { itemId: String(descripteurBrut || '') };
    const itemId = String(descripteur.itemId || '');
    const item = itemsParId[itemId];
    if (!item) throw new Error('INVALID_ANSWERS');

    const valeur = chargeComplete[entryId];
    const type = item.getType();
    let reponseItem;

    if (type === FormApp.ItemType.GRID || type === FormApp.ItemType.CHECKBOX_GRID) {
      if (!Number.isInteger(Number(descripteur.rowIndex))) throw new Error('INVALID_ANSWERS');
      if (!reponsesGroupees[itemId]) reponsesGroupees[itemId] = { item: item, lignes: {} };
      reponsesGroupees[itemId].lignes[Number(descripteur.rowIndex)] = valeur;
      return;
    }

    if (type === FormApp.ItemType.TEXT) {
      reponseItem = item.asTextItem().createResponse(String(valeur));
    } else if (type === FormApp.ItemType.PARAGRAPH_TEXT) {
      reponseItem = item.asParagraphTextItem().createResponse(String(valeur));
    } else if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
      try {
        reponseItem = item.asMultipleChoiceItem().createResponse(String(valeur));
      } catch (erreurChoixExact) {
        reponseItem = creerReponseChoixUniqueCompatibleV26_(item.asMultipleChoiceItem(), valeur);
      }
    } else if (type === FormApp.ItemType.LIST) {
      reponseItem = item.asListItem().createResponse(String(valeur));
    } else if (type === FormApp.ItemType.CHECKBOX) {
      const choix = Array.isArray(valeur) ? valeur : [String(valeur)];
      reponseItem = item.asCheckboxItem().createResponse(choix);
    } else if (type === FormApp.ItemType.SCALE) {
      const note = Number(String(valeur).match(/^\d+/)?.[0] || NaN);
      if (!Number.isFinite(note)) throw new Error('INVALID_ANSWERS');
      reponseItem = item.asScaleItem().createResponse(note);
    } else {
      throw new Error('INVALID_ANSWERS');
    }

    reponse.withItemResponse(reponseItem);
  });

  Object.keys(reponsesGroupees).forEach(function (itemId) {
    const groupe = reponsesGroupees[itemId];
    const item = groupe.item;
    if (item.getType() === FormApp.ItemType.GRID) {
      const lignes = item.asGridItem().getRows().map(function (_, index) {
        const valeur = groupe.lignes[index];
        if (!valeur) throw new Error('INVALID_ANSWERS');
        return String(valeur);
      });
      reponse.withItemResponse(item.asGridItem().createResponse(lignes));
    } else {
      const lignes = item.asCheckboxGridItem().getRows().map(function (_, index) {
        const valeur = groupe.lignes[index];
        if (!valeur) throw new Error('INVALID_ANSWERS');
        return Array.isArray(valeur) ? valeur.map(String) : [String(valeur)];
      });
      reponse.withItemResponse(item.asCheckboxGridItem().createResponse(lignes));
    }
  });

  ajouterReponsesSupplementaires_(reponse, formulaire, supplementaires || {}, indexItems);

  return reponse;
}

function garantirMiseAJourQuestionnaire_(formulaire, creerSiAbsent) {
  const verrou = LockService.getScriptLock();
  verrou.waitLock(20000);
  try {
    let changementStructurel = false;
    const questions = {};

    questions.preferred_public_channel = trouverQuestionUniqueParTitre_(
      formulaire,
      FormApp.ItemType.MULTIPLE_CHOICE,
      MISE_A_JOUR_QUESTIONNAIRE.PREFERRED_CHANNEL_TITLE
    );
    if (!questions.preferred_public_channel && creerSiAbsent) {
      questions.preferred_public_channel = formulaire.addMultipleChoiceItem();
      questions.preferred_public_channel.setTitle(
        MISE_A_JOUR_QUESTIONNAIRE.PREFERRED_CHANNEL_TITLE
      );
      changementStructurel = true;
    }
    if (questions.preferred_public_channel) {
      configurerQuestionChoixUnique_(
        questions.preferred_public_channel,
        MISE_A_JOUR_QUESTIONNAIRE.PREFERRED_CHANNEL_CHOICES
      );
    }

    questions.q2 = trouverQuestionUniqueParTitre_(
      formulaire,
      FormApp.ItemType.MULTIPLE_CHOICE,
      MISE_A_JOUR_QUESTIONNAIRE.Q2_TITLE
    );
    if (!questions.q2) {
      const anciennesQ2 = formulaire.getItems(FormApp.ItemType.MULTIPLE_CHOICE).filter(function (item) {
        const titre = item.getTitle().trim();
        return titre.indexOf(MISE_A_JOUR_QUESTIONNAIRE.Q2_LEGACY_PREFIX) === 0 &&
          titre.indexOf('برنامج الدعم المباشر للسكن') !== -1;
      });
      if (anciennesQ2.length > 1) throw new Error('CONFIGURATION_MISSING');
      if (anciennesQ2.length === 1) {
        questions.q2 = anciennesQ2[0].asMultipleChoiceItem();
        questions.q2.setTitle(MISE_A_JOUR_QUESTIONNAIRE.Q2_TITLE);
        changementStructurel = true;
      }
    }

    questions.no_official_reason = trouverQuestionUniqueParTitre_(
      formulaire,
      FormApp.ItemType.MULTIPLE_CHOICE,
      MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_TITLE
    );
    if (!questions.no_official_reason) {
      const anciennesQ2b = formulaire.getItems(FormApp.ItemType.MULTIPLE_CHOICE).filter(function (item) {
        const titre = item.getTitle().trim();
        const titreSansNumero = titre.replace(/^س2-ب\.\s*/, '');
        return titreSansNumero.indexOf(MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_LEGACY_PREFIX) === 0;
      });
      if (anciennesQ2b.length > 1) throw new Error('CONFIGURATION_MISSING');
      if (anciennesQ2b.length === 1) {
        questions.no_official_reason = anciennesQ2b[0].asMultipleChoiceItem();
        questions.no_official_reason.setTitle(MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_TITLE);
        changementStructurel = true;
      }
    }
    if (!questions.no_official_reason && creerSiAbsent) {
      questions.no_official_reason = formulaire.addMultipleChoiceItem();
      questions.no_official_reason.setTitle(
        MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_TITLE
      );
      changementStructurel = true;
    }
    if (questions.no_official_reason) {
      configurerQuestionChoixUnique_(
        questions.no_official_reason,
        MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_CHOICES
      );
      questions.no_official_reason
        .setHelpText(MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_HELP)
        .showOtherOption(true)
        .setRequired(true);
    }

    questions.trust_general_common = trouverQuestionUniqueParTitre_(
      formulaire,
      FormApp.ItemType.GRID,
      MISE_A_JOUR_QUESTIONNAIRE.TRUST_COMMON_TITLE
    );
    if (!questions.trust_general_common && creerSiAbsent) {
      questions.trust_general_common = formulaire.addGridItem();
      questions.trust_general_common.setTitle(
        MISE_A_JOUR_QUESTIONNAIRE.TRUST_COMMON_TITLE
      );
      changementStructurel = true;
    }
    if (questions.trust_general_common) {
      const lignes = questions.trust_general_common.getRows();
      const colonnes = questions.trust_general_common.getColumns();
      if (
        JSON.stringify(lignes) !== JSON.stringify([MISE_A_JOUR_QUESTIONNAIRE.TRUST_COMMON_ROW]) ||
        JSON.stringify(colonnes) !== JSON.stringify(MISE_A_JOUR_QUESTIONNAIRE.LIKERT_COLUMNS)
      ) {
        questions.trust_general_common
          .setRows([MISE_A_JOUR_QUESTIONNAIRE.TRUST_COMMON_ROW])
          .setColumns(MISE_A_JOUR_QUESTIONNAIRE.LIKERT_COLUMNS);
      }
      questions.trust_general_common.setRequired(false);
    }

    [
      ['official_source_other_detail', MISE_A_JOUR_QUESTIONNAIRE.OFFICIAL_SOURCE_OTHER_DETAIL_TITLE],
      ['external_source_other_detail', MISE_A_JOUR_QUESTIONNAIRE.EXTERNAL_SOURCE_OTHER_DETAIL_TITLE],
      ['contact_channel_other_detail', MISE_A_JOUR_QUESTIONNAIRE.CONTACT_CHANNEL_OTHER_DETAIL_TITLE],
    ].forEach(function (definition) {
      const cle = definition[0];
      const titre = definition[1];
      questions[cle] = trouverQuestionUniqueParTitre_(
        formulaire,
        FormApp.ItemType.TEXT,
        titre
      );
      if (!questions[cle] && creerSiAbsent) {
        questions[cle] = formulaire.addTextItem().setTitle(titre);
        changementStructurel = true;
      }
      if (questions[cle]) questions[cle].setRequired(false);
    });

    activerOptionsAutres_(formulaire);

    if (
      !questions.preferred_public_channel ||
      !questions.no_official_reason ||
      !questions.trust_general_common ||
      !questions.official_source_other_detail ||
      !questions.external_source_other_detail ||
      !questions.contact_channel_other_detail
    ) {
      throw new Error('CONFIGURATION_MISSING');
    }

    if (changementStructurel) actualiserCorrespondanceFormulaire_(formulaire);
    PropertiesService.getScriptProperties().setProperty(
      CONTROLE_PARTICIPATION.QUESTIONNAIRE_UPDATE_PROPERTY,
      'installed'
    );
    return questions;
  } finally {
    verrou.releaseLock();
  }
}

function trouverQuestionUniqueParTitre_(formulaire, type, titre) {
  const trouvees = formulaire.getItems(type).filter(function (item) {
    return item.getTitle() === titre;
  });

  if (trouvees.length > 1) throw new Error('CONFIGURATION_MISSING');
  if (!trouvees.length) return null;

  // getItems(type) renvoie des objets Item génériques.
  // Il faut les convertir vers leur type réel avant d'utiliser
  // setRequired(), createResponse(), getChoices(), etc.
  if (type === FormApp.ItemType.TEXT) return trouvees[0].asTextItem();
  if (type === FormApp.ItemType.PARAGRAPH_TEXT) return trouvees[0].asParagraphTextItem();
  if (type === FormApp.ItemType.MULTIPLE_CHOICE) return trouvees[0].asMultipleChoiceItem();
  if (type === FormApp.ItemType.CHECKBOX) return trouvees[0].asCheckboxItem();
  if (type === FormApp.ItemType.LIST) return trouvees[0].asListItem();
  if (type === FormApp.ItemType.SCALE) return trouvees[0].asScaleItem();
  if (type === FormApp.ItemType.GRID) return trouvees[0].asGridItem();
  if (type === FormApp.ItemType.CHECKBOX_GRID) return trouvees[0].asCheckboxGridItem();
  if (type === FormApp.ItemType.DATE) return trouvees[0].asDateItem();
  if (type === FormApp.ItemType.DATETIME) return trouvees[0].asDateTimeItem();
  if (type === FormApp.ItemType.TIME) return trouvees[0].asTimeItem();
  if (type === FormApp.ItemType.DURATION) return trouvees[0].asDurationItem();

  return trouvees[0];
}

function configurerQuestionChoixUnique_(question, choix) {
  const actuels = question.getChoices().map(function (element) {
    return element.getValue();
  });
  if (JSON.stringify(actuels) !== JSON.stringify(choix)) {
    question.setChoiceValues(choix);
  }
  question.showOtherOption(true).setRequired(false);
}

function activerOptionsAutres_(formulaire) {
  formulaire.getItems(FormApp.ItemType.CHECKBOX).forEach(function (item) {
    const titre = item.getTitle().trim();
    if (
      titre === MISE_A_JOUR_QUESTIONNAIRE.OFFICIAL_SOURCES_TITLE ||
      titre === MISE_A_JOUR_QUESTIONNAIRE.EXTERNAL_SOURCES_TITLE
    ) {
      const valeur = titre === MISE_A_JOUR_QUESTIONNAIRE.OFFICIAL_SOURCES_TITLE
        ? MISE_A_JOUR_QUESTIONNAIRE.OFFICIAL_SOURCE_OTHER_VALUE
        : MISE_A_JOUR_QUESTIONNAIRE.EXTERNAL_SOURCE_OTHER_VALUE;
      garantirChoixAutreExplicite_(item.asCheckboxItem(), valeur, false);
    }
  });

  formulaire.getItems(FormApp.ItemType.MULTIPLE_CHOICE).forEach(function (item) {
    const titre = item.getTitle().trim();
    if (
      titre === MISE_A_JOUR_QUESTIONNAIRE.PRIMARY_SOURCE_TITLE ||
      (titre.indexOf('قناة') !== -1 && titre.indexOf('آخر تواصل') !== -1)
    ) {
      const valeur = titre === MISE_A_JOUR_QUESTIONNAIRE.PRIMARY_SOURCE_TITLE
        ? MISE_A_JOUR_QUESTIONNAIRE.OFFICIAL_SOURCE_OTHER_VALUE
        : MISE_A_JOUR_QUESTIONNAIRE.CONTACT_CHANNEL_OTHER_VALUE;
      garantirChoixAutreExplicite_(item.asMultipleChoiceItem(), valeur, true);
    }
  });
}

/**
 * Ajoute une option « autre » explicite sans utiliser l'option native de Forms.
 * L'option native est incompatible avec les questions qui pilotent une section.
 */
function garantirChoixAutreExplicite_(question, valeur, choixUnique) {
  try {
    question.showOtherOption(false);
  } catch (_) {}

  const choix = question.getChoices();
  if (choix.some(function (element) { return element.getValue() === valeur; })) return;

  if (!choixUnique) {
    question.setChoiceValues(
      choix.map(function (element) { return element.getValue(); }).concat([valeur])
    );
    return;
  }

  let navigation = false;
  choix.forEach(function (element) {
    try {
      if (element.getGotoPage() || element.getPageNavigationType()) navigation = true;
    } catch (_) {}
  });
  const choixAutre = navigation
    ? question.createChoice(valeur, FormApp.PageNavigationType.CONTINUE)
    : question.createChoice(valeur);
  question.setChoices(choix.concat([choixAutre]));
}

function ajouterReponsesSupplementaires_(reponse, formulaire, donnees, itemsDisponibles) {
  if (!Object.keys(donnees).length) return;
  const preference = String(donnees.preferred_public_channel || '');
  const raison = String(donnees.no_official_reason || '');
  const confiance = String(donnees.trust_general_common || '');
  const detailOfficiel = String(donnees.official_source_other_detail || '');
  const detailExterne = String(donnees.external_source_other_detail || '');
  const detailContact = String(donnees.contact_channel_other_detail || '');
  const indexItems = normaliserIndexItemsResolution_(formulaire, itemsDisponibles);
  const resolve = function (type, title) {
    const trouvees = indexItems.metas.filter(function (meta) {
      return meta.type === type && meta.title === title;
    });
    if (trouvees.length !== 1) throw new Error('CONFIGURATION_MISSING');
    const item = trouvees[0].item;
    if (type === FormApp.ItemType.MULTIPLE_CHOICE) return item.asMultipleChoiceItem();
    if (type === FormApp.ItemType.GRID) return item.asGridItem();
    return item;
  };
  if (preference) {
      const itemPreference = resolve(FormApp.ItemType.MULTIPLE_CHOICE, MISE_A_JOUR_QUESTIONNAIRE.PREFERRED_CHANNEL_TITLE);
      let repPreference;
      try {
        repPreference = itemPreference.createResponse(String(preference));
      } catch (_) {
        repPreference = creerReponseChoixUniqueCompatibleV26_(itemPreference, preference);
      }
      reponse.withItemResponse(repPreference);
    }
  if (raison) {
      const itemRaison = resolve(FormApp.ItemType.MULTIPLE_CHOICE, MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_TITLE);
      let repRaison;
      try {
        repRaison = itemRaison.createResponse(String(raison));
      } catch (_) {
        repRaison = creerReponseChoixUniqueCompatibleV26_(itemRaison, raison);
      }
      reponse.withItemResponse(repRaison);
    }
  if (confiance) {
    if (MISE_A_JOUR_QUESTIONNAIRE.LIKERT_COLUMNS.indexOf(confiance) === -1) throw new Error('INVALID_ANSWERS');
    reponse.withItemResponse(resolve(FormApp.ItemType.GRID, MISE_A_JOUR_QUESTIONNAIRE.TRUST_COMMON_TITLE).createResponse([confiance]));
  }
  if (detailOfficiel) reponse.withItemResponse(resolve(FormApp.ItemType.TEXT, MISE_A_JOUR_QUESTIONNAIRE.OFFICIAL_SOURCE_OTHER_DETAIL_TITLE).createResponse(detailOfficiel));
  if (detailExterne) reponse.withItemResponse(resolve(FormApp.ItemType.TEXT, MISE_A_JOUR_QUESTIONNAIRE.EXTERNAL_SOURCE_OTHER_DETAIL_TITLE).createResponse(detailExterne));
  if (detailContact) reponse.withItemResponse(resolve(FormApp.ItemType.TEXT, MISE_A_JOUR_QUESTIONNAIRE.CONTACT_CHANNEL_OTHER_DETAIL_TITLE).createResponse(detailContact));
}

function obtenirCorrespondanceFormulaire_(formulaire, bundleItems) {
  const proprietes = PropertiesService.getScriptProperties();
  const memorisee = proprietes.getProperty(CONTROLE_PARTICIPATION.ENTRY_ITEM_MAP_PROPERTY);
  if (memorisee) {
    try {
      const correspondance = JSON.parse(memorisee);
      if (correspondance && typeof correspondance === 'object' &&
          (!bundleItems || Object.keys(correspondance).every(function (k) {
            return descripteurExisteV302_(correspondance[k], bundleItems);
          }))) return correspondance;
    } catch (_) {}
  }
  return actualiserCorrespondanceFormulaire_(formulaire);
}

function actualiserCorrespondanceFormulaire() {
  const correspondance = actualiserCorrespondanceFormulaire_(obtenirFormulaire_());
  console.log('CORRESPONDANCE_ENTRY_ITEM_ACTUALISEE: ' + Object.keys(correspondance).length);
}

function actualiserCorrespondanceFormulaire_(formulaire) {
  const correspondance = {};
  const items = formulaire.getItems();
  items.forEach(function (item) {
    const reponseExemple = creerReponseExemplePourCorrespondance_(item);
    if (!reponseExemple) return;

    const url = formulaire
      .createResponse()
      .withItemResponse(reponseExemple)
      .toPrefilledUrl();
    const entryIds = extraireEntryIds_(url);
    if (item.getType() === FormApp.ItemType.GRID || item.getType() === FormApp.ItemType.CHECKBOX_GRID) {
      entryIds.forEach(function (entryId, rowIndex) {
        correspondance[entryId] = {
          itemId: String(item.getId()),
          rowIndex: rowIndex,
        };
      });
    } else if (entryIds.length) {
      correspondance[entryIds[0]] = { itemId: String(item.getId()) };
    }
  });

  // L'ancien identifiant reste un alias de transport pour les pages déjà ouvertes.
  const techniques = items.filter(function (item) {
    return item.getType() === FormApp.ItemType.TEXT &&
      item.getTitle() === CONTROLE_PARTICIPATION.SUBMISSION_ID_TITLE;
  });
  if (techniques.length !== 1) throw new Error('CONFIGURATION_MISSING:reference_technique');
  correspondance[String(CONTROLE_PARTICIPATION.SUBMISSION_ENTRY_ID)] = {
    itemId: String(techniques[0].getId())
  };
  const proprietes = PropertiesService.getScriptProperties();
  proprietes.setProperty(
    CONTROLE_PARTICIPATION.ENTRY_ITEM_MAP_PROPERTY,
    JSON.stringify(correspondance)
  );
  proprietes.deleteProperty('FORM_FAST_PLAN_20260815_V24');
  return correspondance;
}

function creerReponseExemplePourCorrespondance_(item) {
  const type = item.getType();
  if (type === FormApp.ItemType.TEXT) {
    return item.asTextItem().createResponse('mapping-' + item.getId());
  }
  if (type === FormApp.ItemType.PARAGRAPH_TEXT) {
    return item.asParagraphTextItem().createResponse('mapping-' + item.getId());
  }
  if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
    const choix = item.asMultipleChoiceItem().getChoices();
    return choix.length ? item.asMultipleChoiceItem().createResponse(choix[0].getValue()) : null;
  }
  if (type === FormApp.ItemType.LIST) {
    const choix = item.asListItem().getChoices();
    return choix.length ? item.asListItem().createResponse(choix[0].getValue()) : null;
  }
  if (type === FormApp.ItemType.CHECKBOX) {
    const choix = item.asCheckboxItem().getChoices();
    return choix.length ? item.asCheckboxItem().createResponse([choix[0].getValue()]) : null;
  }
  if (type === FormApp.ItemType.SCALE) {
    const question = item.asScaleItem();
    return question.createResponse(question.getLowerBound());
  }
  if (type === FormApp.ItemType.GRID) {
    const question = item.asGridItem();
    const colonnes = question.getColumns();
    return colonnes.length
      ? question.createResponse(question.getRows().map(function () { return colonnes[0]; }))
      : null;
  }
  if (type === FormApp.ItemType.CHECKBOX_GRID) {
    const question = item.asCheckboxGridItem();
    const colonnes = question.getColumns();
    return colonnes.length
      ? question.createResponse(question.getRows().map(function () { return [colonnes[0]]; }))
      : null;
  }
  return null;
}

function extraireEntryIds_(url) {
  const ids = [];
  const expression = /[?&]entry\.(\d+)=/g;
  const texte = String(url || '');
  let resultat;
  while ((resultat = expression.exec(texte)) !== null) ids.push(resultat[1]);
  return ids;
}

function obtenirEntryIdQuestion_(correspondance, question) {
  const itemId = String(question.getId());
  const entryId = Object.keys(correspondance).find(function (id) {
    const descripteur = correspondance[id];
    return String(
      descripteur && typeof descripteur === 'object'
        ? descripteur.itemId
        : descripteur
    ) === itemId;
  });
  if (!entryId) throw new Error('CONFIGURATION_MISSING');
  return entryId;
}

function verifierJetonGoogle_(jeton) {
  if (!jeton || jeton.length > 6000) return null;

  const cache = CacheService.getScriptCache();
  const cleCache = cleCacheJeton_(jeton);
  const memorisee = cache.get(cleCache);

  if (memorisee) {
    try {
      const identite = JSON.parse(memorisee);
      if (
        identite &&
        identite.sub &&
        Number(identite.exp || 0) * 1000 > Date.now()
      ) {
        return {
          sub: String(identite.sub),
          email: String(identite.email || '').trim().toLowerCase(),
        };
      }
    } catch (_) {}
  }

  let reponse;
  try {
    reponse = UrlFetchApp.fetch(
      CONTROLE_PARTICIPATION.TOKENINFO_URL + encodeURIComponent(jeton),
      { muteHttpExceptions: true, followRedirects: true }
    );
  } catch (erreur) {
    console.error(erreur && erreur.stack ? erreur.stack : erreur);
    throw new Error('TOKEN_SERVICE_UNAVAILABLE');
  }

  if (reponse.getResponseCode() !== 200) return null;

  let donnees;
  try {
    donnees = JSON.parse(reponse.getContentText());
  } catch (_) {
    return null;
  }

  const emetteurValide =
    donnees.iss === 'https://accounts.google.com' ||
    donnees.iss === 'accounts.google.com';
  const audienceValide = donnees.aud === CONTROLE_PARTICIPATION.CLIENT_ID;
  const emailVerifie =
    donnees.email_verified === true || donnees.email_verified === 'true';
  const expiration = Number(donnees.exp || 0);

  if (!emetteurValide || !audienceValide || !emailVerifie || !donnees.sub) {
    return null;
  }
  if (!expiration || expiration * 1000 <= Date.now()) return null;

  const identiteCache = {
    sub: String(donnees.sub),
    email: String(donnees.email || '').trim().toLowerCase(),
    exp: expiration,
  };
  const ttl = Math.max(
    30,
    Math.min(
      CONTROLE_PARTICIPATION.TOKEN_CACHE_SECONDS,
      Math.floor(expiration - Date.now() / 1000)
    )
  );
  cache.put(cleCache, JSON.stringify(identiteCache), ttl);

  return {
    sub: identiteCache.sub,
    email: identiteCache.email,
  };
}

function cleCacheJeton_(jeton) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(jeton),
    Utilities.Charset.UTF_8
  );
  return 'IDT_' + Utilities.base64EncodeWebSafe(digest).replace(/=+$/g, '').slice(0, 40);
}

function estCompteTestExempte_(identite) {
  return Boolean(
    identite &&
    identite.email &&
    identite.email === String(CONTROLE_PARTICIPATION.TEST_EXEMPT_EMAIL || '').trim().toLowerCase()
  );
}

function creerEmpreinteCompte_(sub) {
  const sel = PropertiesService.getScriptProperties().getProperty('PARTICIPATION_HASH_SALT');
  if (!sel) throw new Error('CONFIGURATION_MISSING');

  const octets = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    sel + ':' + sub,
    Utilities.Charset.UTF_8
  );
  return Utilities.base64EncodeWebSafe(octets).replace(/=+$/g, '');
}

function obtenirFormulaire_() {
  // Accès direct : évite d'ouvrir le Google Sheet uniquement pour retrouver l'URL du Form.
  return FormApp.openById(CONTROLE_PARTICIPATION.FORM_ID);
}

function obtenirQuestionReferenceTechnique_(formulaire, creerSiAbsente) {
  const questions = formulaire.getItems(FormApp.ItemType.TEXT);
  let question = null;
  for (let i = 0; i < questions.length; i += 1) {
    if (questions[i].getTitle() === CONTROLE_PARTICIPATION.SUBMISSION_ID_TITLE) {
      question = questions[i].asTextItem();
      break;
    }
  }

  if (!question && creerSiAbsente) {
    question = formulaire.addTextItem().setTitle(CONTROLE_PARTICIPATION.SUBMISSION_ID_TITLE);
  }
  if (!question) return null;

  if (creerSiAbsente) {
    const validation = FormApp.createTextValidation()
      .requireTextMatchesPattern('^site:[A-Za-z0-9_-]{16,128}:[A-Za-z0-9_-]{43}$')
      .setHelpText('يُملأ هذا الحقل تلقائيًا عبر موقع الاستبيان الرسمي.')
      .build();
    question
      .setHelpText('يُقبل إرسال الإجابات عبر موقع الاستبيان الرسمي فقط.')
      .setRequired(true)
      .setValidation(validation);
  }
  return question;
}

function trouverReponseConfirmee_(formulaire, questionReference, submissionId, depuisReservation) {
  const marge = 60 * 1000;
  const depuis =
    depuisReservation instanceof Date
      ? new Date(Math.max(0, depuisReservation.getTime() - marge))
      : new Date(Date.now() - CONTROLE_PARTICIPATION.CONFIRMATION_WINDOW_MS);

  const reponses = formulaire.getResponses(depuis);
  for (let i = reponses.length - 1; i >= 0; i -= 1) {
    const reponseQuestion = reponses[i].getResponseForItem(questionReference);
    const reference = reponseQuestion && String(reponseQuestion.getResponse() || '');
    if (
      reference === submissionId ||
      extraireSubmissionIdReferenceSignee_(reference) === submissionId
    ) {
      return reponses[i];
    }
  }
  return null;
}

function creerReferenceTechniqueSignee_(submissionId) {
  const secret = PropertiesService.getScriptProperties().getProperty(
    CONTROLE_PARTICIPATION.PROVENANCE_SECRET_PROPERTY
  );
  if (!secret) throw new Error('CONFIGURATION_MISSING');
  const signature = Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(
      String(submissionId),
      secret,
      Utilities.Charset.UTF_8
    )
  ).replace(/=+$/g, '');
  return 'site:' + submissionId + ':' + signature;
}

function extraireSubmissionIdReferenceSignee_(reference) {
  const resultat = String(reference || '').match(
    /^site:([A-Za-z0-9_-]{16,128}):([A-Za-z0-9_-]{43})$/
  );
  if (!resultat) return '';
  const submissionId = resultat[1];
  return creerReferenceTechniqueSignee_(submissionId) === reference ? submissionId : '';
}

function installerDeclencheurProvenance_(formulaire) {
  const existe = ScriptApp.getProjectTriggers().some(function (declencheur) {
    return (
      declencheur.getHandlerFunction() ===
      CONTROLE_PARTICIPATION.PROVENANCE_TRIGGER_HANDLER
    );
  });
  if (!existe) {
    ScriptApp.newTrigger(CONTROLE_PARTICIPATION.PROVENANCE_TRIGGER_HANDLER)
      .forForm(formulaire)
      .onFormSubmit()
      .create();
  }
}

/**
 * Supprime toute réponse envoyée directement au Google Form sans preuve
 * cryptographique émise par le backend du site.
 */
function rejeterSoumissionDirecteNonAutorisee(e) {
  const reponse = e && e.response;
  if (!reponse) return;

  const formulaire = obtenirFormulaire_();
  const questionReference = obtenirQuestionReferenceTechnique_(formulaire, false);
  const reponseReference =
    questionReference && reponse.getResponseForItem(questionReference);
  const reference = String(
    (reponseReference && reponseReference.getResponse()) || ''
  );

  if (extraireSubmissionIdReferenceSignee_(reference)) return;

  const responseId = String(reponse.getId() || '');
  if (responseId) formulaire.deleteResponse(responseId);
  supprimerLigneReponseDirecte_(reponse.getTimestamp(), reference);
  console.log('SOUMISSION_DIRECTE_REJETEE: ' + responseId);
}

function supprimerLigneReponseDirecte_(horodatage, reference) {
  const classeur = SpreadsheetApp.openById(CONTROLE_PARTICIPATION.SPREADSHEET_ID);
  const feuille = classeur.getSheetByName(CONTROLE_PARTICIPATION.RESPONSE_SHEET_NAME);
  if (!feuille || !(horodatage instanceof Date)) return;

  for (let tentative = 0; tentative < 6; tentative += 1) {
    SpreadsheetApp.flush();
    const derniereLigne = feuille.getLastRow();
    const derniereColonne = feuille.getLastColumn();
    if (derniereLigne >= 2 && derniereColonne >= 1) {
      const valeurs = feuille
        .getRange(2, 1, derniereLigne - 1, derniereColonne)
        .getValues();
      const entetes = feuille.getRange(1, 1, 1, derniereColonne).getDisplayValues()[0];
      const colonneReference = entetes.indexOf(CONTROLE_PARTICIPATION.SUBMISSION_ID_TITLE);
      const lignes = [];
      valeurs.forEach(function (ligne, index) {
        const date = ligne[0];
        const memeHorodatage =
          date instanceof Date && Math.abs(date.getTime() - horodatage.getTime()) < 1000;
        const memeReference =
          colonneReference < 0 || String(ligne[colonneReference] || '') === reference;
        if (memeHorodatage && memeReference) lignes.push(index + 2);
      });
      if (lignes.length === 1) {
        feuille.deleteRow(lignes[0]);
        SpreadsheetApp.flush();
        return;
      }
    }
    Utilities.sleep(500);
  }
  console.error('LIGNE_SOUMISSION_DIRECTE_INTROUVABLE');
}

function obtenirFeuilleControle_(mettreAJourEntetes) {
  const classeur = SpreadsheetApp.openById(CONTROLE_PARTICIPATION.SPREADSHEET_ID);
  let feuille = classeur.getSheetByName(CONTROLE_PARTICIPATION.SHEET_NAME);
  let feuilleCreee = false;

  if (!feuille) {
    feuille = classeur.insertSheet(CONTROLE_PARTICIPATION.SHEET_NAME);
    feuille.setFrozenRows(1);
    feuilleCreee = true;
  }

  if (feuilleCreee || mettreAJourEntetes) {
    feuille.getRange(1, 1, 1, 4).setValues([[
      'Empreinte anonyme du compte',
      'Date de participation',
      "Identifiant technique de l'envoi",
      'Identifiant de la réponse Google Forms',
    ]]);
  }

  if (!feuille.isSheetHidden()) feuille.hideSheet();
  return feuille;
}

function protegerFeuilleControle_(feuille) {
  const protections = feuille.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  if (protections.length) return;

  const protection = feuille.protect().setDescription('Contrôle automatique des participations');
  protection.setWarningOnly(true);
}

function lireParticipation_(feuille, empreinte) {
  const derniereLigne = feuille.getLastRow();
  if (derniereLigne < 2) return null;

  const cellule = feuille
    .getRange(2, 1, derniereLigne - 1, 1)
    .createTextFinder(String(empreinte))
    .matchEntireCell(true)
    .findNext();
  if (!cellule) return null;

  const valeurs = feuille.getRange(cellule.getRow(), 1, 1, 4).getValues()[0];
  return {
    row: cellule.getRow(),
    date: valeurs[1] instanceof Date ? valeurs[1] : null,
    submissionId: String(valeurs[2] || ''),
    responseId: String(valeurs[3] || ''),
  };
}

function lireSoumissionParId_(feuille, submissionId) {
  const derniereLigne = feuille.getLastRow();
  if (derniereLigne < 2) return null;

  const cellule = feuille
    .getRange(2, 3, derniereLigne - 1, 1)
    .createTextFinder(String(submissionId))
    .matchEntireCell(true)
    .findNext();
  if (!cellule) return null;

  const valeurs = feuille.getRange(cellule.getRow(), 1, 1, 4).getValues()[0];
  return {
    row: cellule.getRow(),
    empreinte: String(valeurs[0] || ''),
    date: valeurs[1] instanceof Date ? valeurs[1] : null,
    submissionId: String(valeurs[2] || ''),
    responseId: String(valeurs[3] || ''),
  };
}

function reserverSoumission_(feuille, empreinte, submissionId) {
  const ligne = Math.max(2, feuille.getLastRow() + 1);
  feuille.getRange(ligne, 1, 1, 4).setValues([[
    String(empreinte),
    new Date(),
    String(submissionId),
    CONTROLE_PARTICIPATION.PENDING_MARKER,
  ]]);
  return ligne;
}

function finaliserReservation_(feuille, ligne, responseId) {
  if (!ligne) throw new Error('CONFIGURATION_MISSING');
  feuille.getRange(ligne, 4).setValue(String(responseId || 'FORM_OK'));
}

function supprimerReservationSiPending_(feuille, ligne, submissionId) {
  if (!ligne || ligne < 2 || ligne > feuille.getLastRow()) return;
  const valeurs = feuille.getRange(ligne, 3, 1, 2).getDisplayValues()[0];
  if (
    String(valeurs[0] || '') === String(submissionId) &&
    String(valeurs[1] || '') === CONTROLE_PARTICIPATION.PENDING_MARKER
  ) {
    feuille.deleteRow(ligne);
  }
}

function resultatRefus_(raison) {
  return { ok: true, allowed: false, exempt: false, reason: raison };
}


/* =====================================================================
 * PRÉPARATION UNIQUE — ENVOI NATIF GOOGLE FORMS
 * Exécuter UNE SEULE FOIS : PREPARER_CODE_UNIQUE_ENVOI_NATIF_20260815()
 * Puis redéployer l'application Web sur le déploiement existant.
 * ===================================================================== */

const FORM_NATIF_20260815 = Object.freeze({
  SUBMISSION_ENTRY_ID_ATTENDU: '1955032181',
  LIKERT: [
    '1 — لا أوافق إطلاقًا',
    '2 — لا أوافق',
    '3 — لا أوافق ولا أعارض',
    '4 — أوافق',
    '5 — أوافق تمامًا',
  ],
  COMMUNICATION: {
    title: 'الاستفسارات وطلب التوضيحات',
    row: 'تتيح القنوات الرسمية للمواطنين توجيه استفساراتهم وطلب توضيحات من الوزارة بشأن البرنامج.',
  },
  OBSERVATIONS: {
    title: 'الملاحظات والمقترحات',
    row: 'تتيح القنوات الرسمية للمواطنين تقديم ملاحظاتهم ومقترحاتهم بشأن البرنامج.',
  },
  COMPLAINTS: {
    title: 'الشكايات المتعلقة بالبرنامج',
    row: 'تتيح القنوات الرسمية للمواطنين تقديم الشكايات المرتبطة بالبرنامج.',
  },
  RESPONSE_TITLE: 'حول الرد الذي توصلتم به',

  // Deux parcours officiels réellement concernés par les perceptions
  // Communication / Participation lorsque contact_reel = لا.
  ROUTES_OFFICIELLES: [
    {
      communicationId: 984260886,
      observationsId: 1489177863,
      complaintsId: 65348748,
      responseId: 338617431,
    },
    {
      communicationId: 547508310,
      observationsId: 1017244650,
      complaintsId: 1579501699,
      responseId: 1916460429,
    },
  ],
  AUTRES_GRILLES_REPONSE: [191957779, 1132848145],
});

/**
 * FONCTION UNIQUE À EXÉCUTER MANUELLEMENT UNE FOIS.
 *
 * Elle :
 * - conserve la limite native Google Forms désactivée ;
 * - conserve l'exception de test nachchatmahmoud@gmail.com ;
 * - prépare la feuille technique et les secrets si nécessaire ;
 * - aligne uniquement les grilles d'interactivité sur le site actuel ;
 * - actualise la correspondance entryId -> items du Form ;
 * - installe/maintient le contrôle de provenance ;
 * - vérifie que l'identifiant technique attendu par le site est inchangé.
 *
 * Elle NE réinstalle PAS l'ancienne structure du questionnaire.
 */
function PREPARER_CODE_UNIQUE_ENVOI_NATIF_20260815() {
  const proprietes = PropertiesService.getScriptProperties();

  if (!proprietes.getProperty('PARTICIPATION_HASH_SALT')) {
    proprietes.setProperty(
      'PARTICIPATION_HASH_SALT',
      Utilities.getUuid() + Utilities.getUuid()
    );
  }

  if (!proprietes.getProperty(CONTROLE_PARTICIPATION.PROVENANCE_SECRET_PROPERTY)) {
    proprietes.setProperty(
      CONTROLE_PARTICIPATION.PROVENANCE_SECRET_PROPERTY,
      Utilities.getUuid() + Utilities.getUuid()
    );
  }

  const feuilleControle = obtenirFeuilleControle_(true);
  protegerFeuilleControle_(feuilleControle);

  const formulaire = obtenirFormulaire_();
  const questionReference = obtenirQuestionReferenceTechnique_(formulaire, true);

  // Règle personnalisée conservée :
  // la limite native reste OFF afin de garder l'exception du compte de test.
  formulaire.setLimitOneResponsePerUser(false);
  formulaire.setShowLinkToRespondAgain(false);

  FORM_NATIF_20260815.ROUTES_OFFICIELLES.forEach(function(route) {
    configurerGrilleInteractionNative20260815_(
      formulaire,
      route.communicationId,
      FORM_NATIF_20260815.COMMUNICATION.title,
      [FORM_NATIF_20260815.COMMUNICATION.row]
    );

    configurerGrilleInteractionNative20260815_(
      formulaire,
      route.observationsId,
      FORM_NATIF_20260815.OBSERVATIONS.title,
      [FORM_NATIF_20260815.OBSERVATIONS.row]
    );

    configurerGrilleInteractionNative20260815_(
      formulaire,
      route.complaintsId,
      FORM_NATIF_20260815.COMPLAINTS.title,
      [FORM_NATIF_20260815.COMPLAINTS.row]
    );

    imposerTitreGrille20260815_(
      formulaire,
      route.responseId,
      FORM_NATIF_20260815.RESPONSE_TITLE
    );
  });

  FORM_NATIF_20260815.AUTRES_GRILLES_REPONSE.forEach(function(itemId) {
    imposerTitreGrille20260815_(
      formulaire,
      itemId,
      FORM_NATIF_20260815.RESPONSE_TITLE
    );
  });

  // IMPORTANT : après modification des lignes des grilles, les entryId
  // doivent être recalculés avant toute nouvelle réponse.
  const correspondance = actualiserCorrespondanceFormulaire_(formulaire);

  const submissionEntryId =
    obtenirEntryIdQuestion_(correspondance, questionReference);

  if (
    String(submissionEntryId) !==
    String(FORM_NATIF_20260815.SUBMISSION_ENTRY_ID_ATTENDU)
  ) {
    throw new Error(
      'CONFIGURATION_MISSING: entryId technique inattendu = ' +
      submissionEntryId +
      ', attendu = ' +
      FORM_NATIF_20260815.SUBMISSION_ENTRY_ID_ATTENDU
    );
  }

  installerDeclencheurProvenance_(formulaire);
  SpreadsheetApp.flush();

  verifierConfigurationNative20260815_(formulaire);

  console.log('CODE_UNIQUE_PREPARE: oui');
  console.log('ENVOI_NATIF_GOOGLE_FORM: oui');
  console.log('LIMITE_NATIVE_UNE_REPONSE: ' + formulaire.hasLimitOneResponsePerUser());
  console.log('EXCEPTION_TEST: ' + CONTROLE_PARTICIPATION.TEST_EXEMPT_EMAIL);
  console.log('QUESTION_REFERENCE_ENTRY_ID: ' + submissionEntryId);
  console.log('COMMUNICATION_BIDIRECTIONNELLE: 1 item');
  console.log('POSSIBILITE_PARTICIPATION: 2 items techniques distincts');
  console.log('SITE_PARTICIPATION_FUSIONNE_VISUELLEMENT: oui');
  console.log('FORM_PRET_POUR_REDEPLOIEMENT: oui');
}

function configurerGrilleInteractionNative20260815_(formulaire, itemId, titre, lignes) {
  const item = formulaire.getItemById(Number(itemId));
  if (!item || item.getType() !== FormApp.ItemType.GRID) {
    throw new Error('CONFIGURATION_MISSING: grille ' + itemId);
  }

  const grille = item.asGridItem();

  grille
    .setTitle(titre)
    .setRows(lignes)
    .setColumns(FORM_NATIF_20260815.LIKERT);
}

function imposerTitreGrille20260815_(formulaire, itemId, titre) {
  const item = formulaire.getItemById(Number(itemId));
  if (!item || item.getType() !== FormApp.ItemType.GRID) {
    throw new Error('CONFIGURATION_MISSING: grille réponse ' + itemId);
  }
  item.asGridItem().setTitle(titre);
}

function verifierConfigurationNative20260815_(formulaire) {
  const erreurs = [];

  FORM_NATIF_20260815.ROUTES_OFFICIELLES.forEach(function(route, index) {
    verifierGrille20260815_(
      formulaire,
      route.communicationId,
      FORM_NATIF_20260815.COMMUNICATION.title,
      [FORM_NATIF_20260815.COMMUNICATION.row],
      'route ' + (index + 1) + ' / communication',
      erreurs
    );

    verifierGrille20260815_(
      formulaire,
      route.observationsId,
      FORM_NATIF_20260815.OBSERVATIONS.title,
      [FORM_NATIF_20260815.OBSERVATIONS.row],
      'route ' + (index + 1) + ' / observations',
      erreurs
    );

    verifierGrille20260815_(
      formulaire,
      route.complaintsId,
      FORM_NATIF_20260815.COMPLAINTS.title,
      [FORM_NATIF_20260815.COMPLAINTS.row],
      'route ' + (index + 1) + ' / réclamations',
      erreurs
    );
  });

  if (formulaire.hasLimitOneResponsePerUser()) {
    erreurs.push('la limite native Google Forms doit rester désactivée');
  }

  if (erreurs.length) {
    throw new Error('CONFIGURATION_MISSING: ' + erreurs.join(' | '));
  }

  return true;
}

function verifierGrille20260815_(
  formulaire,
  itemId,
  titreAttendu,
  lignesAttendues,
  libelle,
  erreurs
) {
  const item = formulaire.getItemById(Number(itemId));

  if (!item || item.getType() !== FormApp.ItemType.GRID) {
    erreurs.push(libelle + ': grille introuvable');
    return;
  }

  const grille = item.asGridItem();

  if (String(grille.getTitle()) !== String(titreAttendu)) {
    erreurs.push(libelle + ': titre incorrect');
  }

  if (
    JSON.stringify(grille.getRows()) !==
    JSON.stringify(lignesAttendues)
  ) {
    erreurs.push(libelle + ': lignes incorrectes');
  }

  if (
    JSON.stringify(grille.getColumns()) !==
    JSON.stringify(FORM_NATIF_20260815.LIKERT)
  ) {
    erreurs.push(libelle + ': échelle Likert incorrecte');
  }
}


/** V30.2 : contrôle local des références, sans lecture Google supplémentaire. */
function descripteurExisteV302_(descripteur, bundleItems) {
  const id = String(descripteur && typeof descripteur === 'object' ? descripteur.itemId || '' : descripteur || '');
  return !!(id && bundleItems && bundleItems.parId && bundleItems.parId[id]);
}

/** Répare uniquement le champ technique et les caches. N'envoie aucune réponse. */
function REPARER_ENVOI_20261028() {
  const formulaire = obtenirFormulaire_();
  const techniques = formulaire.getItems(FormApp.ItemType.TEXT).filter(function (item) {
    return item.getTitle() === CONTROLE_PARTICIPATION.SUBMISSION_ID_TITLE;
  });
  if (techniques.length > 1) throw new Error('CONFIGURATION_MISSING:references_multiples');
  const reference = obtenirQuestionReferenceTechnique_(formulaire, true);
  const bundle = chargerItemsFormulaireV30_(formulaire);
  const correspondance = obtenirCorrespondanceFormulaire_(formulaire, bundle);
  const plan = obtenirPlanRapideV23_(formulaire, correspondance, bundle).plan;
  if (String(reference.getId()) !== String(plan.technicalItemId)) throw new Error('REFERENCE_NON_REPAREE');
  const canaux = bundle.items.filter(function (item) {
    return item.getType() === FormApp.ItemType.MULTIPLE_CHOICE &&
      item.getTitle() === 'من خلال أي قناة تم آخر تواصل لكم بشأن البرنامج؟';
  });
  if (!canaux.length) throw new Error('CANAUX_ABSENTS');
  canaux.forEach(function (item) {
    const question = item.asMultipleChoiceItem();
    [
      'الهاتف / مركز الاتصال الرسمي → عبر الرقم: \u200E+212 5 37 71 81 81',
      'البريد الإلكتروني الرسمي → contact@daamsakane.ma',
      'الموقع الرسمي للوزارة → عبر خدمة التواصل'
    ].forEach(function (valeur) { creerReponseChoixUniqueCompatibleV26_(question, valeur); });
  });
  console.log('REPARATION_OK:reference=' + reference.getId() + ';correspondances=' + Object.keys(correspondance).length + ';canaux=' + canaux.length + ';aucune_reponse_envoyee');
}
