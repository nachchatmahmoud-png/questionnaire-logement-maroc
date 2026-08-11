/**
 * Remplace uniquement les six questions objectives de compréhension.
 *
 * - Le formulaire conserve six questions.
 * - Les questions 5 et 6 sont les plus exigeantes.
 * - Les sections, embranchements et autres questions ne sont pas modifiés.
 * - Le script est réexécutable : il reconnaît les anciens et les nouveaux titres.
 */
function remplacerQuestionsComprehension() {
  const FORM_ID = '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo';
  const form = FormApp.openById(FORM_ID);

  const definitions = [
    {
      anciensTitres: [
        '1. ما الذي يقدمه برنامج الدعم المباشر للسكن؟',
        '1. ما الذي تتيحه منصة «دعم سكن» للراغبين في الاستفادة من البرنامج؟'
      ],
      titre: '1. أي من العبارات التالية يصف بدقة الغرض الأساسي من برنامج الدعم المباشر للسكن؟',
      choix: ['تمويل بناء مساكن عمومية مخصصة للكراء', 'تقديم مساعدة مالية مباشرة للأشخاص المؤهلين لاقتناء سكن رئيسي', 'منح قروض بنكية بدون فوائد لبناء سكن', 'المساهمة في أداء واجبات كراء السكن']
    },
    {
      anciensTitres: ['2. السكن الذي يتم اقتناؤه في إطار البرنامج يجب أن يكون:'],
      titre: '2. أي من الحالات التالية يتعارض مع شروط الاستفادة من البرنامج؟',
      choix: ['العمل في القطاع الخاص', 'عدم الزواج', 'الإقامة خارج المغرب', 'سبق الاستفادة من دعم أو امتياز من الدولة في مجال السكن']
    },
    {
      anciensTitres: ['3. أي من الحالات التالية يتعارض مع شروط الاستفادة من البرنامج؟'],
      titre: '3. بعد الموافقة الأولية على طلب الاستفادة، تُستكمل إجراءات طلب الدعم عن طريق:',
      choix: ['البنك', 'الجماعة', 'الوكالة العقارية', 'الموثق']
    },
    {
      anciensTitres: ['4. أي من العبارات التالية صحيحة بخصوص مبلغ الدعم؟'],
      titre: '4. ابتداءً من تاريخ إبرام عقد البيع النهائي، ما المدة التي يجب خلالها تخصيص السكن المقتنى للسكن الرئيسي للمستفيد؟',
      choix: ['سنة واحدة', 'ثلاث سنوات', 'خمس سنوات', 'عشر سنوات']
    },
    {
      anciensTitres: ['5. ما الذي تتيحه منصة «دعم سكن» للراغبين في الاستفادة من البرنامج؟'],
      titre: '5. أي من العبارات التالية صحيحة بخصوص مبلغ الدعم؟',
      choix: ['70.000 درهم لجميع المساكن مهما كان ثمنها', '100.000 درهم للسكن الذي لا يتجاوز ثمنه 300.000 درهم، و70.000 درهم للسكن الذي يفوق ثمنه 300.000 درهم ولا يتجاوز 700.000 درهم', '100.000 درهم لجميع المساكن مهما كان ثمنها', 'مبلغ الدعم لا يرتبط بثمن السكن']
    },
    {
      anciensTitres: ['6. بعد الموافقة الأولية على طلب الاستفادة، تُستكمل إجراءات طلب الدعم عن طريق:'],
      titre: '6. أي من الشروط التالية يجب أن تتوفر في السكن المقتنى للاستفادة من برنامج دعم السكن؟',
      choix: [
        'أن يتكون من غرفة واحدة على الأقل، وأن يكون موضوع بيع أول، وأن تكون رخصة السكن صادرة قبل فاتح يناير 2023',
        'أن يتكون من غرفتين على الأقل، وأن يكون موضوع بيع أول، وأن تكون رخصة السكن صادرة ابتداءً من فاتح يناير 2023',
        'أن يتكون من غرفتين على الأقل، وأن يكون موضوع بيع ثانٍ، وأن تكون رخصة السكن صادرة ابتداءً من فاتح يناير 2023',
        'أن يتكون من ثلاث غرف على الأقل، سواء كان موضوع بيع أول أو بيع ثانٍ، بغض النظر عن تاريخ رخصة السكن'
      ]
    }
  ];

  const items = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE);
  const correspondances = definitions.map(definition => ({
    definition,
    items: items.filter(item => {
      const titre = item.getTitle();
      return titre === definition.titre || definition.anciensTitres.includes(titre);
    })
  }));

  correspondances.forEach(({ definition, items: questions }) => {
    if (questions.length !== 4) {
      throw new Error(
        `Validation interrompue : ${questions.length} exemplaire(s) trouvé(s) pour « ${definition.titre} », au lieu de 4.`
      );
    }
  });

  correspondances.forEach(({ definition, items: questions }) => {
    questions.forEach(item => {
      const question = item.asMultipleChoiceItem();
      const obligatoire = question.isRequired();
      question
        .setTitle(definition.titre)
        .setChoiceValues(definition.choix)
        .setRequired(obligatoire);
    });
  });

  Logger.log('Mise à jour terminée : 24 questions de compréhension synchronisées, soit 6 questions dans chacun des 4 parcours.');
}
