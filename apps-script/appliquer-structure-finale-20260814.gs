/**
 * Mise à jour ciblée des échelles finales : confiance, légitimité, facilité,
 * acceptabilité, satisfaction/impact personnel et impact général.
 *
 * À exécuter UNE FOIS dans le projet Apps Script lié au Google Form :
 *   appliquerStructureFinale20260814V2()
 *
 * Le script est idempotent. Il crée de nouveaux items au lieu de réétiqueter
 * les anciens, afin de conserver sans ambiguïté les réponses historiques.
 * Il ne modifie ni la compréhension, ni la transparence, ni l'interaction.
 */
function appliquerStructureFinale20260814V2() {
  const FORM_ID = '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo';
  const SHEET_ID = '1VcNjC6_eF-9GiKALC7lVvgE1q_F3RM6CJUcs4RKyt-Q';
  const STATE_KEY = 'STRUCTURE_FINALE_20260814_V1';
  const ENTRY_MAP_KEY = 'FORM_ENTRY_ITEM_MAP_V1';
  const LIKERT = [
    '1 — لا أوافق إطلاقًا',
    '2 — لا أوافق',
    '3 — لا أوافق ولا أعارض',
    '4 — أوافق',
    '5 — أوافق تمامًا',
  ];

  const T = {
    trust: 'آراؤكم حول تدبير الوزارة للبرنامج',
    legitimacy: 'آراؤكم حول بعض جوانب البرنامج',
    ease: 'شروط وإجراءات الاستفادة من البرنامج',
    accept: 'آراؤكم حول البرنامج',
    beneficiary: 'تجربتكم في الاستفادة من البرنامج وأثرها على وضعكم السكني',
    generalImpact: 'آثار البرنامج',
  };

  const R = {
    trust: [
      '1. المعلومات التي تنشرها الوزارة بشأن البرنامج دقيقة وموثوقة.',
      '2. لدى الوزارة القدرة على تدبير البرنامج بكفاءة.',
      '3. تُعالج طلبات الاستفادة وفق القواعد المعلنة.',
      '4. تطبق الوزارة معايير الاستفادة على جميع طالبي الدعم بصورة عادلة ودون تمييز.',
      '5. تفي الوزارة بالتزاماتها المعلنة بشأن البرنامج.',
    ],
    legitimacy: [
      '1. تخصيص برنامج لامتلاك السكن أمر جيد.',
      '2. يساهم برنامج الدعم المباشر للسكن في تسهيل امتلاك السكن.',
      '3. تخصيص موارد عمومية لتمويل برنامج الدعم المباشر للسكن أمر مناسب.',
      '4. معايير الاستفادة المعتمدة في البرنامج عادلة.',
    ],
    ease: [
      '1. شروط الاستفادة المحددة في البرنامج قابلة للاستيفاء (أي يمكن تحقيقها).',
      '2. إجراءات طلب الاستفادة من البرنامج ميسرة.',
      '3. الوثائق المطلوبة للاستفادة من البرنامج يمكن توفيرها دون صعوبة كبيرة.',
    ],
    accept: [
      '1. الاستفادة من برنامج الدعم المباشر للسكن خيار مناسب لاقتناء السكن.',
      '2. برنامج الدعم المباشر للسكن جدير بالاستمرار.',
      '3. أوصي أصدقائي وأفراد أسرتي المؤهلين بالاستفادة من برنامج الدعم المباشر للسكن.',
    ],
    beneficiary: [
      '1. مكنني البرنامج من اقتناء السكن.',
      '2. شروط وإجراءات الاستفادة من البرنامج ميسرة.',
      '3. كانت المدة بين معالجة ملف الاستفادة واقتناء السكن مناسبة.',
      '4. ساهمت الاستفادة من البرنامج في تحسين ظروفي السكنية والمعيشية.',
      '5. خفف الدعم العبء المالي المرتبط باقتناء السكن.',
    ],
    generalImpact: [
      '1. يساهم برنامج الدعم المباشر للسكن في تحسين الأوضاع السكنية.',
      '2. يساهم برنامج الدعم المباشر للسكن في تخفيف العبء المالي المرتبط باقتناء السكن.',
    ],
  };

  const ROUTES = [
    {
      key: 'g2_beneficiary', beneficiary: true,
      trustPage: 635182950, legitimacyPage: 102366153, evaluationPage: 599868521,
      old: [986026308, 2114254871, 50993500, 61230704, 1876370120, 339768851, 1193605205, 1531160342, 413962512],
      keys: {
        trust: ['990000000000000041','990000000000000042','990000000000000043','990000000000000044','990000000000000045'],
        legitimacy: ['1486461560','1904067536','1513964979','1092411069'],
        ease: ['1248958122','1537513608','664408094'],
        accept: ['1011219132','1200558200','844136116'],
        beneficiary: ['2008127058','1587790851','411578762','271992870','301943015'],
      },
    },
    {
      key: 'g2_other', beneficiary: false,
      trustPage: 975922419, legitimacyPage: 1483995887, evaluationPage: 297175826,
      old: [899892812, 2041391566, 1491746703, 207303477, 540589075, 507386474],
      keys: {
        trust: ['990000000000000051','990000000000000052','990000000000000053','990000000000000054','990000000000000055'],
        legitimacy: ['1677021184','520351974','1645334930','961995117'],
        ease: ['1198945725','1009069255','258582065'],
        accept: ['1265924651','1744035836','89167698'],
        generalImpact: ['471635203','1258806770'],
      },
    },
    {
      key: 'official_beneficiary', beneficiary: true,
      trustPage: 1938112528, legitimacyPage: 599401281, evaluationPage: 1177990968,
      old: [1407402892, 635449595, 629398498, 1903531639, 1368927621, 1608212045, 1042309901, 1898769371, 704500165],
      keys: {
        trust: ['933937764','844787965','1182559343','91257242','674993537'],
        legitimacy: ['1896687752','500642904','1151297594','1948347725'],
        ease: ['2143980090','1321206863','833854624'],
        accept: ['1229613680','3871385','1641681581'],
        beneficiary: ['1415343217','1319006138','1388444923','1864877569','800971163'],
      },
    },
    {
      key: 'official_other', beneficiary: false,
      trustPage: 570856906, legitimacyPage: 524736811, evaluationPage: 975374926,
      old: [643914095, 1726030716, 774097703, 911793325, 2054373503, 884816490],
      keys: {
        trust: ['1808656211','1992870685','1344743776','2037118212','1300161676'],
        legitimacy: ['1119108321','825450485','901308624','2085038932'],
        ease: ['883213170','1032356922','634945297'],
        accept: ['1155871809','917543744','397729049'],
        generalImpact: ['157757540','222082286'],
      },
    },
  ];

  const form = FormApp.openById(FORM_ID);
  const props = PropertiesService.getScriptProperties();
  const state = lireJsonFinalV2_(props.getProperty(STATE_KEY));
  const avant = form.getItems().length;

  ROUTES.forEach(function (route) {
    const routeState = state[route.key] || {};
    const trustPage = exigerPageFinalV2_(form, route.trustPage).setTitle(T.trust);
    const legitimacyPage = exigerPageFinalV2_(form, route.legitimacyPage).setTitle(T.legitimacy);
    const evaluationPage = exigerPageFinalV2_(form, route.evaluationPage).setTitle(T.accept);

    const trust = obtenirGrilleFinaleV2_(form, routeState.trust, T.trust, R.trust, LIKERT);
    const legitimacy = obtenirGrilleFinaleV2_(form, routeState.legitimacy, T.legitimacy, R.legitimacy, LIKERT);
    const ease = obtenirGrilleFinaleV2_(form, routeState.ease, T.ease, R.ease, LIKERT);
    const accept = obtenirGrilleFinaleV2_(form, routeState.accept, T.accept, R.accept, LIKERT);
    const outcome = route.beneficiary
      ? obtenirGrilleFinaleV2_(form, routeState.outcome, T.beneficiary, R.beneficiary, LIKERT)
      : obtenirGrilleFinaleV2_(form, routeState.outcome, T.generalImpact, R.generalImpact, LIKERT);

    placerApresFinalV2_(form, trust, trustPage);
    placerApresFinalV2_(form, legitimacy, legitimacyPage);
    placerApresFinalV2_(form, ease, evaluationPage);
    placerApresFinalV2_(form, accept, ease);
    placerApresFinalV2_(form, outcome, accept);

    state[route.key] = {
      trust: trust.getId(), legitimacy: legitimacy.getId(),
      ease: ease.getId(), accept: accept.getId(), outcome: outcome.getId(),
    };
    props.setProperty(STATE_KEY, JSON.stringify(state));
  });

  ROUTES.forEach(function (route) {
    route.old.forEach(function (id) { supprimerSiPresentFinalV2_(form, id); });
  });
  supprimerItemsGenerauxRestantsFinalV2_(form);

  let entryMap = lireJsonFinalV2_(props.getProperty(ENTRY_MAP_KEY));
  if (!Object.keys(entryMap).length && typeof actualiserCorrespondanceFormulaire_ === 'function') {
    entryMap = actualiserCorrespondanceFormulaire_(form) || {};
  }
  if (!Object.keys(entryMap).length) {
    throw new Error('FORM_ENTRY_ITEM_MAP_V1 est absente. Exécutez d’abord installerControleParticipationGoogle().');
  }
  ROUTES.forEach(function (route) {
    const s = state[route.key];
    associerLignesFinalV2_(entryMap, route.keys.trust, s.trust);
    associerLignesFinalV2_(entryMap, route.keys.legitimacy, s.legitimacy);
    associerLignesFinalV2_(entryMap, route.keys.ease, s.ease);
    associerLignesFinalV2_(entryMap, route.keys.accept, s.accept);
    associerLignesFinalV2_(entryMap, route.beneficiary ? route.keys.beneficiary : route.keys.generalImpact, s.outcome);
  });
  props.setProperty(ENTRY_MAP_KEY, JSON.stringify(entryMap));

  SpreadsheetApp.flush();
  Utilities.sleep(2500);
  actualiserAnalyseFinaleV2_(SHEET_ID, T, R);
  verifierStructureFinaleV2_(form, ROUTES, state, T, R);

  console.log('STRUCTURE_FINALE_APPLIQUEE: oui');
  console.log('NOMBRE_ITEMS_AVANT_APRES: ' + avant + ' / ' + form.getItems().length);
  console.log('CONFIANCE: 5 items, item général supprimé, médiatrice');
  console.log('LEGITIMITE: 4 items, médiatrice');
  console.log('FACILITE: 3 items');
  console.log('ACCEPTABILITE: 3 items, aucun item « أؤيد »');
  console.log('BENEFICIAIRE: satisfaction 3 + impact personnel 2 dans une seule rubrique');
  console.log('NON_BENEFICIAIRE: impact général 2 items uniquement');
  console.log('SCORE_REUSSITE_BENEFICIAIRE: moyenne de 4 dimensions');
  console.log('SCORE_REUSSITE_NON_BENEFICIAIRE: vide');
  console.log('DONNEES_HISTORIQUES: conservees et exclues des nouveaux scores');
  console.log('CORRESPONDANCE_SITE: actualisee');
  console.log('GOOGLE_SHEET: formules et dictionnaires actualises');
  console.log('AUTRES_SECTIONS_INCHANGEES: oui');
}

