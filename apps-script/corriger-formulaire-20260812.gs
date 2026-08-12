/**
 * Correctif Google Forms du 12/08/2026.
 *
 * Objectif principal :
 * - Q1 = نعم  -> continuer vers Q2 ;
 * - Q1 = لا   -> afficher uniquement la question du canal préféré,
 *                puis aller directement aux informations générales.
 *
 * IMPORTANT : ce correctif n'ajoute ni SMS ni WhatsApp.
 *
 * À exécuter : corrigerFormulaireEtSynchroniserSheet()
 */

const ROUTAGE_Q1_20260812 = Object.freeze({
  Q1_TITLE: 'س1. هل سبق لكم أن سمعتم ببرنامج الدعم المباشر للسكن؟',
  Q2_TITLE: 'س2. هل سبق لكم الاطلاع على معلومات حول برنامج الدعم المباشر للسكن عبر إحدى وسائل التواصل الرسمية للوزارة؟',
  DEMOGRAPHICS_FIRST_TITLE: '1. ما هي فئتكم العمرية؟',
  NO_VALUE: 'لا',
  YES_PAGE_PROPERTY: 'Q1_YES_PAGE_ID_20260812_V2',
  NO_PAGE_PROPERTY: 'Q1_NO_PAGE_ID_20260812_V2',
  DEMO_PAGE_PROPERTY: 'Q1_DEMO_PAGE_ID_20260812_V2',
  YES_PAGE_TITLE: 'متابعة الاستبيان',
  NO_PAGE_TITLE: 'وسيلة التواصل المفضلة',
  DEMO_PAGE_TITLE: 'المعلومات العامة',
});

function corrigerFormulaireEtSynchroniserSheet() {
  const formulaire = obtenirFormulaire_();
  const questions = garantirMiseAJourQuestionnaire_(formulaire, true);

  // Les cinq autres champs restent positionnés près de leurs questions de référence.
  const deplacementsAutres = repositionnerAutresQuestionsMiseAJour_(
    formulaire,
    questions
  );

  // La question preferred_public_channel n'est plus simplement déplacée après Q1 :
  // elle est placée dans une vraie section conditionnelle Q1 = لا.
  const routage = garantirRoutageConditionnelQ1_(
    formulaire,
    questions.preferred_public_channel
  );

  const correspondance = actualiserCorrespondanceFormulaire_(formulaire);
  SpreadsheetApp.flush();

  console.log('CORRECTION_FORMULAIRE_TERMINEE: oui');
  console.log('QUESTIONS_REPOSITIONNEES_AUTRES: ' + deplacementsAutres);
  console.log('ROUTAGE_Q1_NON_CONDITIONNEL: actif');
  console.log('Q1_NON_VERS_CANAL_PREFERE: ' + routage.noPage.getId());
  console.log('Q1_OUI_VERS_Q2: ' + routage.yesPage.getId());
  console.log('CANAL_PREFERE_VERS_DEMOGRAPHIE: ' + routage.demoPage.getId());
  console.log('CORRESPONDANCE_ENTRY_ITEM_ACTUALISEE: ' + Object.keys(correspondance).length);
  console.log('SMS_WHATSAPP_AJOUTES: non');
}

