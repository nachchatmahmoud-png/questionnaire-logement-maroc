/** Active et vérifie les huit saisies « autre », sans soumettre de réponse. */
function ACTIVER_ET_VERIFIER_TOUS_CHAMPS_AUTRES_20261106() {
  const formulaire = obtenirFormulaire_();
  const items = formulaire.getItems();
  const texte = 'تفصيل تجريبي للتحقق من جميع حقول أخرى دون إرسال إجابة';
  const questionsLibres = [];
  [
    ['motif_contact', 'ما السبب الرئيسي الذي دفعكم إلى التواصل مع الوزارة بشأن البرنامج؟', 4],
    ['motif_non_contact', 'ما السبب الرئيسي لعدم تواصلكم مع الوزارة بشأن البرنامج؟', 4],
    ['canal_prefere', MISE_A_JOUR_QUESTIONNAIRE.PREFERRED_CHANNEL_TITLE, 1],
    ['motif_non_exposition', MISE_A_JOUR_QUESTIONNAIRE.NO_OFFICIAL_REASON_TITLE, 1]
  ].forEach(function (definition) {
    const questions = items.filter(function (item) {
      return item.getType() === FormApp.ItemType.MULTIPLE_CHOICE &&
        String(item.getTitle() || '').trim() === definition[1];
    });
    if (questions.length !== definition[2]) throw new Error('CONFIGURATION_AUTRE:' + definition[0] + ':nombre=' + questions.length);
    questions.forEach(function (item) {
      const question = item.asMultipleChoiceItem();
      question.showOtherOption(true);
      question.createResponse(texte);
      if (!question.hasOtherOption()) throw new Error('AUTRE_INACTIF:' + definition[0]);
      questionsLibres.push(question);
    });
    console.log('AUTRE_ACTIF:' + definition[0] + ';questions=' + questions.length);
  });
  const correspondance = obtenirCorrespondanceFormulaire_(formulaire);
  const descripteurLogement = correspondance['1373868444'];
  const logementId = String(descripteurLogement && typeof descripteurLogement === 'object' ? descripteurLogement.itemId : descripteurLogement || '');
  const itemLogement = formulaire.getItemById(Number(logementId));
  if (!itemLogement || itemLogement.getType() !== FormApp.ItemType.MULTIPLE_CHOICE) throw new Error('LOGEMENT_ABSENT');
  const logement = itemLogement.asMultipleChoiceItem();
  if (!logement.getChoices().some(function (choix) { return choix.getValue() === 'وضع سكني آخر'; })) throw new Error('CHOIX_LOGEMENT_AUTRE_ABSENT');
  logement.showOtherOption(true);
  questionsLibres.push(logement);
  console.log('AUTRE_ACTIF:logement;questions=1');

  const parId = {};
  items.forEach(function (item) { parId[String(item.getId())] = item; });
  const bundle = {items:items, parId:parId, indexFallback:null};
  const plan = obtenirPlanRapideV23_(formulaire, correspondance, bundle).plan;
  const charge = {'1373868444':texte, '1856677935':['مصدر رسمي آخر'], '1040032':['مصدر آخر'], '1646951693':'مصدر رسمي آخر'};
  [
    '990000000000000001','990000000000000002',
    '990000000000000011','990000000000000012',
    '990000000000000021','990000000000000022',
    '990000000000000031','990000000000000032'
  ].forEach(function (entryId) { charge[entryId] = texte; });
  ['1051412983','1748054727','1917194186','641302619'].forEach(function (entryId) { charge[entryId] = 'قناة رسمية أخرى'; });
  const donnees = {
    preferred_public_channel:texte,
    no_official_reason:texte,
    official_source_other_detail:texte,
    external_source_other_detail:texte,
    contact_channel_other_detail:texte
  };
  const brouillon = preparerReponseUltraRapideV30_(
    formulaire, null, 'verificationAutres20261106_' + Utilities.getUuid().replace(/-/g,''),
    parserChargeReponses_(JSON.stringify(charge)),
    parserReponsesSupplementaires_(JSON.stringify(donnees)),
    correspondance, plan, bundle
  );
  if (brouillon.getId() !== null) throw new Error('VERIFICATION_NE_DOIT_PAS_SOUMETTRE');
  const reponsesParId = {};
  brouillon.getItemResponses().forEach(function (reponse) {
    reponsesParId[String(reponse.getItem().getId())] = reponse;
  });
  questionsLibres.forEach(function (question) {
    const reponse = reponsesParId[String(question.getId())];
    if (!reponse || String(reponse.getResponse()) !== texte) throw new Error('TEXTE_AUTRE_PERDU:item=' + question.getId());
  });
  ['official_source_other_detail','external_source_other_detail','contact_channel_other_detail'].forEach(function (cle) {
    const reponse = reponsesParId[String(plan.supplementaires[cle])];
    if (!reponse || String(reponse.getResponse()) !== texte) throw new Error('PRECISION_AUTRE_PERDUE:' + cle);
    console.log('PRECISION_AUTRE_OK:' + cle);
  });
  console.log('TOUS_CHAMPS_AUTRES_OK:categories=8;questions_libres=' + questionsLibres.length + ';aucune_reponse_envoyee');
}