function obtenirGrilleFinaleV2_(form, id, title, rows, columns) {
  let item = id ? form.getItemById(Number(id)) : null;
  if (item && item.getType() !== FormApp.ItemType.GRID) item = null;
  const grid = item ? item.asGridItem() : form.addGridItem();
  grid.setTitle(title).setRows(rows).setColumns(columns).setRequired(true);
  return grid;
}

function exigerPageFinalV2_(form, id) {
  const item = form.getItemById(Number(id));
  if (!item || item.getType() !== FormApp.ItemType.PAGE_BREAK) throw new Error('Page introuvable: ' + id);
  return item.asPageBreakItem();
}

function placerApresFinalV2_(form, item, previous) {
  const destination = previous.getIndex() + 1;
  if (item.getIndex() !== destination) form.moveItem(item.getIndex(), destination);
}

function supprimerSiPresentFinalV2_(form, id) {
  const item = form.getItemById(Number(id));
  if (item) form.deleteItem(item.getIndex());
}

function supprimerItemsGenerauxRestantsFinalV2_(form) {
  const motifs = [
    'بصفة عامة، أثق في الوزارة فيما يتعلق بتدبير',
    'بصفة عامة، أثق في قدرة الوزارة على تدبير',
    'بصفة عامة، أقيّم نجاح برنامج الدعم المباشر للسكن',
  ];
  form.getItems().slice().reverse().forEach(function (item) {
    if (item.getType() !== FormApp.ItemType.GRID) return;
    const grid = item.asGridItem();
    const texte = [grid.getTitle()].concat(grid.getRows()).join('\n');
    if (motifs.some(function (motif) { return texte.indexOf(motif) !== -1; })) {
      form.deleteItem(item.getIndex());
    }
  });
}

