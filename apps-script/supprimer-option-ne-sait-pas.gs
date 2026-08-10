/**
 * Supprime l'option « لا أعرف / لا أستطيع التقييم » du Google Form actif
 * sans recréer les questions, sans changer leurs identifiants et sans toucher
 * aux réponses déjà enregistrées.
 *
 * Exécuter une seule fois : supprimerOptionNeSaitPas()
 */
function supprimerOptionNeSaitPas() {
  const FORM_ID = '1_xVTDNlHlNeD6LxqbAT6otin1ebJRjsGrlorJRBEpgQ';
  const OPTION_A_SUPPRIMER = 'لا أعرف / لا أستطيع التقييم';
  const VERSION = '2026-08-10-profils-g1-g5-v5-five-point-scales';

  const form = FormApp.openById(FORM_ID);
  let grillesModifiees = 0;

  form.getItems(FormApp.ItemType.GRID).forEach(item => {
    const grille = item.asGridItem();
    const colonnes = grille.getColumns();
    if (!colonnes.includes(OPTION_A_SUPPRIMER)) return;

    const nouvellesColonnes = colonnes.filter(
      colonne => colonne !== OPTION_A_SUPPRIMER
    );
    if (nouvellesColonnes.length !== 5) {
      throw new Error(
        'Échelle inattendue dans « ' + grille.getTitle() + ' » : ' +
        JSON.stringify(colonnes)
      );
    }

    grille.setColumns(nouvellesColonnes);
    grillesModifiees++;
  });

  PropertiesService.getScriptProperties()
    .setProperty('FORM_SCHEMA_VERSION', VERSION);

  console.log('OPTION_SUPPRIMEE: ' + OPTION_A_SUPPRIMER);
  console.log('GRILLES_MODIFIEES: ' + grillesModifiees);
  console.log('FORM_PUBLIC_URL: ' + form.getPublishedUrl());
}
