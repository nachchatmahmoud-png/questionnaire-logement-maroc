/**
 * Correctif Google Forms du 12/08/2026.
 *
 * À placer dans le MÊME projet Apps Script que :
 * installerControleParticipationGoogle..gs
 *
 * Objectif :
 * - Q1 = نعم  -> aller vers Q2 ;
 * - Q1 = لا   -> afficher la question :
 *      عبر أي وسيلة تفضلون التوصل بمعلومات حول البرامج العمومية؟
 *   puis aller directement aux informations générales ;
 * - cette question ne doit jamais apparaître pour Q1 = نعم ;
 * - ne pas ajouter SMS ni WhatsApp.
 *
 * Fonction à exécuter :
 * corrigerFormulaireEtSynchroniserSheet()
 */

const ROUTAGE_Q1_20260812 = Object.freeze({
  Q1_TITLE:
    'س1. هل سبق لكم أن سمعتم ببرنامج الدعم المباشر للسكن؟',

  Q2_TITLE:
    'س2. هل سبق لكم الاطلاع على معلومات حول برنامج الدعم المباشر للسكن عبر إحدى وسائل التواصل الرسمية للوزارة؟',

  DEMOGRAPHICS_FIRST_TITLE:
    '1. ما هي فئتكم العمرية؟',

  YES_VALUE: 'نعم',
  NO_VALUE: 'لا',

  YES_PAGE_PROPERTY: 'Q1_YES_PAGE_ID_20260812_V3',
  NO_PAGE_PROPERTY: 'Q1_NO_PAGE_ID_20260812_V3',
  DEMO_PAGE_PROPERTY: 'Q1_DEMO_PAGE_ID_20260812_V3',

  YES_PAGE_TITLE: 'متابعة الاستبيان',
  NO_PAGE_TITLE: 'وسيلة التواصل المفضلة',
  DEMO_PAGE_TITLE: 'المعلومات العامة',
});


/**
 * FONCTION PRINCIPALE À EXÉCUTER.
 */
function corrigerFormulaireEtSynchroniserSheet() {
  const formulaire = obtenirFormulaire_();

  // Vérifie/crée les 6 champs ajoutés.
  const questions = garantirMiseAJourQuestionnaire_(
    formulaire,
    true
  );

  // Replace les 5 autres champs près de leurs questions de référence.
  const autresDeplacements =
    repositionnerAutresQuestionsMiseAJour_(
      formulaire,
      questions
    );

  // Met la question du canal préféré dans une vraie section conditionnelle.
  const routage = garantirRoutageConditionnelQ1_(
    formulaire,
    questions.preferred_public_channel
  );

  // Régénère les entry IDs après modification de la structure du Form.
  const correspondance =
    actualiserCorrespondanceFormulaire_(
      formulaire
    );

  SpreadsheetApp.flush();

  // Contrôle final du routage.
  verifierRoutageConditionnelQ1_(
    formulaire,
    questions.preferred_public_channel,
    routage
  );

  console.log(
    'CORRECTION_FORMULAIRE_TERMINEE: oui'
  );

  console.log(
    'QUESTIONS_REPOSITIONNEES_AUTRES: ' +
    autresDeplacements
  );

  console.log(
    'ROUTAGE_Q1_CONDITIONNEL: actif'
  );

  console.log(
    'Q1_NON_VERS_CANAL_PREFERE: oui'
  );

  console.log(
    'Q1_OUI_VERS_Q2: oui'
  );

  console.log(
    'CANAL_PREFERE_VERS_INFORMATIONS_GENERALES: oui'
  );

  console.log(
    'QUESTION_CANAL_VISIBLE_SI_Q1_OUI: non'
  );

  console.log(
    'CORRESPONDANCE_ENTRY_ITEM_ACTUALISEE: ' +
    Object.keys(correspondance).length
  );

  console.log(
    'SMS_WHATSAPP_AJOUTES: non'
  );
}


