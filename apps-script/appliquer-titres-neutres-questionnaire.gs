/**
 * Applique uniquement les titres neutres validés dans le Google Form.
 * Les questions, choix, obligations et règles de navigation ne sont pas modifiés.
 */
function appliquerTitresNeutresQuestionnaire20260813() {
  const FORM_ID = '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo';
  const form = FormApp.openById(FORM_ID);

  const correspondances = new Map([
    ['القسم الأول: معلومات أولية حول علاقتكم بالبرنامج', 'معلومات حول علاقتكم بالبرنامج'],
    ['معلومات أولية حول علاقتكم بالبرنامج', 'معلومات حول علاقتكم بالبرنامج'],
    ['القسم الثاني: شفافية المعلومات الرسمية المتعلقة بالبرنامج', 'المعلومات الرسمية المتعلقة بالبرنامج'],
    ['شفافية المعلومات الرسمية المتعلقة بالبرنامج', 'المعلومات الرسمية المتعلقة بالبرنامج'],
    ['القسم الثالث: التواصل والتفاعل مع الوزارة حول البرنامج', 'التفاعل مع الوزارة بشأن البرنامج'],
    ['التواصل والتفاعل مع الوزارة حول البرنامج', 'التفاعل مع الوزارة بشأن البرنامج'],
    ['القسم الثالث: تجربة التواصل الفعلي مع الوزارة', 'تجربتكم في التفاعل مع الوزارة'],
    ['تجربة التواصل الفعلي مع الوزارة', 'تجربتكم في التفاعل مع الوزارة'],
    ['القسم الرابع: فهم البرنامج', 'أسئلة حول برنامج الدعم المباشر للسكن'],
    ['فهم البرنامج', 'أسئلة حول برنامج الدعم المباشر للسكن'],
    ['القسم الخامس: الثقة في الوزارة', 'آراؤكم حول تدبير الوزارة للبرنامج'],
    ['القسم الخامس: الثقة العامة في الوزارة', 'آراؤكم حول تدبير الوزارة للبرنامج'],
    ['الثقة في الوزارة', 'آراؤكم حول تدبير الوزارة للبرنامج'],
    ['الثقة العامة في الوزارة', 'آراؤكم حول تدبير الوزارة للبرنامج'],
    ['القسم السادس: مشروعية البرنامج', 'آراؤكم حول بعض جوانب البرنامج'],
    ['مشروعية البرنامج', 'آراؤكم حول بعض جوانب البرنامج'],
    ['القسم السابع: تقييم البرنامج', 'آراؤكم حول البرنامج'],
    ['تقييم البرنامج', 'آراؤكم حول البرنامج'],
    ['القسم الثامن: أثر الاستفادة من البرنامج على الوضع السكني', 'وضعكم السكني بعد الاستفادة من البرنامج'],
    ['أثر الاستفادة من البرنامج على الوضع السكني', 'وضعكم السكني بعد الاستفادة من البرنامج'],
    ['القسم التاسع: مقترحاتكم', 'مقترحاتكم بشأن البرنامج'],
    ['مقترحاتكم', 'مقترحاتكم بشأن البرنامج'],
    ['القسم العاشر: معلومات عامة', 'معلومات عامة'],

    ['أولًا: الوصول إلى المعلومات', 'الوصول إلى المعلومات'],
    ['ثانيًا: وضوح المعلومات وسهولة فهمها', 'وضوح المعلومات وسهولة فهمها'],
    ['ثالثًا: كفاية المعلومات', 'محتوى المعلومات المتعلقة بالبرنامج'],
    ['رابعًا: دقة المعلومات وتحيينها', 'دقة المعلومات وتحيينها'],
    ['التقييم العام للشفافية', 'المعلومات الرسمية المتعلقة بالبرنامج'],

    ['أولًا: إمكانية التواصل مع الوزارة حول البرنامج', 'الاستفسارات وطلب التوضيحات'],
    ['ثانيًا: إمكانية المشاركة', 'الملاحظات والمقترحات — الشكايات المتعلقة بالبرنامج'],
    ['التقييم العام لإمكانية التفاعل مع الوزارة', 'التفاعل مع الوزارة بشأن البرنامج'],
    ['التقييم العام لجودة تواصل الوزارة', 'التفاعل مع الوزارة بشأن البرنامج'],
    ['ثالثًا: تجربة التواصل الفعلي مع الوزارة', 'تجربتكم في التفاعل مع الوزارة'],
    ['تقييم الرد الذي توصلتم به', 'حول الرد الذي توصلتم به'],

    ['أولًا: سهولة الاستفادة من البرنامج', 'شروط وإجراءات الاستفادة من البرنامج'],
    ['ثانيًا: قبول البرنامج وتأييده', 'آراؤكم حول البرنامج'],
    ['ثالثًا: الرضا عن تجربة الاستفادة من البرنامج', 'حول تجربتكم في الاستفادة من البرنامج'],
    ['رابعًا: الأثر العام للبرنامج', 'آثار البرنامج'],
    ['التقييم العام لنجاح البرنامج', 'آراؤكم حول البرنامج']
  ]);

  const avant = form.getItems();
  const structureAvant = avant.map(function(item) {
    return item.getId() + '|' + item.getType();
  }).join('\n');

  let modifications = 0;
  const journal = [];

  avant.forEach(function(item) {
    const ancienTitre = item.getTitle();
    const nouveauTitre = correspondances.get(ancienTitre);
    if (!nouveauTitre || nouveauTitre === ancienTitre) return;

    definirTitreSansModifierItem_(item, nouveauTitre);
    modifications++;
    journal.push(item.getId() + ' : ' + ancienTitre + ' -> ' + nouveauTitre);
  });

  const apres = form.getItems();
  const structureApres = apres.map(function(item) {
    return item.getId() + '|' + item.getType();
  }).join('\n');

  if (structureAvant !== structureApres) {
    throw new Error('La structure du formulaire a changé : opération annulée à contrôler.');
  }

  const anciensTitresRestants = apres
    .map(function(item) { return item.getTitle(); })
    .filter(function(titre) { return correspondances.has(titre); });

  if (anciensTitresRestants.length) {
    throw new Error('Titres analytiques encore présents : ' + anciensTitresRestants.join(' | '));
  }

  Logger.log('TITRES_NEUTRES_APPLIQUES: oui');
  Logger.log('NOMBRE_TITRES_MODIFIES: ' + modifications);
  Logger.log('NOMBRE_ITEMS_AVANT_APRES: ' + avant.length + ' / ' + apres.length);
  Logger.log('STRUCTURE_ET_NAVIGATION_CONSERVEES: oui');
  journal.forEach(function(ligne) { Logger.log(ligne); });
}

