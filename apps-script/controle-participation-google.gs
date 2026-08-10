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

/**
 * Page intermédiaire invisible chargée dans un iframe par le site GitHub Pages.
 * Elle permet une communication sécurisée sans placer le jeton dans l'URL.
 */
function doGet() {
  const origine = JSON.stringify(CONTROLE_PARTICIPATION.SITE_ORIGIN);
  const canal = JSON.stringify(CONTROLE_PARTICIPATION.CHANNEL);
  const html = [
    '<!doctype html><html><head><base target="_top"><meta charset="utf-8"></head><body>',
    '<script>',
    '(function(){',
    'const SITE_ORIGIN=' + origine + ';',
    'const CHANNEL=' + canal + ';',
    'function repondre(cible,origine,id,resultat){',
    '  cible.postMessage({channel:CHANNEL,type:"response",requestId:id,result:resultat},origine);',
    '}',
    'window.addEventListener("message",function(event){',
    '  if(event.origin!==SITE_ORIGIN||event.source!==window.parent)return;',
    '  const message=event.data||{};',
    '  if(message.channel!==CHANNEL||message.type!=="request"||!message.requestId)return;',
    '  const cible=event.source, origine=event.origin, id=message.requestId;',
    '  google.script.run',
    '    .withSuccessHandler(function(resultat){repondre(cible,origine,id,resultat);})',
    '    .withFailureHandler(function(){repondre(cible,origine,id,{ok:false,allowed:false,reason:"server_error"});})',
    '    .verifierParticipationGoogle({idToken:message.idToken,action:message.action});',
    '});',
    'window.parent.postMessage({channel:CHANNEL,type:"ready"},SITE_ORIGIN);',
    '})();',
    '<\/script></body></html>',
  ].join('');

  return HtmlService.createHtmlOutput(html)
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
    if (message.indexOf('TOKEN_') === 0) {
      return resultatRefus_('reauthentication_required');
    }
    return resultatRefus_('server_error');
  }
}

function verifierJetonGoogle_(jeton) {
  if (!jeton || jeton.length > 6000) throw new Error('TOKEN_MISSING');

  const reponse = UrlFetchApp.fetch(
    CONTROLE_PARTICIPATION.TOKENINFO_URL + encodeURIComponent(jeton),
    { muteHttpExceptions: true, followRedirects: true }
  );

  if (reponse.getResponseCode() !== 200) throw new Error('TOKEN_INVALID');

  const donnees = JSON.parse(reponse.getContentText());
  const emetteurValide =
    donnees.iss === 'https://accounts.google.com' ||
    donnees.iss === 'accounts.google.com';
  const audienceValide = donnees.aud === CONTROLE_PARTICIPATION.CLIENT_ID;
  const emailVerifie = donnees.email_verified === true || donnees.email_verified === 'true';
  const expiration = Number(donnees.exp || 0);

  if (!emetteurValide || !audienceValide || !emailVerifie || !donnees.sub) {
    throw new Error('TOKEN_INVALID');
  }
  if (!expiration || expiration * 1000 <= Date.now()) {
    throw new Error('TOKEN_EXPIRED');
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
