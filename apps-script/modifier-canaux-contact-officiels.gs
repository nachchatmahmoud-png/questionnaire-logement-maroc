/**
 * Met à jour la question du dernier canal de contact dans les quatre parcours
 * du Google Form, sans modifier les destinations de page existantes.
 *
 * Exécuter une seule fois : modifierCanauxContactOfficiels()
 */
function modifierCanauxContactOfficiels() {
  const FORM_ID = '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo';
  const form = FormApp.openById(FORM_ID);

  const TITRE =
    'عبر أي قناة رسمية تم آخر تواصل لكم بشأن برنامج الدعم المباشر للسكن؟';

  const CHOIX = [
    'منصة دعم سكن – DaamSakane.ma → عبر خدمة «اتصل بنا» على المنصة الرسمية.',
    'الموقع الرسمي للوزارة – mhpv.gov.ma → عبر نموذج الاتصال / خدمة التواصل على الموقع الرسمي للوزارة.',
    'البوابة الوطنية للشكايات – Chikaya.ma → عبر إيداع أو متابعة شكاية رسمية.',
    'الهاتف / مركز الاتصال الرسمي → عبر الرقم: \u200E+212 5 37 71 81 81',
    'البريد الإلكتروني الرسمي → عبر: contact@daamsakane.ma',
    'شبكات التواصل الاجتماعي الرسمية للوزارة → عبر Facebook أو Instagram أو باقي الحسابات الرسمية للوزارة، من خلال الرسائل الخاصة أو التعليقات.',
  ];

  const PARCOURS = [
    { route: 'g2_beneficiary', questionId: 1051412983 },
    { route: 'g2_other', questionId: 1748054727 },
    { route: 'official_beneficiary', questionId: 1917194186 },
    { route: 'official_other', questionId: 641302619 },
  ];

  const resultat = PARCOURS.map(config => {
    const item = form.getItemById(config.questionId);
    if (!item || item.getType() !== FormApp.ItemType.MULTIPLE_CHOICE) {
      throw new Error(
        'Question de canal introuvable pour ' +
          config.route +
          ' (ID ' +
          config.questionId +
          ')'
      );
    }

    const question = item.asMultipleChoiceItem();
    const choixActuels = question.getChoices();
    let pageSuivante = null;

    for (let i = 0; i < choixActuels.length; i++) {
      try {
        pageSuivante = choixActuels[i].getGotoPage();
      } catch (_) {
        pageSuivante = null;
      }
      if (pageSuivante) break;
    }

    if (!pageSuivante) {
      throw new Error(
        'Destination de la question de canal introuvable pour ' + config.route
      );
    }

    question
      .setTitle(TITRE)
      .setChoices(
        CHOIX.map(valeur => question.createChoice(valeur, pageSuivante))
      )
      .setRequired(true);

    return {
      route: config.route,
      questionId: String(config.questionId),
      choix: question.getChoices().map(choix => choix.getValue()),
    };
  });

  console.log(
    JSON.stringify({
      status: 'canaux_contact_modifies',
      formEditUrl: form.getEditUrl(),
      formPublicUrl: form.getPublishedUrl(),
      questions: resultat,
    })
  );
}
