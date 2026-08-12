/**
 * Correctif de positionnement des champs ajoutés le 12/08/2026.
 * À ajouter au même projet Apps Script que controle-participation-google.gs,
 * puis exécuter corrigerFormulaireEtSynchroniserSheet().
 *
 * IMPORTANT : ce correctif n'ajoute ni SMS ni WhatsApp.
 */
function corrigerFormulaireEtSynchroniserSheet() {
  const formulaire = obtenirFormulaire_();
  const questions = garantirMiseAJourQuestionnaire_(formulaire, true);
  const deplacements = repositionnerQuestionsMiseAJour_(formulaire, questions);
  const correspondance = actualiserCorrespondanceFormulaire_(formulaire);

  SpreadsheetApp.flush();
  console.log('CORRECTION_FORMULAIRE_TERMINEE: oui');
  console.log('QUESTIONS_REPOSITIONNEES: ' + deplacements);
  console.log('CORRESPONDANCE_ENTRY_ITEM_ACTUALISEE: ' + Object.keys(correspondance).length);
  console.log('SMS_WHATSAPP_AJOUTES: non');
}

function repositionnerQuestionsMiseAJour_(formulaire, questions) {
  let deplacements = 0;

  deplacements += deplacerQuestionApresTitre_(
    formulaire,
    questions.preferred_public_channel,
    'س1. هل سبق لكم أن سمعتم ببرنامج الدعم المباشر للسكن؟',
    0
  );

  deplacements += deplacerQuestionApresTitre_(
    formulaire,
    questions.official_source_other_detail,
    MISE_A_JOUR_QUESTIONNAIRE.OFFICIAL_SOURCES_TITLE,
    0
  );

  deplacements += deplacerQuestionApresTitre_(
    formulaire,
    questions.external_source_other_detail,
    MISE_A_JOUR_QUESTIONNAIRE.EXTERNAL_SOURCES_TITLE,
    0
  );
  deplacements += deplacerQuestionApresItem_(
    formulaire,
    questions.no_official_reason,
    questions.external_source_other_detail
  );

  const ancreContact = trouverItemParPredicat_(formulaire, function (item) {
    if (item.getType() !== FormApp.ItemType.MULTIPLE_CHOICE) return false;
    const titre = String(item.getTitle() || '').trim();
    return titre.indexOf('آخر تواصل') !== -1 && titre.indexOf('قناة') !== -1;
  }, 0);
  if (ancreContact) {
    deplacements += deplacerQuestionApresItem_(
      formulaire,
      questions.contact_channel_other_detail,
      ancreContact
    );
  }

  const ancreConfiance = trouverItemParPredicat_(formulaire, function (item) {
    const titre = String(item.getTitle() || '').trim();
    if (!titre) return false;
    return (
      titre.indexOf('الثقة في الوزارة') !== -1 ||
      titre.indexOf('الثقة العامة في الوزارة') !== -1
    );
  }, -1);
  if (
    ancreConfiance &&
    String(ancreConfiance.getId()) !== String(questions.trust_general_common.getId())
  ) {
    deplacements += deplacerQuestionApresItem_(
      formulaire,
      questions.trust_general_common,
      ancreConfiance
    );
  }

  return deplacements;
}

function deplacerQuestionApresTitre_(formulaire, question, titreAncre, occurrence) {
  const ancre = trouverItemParPredicat_(formulaire, function (item) {
    return String(item.getTitle() || '').trim() === String(titreAncre || '').trim();
  }, occurrence);
  if (!ancre) return 0;
  return deplacerQuestionApresItem_(formulaire, question, ancre);
}

function deplacerQuestionApresItem_(formulaire, question, ancre) {
  if (!question || !ancre) return 0;
  const questionId = String(question.getId());
  const ancreId = String(ancre.getId());
  if (questionId === ancreId) return 0;

  const items = formulaire.getItems();
  const indexQuestion = items.findIndex(function (item) {
    return String(item.getId()) === questionId;
  });
  const indexAncre = items.findIndex(function (item) {
    return String(item.getId()) === ancreId;
  });
  if (indexQuestion < 0 || indexAncre < 0) return 0;

  let indexCible = indexAncre + 1;
  if (indexQuestion === indexCible) return 0;
  if (indexQuestion < indexCible) indexCible -= 1;

  formulaire.moveItem(indexQuestion, indexCible);
  return 1;
}

function trouverItemParPredicat_(formulaire, predicat, occurrence) {
  const trouves = formulaire.getItems().filter(predicat);
  if (!trouves.length) return null;
  if (occurrence === -1) return trouves[trouves.length - 1];
  const index = Math.max(0, Number(occurrence) || 0);
  return trouves[index] || null;
}