/**
 * Crée/réutilise les sections nécessaires au branchement de Q1.
 *
 * Structure obtenue :
 *
 * Q1
 * ├── نعم -> [section OUI] -> Q2 -> parcours normal existant
 * └── لا  -> [section NON]
 *             عبر أي وسيلة تفضلون...
 *             -> [المعلومات العامة]
 *
 * Tous les autres parcours qui arrivent normalement avant les informations
 * générales sautent automatiquement la section NON.
 */
function garantirRoutageConditionnelQ1_(
  formulaire,
  questionCanalPrefere
) {
  const q1 =
    trouverQuestionChoixUniqueTitreExactRoutage_(
      formulaire,
      ROUTAGE_Q1_20260812.Q1_TITLE
    );

  const q2 =
    trouverQuestionChoixUniqueTitreExactRoutage_(
      formulaire,
      ROUTAGE_Q1_20260812.Q2_TITLE
    );

  const premiereQuestionDemo =
    trouverItemTitreExactRoutage_(
      formulaire,
      ROUTAGE_Q1_20260812.DEMOGRAPHICS_FIRST_TITLE
    );

  if (
    !q1 ||
    !q2 ||
    !premiereQuestionDemo ||
    !questionCanalPrefere
  ) {
    throw new Error(
      'CONFIGURATION_MISSING: Q1/Q2/démographie/canal préféré introuvable.'
    );
  }

  const proprietes =
    PropertiesService.getScriptProperties();


  /*
   * 1. SECTION OUI
   *
   * Elle doit commencer immédiatement avant Q2.
   */
  let yesPage =
    obtenirPageBreakDepuisProprieteRoutage_(
      formulaire,
      ROUTAGE_Q1_20260812.YES_PAGE_PROPERTY
    );

  if (!yesPage) {
    yesPage =
      trouverPageBreakImmediatAvantItemRoutage_(
        formulaire,
        q2
      );
  }

  if (!yesPage) {
    yesPage =
      formulaire
        .addPageBreakItem()
        .setTitle(
          ROUTAGE_Q1_20260812.YES_PAGE_TITLE
        );

    deplacerItemAvantRoutage_(
      formulaire,
      yesPage,
      q2
    );
  }

  proprietes.setProperty(
    ROUTAGE_Q1_20260812.YES_PAGE_PROPERTY,
    String(yesPage.getId())
  );


  /*
   * 2. SECTION INFORMATIONS GÉNÉRALES
   *
   * Elle doit commencer immédiatement avant la première question démographique.
   */
  let demoPage =
    obtenirPageBreakDepuisProprieteRoutage_(
      formulaire,
      ROUTAGE_Q1_20260812.DEMO_PAGE_PROPERTY
    );

  if (
    !demoPage ||
    !estPageBreakImmediatAvantItemRoutage_(
      formulaire,
      demoPage,
      premiereQuestionDemo
    )
  ) {
    demoPage =
      trouverPageBreakImmediatAvantItemRoutage_(
        formulaire,
        premiereQuestionDemo
      );
  }

  if (!demoPage) {
    demoPage =
      formulaire
        .addPageBreakItem()
        .setTitle(
          ROUTAGE_Q1_20260812.DEMO_PAGE_TITLE
        );

    deplacerItemAvantRoutage_(
      formulaire,
      demoPage,
      premiereQuestionDemo
    );
  }

  proprietes.setProperty(
    ROUTAGE_Q1_20260812.DEMO_PAGE_PROPERTY,
    String(demoPage.getId())
  );


  /*
   * 3. SECTION NON
   *
   * Elle est placée juste avant la section des informations générales.
   */
  let noPage =
    obtenirPageBreakDepuisProprieteRoutage_(
      formulaire,
      ROUTAGE_Q1_20260812.NO_PAGE_PROPERTY
    );

  if (!noPage) {
    noPage =
      trouverPageBreakParTitreRoutage_(
        formulaire,
        ROUTAGE_Q1_20260812.NO_PAGE_TITLE
      );
  }

  if (!noPage) {
    noPage =
      formulaire
        .addPageBreakItem()
        .setTitle(
          ROUTAGE_Q1_20260812.NO_PAGE_TITLE
        );
  }

  proprietes.setProperty(
    ROUTAGE_Q1_20260812.NO_PAGE_PROPERTY,
    String(noPage.getId())
  );


  /*
   * Ordre voulu :
   *
   * [noPage]
   * questionCanalPrefere
   * [demoPage]
   * première question démographique
   */

  deplacerItemAvantRoutage_(
    formulaire,
    noPage,
    demoPage
  );

  deplacerItemApresRoutage_(
    formulaire,
    questionCanalPrefere,
    noPage
  );

  deplacerItemApresRoutage_(
    formulaire,
    demoPage,
    questionCanalPrefere
  );


  /*
   * IMPORTANT :
   *
   * Lorsqu'un autre parcours arrive linéairement à noPage,
   * il doit sauter la section réservée à Q1 = لا.
   *
   * En revanche, lorsqu'on arrive à noPage via le choix Q1 = لا,
   * la navigation du choix prioritaire permet d'afficher cette section.
   */
  noPage.setGoToPage(
    demoPage
  );

  /*
   * Une fois la question du canal complétée,
   * continuer normalement vers les informations générales.
   */
  demoPage.setGoToPage(
    FormApp.PageNavigationType.CONTINUE
  );


  /*
   * 4. ROUTAGE DE Q1
   */
  try {
    q1.showOtherOption(false);
  } catch (_) {}

  const valeursQ1 =
    q1.getChoices().map(function(choice) {
      return String(
        choice.getValue() || ''
      ).trim();
    });

  if (
    valeursQ1.indexOf(
      ROUTAGE_Q1_20260812.YES_VALUE
    ) === -1
  ) {
    throw new Error(
      'CONFIGURATION_MISSING: réponse نعم absente de Q1.'
    );
  }

  if (
    valeursQ1.indexOf(
      ROUTAGE_Q1_20260812.NO_VALUE
    ) === -1
  ) {
    throw new Error(
      'CONFIGURATION_MISSING: réponse لا absente de Q1.'
    );
  }

  const nouveauxChoix =
    valeursQ1.map(function(valeur) {

      if (
        valeur ===
        ROUTAGE_Q1_20260812.NO_VALUE
      ) {
        return q1.createChoice(
          valeur,
          noPage
        );
      }

      if (
        valeur ===
        ROUTAGE_Q1_20260812.YES_VALUE
      ) {
        return q1.createChoice(
          valeur,
          yesPage
        );
      }

      // Sécurité si une ancienne valeur inattendue existe.
      return q1.createChoice(
        valeur,
        yesPage
      );
    });

  q1.setChoices(
    nouveauxChoix
  );

  q1.setRequired(true);

  /*
   * La question du canal est obligatoire uniquement
   * lorsqu'elle est effectivement affichée dans le parcours NON.
   */
  questionCanalPrefere.setRequired(true);

  return {
    q1: q1,
    q2: q2,
    yesPage: yesPage,
    noPage: noPage,
    demoPage: demoPage,
  };
}


