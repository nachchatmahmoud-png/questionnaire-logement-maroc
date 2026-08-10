import fs from 'node:fs';

const source = fs.readFileSync('assets/questionnaire.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

expect(!source.includes('البريد الإلكتروني الشخصي'), 'La question sur l’adresse e-mail personnelle ne doit pas réapparaître.');
expect(!source.includes('email_personal'), 'Le fichier principal ne doit plus dépendre de email_personal.');
expect(source.includes('رابعًا: الأثر العام للبرنامج'), 'Le titre court de l’impact général doit être conservé.');
expect(!source.includes('رابعًا: الأثر العام المدرك للبرنامج'), 'Le mot المدرك ne doit pas réapparaître dans le titre.');
expect(source.includes('function scaleLegend()'), 'La légende Likert extérieure doit exister.');
expect(source.includes('<th title="${esc(t)}" aria-label="${esc(t)}">${n}</th>'), 'Les numéros 1 à 5 doivent rester visibles dans les tableaux.');
expect(source.includes('.likert-table{width:100%;min-width:0;table-layout:fixed;border-collapse:collapse'), 'Le tableau Likert mobile doit rester un vrai tableau adaptatif.');
expect(source.includes('.likert-table thead{display:table-header-group}'), 'L’en-tête du tableau Likert doit rester visible sur mobile.');
expect(source.includes('.likert-table thead th{font-size:1.12rem;font-weight:800'), 'Les numéros de l’échelle et l’en-tête العبارة doivent rester agrandis sur mobile.');
expect(source.includes('.likert-table th:not(:first-child),.likert-table td:not(:first-child){width:10%'), 'Chaque colonne de mesure doit conserver 10 % de la largeur mobile.');
expect(source.includes('.likert-table tr{display:table-row}'), 'Les affirmations Likert doivent rester présentées en lignes de tableau.');
expect(source.includes('.likert-table th:first-child,.likert-table td:first-child{display:table-cell;width:50%'), 'La colonne des affirmations doit garder une largeur lisible sur mobile.');
expect(source.includes('.likert-table input{width:28px;height:28px;margin:0}'), 'Les boutons Likert mobiles doivent rester suffisamment grands.');
expect(!source.includes('display:grid;grid-template-columns:repeat(5,1fr)'), 'La présentation mobile en cartes/grilles ne doit pas remplacer le tableau.');
expect(!source.includes('.likert-table{min-width:660px}'), 'L’ancienne largeur mobile qui masquait les colonnes ne doit pas réapparaître.');


expect(source.includes("interaction_global:'240047744'"), 'L’identifiant Google Forms de l’évaluation générale de l’interaction doit être conservé.');
expect(source.includes("communication_quality_global:'1189017906'"), 'L’identifiant Google Forms de l’évaluation générale de la qualité doit être conservé.');
expect(source.includes("interGlobal:[['التقييم العام لإمكانية التفاعل مع الوزارة'"), 'Le tableau d’évaluation générale de l’interaction doit rester dans la section 3.');
expect(source.includes("communicationQuality:[['التقييم العام لجودة تواصل الوزارة'"), 'Le tableau d’évaluation générale de la qualité doit rester dans la section 3.');
expect(source.includes("${table(G.interPart)}${table(G.interGlobal)}${table(G.communicationQuality)}<section"), 'Les deux évaluations générales doivent précéder l’expérience de contact dans la section 3.');
expect(source.includes("...G.interPart,...G.interGlobal,...G.communicationQuality"), 'Les deux nouvelles évaluations doivent rester obligatoires.');
expect(source.includes("'interaction_global','communication_quality_global','clarte_reponse'"), 'Les deux nouvelles réponses doivent être envoyées à Google Forms.');

const interaction = source.slice(
  source.indexOf('function interaction()'),
  source.indexOf('function understanding()')
);
const evaluation = source.slice(
  source.indexOf('function evaluation()'),
  source.indexOf('const demographics=')
);
expect((interaction.match(/scaleLegend\(\)/g) || []).length === 1, 'La section 3 doit afficher exactement une légende Likert.');
expect((evaluation.match(/scaleLegend\(\)/g) || []).length === 1, 'La section 7 doit afficher exactement une légende Likert.');

expect(source.includes('استفدت شخصيًا من البرنامج'), 'Le choix du bénéficiaire personnel doit être conservé.');
expect(source.includes('استفاد أحد أفراد أسرتي من البرنامج'), 'Le choix du membre de la famille doit être conservé.');
expect(!source.includes('accept_4'), 'La quatrième affirmation d’acceptation supprimée ne doit pas réapparaître.');
expect(!source.includes('بصفة عامة، يحظى برنامج الدعم المباشر للسكن بتأييدي.'), 'Le texte supprimé sur l’acceptation générale ne doit pas réapparaître.');
expect(!source.includes('لن تُعرض الإجابات الصحيحة أثناء الاستبيان.'), 'La mention supprimée sur l’affichage des bonnes réponses ne doit pas réapparaître.');

const quizStart = source.indexOf('const quiz=[') + 'const quiz='.length;
const quizEnd = source.indexOf(';\nconst G={', quizStart);
const quiz = Function('return ' + source.slice(quizStart, quizEnd))();
const positions = quiz.map(question => question[2].indexOf(question[3]) + 1);
expect(quiz.length === 6, 'La section de compréhension doit contenir six questions.');
expect(quiz.every((question, index) => question[1].startsWith((index + 1) + '. ')), 'Les questions de compréhension doivent rester numérotées de 1 à 6.');
expect(JSON.stringify(positions) === JSON.stringify([2, 3, 4, 2, 3, 4]), 'L’ordre validé des bonnes réponses doit être conservé.');

expect(source.includes('1FAIpQLSfm5EXmdlOc_4k1wA14rliRwoSo0a23WyryaQK2G9yXn0TKAg/formResponse'), 'Le formulaire Google actif ne doit pas être remplacé.');
expect((index.match(/questionnaire\.js\?v=/g) || []).length === 1, 'index.html doit charger exactement une version du fichier canonique.');
expect((index.match(/<script[^>]+src=/g) || []).length === 1, 'index.html doit charger un seul fichier JavaScript fonctionnel.');
expect(!index.includes('ui-cleanup-20260807.js'), 'Le correctif secondaire ui-cleanup ne doit plus être chargé.');

if (failures.length) {
  console.error('Régressions détectées :');
  failures.forEach(message => console.error('- ' + message));
  process.exit(1);
}

console.log('Questionnaire validé : aucune régression connue.');
