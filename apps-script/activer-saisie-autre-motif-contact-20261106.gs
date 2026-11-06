/**
 * Active la réponse libre du motif de contact sur le formulaire existant.
 * À exécuter une fois dans le projet de contrôle des participations.
 * Conserve les choix et le routage existants. Aucune réponse n'est soumise.
 */
function ACTIVER_SAISIE_AUTRE_MOTIF_CONTACT_20261106() {
  const formulaire = FormApp.openById('1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo');
  const titre = 'ما السبب الرئيسي الذي دفعكم إلى التواصل مع الوزارة بشأن البرنامج؟';
  const questions = formulaire.getItems(FormApp.ItemType.MULTIPLE_CHOICE).filter(function (item) {
    return String(item.getTitle() || '').trim() === titre;
  });
  if (!questions.length) throw new Error('MOTIF_CONTACT_ABSENT');
  questions.forEach(function (item) {
    const question = item.asMultipleChoiceItem();
    question.showOtherOption(true);
    const texte = 'فحص تقني لحقل السبب الآخر دون إرسال إجابة';
    const brouillon = formulaire.createResponse().withItemResponse(question.createResponse(texte));
    if (!question.hasOtherOption() || brouillon.getId() !== null) throw new Error('SAISIE_AUTRE_NON_VALIDEE');
    console.log('MOTIF_CONTACT_AUTRE_OK:item=' + question.getId());
  });
  console.log('SAISIE_AUTRE_MOTIF_CONTACT_OK:questions=' + questions.length + ';aucune_reponse_envoyee');
}