/**
 * Vérifie que le routage final correspond bien à la demande.
 * Lance une erreur si quelque chose n'est pas conforme.
 */
function verifierRoutageConditionnelQ1_(
  formulaire,
  questionCanalPrefere,
  routage
) {
  const q1 = routage.q1;

  const choix =
    q1.getChoices();

  const choixOui =
    choix.find(function(choice) {
      return (
        String(choice.getValue()).trim() ===
        ROUTAGE_Q1_20260812.YES_VALUE
      );
    });

  const choixNon =
    choix.find(function(choice) {
      return (
        String(choice.getValue()).trim() ===
        ROUTAGE_Q1_20260812.NO_VALUE
      );
    });

  if (!choixOui || !choixNon) {
    throw new Error(
      'VERIFICATION_FAILED: choix نعم/لا introuvables.'
    );
  }

  const destinationOui =
    choixOui.getGotoPage();

  const destinationNon =
    choixNon.getGotoPage();

  if (
    !destinationOui ||
    String(destinationOui.getId()) !==
      String(routage.yesPage.getId())
  ) {
    throw new Error(
      'VERIFICATION_FAILED: Q1=نعم ne pointe pas vers Q2.'
    );
  }

  if (
    !destinationNon ||
    String(destinationNon.getId()) !==
      String(routage.noPage.getId())
  ) {
    throw new Error(
      'VERIFICATION_FAILED: Q1=لا ne pointe pas vers le canal préféré.'
    );
  }

  const indexNo =
    indexItemRoutage_(
      formulaire,
      routage.noPage
    );

  const indexCanal =
    indexItemRoutage_(
      formulaire,
      questionCanalPrefere
    );

  const indexDemo =
    indexItemRoutage_(
      formulaire,
      routage.demoPage
    );

  if (
    !(
      indexNo >= 0 &&
      indexCanal === indexNo + 1 &&
      indexDemo === indexCanal + 1
    )
  ) {
    throw new Error(
      'VERIFICATION_FAILED: ordre section NON / canal / démographie incorrect.'
    );
  }

  const indexQ2 =
    indexItemRoutage_(
      formulaire,
      routage.q2
    );

  const indexYes =
    indexItemRoutage_(
      formulaire,
      routage.yesPage
    );

  if (
    indexQ2 !== indexYes + 1
  ) {
    throw new Error(
      'VERIFICATION_FAILED: la section OUI ne mène pas directement à Q2.'
    );
  }
}


