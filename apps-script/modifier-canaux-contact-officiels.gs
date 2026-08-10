/**
 * Met à jour la question du dernier canal de contact dans les quatre parcours
 * du Google Form et ajoute une saisie libre conditionnelle pour « autre ».
 *
 * Exécuter une seule fois : modifierCanauxContactOfficiels()
 */
function modifierCanauxContactOfficiels() {
  const FORM_ID = '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo';
  const form = FormApp.openById(FORM_ID);

  const NOUVEAU_TITRE =
    'عبر أي قناة رسمية تم آخر تواصل لكم بشأن برنامج الدعم المباشر للسكن؟';

  const CHOIX_STANDARD = [
    'خدمة «اتصل بنا» على منصة «دعم سكن»',
    'خدمة التواصل أو نموذج الاتصال عبر الموقع الإلكتروني الرسمي للوزارة',
    'البوابة الوطنية للشكايات «Chikaya.ma»',
    'الرقم الهاتفي أو مركز الاتصال الرسمي المخصص للاستفسارات بشأن البرنامج',
    'البريد الإلكتروني الرسمي المخصص للتواصل بشأن البرنامج',
    'الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي، عبر الرسائل الخاصة أو التعليقات',
  ];

  const CHOIX_AUTRE =
    'قناة رسمية أخرى للتواصل بشأن البرنامج، يرجى تحديدها:';

  const TITRE_PAGE_AUTRE = 'تحديد قناة التواصل الرسمية الأخرى';
  const TITRE_TEXTE_AUTRE =
    'قناة رسمية أخرى للتواصل بشأن البرنامج، يرجى تحديدها:';

  const PARCOURS = [
    { route: 'g2_beneficiary', questionId: 1051412983 },
    { route: 'g2_other', questionId: 1748054727 },
    { route: 'official_beneficiary', questionId: 1917194186 },
    { route: 'official_other', questionId: 641302619 },
  ];

  const resultat = [];

  PARCOURS.forEach(config => {
    const itemBase = form.getItemById(config.questionId);
    if (!itemBase || itemBase.getType() !== FormApp.ItemType.MULTIPLE_CHOICE) {
      throw new Error(
        'Question de canal introuvable pour ' +
          config.route +
          ' (ID ' +
          config.questionId +
          ')'
      );
    }

    let question = itemBase.asMultipleChoiceItem();
    const choixActuels = question.getChoices();
    if (!choixActuels.length) {
      throw new Error('Aucun choix trouvé pour ' + config.route);
    }

    // Les choix normaux actuels conduisent tous à la page « réponse reçue ».
    let pageReponse = null;
    for (let i = 0; i < choixActuels.length; i++) {
      if (choixActuels[i].getValue() === CHOIX_AUTRE) continue;
      try {
        pageReponse = choixActuels[i].getGotoPage();
      } catch (_) {
        pageReponse = null;
      }
      if (pageReponse) break;
    }

    if (!pageReponse) {
      throw new Error(
        'Destination de la question de canal introuvable pour ' + config.route
      );
    }

    const pageReponseId = pageReponse.getId();
    let pageAutre = null;
    let texteAutre = null;

    // Réutilisation en cas de seconde exécution accidentelle.
    const choixAutreExistant = choixActuels.find(
      choix => choix.getValue() === CHOIX_AUTRE
    );
    if (choixAutreExistant) {
      try {
        pageAutre = choixAutreExistant.getGotoPage();
      } catch (_) {
        pageAutre = null;
      }
    }

    if (pageAutre) {
      const items = form.getItems();
      const depart = items.findIndex(x => x.getId() === pageAutre.getId());
      for (let i = depart + 1; i < items.length; i++) {
        if (items[i].getType() === FormApp.ItemType.PAGE_BREAK) break;
        if (
          items[i].getType() === FormApp.ItemType.TEXT &&
          items[i].getTitle() === TITRE_TEXTE_AUTRE
        ) {
          texteAutre = items[i].asTextItem();
          break;
        }
      }
    }

    if (!pageAutre) {
      pageAutre = form
        .addPageBreakItem()
        .setTitle(TITRE_PAGE_AUTRE);
    }

    if (!texteAutre) {
      texteAutre = form
        .addTextItem()
        .setTitle(TITRE_TEXTE_AUTRE)
        .setRequired(true);
    } else {
      texteAutre.setTitle(TITRE_TEXTE_AUTRE).setRequired(true);
    }

    const pageAutreId = pageAutre.getId();
    const texteAutreId = texteAutre.getId();

    // Placer la page « autre » juste avant la page normale suivante.
    let destinationIndex = form.getItemById(pageReponseId).getIndex();
    let departPage = form.getItemById(pageAutreId).getIndex();
    if (departPage !== destinationIndex) {
      form.moveItem(departPage, destinationIndex);
    }

    const pageIndex = form.getItemById(pageAutreId).getIndex();
    const departTexte = form.getItemById(texteAutreId).getIndex();
    if (departTexte !== pageIndex + 1) {
      form.moveItem(departTexte, pageIndex + 1);
    }

    question = form
      .getItemById(config.questionId)
      .asMultipleChoiceItem();
    pageAutre = form
      .getItemById(pageAutreId)
      .asPageBreakItem();
    pageReponse = form
      .getItemById(pageReponseId)
      .asPageBreakItem();

    pageAutre
      .setTitle(TITRE_PAGE_AUTRE)
      .setGoToPage(pageReponse);

    question
      .setTitle(NOUVEAU_TITRE)
      .setChoices(
        CHOIX_STANDARD
          .map(valeur => question.createChoice(valeur, pageReponse))
          .concat([question.createChoice(CHOIX_AUTRE, pageAutre)])
      )
      .setRequired(true);

    resultat.push({
      route: config.route,
      canalQuestionId: String(config.questionId),
      autreTextId: String(texteAutreId),
      autrePageId: String(pageAutreId),
      responsePageId: String(pageReponseId),
    });
  });

  // Indices à utiliser dans pageHistory du site.
  const pages = form.getItems(FormApp.ItemType.PAGE_BREAK);
  const pageHistoryIndex = pageId =>
    pages.findIndex(page => page.getId() === pageId) + 1;

  resultat.forEach(ligne => {
    ligne.autrePageHistory = pageHistoryIndex(Number(ligne.autrePageId));
    ligne.responsePageHistory = pageHistoryIndex(Number(ligne.responsePageId));
  });

  console.log(
    JSON.stringify({
      status: 'canaux_contact_modifies',
      formEditUrl: form.getEditUrl(),
      formPublicUrl: form.getPublishedUrl(),
      mappings: resultat,
    })
  );
}