function associerLignesFinalV2_(map, keys, itemId) {
  (keys || []).forEach(function (key, index) {
    map[String(key)] = { itemId: String(itemId), rowIndex: index };
  });
}

function lireJsonFinalV2_(raw) {
  if (!raw) return {};
  try { return JSON.parse(raw) || {}; } catch (_) { return {}; }
}

function actualiserAnalyseFinaleV2_(spreadsheetId, titles, rows) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const raw = ss.getSheetByName('Réponses au formulaire');
  const items = ss.getSheetByName('ITEMS_LIKERT');
  const scoring = ss.getSheetByName('SCORING');
  const codebook = ss.getSheetByName('CODEBOOK');
  let correspondence = ss.getSheetByName('Correspondance_Titres_Variables') || ss.getSheetByName('Correspondance');
  if (!raw || !items || !scoring || !codebook) throw new Error('Feuille analytique requise introuvable.');
  if (!correspondence) correspondence = ss.insertSheet('Correspondance_Titres_Variables');

  let headers = raw.getRange(1, 1, 1, raw.getLastColumn()).getDisplayValues()[0];
  const specs = [
    ['trust_1', titles.trust, rows.trust[0], 22],
    ['trust_2', titles.trust, rows.trust[1], 23],
    ['trust_3', titles.trust, rows.trust[2], 24],
    ['trust_4', titles.trust, rows.trust[3], 25],
    ['trust_5', titles.trust, rows.trust[4], 26],
    ['legit_1', titles.legitimacy, rows.legitimacy[0], 27],
    ['legit_2', titles.legitimacy, rows.legitimacy[1], 28],
    ['legit_3', titles.legitimacy, rows.legitimacy[2], 29],
    ['legit_4', titles.legitimacy, rows.legitimacy[3], 30],
    ['ease_1', titles.ease, rows.ease[0], 31],
    ['ease_2', titles.ease, rows.ease[1], 32],
    ['ease_3', titles.ease, rows.ease[2], 33],
    ['accept_1', titles.accept, rows.accept[0], 34],
    ['accept_2', titles.accept, rows.accept[1], 35],
    ['accept_3', titles.accept, rows.accept[2], 36],
    ['satisfaction_1', titles.beneficiary, rows.beneficiary[0], 37],
    ['satisfaction_2', titles.beneficiary, rows.beneficiary[1], 38],
    ['satisfaction_3', titles.beneficiary, rows.beneficiary[2], 39],
    ['impact_general_1', titles.generalImpact, rows.generalImpact[0], 40],
    ['impact_general_2', titles.generalImpact, rows.generalImpact[1], 41],
    ['impact_personal_1', titles.beneficiary, rows.beneficiary[3], 46],
    ['impact_personal_2', titles.beneficiary, rows.beneficiary[4], 47],
  ];

  const attendusManquants = function () {
    return specs.filter(function (spec) { return !colonnesEntetesFinalesV2_(headers, spec[1], spec[2]).length; });
  };
  for (let tentative = 0; tentative < 3 && attendusManquants().length; tentative++) {
    SpreadsheetApp.flush();
    Utilities.sleep(2500);
    headers = raw.getRange(1, 1, 1, raw.getLastColumn()).getDisplayValues()[0];
  }
  specs.forEach(function (spec) {
    const key = spec[0], title = spec[1], row = spec[2], col = spec[3];
    const indexes = colonnesEntetesFinalesV2_(headers, title, row);
    if (!indexes.length) throw new Error('Colonne brute introuvable après mise à jour: ' + key);
    items.getRange(1, col).setValue(key);
    items.getRange(2, col).setFormula(formuleLikertFinaleV2_(indexes));
  });
  items.getRange('AP1').setValue('HIST_impact_general_3_exclu');
  items.getRange('AV1').setValue('HIST_impact_personal_3_exclu');

  const formulas = {
    Q2: '=ARRAYFORMULA(IF(B2:B="";"";IF((ITEMS_LIKERT!V2:V<>"")*(ITEMS_LIKERT!W2:W<>"")*(ITEMS_LIKERT!X2:X<>"")*(ITEMS_LIKERT!Y2:Y<>"")*(ITEMS_LIKERT!Z2:Z<>"");(ITEMS_LIKERT!V2:V+ITEMS_LIKERT!W2:W+ITEMS_LIKERT!X2:X+ITEMS_LIKERT!Y2:Y+ITEMS_LIKERT!Z2:Z)/5;"")))',
    R2: '=ARRAYFORMULA(IF(B2:B="";"";IF((ITEMS_LIKERT!AA2:AA<>"")*(ITEMS_LIKERT!AB2:AB<>"")*(ITEMS_LIKERT!AC2:AC<>"")*(ITEMS_LIKERT!AD2:AD<>"");(ITEMS_LIKERT!AA2:AA+ITEMS_LIKERT!AB2:AB+ITEMS_LIKERT!AC2:AC+ITEMS_LIKERT!AD2:AD)/4;"")))',
    S2: '=ARRAYFORMULA(IF(B2:B="";"";IF((ITEMS_LIKERT!AE2:AE<>"")*(ITEMS_LIKERT!AF2:AF<>"")*(ITEMS_LIKERT!AG2:AG<>"");(ITEMS_LIKERT!AE2:AE+ITEMS_LIKERT!AF2:AF+ITEMS_LIKERT!AG2:AG)/3;"")))',
    T2: '=ARRAYFORMULA(IF(B2:B="";"";IF((ITEMS_LIKERT!AH2:AH<>"")*(ITEMS_LIKERT!AI2:AI<>"")*(ITEMS_LIKERT!AJ2:AJ<>"");(ITEMS_LIKERT!AH2:AH+ITEMS_LIKERT!AI2:AI+ITEMS_LIKERT!AJ2:AJ)/3;"")))',
    U2: '=ARRAYFORMULA(IF(B2:B="";"";IF(AF2:AF="نعم، استفدت شخصيًا من البرنامج.";"";IF((ITEMS_LIKERT!AN2:AN<>"")*(ITEMS_LIKERT!AO2:AO<>"");(ITEMS_LIKERT!AN2:AN+ITEMS_LIKERT!AO2:AO)/2;""))))',
    V2: '=ARRAYFORMULA(IF(B2:B="";"";IF(AF2:AF="نعم، استفدت شخصيًا من البرنامج.";IF((S2:S<>"")*(T2:T<>"")*(W2:W<>"")*(Y2:Y<>"");(S2:S+T2:T+W2:W+Y2:Y)/4;"");"")))',
    W2: '=ARRAYFORMULA(IF(B2:B="";"";IF(AF2:AF="نعم، استفدت شخصيًا من البرنامج.";IF((ITEMS_LIKERT!AK2:AK<>"")*(ITEMS_LIKERT!AL2:AL<>"")*(ITEMS_LIKERT!AM2:AM<>"");(ITEMS_LIKERT!AK2:AK+ITEMS_LIKERT!AL2:AL+ITEMS_LIKERT!AM2:AM)/3;"");"")))',
    Y2: '=ARRAYFORMULA(IF(B2:B="";"";IF(AF2:AF="نعم، استفدت شخصيًا من البرنامج.";IF((ITEMS_LIKERT!AT2:AT<>"")*(ITEMS_LIKERT!AU2:AU<>"");(ITEMS_LIKERT!AT2:AT+ITEMS_LIKERT!AU2:AU)/2;"");"")))',
    CD2: '=ARRAYFORMULA(IF(B2:B="";"";IF(AF2:AF="نعم، استفدت شخصيًا من البرنامج.";IF((S2:S<>"")*(T2:T<>"")*(W2:W<>"")*(Y2:Y<>"");(S2:S>3)+(T2:T>3)+(W2:W>3)+(Y2:Y>3);"");"")))',
  };
  const names = {
    Q1:'Score_Confiance', R1:'Score_Légitimité', S1:'Score_Facilité_Accès',
    T1:'Score_Adhésion_Acceptabilité', U1:'Score_Impact_Général', V1:'Score_Réussite_Perçue',
    W1:'Score_Satisfaction', Y1:'Score_Impact_Personnel',
    AY1:'Indice_Confiance_0_100', BA1:'Indice_Légitimité_0_100', BC1:'Indice_Facilité_Accès_0_100',
    BE1:'Indice_Adhésion_Acceptabilité_0_100', BG1:'Indice_Impact_Général_0_100', BI1:'Indice_Réussite_Perçue_0_100',
    BK1:'Indice_Satisfaction_0_100', BO1:'Indice_Impact_Personnel_0_100',
    AC1:'HIST_G_REUSSITE_GLOBAL_EXCLU', AD1:'HIST_G_CONFIANCE_GENERALE_EXCLUE',
    CD1:'NB_DIM_POS_REUSSITE_0_4',
  };
  Object.keys(names).forEach(function (a1) { scoring.getRange(a1).setValue(names[a1]); });
  Object.keys(formulas).forEach(function (a1) { scoring.getRange(a1).setFormula(formulas[a1]); });

  actualiserCodebookFinalV2_(codebook, titles, rows);
  actualiserCorrespondanceFinaleV2_(correspondence, titles, rows);
  SpreadsheetApp.flush();
}