/**
 * Replace les 5 autres nouveaux champs.
 * Le canal préféré n'est volontairement PAS traité ici :
 * son emplacement est géré par garantirRoutageConditionnelQ1_().
 */
function repositionnerAutresQuestionsMiseAJour_(
  formulaire,
  questions
) {
  let deplacements = 0;

  // Détail "autre source officielle".
  deplacements +=
    deplacerQuestionApresTitreRoutage_(
      formulaire,
      questions.official_source_other_detail,
      MISE_A_JOUR_QUESTIONNAIRE.OFFICIAL_SOURCES_TITLE,
      0
    );

  // Détail "autre source externe".
  deplacements +=
    deplacerQuestionApresTitreRoutage_(
      formulaire,
      questions.external_source_other_detail,
      MISE_A_JOUR_QUESTIONNAIRE.EXTERNAL_SOURCES_TITLE,
      0
    );

  // Raison principale de non-consultation officielle.
  deplacements +=
    deplacerItemApresRoutage_(
      formulaire,
      questions.no_official_reason,
      questions.external_source_other_detail
    );

  // Détail "autre canal de dernier contact".
  const ancreContact =
    trouverItemParPredicatRoutage_(
      formulaire,
      function(item) {
        if (
          item.getType() !==
          FormApp.ItemType.MULTIPLE_CHOICE
        ) {
          return false;
        }

        const titre =
          String(
            item.getTitle() || ''
          ).trim();

        return (
          titre.indexOf(
            'آخر تواصل'
          ) !== -1 &&
          titre.indexOf(
            'قناة'
          ) !== -1
        );
      },
      0
    );

  if (ancreContact) {
    deplacements +=
      deplacerItemApresRoutage_(
        formulaire,
        questions.contact_channel_other_detail,
        ancreContact
      );
  }

  // Confiance générale commune.
  const ancreConfiance =
    trouverItemParPredicatRoutage_(
      formulaire,
      function(item) {
        const titre =
          String(
            item.getTitle() || ''
          ).trim();

        if (!titre) {
          return false;
        }

        return (
          titre.indexOf(
            'الثقة في الوزارة'
          ) !== -1 ||
          titre.indexOf(
            'الثقة العامة في الوزارة'
          ) !== -1
        );
      },
      -1
    );

  if (
    ancreConfiance &&
    String(
      ancreConfiance.getId()
    ) !==
    String(
      questions.trust_general_common.getId()
    )
  ) {
    deplacements +=
      deplacerItemApresRoutage_(
        formulaire,
        questions.trust_general_common,
        ancreConfiance
      );
  }

  return deplacements;
}


