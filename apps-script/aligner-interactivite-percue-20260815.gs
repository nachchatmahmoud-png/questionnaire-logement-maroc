/**
 * Alignement final des titres visibles du bloc « Interactivité perçue ».
 *
 * Objectif méthodologique :
 * 1) Communication bidirectionnelle -> titre visible : الاستفسارات وطلب التوضيحات
 * 2) Possibilité de participation -> un seul titre visuel pour :
 *      - الملاحظات والمقترحات
 *      - الشكايات المتعلقة بالبرنامج
 * 3) Réactivité institutionnelle -> titre visible déjà existant : حول الرد الذي توصلتم به
 *
 * IMPORTANT :
 * - ne modifie aucun identifiant d'item ;
 * - ne supprime et ne crée aucune question ;
 * - ne modifie aucun branchement ;
 * - conserve les deux réponses participation comme deux items distincts ;
 * - le second titre de participation devient un caractère invisible afin que
 *   les deux grilles apparaissent comme la continuité d'un même bloc.
 */
function alignerInteractivitePercue20260815() {
  const FORM_ID = '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo';
  const form = FormApp.openById(FORM_ID);

  const TITRE_COMMUNICATION = 'الاستفسارات وطلب التوضيحات';
  const TITRE_PARTICIPATION = 'الملاحظات والمقترحات والشكايات المتعلقة بالبرنامج';
  const TITRE_REACTIVITE = 'حول الرد الذي توصلتم به';
  const TITRE_CONTINUATION_INVISIBLE = '\u200B';

  const ROUTES_OFFICIELLES = [
    {
      communicationId: 984260886,
      observationsPropositionsId: 1489177863,
      reclamationsId: 65348748,
      responseQualityGridId: 338617431,
    },
    {
      communicationId: 547508310,
      observationsPropositionsId: 1017244650,
      reclamationsId: 1579501699,
      responseQualityGridId: 1916460429,
    },
  ];

  const AUTRES_GRILLES_REACTIVITE = [191957779, 1132848145];

  ROUTES_OFFICIELLES.forEach(function(route) {
    const communication = exigerGrilleInteractivite20260815_(form, route.communicationId);
    const observations = exigerGrilleInteractivite20260815_(form, route.observationsPropositionsId);
    const reclamations = exigerGrilleInteractivite20260815_(form, route.reclamationsId);
    const reactivite = exigerGrilleInteractivite20260815_(form, route.responseQualityGridId);

    communication.setTitle(TITRE_COMMUNICATION);
    observations.setTitle(TITRE_PARTICIPATION);
    reclamations.setTitle(TITRE_CONTINUATION_INVISIBLE);
    reactivite.setTitle(TITRE_REACTIVITE);
  });

  AUTRES_GRILLES_REACTIVITE.forEach(function(id) {
    exigerGrilleInteractivite20260815_(form, id).setTitle(TITRE_REACTIVITE);
  });

  console.log('INTERACTIVITE_PERCUE_ALIGNEE: oui');
  console.log('COMMUNICATION_BIDIRECTIONNELLE: ' + TITRE_COMMUNICATION);
  console.log('POSSIBILITE_PARTICIPATION: ' + TITRE_PARTICIPATION);
  console.log('REACTIVITE_INSTITUTIONNELLE: ' + TITRE_REACTIVITE);
}

function exigerGrilleInteractivite20260815_(form, id) {
  const item = form.getItemById(Number(id));
  if (!item || item.getType() !== FormApp.ItemType.GRID) {
    throw new Error('Grille introuvable ou type incorrect : ' + id);
  }
  return item.asGridItem();
}