function colonnesEntetesFinalesV2_(headers, title, row) {
  const exact = title + ' [' + row + ']';
  const result = [];
  headers.forEach(function (header, index) { if (String(header).trim() === exact) result.push(index + 1); });
  return result;
}

function formuleLikertFinaleV2_(columnIndexes) {
  let source = '""';
  columnIndexes.slice().reverse().forEach(function (index) {
    const col = lettreColonneFinaleV2_(index);
    source = 'IF(\'Réponses au formulaire\'!' + col + '2:' + col + '<>"";\'Réponses au formulaire\'!' + col + '2:' + col + ';' + source + ')';
  });
  return '=ARRAYFORMULA(IF(\'Réponses au formulaire\'!A2:A="";"";LET(V;' + source + ';IF(V="";"";IFERROR(VALUE(REGEXEXTRACT(V;"^[1-5]"));SWITCH(V;"لا أوافق إطلاقًا";1;"لا أوافق";2;"لا أوافق ولا أعارض";3;"أوافق";4;"أوافق تمامًا";5;""))))))';
}

function lettreColonneFinaleV2_(n) {
  let s = '';
  while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

function actualiserCodebookFinalV2_(sheet, titles, rows) {
  const likert = 'لا أوافق إطلاقًا=1; لا أوافق=2; لا أوافق ولا أعارض=3; أوافق=4; أوافق تمامًا=5; vide=NA';
  const records = [];
  function pushItems(prefix, title, itemRows, dimension, usage, population) {
    itemRows.forEach(function (row, index) {
      records.push([prefix + (index + 1), title + ' — ' + row, 'Item Likert', likert, dimension, usage + '; Population=' + population, 'Nouvelles colonnes du formulaire; anciennes colonnes conservées comme historiques']);
    });
  }
  pushItems('trust_', titles.trust, rows.trust, 'Confiance institutionnelle', 'Score_Confiance; médiatrice; hors Score_Réussite_Perçue', 'tous les répondants concernés');
  pushItems('legit_', titles.legitimacy, rows.legitimacy, 'Légitimité perçue', 'Score_Légitimité; médiatrice; hors Score_Réussite_Perçue', 'tous les répondants concernés');
  pushItems('ease_', titles.ease, rows.ease, 'Facilité d’accès', 'Score_Facilité_Accès; dimension de réussite', 'bénéficiaires et non-bénéficiaires');
  pushItems('accept_', titles.accept, rows.accept, 'Adhésion / acceptabilité', 'Score_Adhésion_Acceptabilité; dimension de réussite', 'bénéficiaires et non-bénéficiaires');
  pushItems('satisfaction_', titles.beneficiary, rows.beneficiary.slice(0,3), 'Satisfaction', 'Score_Satisfaction; dimension de réussite', 'bénéficiaires personnels uniquement');
  pushItems('impact_personal_', titles.beneficiary, rows.beneficiary.slice(3), 'Impact personnel', 'Score_Impact_Personnel; dimension de réussite', 'bénéficiaires personnels uniquement');
  pushItems('impact_general_', titles.generalImpact, rows.generalImpact, 'Impact général', 'Score_Impact_Général; hors score complet', 'non-bénéficiaires uniquement');
  const obsolete = ['trust_general_common','trust_general','success_global','impact_general_3','impact_personal_3'];
  const values = sheet.getDataRange().getValues();
  const byKey = {};
  for (let i = 1; i < values.length; i++) byKey[String(values[i][0])] = i + 1;
  obsolete.forEach(function (key) {
    if (byKey[key]) sheet.getRange(byKey[key], 2, 1, 6).setValues([['[HISTORIQUE — EXCLU DES NOUVEAUX SCORES]','Historique','Conservé brut; non recodé','Historique','Exclu de toutes les formules','Colonnes brutes historiques conservées']]);
  });
  records.forEach(function (record) {
    const row = byKey[record[0]] || sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, 7).setValues([record]);
  });
}