/**
 * Cherche une question MULTIPLE_CHOICE par titre exact.
 */
function trouverQuestionChoixUniqueTitreExactRoutage_(
  formulaire,
  titre
) {
  const trouves =
    formulaire
      .getItems(
        FormApp.ItemType.MULTIPLE_CHOICE
      )
      .filter(function(item) {
        return (
          String(
            item.getTitle() || ''
          ).trim() ===
          String(
            titre || ''
          ).trim()
        );
      });

  if (trouves.length !== 1) {
    return null;
  }

  return trouves[0]
    .asMultipleChoiceItem();
}


/**
 * Cherche un item par titre exact, quel que soit son type.
 */
function trouverItemTitreExactRoutage_(
  formulaire,
  titre
) {
  const trouves =
    formulaire
      .getItems()
      .filter(function(item) {
        return (
          String(
            item.getTitle() || ''
          ).trim() ===
          String(
            titre || ''
          ).trim()
        );
      });

  if (trouves.length !== 1) {
    return null;
  }

  return trouves[0];
}


/**
 * Retrouve un PageBreakItem mémorisé dans les propriétés du script.
 */
function obtenirPageBreakDepuisProprieteRoutage_(
  formulaire,
  cle
) {
  const id =
    PropertiesService
      .getScriptProperties()
      .getProperty(cle);

  if (!id) {
    return null;
  }

  const item =
    formulaire
      .getItems()
      .find(function(element) {
        return (
          String(
            element.getId()
          ) ===
            String(id) &&
          element.getType() ===
            FormApp.ItemType.PAGE_BREAK
        );
      });

  return item
    ? item.asPageBreakItem()
    : null;
}


/**
 * Cherche un PageBreakItem par titre.
 */
function trouverPageBreakParTitreRoutage_(
  formulaire,
  titre
) {
  const trouves =
    formulaire
      .getItems(
        FormApp.ItemType.PAGE_BREAK
      )
      .filter(function(item) {
        return (
          String(
            item.getTitle() || ''
          ).trim() ===
          String(
            titre || ''
          ).trim()
        );
      });

  if (!trouves.length) {
    return null;
  }

  return trouves[0]
    .asPageBreakItem();
}


/**
 * Retourne le saut de page immédiatement avant un item,
 * s'il existe.
 */
function trouverPageBreakImmediatAvantItemRoutage_(
  formulaire,
  item
) {
  const items =
    formulaire.getItems();

  const index =
    indexItemRoutage_(
      formulaire,
      item
    );

  if (index <= 0) {
    return null;
  }

  const precedent =
    items[index - 1];

  if (
    precedent.getType() !==
    FormApp.ItemType.PAGE_BREAK
  ) {
    return null;
  }

  return precedent
    .asPageBreakItem();
}


/**
 * Vérifie qu'un saut de page est immédiatement avant l'item.
 */
function estPageBreakImmediatAvantItemRoutage_(
  formulaire,
  page,
  item
) {
  const indexPage =
    indexItemRoutage_(
      formulaire,
      page
    );

  const indexItem =
    indexItemRoutage_(
      formulaire,
      item
    );

  return (
    indexPage >= 0 &&
    indexItem ===
      indexPage + 1
  );
}


/**
 * Retourne l'index actuel d'un item dans le Form.
 */
function indexItemRoutage_(
  formulaire,
  item
) {
  if (!item) {
    return -1;
  }

  const id =
    String(
      item.getId()
    );

  return formulaire
    .getItems()
    .findIndex(function(element) {
      return (
        String(
          element.getId()
        ) === id
      );
    });
}


/**
 * Déplace item juste AVANT ancre.
 */
