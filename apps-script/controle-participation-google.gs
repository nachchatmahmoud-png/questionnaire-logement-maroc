/**
 * Contrôle « un compte Google = une participation » et confirmation d'envoi.
 *
 * Installation :
 * 1. Coller ce fichier dans le projet Apps Script associé au questionnaire.
 * 2. Exécuter installerControleParticipationGoogle() une seule fois.
 * 3. Redéployer l'application Web : exécuter en tant que propriétaire,
 *    accès autorisé à « Tout le monde ».
 * 4. Reporter l'URL /exec dans AUTH_BRIDGE_URL du site si elle a changé.
 *
 * L'adresse Google n'est jamais enregistrée. Seule une empreinte salée et
 * irréversible du compte est conservée dans la feuille technique masquée.
 */

const CONTROLE_PARTICIPATION = Object.freeze({
  CLIENT_ID: '285878510024-7dhdojiucp6ff20m2snuro018t70c6s5.apps.googleusercontent.com',
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
  QUESTIONNAIRE_UPDATE_PROPERTY: 'QUESTIONNAIRE_UPDATE_20260812_V2',
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
  NO_OFFICIAL_REASON_TITLE: 'س2-ب. ما السبب الرئيسي لعدم اطلاعكم على معلومات حول البرنامج عبر القنوات الرسمية للوزارة أو للبرنامج؟',
  NO_OFFICIAL_REASON_HELP: 'يرجى اختيار جواب واحد فقط.',
  NO_OFFICIAL_REASON_LEGACY_TITLES: ['ما السبب الرئيسي لعدم اطلاعكم على معلومات حول البرنامج عبر وسائل التواصل الرسمية للوزارة؟'],
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
 * À exécuter manuellement une seule fois par le propriétaire du projet.
 * Crée la feuille technique, le sel privé et la question de confirmation,
 * puis active la limite native d'une réponse par compte Google.
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
  formulaire.setLimitOneResponsePerUser(true);
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
function verifierParticipationGoogle(requete) {
  try {
    const action = String((requete && requete.action) || '');
    const jeton = String((requete && requete.idToken) || '');

    if (action !== 'check' && action !== 'confirm' && action !== 'submit') {
      return resultatRefus_('invalid_action');
    }

    const identite = verifierJetonGoogle_(jeton);
    if (!identite) {
      return resultatRefus_('reauthentication_required');
    }

    const formulaire = obtenirFormulaire_();
    garantirMiseAJourQuestionnaire_(formulaire, true);
    const questionReference = obtenirQuestionReferenceTechnique_(formulaire, false);
    if (!questionReference || !formulaire.hasLimitOneResponsePerUser()) {
      return resultatRefus_('configuration_error');
    }

    const empreinte = creerEmpreinteCompte_(identite.sub);
    const feuille = obtenirFeuilleControle_();
    const participation = lireParticipation_(feuille, empreinte);
    const correspondance = obtenirCorrespondanceFormulaire_(formulaire);
    const submissionEntryId = obtenirEntryIdQuestion_(correspondance, questionReference);

    if (action === 'check') {
      return {
        ok: true,
        allowed: !participation,
        exempt: false,
        reason: participation ? 'already_submitted' : 'eligible',
        submissionEntryId: submissionEntryId,
      };
    }

    const submissionId = String((requete && requete.submissionId) || '');
    if (!/^[A-Za-z0-9_-]{16,128}$/.test(submissionId)) {
      return resultatRefus_('invalid_submission_id');
    }

    const verrou = LockService.getScriptLock();
    verrou.waitLock(20000);
    try {
      const participationVerrouillee = lireParticipation_(feuille, empreinte);
      if (participationVerrouillee) {
        if (participationVerrouillee.submissionId === submissionId) {
          return {
            ok: true,
            allowed: true,
            exempt: false,
            reason: 'already_confirmed',
          };
        }
        return resultatRefus_('already_submitted');
      }

      let reponse = trouverReponseConfirmee_(formulaire, questionReference, submissionId);
      if (!reponse && action === 'submit') {
        const charge = parserChargeReponses_(String((requete && requete.payload) || ''));
        const supplementaires = parserReponsesSupplementaires_(
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
        reponse = creerReponseDepuisCharge_(
          formulaire,
          questionReference,
          submissionId,
          charge,
          supplementaires
        );
      }
      if (!reponse) return resultatRefus_('submission_not_found');

      feuille.appendRow([empreinte, new Date(), submissionId, String(reponse.getId() || '')]);
      SpreadsheetApp.flush();
      return {
        ok: true,
        allowed: true,
        exempt: false,
        reason: action === 'submit' ? 'submitted' : 'confirmed',
      };
    } finally {
      verrou.releaseLock();
    }
  } catch (erreur) {
    console.error(erreur && erreur.stack ? erreur.stack : erreur);
    const message = String((erreur && erreur.message) || '');
    if (message.indexOf('TOKEN_SERVICE_UNAVAILABLE') !== -1) return resultatRefus_('token_service_unavailable');
    if (message.indexOf('CONFIGURATION_MISSING') !== -1) return resultatRefus_('configuration_error');
    if (message.indexOf('INVALID_ANSWERS') !== -1) return resultatRefus_('invalid_answers');
    return resultatRefus_('server_error');
  }
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
  if (!Object.keys(resultat).length) throw new Error('INVALID_ANSWERS');
  return resultat;
}

function creerReponseDepuisCharge_(formulaire, questionReference, submissionId, charge, supplementaires) {
  const reponse = formulaire.createResponse();
  const items = formulaire.getItems();
  const itemsParId = {};
  const reponsesGroupees = {};
  items.forEach(function (item) {
    itemsParId[String(item.getId())] = item;
  });

  const correspondance = obtenirCorrespondanceFormulaire_(formulaire);
  const chargeComplete = Object.assign({}, charge);
  delete chargeComplete[String(questionReference.getId())];
  chargeComplete[obtenirEntryIdQuestion_(correspondance, questionReference)] =
    creerReferenceTechniqueSignee_(submissionId);

  Object.keys(chargeComplete).forEach(function (entryId) {
    const descripteurBrut = correspondance[entryId];
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
      reponseItem = item.asMultipleChoiceItem().createResponse(String(valeur));
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

  ajouterReponsesSupplementaires_(reponse, formulaire, supplementaires || {});

  return reponse.submit();
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

    questions.no_official_reason = trouverQuestionUniqueParTitre_(
      formulaire,
      FormApp.ItemType.MULTIPLE_CHOICE,
      MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_TITLE
    );
    if (!questions.no_official_reason) {
      const anciennesQ2b = formulaire.getItems(FormApp.ItemType.MULTIPLE_CHOICE).filter(function (item) {
        return MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_LEGACY_TITLES.indexOf(item.getTitle()) !== -1;
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
  if (type === FormApp.ItemType.MULTIPLE_CHOICE) return trouvees[0].asMultipleChoiceItem();
  if (type === FormApp.ItemType.GRID) return trouvees[0].asGridItem();
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

function ajouterReponsesSupplementaires_(reponse, formulaire, donnees) {
  if (!Object.keys(donnees).length) return;
  const preference = String(donnees.preferred_public_channel || '');
  const raison = String(donnees.no_official_reason || '');
  const confiance = String(donnees.trust_general_common || '');
  const detailOfficiel = String(donnees.official_source_other_detail || '');
  const detailExterne = String(donnees.external_source_other_detail || '');
  const detailContact = String(donnees.contact_channel_other_detail || '');
  if (preference && (raison || confiance || detailOfficiel || detailExterne || detailContact)) {
    throw new Error('INVALID_ANSWERS');
  }
  if (raison && !confiance) throw new Error('INVALID_ANSWERS');
  if (!preference && !confiance) throw new Error('INVALID_ANSWERS');
  if (detailOfficiel && raison) throw new Error('INVALID_ANSWERS');
  if (detailExterne && !raison) throw new Error('INVALID_ANSWERS');

  const questions = {
    preferred_public_channel: trouverQuestionUniqueParTitre_(
      formulaire,
      FormApp.ItemType.MULTIPLE_CHOICE,
      MISE_A_JOUR_QUESTIONNAIRE.PREFERRED_CHANNEL_TITLE
    ),
    no_official_reason: trouverQuestionUniqueParTitre_(
      formulaire,
      FormApp.ItemType.MULTIPLE_CHOICE,
      MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_TITLE
    ),
    trust_general_common: trouverQuestionUniqueParTitre_(
      formulaire,
      FormApp.ItemType.GRID,
      MISE_A_JOUR_QUESTIONNAIRE.TRUST_COMMON_TITLE
    ),
    official_source_other_detail: trouverQuestionUniqueParTitre_(
      formulaire,
      FormApp.ItemType.TEXT,
      MISE_A_JOUR_QUESTIONNAIRE.OFFICIAL_SOURCE_OTHER_DETAIL_TITLE
    ),
    external_source_other_detail: trouverQuestionUniqueParTitre_(
      formulaire,
      FormApp.ItemType.TEXT,
      MISE_A_JOUR_QUESTIONNAIRE.EXTERNAL_SOURCE_OTHER_DETAIL_TITLE
    ),
    contact_channel_other_detail: trouverQuestionUniqueParTitre_(
      formulaire,
      FormApp.ItemType.TEXT,
      MISE_A_JOUR_QUESTIONNAIRE.CONTACT_CHANNEL_OTHER_DETAIL_TITLE
    ),
  };
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
  if (preference) {
    reponse.withItemResponse(
      questions.preferred_public_channel.createResponse(preference)
    );
  }
  if (raison) {
    reponse.withItemResponse(
      questions.no_official_reason.createResponse(raison)
    );
  }
  if (confiance) {
    if (MISE_A_JOUR_QUESTIONNAIRE.LIKERT_COLUMNS.indexOf(confiance) === -1) {
      throw new Error('INVALID_ANSWERS');
    }
    reponse.withItemResponse(
      questions.trust_general_common.createResponse([confiance])
    );
  }
  if (detailOfficiel) {
    reponse.withItemResponse(
      questions.official_source_other_detail.createResponse(detailOfficiel)
    );
  }
  if (detailExterne) {
    reponse.withItemResponse(
      questions.external_source_other_detail.createResponse(detailExterne)
    );
  }
  if (detailContact) {
    reponse.withItemResponse(
      questions.contact_channel_other_detail.createResponse(detailContact)
    );
  }
}

function obtenirCorrespondanceFormulaire_(formulaire) {
  const proprietes = PropertiesService.getScriptProperties();
  const memorisee = proprietes.getProperty(CONTROLE_PARTICIPATION.ENTRY_ITEM_MAP_PROPERTY);
  if (memorisee) {
    try {
      const correspondance = JSON.parse(memorisee);
      if (correspondance && typeof correspondance === 'object') return correspondance;
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
  formulaire.getItems().forEach(function (item) {
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

  PropertiesService.getScriptProperties().setProperty(
    CONTROLE_PARTICIPATION.ENTRY_ITEM_MAP_PROPERTY,
    JSON.stringify(correspondance)
  );
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
  const emailVerifie = donnees.email_verified === true || donnees.email_verified === 'true';
  const expiration = Number(donnees.exp || 0);

  if (!emetteurValide || !audienceValide || !emailVerifie || !donnees.sub) {
    return null;
  }
  if (!expiration || expiration * 1000 <= Date.now()) {
    return null;
  }

  return { sub: String(donnees.sub) };
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
  const classeur = SpreadsheetApp.openById(CONTROLE_PARTICIPATION.SPREADSHEET_ID);
  const feuilleReponses = classeur.getSheetByName(CONTROLE_PARTICIPATION.RESPONSE_SHEET_NAME);
  const formUrl = feuilleReponses && feuilleReponses.getFormUrl();
  if (!formUrl) throw new Error('CONFIGURATION_MISSING');
  return FormApp.openByUrl(formUrl);
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

function trouverReponseConfirmee_(formulaire, questionReference, submissionId) {
  const depuis = new Date(Date.now() - CONTROLE_PARTICIPATION.CONFIRMATION_WINDOW_MS);
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
    .createTextFinder(empreinte)
    .matchEntireCell(true)
    .findNext();
  if (!cellule) return null;

  const valeurs = feuille.getRange(cellule.getRow(), 1, 1, 4).getValues()[0];
  return {
    submissionId: String(valeurs[2] || ''),
    responseId: String(valeurs[3] || ''),
  };
}

function resultatRefus_(raison) {
  return { ok: true, allowed: false, exempt: false, reason: raison };
}