function actualiserCorrespondanceFinaleV2_(sheet, titles, rows) {
  const data = [['Variable analytique','Titre visible','Item / formule','Population','Échelle / codage','Rôle / applicabilité','Visible au répondant']];
  function add(variable, title, itemRows, population, role, visible) {
    itemRows.forEach(function (row) { data.push([variable,title,row,population,'Likert 1–5; moyenne; NA=vide',role,visible]); });
  }
  add('Confiance institutionnelle / الثقة في الوزارة', titles.trust, rows.trust, 'Tous les répondants concernés', 'Médiatrice; exclue de Score_Réussite_Perçue', 'Oui');
  add('Légitimité perçue / مشروعية البرنامج', titles.legitimacy, rows.legitimacy, 'Tous les répondants concernés', 'Médiatrice; exclue de Score_Réussite_Perçue', 'Oui');
  add('Facilité d’accès', titles.ease, rows.ease, 'Bénéficiaires et non-bénéficiaires', 'Dimension de réussite', 'Oui');
  add('Adhésion / acceptabilité', titles.accept, rows.accept, 'Bénéficiaires et non-bénéficiaires', 'Dimension de réussite', 'Oui');
  add('Satisfaction', titles.beneficiary, rows.beneficiary.slice(0,3), 'Bénéficiaires personnels', 'Score_Satisfaction', 'Oui — bénéficiaires personnels uniquement');
  add('Impact personnel', titles.beneficiary, rows.beneficiary.slice(3), 'Bénéficiaires personnels', 'Score_Impact_Personnel', 'Oui — bénéficiaires personnels uniquement');
  add('Impact général', titles.generalImpact, rows.generalImpact, 'Non-bénéficiaires', 'Score_Impact_Général; pas de score complet', 'Oui — non-bénéficiaires uniquement');
  data.push(['Score_Réussite_Perçue','—','(Score_Facilité_Accès + Score_Adhésion_Acceptabilité + Score_Satisfaction + Score_Impact_Personnel) / 4','Bénéficiaires personnels','Moyenne égale de 4 dimensions','Confiance et légitimité exclues','Non']);
  if (!sheet.getRange('A1').getValue()) sheet.getRange(1, 1, 1, data[0].length).setValues([data[0]]);
  const existing = sheet.getDataRange().getValues();
  const activeVariables = data.slice(1).map(function (row) { return row[0]; });
  const validKeys = {};
  data.slice(1).forEach(function (row) { validKeys[row[0] + '\n' + row[2]] = true; });
  for (let r = 1; r < existing.length; r++) {
    const variable = String(existing[r][0] || '');
    if (activeVariables.indexOf(variable) !== -1 && !validKeys[variable + '\n' + String(existing[r][2] || '')]) {
      sheet.getRange(r + 1, 1, 1, data[0].length).setValues([[
        variable, existing[r][1], '[HISTORIQUE — EXCLU] ' + String(existing[r][2] || ''),
        existing[r][3], existing[r][4], 'Exclu des nouvelles formules', 'Non',
      ]]);
    }
  }
  const refreshed = sheet.getDataRange().getValues();
  const byKey = {};
  for (let r = 1; r < refreshed.length; r++) byKey[String(refreshed[r][0]) + '\n' + String(refreshed[r][2])] = r + 1;
  data.slice(1).forEach(function (row) {
    const key = row[0] + '\n' + row[2];
    const target = byKey[key] || sheet.getLastRow() + 1;
    sheet.getRange(target, 1, 1, data[0].length).setValues([row]);
  });
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, data[0].length);
}

