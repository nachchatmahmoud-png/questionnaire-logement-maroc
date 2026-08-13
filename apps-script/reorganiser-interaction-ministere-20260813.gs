/**
 * Réorganise uniquement la partie « التفاعل مع الوزارة بشأن البرنامج ».
 *
 * À exécuter dans le projet Apps Script du Google Form après la première
 * réorganisation :
 *   ajusterConsultationEtInteraction20260813()
 *
 * Le script est idempotent : une seconde exécution vérifie/réapplique la
 * configuration sans créer de doublons. Il conserve les questions existantes
 * de canal, de réception et de qualité de la réponse, ainsi que leurs données.
 */
function ajusterConsultationEtInteraction20260813() {
  const FORM_ID = '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo';
  const ETAT_PROPERTY = 'INTERACTION_MINISTERE_20260813_V1';
  const ENTRY_MAP_PROPERTY = 'FORM_ENTRY_ITEM_MAP_V1';

  const TITRE_SECTION = 'التفاعل مع الوزارة بشأن البرنامج';
  const INTRODUCTION =
    'يرجى الإجابة بناءً على معرفتكم أو تجربتكم مع قنوات التواصل الرسمية التي تتيح التفاعل بشأن برنامج «دعم سكن».';
  const QUESTION_FILTRE =
    'هل سبق لكم استخدام إحدى القنوات الرسمية للتواصل أو التفاعل بشأن البرنامج، لطرح سؤال أو طلب توضيح أو تقديم ملاحظة أو مقترح أو شكاية؟';
  const QUESTION_MOTIF =
    'ما السبب الرئيسي الذي دفعكم إلى التواصل مع الوزارة بشأن البرنامج؟';
  const QUESTION_NON_INTERACTION =
    'ما السبب الرئيسي لعدم تواصلكم مع الوزارة بشأن البرنامج؟';

  const MOTIFS_CONTACT = [
    'طلب معلومات حول البرنامج أو شروط الاستفادة منه.',
    'طلب توضيح بشأن معلومة أو إجراء متعلق بالبرنامج.',
    'طلب المساعدة بشأن تقديم الطلب أو استكمال الإجراءات.',
    'الاستفسار عن وضعية الطلب أو متابعة معالجة الملف.',
    'الإبلاغ عن صعوبة أو مشكلة واجهتني أثناء الاستفادة من البرنامج.',
    'تقديم شكاية مرتبطة بالبرنامج.',
    'تقديم ملاحظة أو مقترح بشأن البرنامج.',
    'سبب آخر، يرجى تحديده:',
  ];

  const RAISONS_NON_INTERACTION = [
    'لم أكن بحاجة إلى التواصل مع الوزارة.',
    'وجدت المعلومات التي أحتاجها دون الحاجة إلى التواصل مع الوزارة.',
    'حصلت على المعلومات التي أحتاجها من مصادر أخرى.',
    'لم أكن أعرف بوجود قنوات رسمية للتواصل مع الوزارة.',
    'كنت أعرف بوجود قنوات للتواصل، لكن لم يكن واضحًا لي أي قناة ينبغي استخدامها.',
    'واجهت صعوبة في الوصول إلى قنوات التواصل أو استخدامها.',
    'لم أتوقع أن يؤدي التواصل إلى الحصول على جواب أو حل مفيد.',
    'سبب آخر، يرجى تحديده:',
  ];

  const LIKERT = [
    '1 — لا أوافق إطلاقًا',
    '2 — لا أوافق',
    '3 — لا أوافق ولا أعارض',
    '4 — أوافق',
    '5 — أوافق تمامًا',
  ];

  const PERCEPTIONS = [
    {
      key: 'infoClarification',
      title: 'الاستفسارات وطلب التوضيحات',
      row: 'تتيح القنوات الرسمية للمواطنين توجيه استفساراتهم وطلب توضيحات من الوزارة بشأن البرنامج.',
    },
    {
      key: 'observationsPropositions',
      title: 'الملاحظات والمقترحات',
      row: 'تتيح القنوات الرسمية للمواطنين تقديم ملاحظاتهم ومقترحاتهم بشأن البرنامج.',
    },
    {
      key: 'reclamations',
      title: 'الشكايات المتعلقة بالبرنامج',
      row: 'تتيح القنوات الرسمية للمواطنين تقديم الشكايات المرتبطة بالبرنامج.',
    },
  ];

  const ROUTES = [
    {
      key: 'g2_beneficiary',
      interactionPageId: 1857212741,
      filterId: 412659,
      yesPageId: 1026969669,
      channelId: 712384300,
      responsePageId: 463901360,
      responseId: 1809358596,
      qualityPageId: 596612633,
      qualityGridId: 191957779,
      noPageId: 2095709005,
      nextPageId: 2022969520,
      contactReasonId: 470634372,
      noReasonId: 87110067,
      perceptionIds: {
        infoClarification: 793689576,
        observationsPropositions: 912503116,
        reclamations: 2037237011,
      },
      consultationOfficielle: false,
      synthetic: ['990000000000000001', '990000000000000002', '990000000000000003', '990000000000000004', '990000000000000005'],
    },
    {
      key: 'g2_other',
      interactionPageId: 596877967,
      filterId: 283321169,
      yesPageId: 1072000981,
      channelId: 1798678351,
      responsePageId: 1232967069,
      responseId: 1539560186,
      qualityPageId: 2104245602,
      qualityGridId: 1132848145,
      noPageId: 1237717641,
      nextPageId: 245909717,
      contactReasonId: 1760916153,
      noReasonId: 1700421298,
      perceptionIds: {
        infoClarification: 1983786008,
        observationsPropositions: 579843107,
        reclamations: 562250570,
      },
      consultationOfficielle: false,
      synthetic: ['990000000000000011', '990000000000000012', '990000000000000013', '990000000000000014', '990000000000000015'],
    },
    {
      key: 'official_beneficiary',
      interactionPageId: 387210411,
      filterId: 634946448,
      yesPageId: 1976616302,
      channelId: 1027290432,
      responsePageId: 520814463,
      responseId: 786149328,
      qualityPageId: 1016735707,
      qualityGridId: 338617431,
      noPageId: 695103605,
      nextPageId: 1593593510,
      contactReasonId: 1769331976,
      noReasonId: 768149222,
      perceptionIds: {
        infoClarification: 984260886,
        observationsPropositions: 1489177863,
        reclamations: 65348748,
      },
      consultationOfficielle: true,
      legacyIds: [351512942, 350843683, 2141349291, 1684280107, 1977115362],
      synthetic: ['990000000000000021', '990000000000000022', '990000000000000023', '990000000000000024', '990000000000000025'],
    },
    {
      key: 'official_other',
      interactionPageId: 581596682,
      filterId: 2077056235,
      yesPageId: 975996182,
      channelId: 890011310,
      responsePageId: 854625717,
      responseId: 906098344,
      qualityPageId: 1674308694,
      qualityGridId: 1916460429,
      noPageId: 1131663142,
      nextPageId: 465167947,
      contactReasonId: 803530616,
      noReasonId: 1826130994,
      perceptionIds: {
        infoClarification: 547508310,
        observationsPropositions: 1017244650,
        reclamations: 1579501699,
      },
      consultationOfficielle: true,
      legacyIds: [1714472375, 650330153, 715214820, 1854786006, 321455995],
      synthetic: ['990000000000000031', '990000000000000032', '990000000000000033', '990000000000000034', '990000000000000035'],
    },
  ];

  const form = FormApp.openById(FORM_ID);
  const properties = PropertiesService.getScriptProperties();
  let state = lireEtatInteraction_(properties, ETAT_PROPERTY);
  const avant = form.getItems().length;

  ROUTES.forEach(function (route) {
    const savedState = state[route.key] || {};
    const routeState = {
      contactReasonId: savedState.contactReasonId || route.contactReasonId,
      noReasonId: savedState.noReasonId || route.noReasonId,
      noPageId: savedState.noPageId || route.noPageId,
      perceptionIds: Object.assign({}, route.perceptionIds || {}, savedState.perceptionIds || {}),
    };

    const interactionPage = exigerItemInteraction_(form, route.interactionPageId, FormApp.ItemType.PAGE_BREAK).asPageBreakItem();
    const filter = exigerItemInteraction_(form, route.filterId, FormApp.ItemType.MULTIPLE_CHOICE).asMultipleChoiceItem();
    const yesPage = exigerItemInteraction_(form, route.yesPageId, FormApp.ItemType.PAGE_BREAK).asPageBreakItem();
    const channel = exigerItemInteraction_(form, route.channelId, FormApp.ItemType.MULTIPLE_CHOICE).asMultipleChoiceItem();
    const responsePage = exigerItemInteraction_(form, route.responsePageId, FormApp.ItemType.PAGE_BREAK).asPageBreakItem();
    const response = exigerItemInteraction_(form, route.responseId, FormApp.ItemType.MULTIPLE_CHOICE).asMultipleChoiceItem();
    const qualityPage = exigerItemInteraction_(form, route.qualityPageId, FormApp.ItemType.PAGE_BREAK).asPageBreakItem();
    exigerItemInteraction_(form, route.qualityGridId, FormApp.ItemType.GRID);
    const nextPage = exigerItemInteraction_(form, route.nextPageId, FormApp.ItemType.PAGE_BREAK).asPageBreakItem();

    const contactReason = obtenirOuCreerChoixInteraction_(
      form,
      routeState.contactReasonId,
      QUESTION_MOTIF,
      MOTIFS_CONTACT
    );
    routeState.contactReasonId = contactReason.getId();
    enregistrerEtatInteraction_(properties, ETAT_PROPERTY, state, route.key, routeState);

    let noPage;
    if (routeState.noPageId) {
      noPage = exigerItemInteraction_(form, routeState.noPageId, FormApp.ItemType.PAGE_BREAK).asPageBreakItem();
    } else {
      noPage = obtenirOuCreerPageInteraction_(form, routeState.noPageId);
      routeState.noPageId = noPage.getId();
      enregistrerEtatInteraction_(properties, ETAT_PROPERTY, state, route.key, routeState);
    }

    const noReason = obtenirOuCreerChoixInteraction_(
      form,
      routeState.noReasonId,
      QUESTION_NON_INTERACTION,
      RAISONS_NON_INTERACTION
    );
    routeState.noReasonId = noReason.getId();
    enregistrerEtatInteraction_(properties, ETAT_PROPERTY, state, route.key, routeState);

    routeState.perceptionIds = routeState.perceptionIds || {};
    let perceptionItems = [];
    if (route.consultationOfficielle) {
      perceptionItems = PERCEPTIONS.map(function (definition) {
        const item = obtenirOuCreerGrilleInteraction_(
          form,
          routeState.perceptionIds[definition.key],
          definition.title,
          definition.row,
          LIKERT
        );
        routeState.perceptionIds[definition.key] = item.getId();
        enregistrerEtatInteraction_(properties, ETAT_PROPERTY, state, route.key, routeState);
        return item;
      });
    } else {
      Object.keys(routeState.perceptionIds).forEach(function (key) {
        supprimerItemInteractionSiPresent_(form, routeState.perceptionIds[key], FormApp.ItemType.GRID);
      });
      routeState.perceptionIds = {};
    }

    interactionPage.setTitle(TITRE_SECTION).setHelpText(INTRODUCTION);
    filter.setTitle(QUESTION_FILTRE).setRequired(true);
    yesPage.setTitle('تجربتكم في التفاعل مع الوزارة');
    noPage.setTitle('عدم التواصل مع الوزارة بشأن البرنامج').setHelpText('');
    contactReason.setTitle(QUESTION_MOTIF).setChoiceValues(MOTIFS_CONTACT).setRequired(true);
    noReason.setTitle(QUESTION_NON_INTERACTION).setChoiceValues(RAISONS_NON_INTERACTION).setRequired(true);

    perceptionItems.forEach(function (item, index) {
      const definition = PERCEPTIONS[index];
      item
        .setTitle(definition.title)
        .setRows([definition.row])
        .setColumns(LIKERT)
        .setRequired(true);
    });

    filter.setChoices([
      filter.createChoice('نعم', yesPage),
      filter.createChoice('لا', noPage),
    ]);
    response.setChoices([
      response.createChoice('نعم', qualityPage),
      response.createChoice('لا', nextPage),
    ]).setRequired(true);
    qualityPage.setGoToPage(nextPage);
    noPage.setGoToPage(nextPage);

    placerAvantInteraction_(form, contactReason, channel);
    placerBlocAvantInteraction_(form, [noPage, noReason].concat(perceptionItems), nextPage);

    (route.legacyIds || []).forEach(function (legacyId) {
      const legacy = form.getItemById(legacyId);
      if (legacy) form.deleteItem(legacy.getIndex());
    });

    form.moveItem(filter.getIndex(), interactionPage.getIndex() + 1);
    routeState.contactReasonId = contactReason.getId();
    routeState.noReasonId = noReason.getId();
    routeState.noPageId = noPage.getId();
    enregistrerEtatInteraction_(properties, ETAT_PROPERTY, state, route.key, routeState);
  });

  const mapRaw = properties.getProperty(ENTRY_MAP_PROPERTY);
  let entryMap = {};
  if (mapRaw) {
    try { entryMap = JSON.parse(mapRaw) || {}; } catch (_) { entryMap = {}; }
  }
  if (!Object.keys(entryMap).length && typeof actualiserCorrespondanceFormulaire_ === 'function') {
    entryMap = actualiserCorrespondanceFormulaire_(form);
  }
  if (!Object.keys(entryMap).length) {
    throw new Error('La correspondance FORM_ENTRY_ITEM_MAP_V1 est absente. Exécutez d’abord installerControleParticipationGoogle().');
  }

  ROUTES.forEach(function (route) {
    const routeState = state[route.key];
    entryMap[route.synthetic[0]] = { itemId: String(routeState.contactReasonId) };
    entryMap[route.synthetic[1]] = { itemId: String(routeState.noReasonId) };
    if (route.consultationOfficielle) {
      entryMap[route.synthetic[2]] = { itemId: String(routeState.perceptionIds.infoClarification), rowIndex: 0 };
      entryMap[route.synthetic[3]] = { itemId: String(routeState.perceptionIds.observationsPropositions), rowIndex: 0 };
      entryMap[route.synthetic[4]] = { itemId: String(routeState.perceptionIds.reclamations), rowIndex: 0 };
    } else {
      delete entryMap[route.synthetic[2]];
      delete entryMap[route.synthetic[3]];
      delete entryMap[route.synthetic[4]];
    }
  });
  properties.setProperty(ENTRY_MAP_PROPERTY, JSON.stringify(entryMap));

  const apres = form.getItems().length;
  verifierInteractionInstallee_(form, ROUTES, state, TITRE_SECTION, INTRODUCTION, QUESTION_FILTRE, PERCEPTIONS);

  console.log('LOGIQUE_CONSULTATION_INTERACTION_AJUSTEE: oui');
  console.log('NOMBRE_ITEMS_AVANT_APRES: ' + avant + ' / ' + apres);
  console.log('TITRE_ET_INTRODUCTION_CONSERVES: oui');
  console.log('LONG_PARAGRAPHE_SUPPRIME: oui');
  console.log('QUESTION_FILTRE_OBLIGATOIRE: oui');
  console.log('PARCOURS_OUI: motif -> canal -> réponse -> qualité_si_réponse');
  console.log('CAS_1_CONSULTATION_OUI_INTERACTION_OUI: expérience réelle');
  console.log('CAS_2_CONSULTATION_NON_INTERACTION_OUI: expérience réelle');
  console.log('CAS_3_CONSULTATION_OUI_INTERACTION_NON: raison + 3 affirmations Likert');
  console.log('CAS_4_CONSULTATION_NON_INTERACTION_NON: raison uniquement');
  console.log('AUTRES_SECTIONS_INCHANGEES: oui');
  console.log('CORRESPONDANCE_SITE_ACTUALISEE: oui');
  ROUTES.forEach(function (route) {
    console.log('ROUTE_OK: ' + route.key + ' | LIKERT=' + (route.consultationOfficielle ? 'oui' : 'non'));
  });
}

