/**
 * Mise à jour ciblée de la section « compréhension du programme ».
 *
 * Fonction unique à exécuter : mettreAJourComprehension20260813
 *
 * Le script modifie seulement Q2 et Q6 dans les quatre parcours existants.
 * Il ne transforme pas le formulaire en quiz et ne révèle aucune bonne réponse.
 */
function mettreAJourComprehension20260813() {
  const FORM_ID = '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo';

  const Q2_OLD = '2. أي حالة من الحالات التالية تجعل الشخص غير مؤهل للاستفادة من البرنامج؟';
  const Q2_NEW = '2. أي من الشروط التالية يجب أن يتوفر في الشخص للاستفادة من برنامج الدعم المباشر للسكن؟';
  const Q2_CHOICES = [
    'أن يكون حاملاً للجنسية المغربية، وألا يكون قد سبق له الاستفادة من إعانة أو امتياز ممنوح من طرف الدولة في مجال السكن.',
    'أن يكون حاملاً للجنسية المغربية، وأن يكون مقيماً بصفة دائمة داخل المغرب عند تقديم طلب الاستفادة.',
    'أن يكون حاملاً للجنسية المغربية، وأن يتراوح عمره عند تقديم الطلب بين 18 و45 سنة.',
    'أن يكون حاملاً للجنسية المغربية، وأن يكون مسجلاً في السجل الاجتماعي الموحد ضمن عتبة الاستفادة المحددة.',
  ];

  const Q6_OLD = '6. بعد الموافقة الأولية، عن طريق من تُستكمل إجراءات الدعم، وما المدة التي يجب أن يبقى خلالها السكن مخصصًا للسكن الرئيسي ابتداءً من تاريخ عقد البيع النهائي؟';
  const Q6_NEW = '6. ما المدة التي يجب أن يبقى خلالها السكن مخصصًا للسكن الرئيسي ابتداءً من تاريخ إبرام عقد البيع النهائي؟';
  const Q6_CHOICES = [
    'ثلاث (3) سنوات',
    'أربع (4) سنوات',
    'خمس (5) سنوات',
    'سبع (7) سنوات',
  ];

  const form = FormApp.openById(FORM_ID);
  const allItemsBefore = form.getItems();
  const signatureBefore = allItemsBefore.map(function (item) {
    return [String(item.getId()), String(item.getType()), item.getTitle()];
  });

  const multipleChoiceItems = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE);
  const q2Items = multipleChoiceItems.filter(function (item) {
    const title = item.getTitle();
    return title === Q2_OLD || title === Q2_NEW;
  }).map(function (item) { return item.asMultipleChoiceItem(); });
  const q6Items = multipleChoiceItems.filter(function (item) {
    const title = item.getTitle();
    return title === Q6_OLD || title === Q6_NEW;
  }).map(function (item) { return item.asMultipleChoiceItem(); });

  if (q2Items.length !== 4) {
    throw new Error('Q2: 4 occurrences attendues, ' + q2Items.length + ' trouvées. Aucune suppression effectuée.');
  }
  if (q6Items.length !== 4) {
    throw new Error('Q6: 4 occurrences attendues, ' + q6Items.length + ' trouvées. Aucune suppression effectuée.');
  }

  q2Items.forEach(function (item) {
    item.setTitle(Q2_NEW).setChoiceValues(Q2_CHOICES).setRequired(true);
  });
  q6Items.forEach(function (item) {
    item.setTitle(Q6_NEW).setChoiceValues(Q6_CHOICES).setRequired(true);
  });

  const allItemsAfter = form.getItems();
  if (allItemsAfter.length !== allItemsBefore.length) {
    throw new Error('Le nombre total d’items a changé: ' + allItemsBefore.length + ' / ' + allItemsAfter.length);
  }

  verifierQuestionsComprehension20260813_(form, Q2_NEW, Q2_CHOICES, Q6_NEW, Q6_CHOICES);

  const changedIds = new Set(q2Items.concat(q6Items).map(function (item) { return String(item.getId()); }));
  const unexpectedChanges = allItemsAfter.filter(function (item, index) {
    const before = signatureBefore[index];
    return !changedIds.has(String(item.getId())) &&
      (before[0] !== String(item.getId()) || before[1] !== String(item.getType()) || before[2] !== item.getTitle());
  });
  if (unexpectedChanges.length) {
    throw new Error('Des items hors Q2/Q6 ont été modifiés: ' + unexpectedChanges.map(function (item) { return item.getId(); }).join(', '));
  }

  console.log('COMPREHENSION_MISE_A_JOUR: oui');
  console.log('QUESTIONS_COMPREHENSION_PAR_PARCOURS: 6');
  console.log('OCCURRENCES_COMPREHENSION_TOTALES: 24');
  console.log('Q2_OCCURRENCES_MODIFIEES: ' + q2Items.length);
  console.log('Q6_OCCURRENCES_MODIFIEES: ' + q6Items.length);
  console.log('Q2_ET_Q6_OBLIGATOIRES: oui');
  console.log('Q2_ET_Q6_CHOIX: 4 / 4');
  console.log('FORMULAIRE_TRANSFORME_EN_QUIZ: non');
  console.log('BONNES_REPONSES_VISIBLES: non');
  console.log('AUTRES_ITEMS_INCHANGES: oui');
}

function verifierQuestionsComprehension20260813_(form, q2Title, q2Choices, q6Title, q6Choices) {
  const knowledgeTitles = [
    '1. ما الغاية الأساسية من برنامج الدعم المباشر للسكن؟',
    q2Title,
    '3. أين يُقدَّم طلب الاستفادة، وكيف تُتابع مراحل معالجة الملف؟',
    '4. ما قيمة الدعم حسب ثمن بيع السكن مع احتساب الرسوم؟',
    '5. ما شروط السكن المؤهل للاستفادة من الدعم؟',
    q6Title,
  ];
  const questions = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE)
    .map(function (item) { return item.asMultipleChoiceItem(); })
    .filter(function (item) { return knowledgeTitles.indexOf(item.getTitle()) !== -1; });

  if (questions.length !== 24) {
    throw new Error('24 questions de compréhension attendues dans les 4 parcours, ' + questions.length + ' trouvées.');
  }
  knowledgeTitles.forEach(function (title) {
    const occurrences = questions.filter(function (item) { return item.getTitle() === title; });
    if (occurrences.length !== 4) throw new Error('4 occurrences attendues pour: ' + title);
    occurrences.forEach(function (item) {
      if (!item.isRequired()) throw new Error('Question non obligatoire: ' + item.getId());
    });
  });

  questions.filter(function (item) { return item.getTitle() === q2Title; }).forEach(function (item) {
    const values = item.getChoices().map(function (choice) { return choice.getValue(); });
    if (JSON.stringify(values) !== JSON.stringify(q2Choices)) throw new Error('Choix Q2 incorrects: ' + item.getId());
  });
  questions.filter(function (item) { return item.getTitle() === q6Title; }).forEach(function (item) {
    const values = item.getChoices().map(function (choice) { return choice.getValue(); });
    if (JSON.stringify(values) !== JSON.stringify(q6Choices)) throw new Error('Choix Q6 incorrects: ' + item.getId());
  });
}
