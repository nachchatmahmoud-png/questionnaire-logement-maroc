/**
 * Contrôle « un compte Google = une participation ».
 *
 * Installation :
 * 1. Coller ce fichier dans le projet Apps Script associé au questionnaire.
 * 2. Exécuter installerControleParticipationGoogle() une seule fois.
 * 3. Déployer comme application Web : exécuter en tant que propriétaire,
 *    accès autorisé à « Tout le monde ».
 * 4. Reporter l'URL /exec dans AUTH_BRIDGE_URL du site.
 *
 * Le code secret OAuth n'est jamais utilisé. L'adresse du propriétaire est
 * conservée dans les propriétés privées du script uniquement pour les tests.
 */

const CONTROLE_PARTICIPATION = Object.freeze({
  CLIENT_ID: '285878510024-7dhdojiucp6ff20m2snuro018t70c6s5.apps.googleusercontent.com',
  SPREADSHEET_ID: '1VcNjC6_eF-9GiKALC7lVvgE1q_F3RM6CJUcs4RKyt-Q',
  SHEET_NAME: 'Contrôle participations',
  SITE_ORIGIN: 'https://nachchatmahmoud-png.github.io',
  CHANNEL: 'questionnaire-logement-auth-v1',
  TOKENINFO_URL: 'https://oauth2.googleapis.com/tokeninfo?id_token=',
});

/**
 * À exécuter manuellement une seule fois par le propriétaire du projet.
 * Crée la feuille technique, un sel privé et l'exception de test privée.
 */
function installerControleParticipationGoogle() {
  const proprietes = PropertiesService.getScriptProperties();
  const adresseProprietaire = String(Session.getEffectiveUser().getEmail() || '')
    .trim()
    .toLowerCase();

  if (!adresseProprietaire) {
    throw new Error("Impossible d'identifier le propriétaire. Exécutez cette fonction depuis votre propre compte Google.");
  }

  if (!proprietes.getProperty('PARTICIPATION_HASH_SALT')) {
    proprietes.setProperty(
      'PARTICIPATION_HASH_SALT',
      Utilities.getUuid() + Utilities.getUuid()
    );
  }

  // Cette adresse reste privée dans Apps Script et n'est jamais publiée sur GitHub.
  proprietes.setProperty('PARTICIPATION_TEST_EMAIL', adresseProprietaire);

  const feuille = obtenirFeuilleControle_();
  protegerFeuilleControle_(feuille);

  console.log('CONTROLE_PARTICIPATION_INSTALLE: oui');
  console.log('COMPTE_TEST_CONFIGURE: oui');
  console.log('NOM_FEUILLE_TECHNIQUE: ' + CONTROLE_PARTICIPATION.SHEET_NAME);
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
 * Appelée uniquement par la page intermédiaire Apps Script.
 * action=check : vérifie si le compte peut participer.
 * action=claim : réserve définitivement la participation avant l'envoi du formulaire.
 */
function verifierParticipationGoogle(requete) {
  try {
    const action = String((requete && requete.action) || '');
    const jeton = String((requete && requete.idToken) || '');

    if (action !== 'check' && action !== 'claim') {
      return resultatRefus_('invalid_action');
    }

    const identite = verifierJetonGoogle_(jeton);
    if (!identite) {
      return resultatRefus_('reauthentication_required');
    }
    const proprietes = PropertiesService.getScriptProperties();
    const adresseTest = String(proprietes.getProperty('PARTICIPATION_TEST_EMAIL') || '')
      .trim()
      .toLowerCase();
    const estCompteTest = Boolean(adresseTest) && identite.email === adresseTest;

    if (estCompteTest) {
      return { ok: true, allowed: true, exempt: true, reason: 'test_account' };
    }

    const empreinte = creerEmpreinteCompte_(identite.sub);

    if (action === 'check') {
      const dejaUtilise = participationExiste_(obtenirFeuilleControle_(), empreinte);
      return {
        ok: true,
        allowed: !dejaUtilise,
        exempt: false,
        reason: dejaUtilise ? 'already_submitted' : 'eligible',
      };
    }

    const verrou = LockService.getScriptLock();
    verrou.waitLock(20000);
    try {
      const feuille = obtenirFeuilleControle_();
      if (participationExiste_(feuille, empreinte)) {
        return resultatRefus_('already_submitted');
      }

      feuille.appendRow([empreinte, new Date()]);
      SpreadsheetApp.flush();
      return { ok: true, allowed: true, exempt: false, reason: 'claimed' };
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

  return {
    sub: String(donnees.sub),
    email: String(donnees.email || '').trim().toLowerCase(),
  };
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

function obtenirFeuilleControle_() {
  const classeur = SpreadsheetApp.openById(CONTROLE_PARTICIPATION.SPREADSHEET_ID);
  let feuille = classeur.getSheetByName(CONTROLE_PARTICIPATION.SHEET_NAME);

  if (!feuille) {
    feuille = classeur.insertSheet(CONTROLE_PARTICIPATION.SHEET_NAME);
    feuille.getRange(1, 1, 1, 2).setValues([
      ['Empreinte anonyme du compte', 'Date de participation'],
    ]);
    feuille.setFrozenRows(1);
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

function participationExiste_(feuille, empreinte) {
  const derniereLigne = feuille.getLastRow();
  if (derniereLigne < 2) return false;

  return Boolean(
    feuille
      .getRange(2, 1, derniereLigne - 1, 1)
      .createTextFinder(empreinte)
      .matchEntireCell(true)
      .findNext()
  );
}

function resultatRefus_(raison) {
  return { ok: true, allowed: false, exempt: false, reason: raison };
}
