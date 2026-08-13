/**
 * Supprime uniquement les deux grilles correspondant à l’ancien item 14
 * d’évaluation générale de la transparence.
 */
function supprimerEvaluationGeneraleTransparence20260813() {
  const FORM_ID = '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo';
  const IDS_CIBLES = [357419921, 457506886];
  const ITEM_ATTENDU = '14. بصفة عامة، أرى أن التواصل العمومي للوزارة حول برنامج الدعم المباشر للسكن يتسم بالشفافية.';
  const TITRES_ACCEPTES = [
    'المعلومات الرسمية المتعلقة بالبرنامج',
    'التقييم العام للشفافية'
  ];

  const form = FormApp.openById(FORM_ID);
  const avant = form.getItems();
  const cibles = IDS_CIBLES.map(function(id) {
    return form.getItemById(id);
  });

  const presentes = cibles.filter(function(item) { return item !== null; });
  if (presentes.length === 0) {
    Logger.log('EVALUATION_GENERALE_TRANSPARENCE_DEJA_SUPPRIMEE: oui');
    Logger.log('NOMBRE_ITEMS_FORMULAIRE: ' + avant.length);
    return;
  }
  if (presentes.length !== IDS_CIBLES.length) {
    throw new Error('État incohérent : une seule des deux grilles de transparence est présente.');
  }

  presentes.forEach(function(item) {
    if (item.getType() !== FormApp.ItemType.GRID) {
      throw new Error('L’élément ' + item.getId() + ' n’est pas une grille : suppression annulée.');
    }
    if (TITRES_ACCEPTES.indexOf(item.getTitle()) === -1) {
      throw new Error('Titre inattendu pour l’élément ' + item.getId() + ' : ' + item.getTitle());
    }
    const lignes = item.asGridItem().getRows();
    if (lignes.length !== 1 || lignes[0] !== ITEM_ATTENDU) {
      throw new Error('Contenu inattendu pour l’élément ' + item.getId() + ' : suppression annulée.');
    }
  });

  const autresAvant = avant
    .filter(function(item) { return IDS_CIBLES.indexOf(item.getId()) === -1; })
    .map(function(item) {
      return item.getId() + '|' + item.getType() + '|' + item.getTitle();
    })
    .join('\n');

  presentes
    .sort(function(a, b) { return b.getIndex() - a.getIndex(); })
    .forEach(function(item) { form.deleteItem(item); });

  const apres = form.getItems();
  const autresApres = apres.map(function(item) {
    return item.getId() + '|' + item.getType() + '|' + item.getTitle();
  }).join('\n');

  if (apres.length !== avant.length - IDS_CIBLES.length) {
    throw new Error('Nombre d’éléments inattendu après suppression.');
  }
  if (autresAvant !== autresApres) {
    throw new Error('Un autre élément du formulaire a changé.');
  }
  IDS_CIBLES.forEach(function(id) {
    if (form.getItemById(id) !== null) {
      throw new Error('L’élément ' + id + ' est encore présent.');
    }
  });

  Logger.log('EVALUATION_GENERALE_TRANSPARENCE_SUPPRIMEE: oui');
  Logger.log('ITEMS_SUPPRIMES: ' + IDS_CIBLES.join(', '));
  Logger.log('NOMBRE_ITEMS_AVANT_APRES: ' + avant.length + ' / ' + apres.length);
  Logger.log('AUTRES_ITEMS_INCHANGES: oui');
  Logger.log('STRUCTURE_ET_NAVIGATION_CONSERVEES: oui');
}