function deplacerItemAvantRoutage_(
  formulaire,
  item,
  ancre
) {
  if (!item || !ancre) {
    return 0;
  }

  const itemId =
    String(
      item.getId()
    );

  const ancreId =
    String(
      ancre.getId()
    );

  if (itemId === ancreId) {
    return 0;
  }

  const items =
    formulaire.getItems();

  const indexItem =
    items.findIndex(function(element) {
      return (
        String(
          element.getId()
        ) === itemId
      );
    });

  const indexAncre =
    items.findIndex(function(element) {
      return (
        String(
          element.getId()
        ) === ancreId
      );
    });

  if (
    indexItem < 0 ||
    indexAncre < 0
  ) {
    return 0;
  }

  if (
    indexItem ===
    indexAncre - 1
  ) {
    return 0;
  }

  let cible =
    indexAncre;

  if (
    indexItem < cible
  ) {
    cible -= 1;
  }

  formulaire.moveItem(
    indexItem,
    cible
  );

  return 1;
}


/**
 * Déplace item juste APRÈS ancre.
 */
function deplacerItemApresRoutage_(
  formulaire,
  item,
  ancre
) {
  if (!item || !ancre) {
    return 0;
  }

  const itemId =
    String(
      item.getId()
    );

  const ancreId =
    String(
      ancre.getId()
    );

  if (itemId === ancreId) {
    return 0;
  }

  const items =
    formulaire.getItems();

  const indexItem =
    items.findIndex(function(element) {
      return (
        String(
          element.getId()
        ) === itemId
      );
    });

  const indexAncre =
    items.findIndex(function(element) {
      return (
        String(
          element.getId()
        ) === ancreId
      );
    });

  if (
    indexItem < 0 ||
    indexAncre < 0
  ) {
    return 0;
  }

  if (
    indexItem ===
    indexAncre + 1
  ) {
    return 0;
  }

  let cible =
    indexAncre + 1;

  if (
    indexItem < cible
  ) {
    cible -= 1;
  }

  formulaire.moveItem(
    indexItem,
    cible
  );

  return 1;
}


/**
 * Déplace une question après un titre exact.
 */
function deplacerQuestionApresTitreRoutage_(
  formulaire,
  question,
  titreAncre,
  occurrence
) {
  const ancre =
    trouverItemParPredicatRoutage_(
      formulaire,
      function(item) {
        return (
          String(
            item.getTitle() || ''
          ).trim() ===
          String(
            titreAncre || ''
          ).trim()
        );
      },
      occurrence
    );

  if (!ancre) {
    return 0;
  }

  return deplacerItemApresRoutage_(
    formulaire,
    question,
    ancre
  );
}


/**
 * Cherche un item par prédicat.
 *
 * occurrence = 0  -> premier
 * occurrence = 1  -> deuxième
 * occurrence = -1 -> dernier
 */
function trouverItemParPredicatRoutage_(
  formulaire,
  predicat,
  occurrence
) {
  const trouves =
    formulaire
      .getItems()
      .filter(predicat);

  if (!trouves.length) {
    return null;
  }

  if (occurrence === -1) {
    return trouves[
      trouves.length - 1
    ];
  }

  const index =
    Math.max(
      0,
      Number(
        occurrence
      ) || 0
    );

  return trouves[index] || null;
}


/**
 * Diagnostic facultatif.
 * Peut être exécuté après la correction pour relire le routage Q1.
 */
function diagnostiquerRoutageQ1() {
  const formulaire =
    obtenirFormulaire_();

  const q1 =
    trouverQuestionChoixUniqueTitreExactRoutage_(
      formulaire,
      ROUTAGE_Q1_20260812.Q1_TITLE
    );

  if (!q1) {
    throw new Error(
      'Q1 introuvable.'
    );
  }

  q1.getChoices().forEach(
    function(choice) {
      const destination =
        choice.getGotoPage();

      console.log(
        'Q1_CHOICE: ' +
        choice.getValue() +
        ' -> ' +
        (
          destination
            ? destination.getTitle() +
              ' [id=' +
              destination.getId() +
              ']'
            : String(
                choice.getPageNavigationType()
              )
        )
      );
    }
  );

  console.log(
    'DIAGNOSTIC_ROUTAGE_Q1_TERMINE: oui'
  );
}