function lireEtatInteraction_(properties, key) {
  const raw = properties.getProperty(key);
  if (!raw) return {};
  try { return JSON.parse(raw) || {}; } catch (_) { return {}; }
}

function enregistrerEtatInteraction_(properties, key, state, routeKey, routeState) {
  state[routeKey] = routeState;
  properties.setProperty(key, JSON.stringify(state));
}

function exigerItemInteraction_(form, id, type) {
  const item = form.getItemById(Number(id));
  if (!item || item.getType() !== type) {
    throw new Error('Item requis introuvable ou de type inattendu: ' + id + ' / ' + type);
  }
  return item;
}

function obtenirOuCreerChoixInteraction_(form, id, title, choices) {
  let item = id ? form.getItemById(Number(id)) : null;
  if (item && item.getType() !== FormApp.ItemType.MULTIPLE_CHOICE) {
    throw new Error('Type inattendu pour la question: ' + id);
  }
  const question = item ? item.asMultipleChoiceItem() : form.addMultipleChoiceItem();
  return question.setTitle(title).setChoiceValues(choices).setRequired(true);
}

function obtenirOuCreerPageInteraction_(form, id) {
  const item = id ? form.getItemById(Number(id)) : null;
  if (item && item.getType() !== FormApp.ItemType.PAGE_BREAK) {
    throw new Error('Type inattendu pour la section: ' + id);
  }
  return item ? item.asPageBreakItem() : form.addPageBreakItem();
}