function garantirRoutageConditionnelQ1_(formulaire, questionCanalPrefere) {
  const q1 = trouverQuestionChoixUniqueTitreExactQ1_(
    formulaire,
    ROUTAGE_Q1_20260812.Q1_TITLE
  );
  const q2 = trouverQuestionChoixUniqueTitreExactQ1_(
    formulaire,
    ROUTAGE_Q1_20260812.Q2_TITLE
  );
  const questionDemo = trouverItemTitreExactQ1_(
    formulaire,
    ROUTAGE_Q1_20260812.DEMOGRAPHICS_FIRST_TITLE
  );

  if (!q1 || !q2 || !questionDemo || !questionCanalPrefere) {
    throw new Error('CONFIGURATION_MISSING');
  }

  const proprietes = PropertiesService.getScriptProperties();

  // 1) Section normale : Q1 = نعم -> Q2.
  let yesPage = obtenirPageBreakDepuisProprieteQ1_(
    formulaire,
    ROUTAGE_Q1_20260812.YES_PAGE_PROPERTY
  );
  if (!yesPage) {
    yesPage = trouverPageBreakEntreItemsQ1_(formulaire, q1, q2);
  }
  if (!yesPage) {
    yesPage = formulaire
      .addPageBreakItem()
      .setTitle(ROUTAGE_Q1_20260812.YES_PAGE_TITLE);
  }
  proprietes.setProperty(
    ROUTAGE_Q1_20260812.YES_PAGE_PROPERTY,
    String(yesPage.getId())
  );
  deplacerItemApresQ1_(formulaire, yesPage, q1);

  // 2) Section des informations générales : réutiliser la section qui précède
  // déjà la première question démographique si elle existe.
  let demoPage = obtenirPageBreakDepuisProprieteQ1_(
    formulaire,
    ROUTAGE_Q1_20260812.DEMO_PAGE_PROPERTY
  );
  if (!demoPage) {
    demoPage = trouverPageBreakAvantItemQ1_(formulaire, questionDemo);
  }
  if (!demoPage) {
    demoPage = formulaire
      .addPageBreakItem()
      .setTitle(ROUTAGE_Q1_20260812.DEMO_PAGE_TITLE);
    deplacerItemAvantQ1_(formulaire, demoPage, questionDemo);
  }
  proprietes.setProperty(
    ROUTAGE_Q1_20260812.DEMO_PAGE_PROPERTY,
    String(demoPage.getId())
  );

  // 3) Section spéciale Q1 = لا : elle est placée juste AVANT les informations
  // générales et contient seulement la question du canal préféré.
  let noPage = obtenirPageBreakDepuisProprieteQ1_(
    formulaire,
    ROUTAGE_Q1_20260812.NO_PAGE_PROPERTY
  );
  if (!noPage) {
    noPage = formulaire
      .addPageBreakItem()
      .setTitle(ROUTAGE_Q1_20260812.NO_PAGE_TITLE);
  }
  proprietes.setProperty(
    ROUTAGE_Q1_20260812.NO_PAGE_PROPERTY,
    String(noPage.getId())
  );

  deplacerItemAvantQ1_(formulaire, noPage, demoPage);
  deplacerItemApresQ1_(formulaire, questionCanalPrefere, noPage);
  deplacerItemApresQ1_(formulaire, demoPage, questionCanalPrefere);

  // Si le parcours normal arrive linéairement à la section spéciale « Non »,
  // il la saute et va directement aux informations générales.
  // En revanche, Q1 = لا y arrive par navigation explicite et la section s'affiche.
  noPage.setGoToPage(demoPage);

  // Après la question du canal préféré, continuer normalement sur la page
  // des informations générales.
  demoPage.setGoToPage(FormApp.PageNavigationType.CONTINUE);

  // 4) Routage de Q1. Toutes les réponses doivent avoir une navigation explicite.
  const valeurs = q1.getChoices().map(function (choix) {
    return String(choix.getValue() || '').trim();
  });

  if (valeurs.indexOf(ROUTAGE_Q1_20260812.NO_VALUE) === -1) {
    throw new Error('CONFIGURATION_MISSING');
  }

  try {
    q1.showOtherOption(false);
  } catch (_) {}

  const nouveauxChoix = valeurs.map(function (valeur) {
    return q1.createChoice(
      valeur,
      valeur === ROUTAGE_Q1_20260812.NO_VALUE ? noPage : yesPage
    );
  });
  q1.setChoices(nouveauxChoix);

  return {
    q1: q1,
    yesPage: yesPage,
    noPage: noPage,
    demoPage: demoPage,
  };
}