function verifierStructureFinaleV2_(form, routes, state, titles, rows) {
  routes.forEach(function (route) {
    const s = state[route.key];
    const expected = [
      [s.trust, titles.trust, rows.trust],
      [s.legitimacy, titles.legitimacy, rows.legitimacy],
      [s.ease, titles.ease, rows.ease],
      [s.accept, titles.accept, rows.accept],
      [s.outcome, route.beneficiary ? titles.beneficiary : titles.generalImpact, route.beneficiary ? rows.beneficiary : rows.generalImpact],
    ];
    expected.forEach(function (definition) {
      const item = form.getItemById(Number(definition[0]));
      if (!item || item.getType() !== FormApp.ItemType.GRID) throw new Error('Grille finale absente: ' + route.key);
      const grid = item.asGridItem();
      if (!grid.isRequired()) throw new Error('Grille non obligatoire: ' + route.key + ' / ' + definition[1]);
      if (grid.getTitle() !== definition[1] || JSON.stringify(grid.getRows()) !== JSON.stringify(definition[2])) throw new Error('Contenu incorrect: ' + route.key + ' / ' + definition[1]);
    });
  });
  const forbidden = ['أؤيد تطبيق برنامج الدعم المباشر للسكن.','بصفة عامة، أقيّم نجاح برنامج الدعم المباشر للسكن تقييمًا إيجابيًا.'];
  const visible = form.getItems(FormApp.ItemType.GRID).map(function (item) { const g = item.asGridItem(); return [g.getTitle()].concat(g.getRows()).join('\n'); }).join('\n');
  forbidden.forEach(function (text) { if (visible.indexOf(text) !== -1) throw new Error('Item interdit encore visible: ' + text); });
}