function definirTitreSansModifierItem_(item, titre) {
  const type = item.getType();

  switch (type) {
    case FormApp.ItemType.CHECKBOX:
      item.asCheckboxItem().setTitle(titre); break;
    case FormApp.ItemType.CHECKBOX_GRID:
      item.asCheckboxGridItem().setTitle(titre); break;
    case FormApp.ItemType.DATE:
      item.asDateItem().setTitle(titre); break;
    case FormApp.ItemType.DATETIME:
      item.asDateTimeItem().setTitle(titre); break;
    case FormApp.ItemType.DURATION:
      item.asDurationItem().setTitle(titre); break;
    case FormApp.ItemType.GRID:
      item.asGridItem().setTitle(titre); break;
    case FormApp.ItemType.IMAGE:
      item.asImageItem().setTitle(titre); break;
    case FormApp.ItemType.LIST:
      item.asListItem().setTitle(titre); break;
    case FormApp.ItemType.MULTIPLE_CHOICE:
      item.asMultipleChoiceItem().setTitle(titre); break;
    case FormApp.ItemType.PAGE_BREAK:
      item.asPageBreakItem().setTitle(titre); break;
    case FormApp.ItemType.PARAGRAPH_TEXT:
      item.asParagraphTextItem().setTitle(titre); break;
    case FormApp.ItemType.SCALE:
      item.asScaleItem().setTitle(titre); break;
    case FormApp.ItemType.SECTION_HEADER:
      item.asSectionHeaderItem().setTitle(titre); break;
    case FormApp.ItemType.TEXT:
      item.asTextItem().setTitle(titre); break;
    case FormApp.ItemType.TIME:
      item.asTimeItem().setTitle(titre); break;
    case FormApp.ItemType.VIDEO:
      item.asVideoItem().setTitle(titre); break;
    default:
      throw new Error('Type d’élément non pris en charge pour le titre « ' + item.getTitle() + ' » : ' + type);
  }
}