function repositionnerAutresQuestionsMiseAJour_(formulaire, questions) {
  let deplacements = 0;

  deplacements += deplacerQuestionApresTitreQ1_(
    formulaire,
    questions.official_source_other_detail,
    MISE_A_JOUR_QUESTIONNAIRE.OFFICIAL_SOURCES_TITLE,
    0
  );

  deplacements += deplacerQuestionApresTitreQ1_(
    formulaire,
    questions.external_source_other_detail,
    MISE_A_JOUR_QUESTIONNAIRE.EXTERNAL_SOURCES_TITLE,
    0
  );

  deplacements += deplacerItemApresQ1_(
    formulaire,
    questions.no_official_reason,
    questions.external_source_other_detail
  );

  const ancreContact = trouverItemParPredicatQ1_(formulaire, function (item) {
    if (item.getType() !== FormApp.ItemType.MULTIPLE_CHOICE) return false;
    const titre = String(item.getTitle() || '').trim();
    return titre.indexOf('آخر تواصل') !== -1 && titre.indexOf('قناة') !== -1;
  }, 0);
  if (ancreContact) {
    deplacements += deplacerItemApresQ1_(
      formulaire,
      questions.contact_channel_other_detail,
      ancreContact
    );
  }

  const ancreConfiance = trouverItemParPredicatQ1_(formulaire, function (item) {
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
    deplacements += deplacerItemApresQ1_(
      formulaire,
      questions.trust_general_common,
      ancreConfiance
    );
  }

  return deplacements;
}

function trouverQuestionChoixUniqueTitreExactQ1_(formulaire, titre) {
  const trouves = formulaire
    .getItems(FormApp.ItemType.MULTIPLE_CHOICE)
    .filter(function (item) {
      return String(item.getTitle() || '').trim() === String(titre || '').trim();
    });

  if (trouves.length !== 1) return null;
  return trouves[0].asMultipleChoiceItem();
}

function trouverItemTitreExactQ1_(formulaire, titre) {
  const trouves = formulaire.getItems().filter(function (item) {
    return String(item.getTitle() || '').trim() === String(titre || '').trim();
  });
  return trouves.length === 1 ? trouves[0] : null;
}

function obtenirPageBreakDepuisProprieteQ1_(formulaire, cle) {
  const id = PropertiesService.getScriptProperties().getProperty(cle);
  if (!id) return null;

  const item = formulaire.getItems().find(function (element) {
    return (
      String(element.getId()) === String(id) &&
      element.getType() === FormApp.ItemType.PAGE_BREAK
    );
  });

  return item ? item.asPageBreakItem() : null;
}

function trouverPageBreakEntreItemsQ1_(formulaire, avant, apres) {
  const items = formulaire.getItems();
  const indexAvant = indexItemQ1_(items, avant);
  const indexApres = indexItemQ1_(items, apres);
  if (indexAvant < 0 || indexApres < 0 || indexApres <= indexAvant) return null;

  for (let i = indexAvant + 1; i < indexApres; i += 1) {
    if (items[i].getType() === FormApp.ItemType.PAGE_BREAK) {
      return items[i].asPageBreakItem();
    }
  }
  return null;
}

function trouverPageBreakAvantItemQ1_(formulaire, itemCible) {
  const items = formulaire.getItems();
  const indexCible = indexItemQ1_(items, itemCible);
  if (indexCible < 0) return null;

  for (let i = indexCible - 1; i >= 0; i -= 1) {
    if (items[i].getType() === FormApp.ItemType.PAGE_BREAK) {
      return items[i].asPageBreakItem();
    }
  }
  return null;
}

function deplacerQuestionApresTitreQ1_(formulaire, question, titreAncre, occurrence) {
  const ancre = trouverItemParPredicatQ1_(formulaire, function (item) {
    return String(item.getTitle() || '').trim() === String(titreAncre || '').trim();
  }, occurrence);
  if (!ancre) return 0;
  return deplacerItemApresQ1_(formulaire, question, ancre);
}

function deplacerItemApresQ1_(formulaire, item, ancre) {
  if (!item || !ancre) return 0;

  const items = formulaire.getItems();
  const indexItem = indexItemQ1_(items, item);
  const indexAncre = indexItemQ1_(items, ancre);
  if (indexItem < 0 || indexAncre < 0) return 0;
  if (indexItem === indexAncre + 1) return 0;

  let cible = indexAncre + 1;
  if (indexItem < cible) cible -= 1;
  formulaire.moveItem(indexItem, cible);
  return 1;
}

function deplacerItemAvantQ1_(formulaire, item, ancre) {
  if (!item || !ancre) return 0;

  const items = formulaire.getItems();
  const indexItem = indexItemQ1_(items, item);
  const indexAncre = indexItemQ1_(items, ancre);
  if (indexItem < 0 || indexAncre < 0) return 0;
  if (indexItem === indexAncre - 1) return 0;

  let cible = indexAncre;
  if (indexItem < cible) cible -= 1;
  formulaire.moveItem(indexItem, cible);
  return 1;
}

function indexItemQ1_(items, item) {
  const id = String(item.getId());
  return items.findIndex(function (element) {
    return String(element.getId()) === id;
  });
}

function trouverItemParPredicatQ1_(formulaire, predicat, occurrence) {
  const trouves = formulaire.getItems().filter(predicat);
  if (!trouves.length) return null;
  if (occurrence === -1) return trouves[trouves.length - 1];
  const index = Math.max(0, Number(occurrence) || 0);
  return trouves[index] || null;
}
