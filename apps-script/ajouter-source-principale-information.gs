/**
 * Ajoute au Google Form la variable distincte qui reçoit la source officielle
 * principale choisie dans l'interface du site.
 *
 * Google Forms ne peut pas filtrer dynamiquement les choix d'une question
 * selon plusieurs cases cochées. Le site assure donc cet affichage dynamique,
 * tandis que cette question conserve la valeur dans une colonne séparée des
 * réponses Google Forms.
 *
 * À exécuter une seule fois : ajouterSourcePrincipaleInformation()
 */
function ajouterSourcePrincipaleInformation() {
  const FORM_ID = '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo';
  const ITEM_SOURCES_OFFICIELLES_ID = 330113323;
  const TITRE =
    'من بين وسائل التواصل الرسمية التي اخترتموها، ما هي الوسيلة الرئيسية التي اعتمدتم عليها للاطلاع على معلومات حول البرنامج؟';
  const AIDE = 'يرجى اختيار جواب واحد فقط.';
  const CHOIX = [
    'المنصة الإلكترونية «دعم سكن» (DaamSakane.ma)',
    'تطبيق «دعم سكن» على الهاتف المحمول',
    'الموقع الإلكتروني الرسمي للوزارة (mhpv.gov.ma)',
    'الصفحات أو الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي',
    'الدلائل والمطويات والبلاغات الرسمية المتعلقة بالبرنامج',
    'اللقاءات أو الحملات والأنشطة التواصلية الرسمية المنظمة للتعريف بالبرنامج',
  ];

  const form = FormApp.openById(FORM_ID);
  const items = form.getItems();
  const sourceIndex = items.findIndex(
    item => Number(item.getId()) === ITEM_SOURCES_OFFICIELLES_ID
  );

  if (sourceIndex === -1) {
    throw new Error(
      'Question des sources officielles introuvable (item ' +
        ITEM_SOURCES_OFFICIELLES_ID +
        ').'
    );
  }

  let question = form
    .getItems(FormApp.ItemType.MULTIPLE_CHOICE)
    .map(item => item.asMultipleChoiceItem())
    .find(item => item.getTitle() === TITRE);

  if (!question) question = form.addMultipleChoiceItem();

  question
    .setTitle(TITRE)
    .setHelpText(AIDE)
    .setChoiceValues(CHOIX)
    .setRequired(true);

  const currentItems = form.getItems();
  const currentSourceIndex = currentItems.findIndex(
    item => Number(item.getId()) === ITEM_SOURCES_OFFICIELLES_ID
  );
  const currentIndex = currentItems.findIndex(
    item => Number(item.getId()) === Number(question.getId())
  );
  const targetIndex = currentSourceIndex + 1;
  if (currentIndex !== targetIndex) form.moveItem(currentIndex, targetIndex);

  const prefilledUrl = form
    .createResponse()
    .withItemResponse(question.createResponse(CHOIX[0]))
    .toPrefilledUrl();
  const entryMatch = prefilledUrl.match(/[?&]entry\.(\d+)=/);

  if (!entryMatch) {
    throw new Error("Impossible d'identifier le paramètre entry de la question.");
  }

  const resultat = {
    status: 'source_principale_prete',
    formEditUrl: form.getEditUrl(),
    formPublicUrl: form.getPublishedUrl(),
    itemId: String(question.getId()),
    entryId: entryMatch[1],
    title: question.getTitle(),
    required: question.isRequired(),
    choices: question.getChoices().map(choice => choice.getValue()),
  };

  console.log(JSON.stringify(resultat));
  return resultat;
}