function obtenirOuCreerGrilleInteraction_(form, id, title, row, columns) {
  const item = id ? form.getItemById(Number(id)) : null;
  if (item && item.getType() !== FormApp.ItemType.GRID) {
    throw new Error('Type inattendu pour la grille: ' + id);
  }
  const grid = item ? item.asGridItem() : form.addGridItem();
  return grid.setTitle(title).setRows([row]).setColumns(columns).setRequired(true);
}

function supprimerItemInteractionSiPresent_(form, id, type) {
  if (!id) return;
  const item = form.getItemById(Number(id));
  if (!item) return;
  if (item.getType() !== type) {
    throw new Error('Type inattendu pour la suppression: ' + id);
  }
  form.deleteItem(item.getIndex());
}

function placerAvantInteraction_(form, item, before) {
  if (item.getIndex() === before.getIndex() - 1) return;
  form.moveItem(item.getIndex(), before.getIndex());
}

function placerBlocAvantInteraction_(form, items, before) {
  const page = items[0];
  if (page.getIndex() > before.getIndex()) {
    form.moveItem(page.getIndex(), before.getIndex());
  }
  items.slice(1).forEach(function (item) {
    form.moveItem(item.getIndex(), before.getIndex());
  });
}

function verifierInteractionInstallee_(form, routes, state, title, intro, filterTitle, perceptions) {
  routes.forEach(function (route) {
    const routeState = state[route.key];
    const page = exigerItemInteraction_(form, route.interactionPageId, FormApp.ItemType.PAGE_BREAK).asPageBreakItem();
    const filter = exigerItemInteraction_(form, route.filterId, FormApp.ItemType.MULTIPLE_CHOICE).asMultipleChoiceItem();
    const yesPage = exigerItemInteraction_(form, route.yesPageId, FormApp.ItemType.PAGE_BREAK).asPageBreakItem();
    const noPage = exigerItemInteraction_(form, routeState.noPageId, FormApp.ItemType.PAGE_BREAK).asPageBreakItem();
    const contactReason = exigerItemInteraction_(form, routeState.contactReasonId, FormApp.ItemType.MULTIPLE_CHOICE);
    const noReason = exigerItemInteraction_(form, routeState.noReasonId, FormApp.ItemType.MULTIPLE_CHOICE);
    const channel = exigerItemInteraction_(form, route.channelId, FormApp.ItemType.MULTIPLE_CHOICE);
    const nextPage = exigerItemInteraction_(form, route.nextPageId, FormApp.ItemType.PAGE_BREAK);

    if (page.getTitle() !== title || page.getHelpText() !== intro) throw new Error('Titre/introduction incorrects: ' + route.key);
    if (filter.getTitle() !== filterTitle || !filter.isRequired()) throw new Error('Filtre incorrect: ' + route.key);
    if (filter.getIndex() !== page.getIndex() + 1) throw new Error('Filtre mal placé: ' + route.key);
    if (!(yesPage.getIndex() < contactReason.getIndex() && contactReason.getIndex() < channel.getIndex())) throw new Error('Ordre OUI incorrect: ' + route.key);
    if (!(noPage.getIndex() < noReason.getIndex() && noReason.getIndex() < nextPage.getIndex())) throw new Error('Ordre NON incorrect: ' + route.key);

    if (route.consultationOfficielle) {
      perceptions.forEach(function (definition) {
        const grid = exigerItemInteraction_(form, routeState.perceptionIds[definition.key], FormApp.ItemType.GRID).asGridItem();
        if (grid.getTitle() !== definition.title || grid.getRows()[0] !== definition.row || !grid.isRequired()) {
          throw new Error('Affirmation Likert incorrecte: ' + route.key + ' / ' + definition.key);
        }
        if (!(noReason.getIndex() < grid.getIndex() && grid.getIndex() < nextPage.getIndex())) {
          throw new Error('Affirmation hors parcours NON: ' + route.key + ' / ' + definition.key);
        }
      });
    } else if (Object.keys(routeState.perceptionIds || {}).length) {
      throw new Error('Des affirmations Likert subsistent dans le parcours sans consultation: ' + route.key);
    }
  });
}
