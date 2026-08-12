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

  const feuille = obtenirFeuilleControle_(true);
  protegerFeuilleControle_(feuille);

  const formulaire = obtenirFormulaire_();
  const questionReference = obtenirQuestionReferenceTechnique_(formulaire, true);
  formulaire.setLimitOneResponsePerUser(true);
  formulaire.setShowLinkToRespondAgain(false);

  console.log('CONTROLE_PARTICIPATION_INSTALLE: oui');
  console.log('LIMITE_NATIVE_UNE_REPONSE: ' + formulaire.hasLimitOneResponsePerUser());
  console.log('QUESTION_REFERENCE_ENTRY_ID: ' + questionReference.getId());
  console.log('NOM_FEUILLE_TECHNIQUE: ' + CONTROLE_PARTICIPATION.SHEET_NAME);
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
 * action=confirm : confirme que Google Forms a réellement enregistré la réponse,
 *                  puis marque le compte comme ayant participé.
 */
function verifierParticipationGoogle(requete) {
  try {
    const action = String((requete && requete.action) || '');
    const jeton = String((requete && requete.idToken) || '');

    if (action !== 'check' && action !== 'confirm') {
      return resultatRefus_('invalid_action');
    }

    const identite = verifierJetonGoogle_(jeton);
    if (!identite) {
      return resultatRefus_('reauthentication_required');
    }

    const formulaire = obtenirFormulaire_();
    const questionReference = obtenirQuestionReferenceTechnique_(formulaire, false);
    if (!questionReference || !formulaire.hasLimitOneResponsePerUser()) {
      return resultatRefus_('configuration_error');
    }

    const empreinte = creerEmpreinteCompte_(identite.sub);
    const feuille = obtenirFeuilleControle_();
    const participation = lireParticipation_(feuille, empreinte);
    const submissionEntryId = String(questionReference.getId());

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

      const reponse = trouverReponseConfirmee_(formulaire, questionReference, submissionId);
      if (!reponse) {
        return resultatRefus_('submission_not_found');
      }

      feuille.appendRow([empreinte, new Date(), submissionId, String(reponse.getId() || '')]);
      SpreadsheetApp.flush();
      return { ok: true, allowed: true, exempt: false, reason: 'confirmed' };
    } finally {
      verrou.releaseLock();
    }
  } catch (erreur) {
    console.error(erreur && erreur.stack ? erreur.stack : erreur);
    const message = String((erreur && erreur.message) || '');
    if (message.indexOf('TOKEN_SERVICE_UNAVAILABLE') !== -1) return resultatRefus_('token_service_unavailable');
    if (message.indexOf('CONFIGURATION_MISSING') !== -1) return resultatRefus_('configuration_error');
    return resultatRefus_('server_error');
  }
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
  for (let i = 0; i < questions.length; i += 1) {
    if (questions[i].getTitle() === CONTROLE_PARTICIPATION.SUBMISSION_ID_TITLE) {
      return questions[i].asTextItem();
    }
  }

  if (!creerSiAbsente) return null;
  return formulaire
    .addTextItem()
    .setTitle(CONTROLE_PARTICIPATION.SUBMISSION_ID_TITLE)
    .setHelpText('حقل تقني يُملأ تلقائيًا من موقع الاستبيان للتحقق من تسجيل الإجابة.')
    .setRequired(false);
}

function trouverReponseConfirmee_(formulaire, questionReference, submissionId) {
  const depuis = new Date(Date.now() - CONTROLE_PARTICIPATION.CONFIRMATION_WINDOW_MS);
  const reponses = formulaire.getResponses(depuis);

  for (let i = reponses.length - 1; i >= 0; i -= 1) {
    const reponseQuestion = reponses[i].getResponseForItem(questionReference);
    if (reponseQuestion && String(reponseQuestion.getResponse() || '') === submissionId) {
      return reponses[i];
    }
  }
  return null;
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
