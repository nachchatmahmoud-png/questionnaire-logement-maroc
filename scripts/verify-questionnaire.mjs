import fs from 'node:fs';
import crypto from 'node:crypto';

const source = fs.readFileSync('assets/questionnaire.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

// Empreinte sémantique : protège tous les titres, affirmations, choix et groupes
// contre le retour involontaire d'une ancienne version lors d'une mise à jour.
const questionnaireDataSource = source.slice(
  source.indexOf('const PERSONAL_BENEFICIARY='),
  source.indexOf('function currentStepTitle')
) + source.slice(
  source.indexOf('const demographics='),
  source.indexOf('function demo()')
);
const questionnaireData = Function(questionnaireDataSource + '\nreturn {PERSONAL_BENEFICIARY,FAMILY_BENEFICIARY,officialSources,externalSources,statuses,contactChannels,quiz,G,stepTitles,demographics};')();
const contentFingerprint = crypto
  .createHash('sha256')
  .update(JSON.stringify(questionnaireData))
  .digest('hex');
expect(
  contentFingerprint === '21b17b1a0ebe7c4618c9507ea752c056fca2ba63da0d6344274dccf2fe4a5ab7',
  'Le contenu validé du questionnaire a été modifié sans mise à jour explicite de son empreinte.'
);

const publicFormId = '1FAIpQLSfIOkBS04JQVuTRE0npIB6QOJ6UPg0ckoBTqAdLG9PT3yUOkA';
expect(source.includes(publicFormId + '/formResponse'), 'Le site doit envoyer vers le Google Form actif.');
expect(source.includes(publicFormId + '/viewform'), 'Le lien public doit viser le Google Form actif.');
expect(source.includes("2026-08-10-profils-g1-g5-v5-five-point-scales"), 'La version du schéma doit correspondre au formulaire actuel.');

for (const mapName of [
  'ENTRY_G2_BENEFICIARY',
  'ENTRY_G2_OTHER',
  'ENTRY_OFFICIAL_BENEFICIARY',
  'ENTRY_OFFICIAL_OTHER',
]) {
  expect(source.includes('const ' + mapName + '={'), 'Le parcours ' + mapName + ' doit avoir sa propre correspondance Google Forms.');
}

const mapSource = source.slice(0, source.indexOf('const SCALE='));
const maps = Function(mapSource + '\nreturn {ENTRY_COMMON,ENTRY_G2_SHARED,ENTRY_OFFICIAL_SHARED,ENTRY_G2_BENEFICIARY,ENTRY_G2_OTHER,ENTRY_OFFICIAL_BENEFICIARY,ENTRY_OFFICIAL_OTHER};')();
const commonRouteKeys = [
  'contact_reel', 'canal_dernier_contact', 'reponse_recue',
  'clarte_reponse', 'suffisance_reponse', 'delai_reponse',
  'understanding_1', 'understanding_2', 'understanding_3', 'understanding_4', 'understanding_5', 'understanding_6',
  'legit_1', 'legit_2', 'legit_3', 'legit_4',
  'ease_1', 'ease_2', 'ease_3', 'accept_1', 'accept_2', 'accept_3',
  'impact_general_1', 'impact_general_2', 'impact_general_3', 'success_global', 'suggestion',
];
const g2Keys = commonRouteKeys.concat('trust_general');
const officialKeys = commonRouteKeys.concat([
  'info_1', 'info_2', 'info_3', 'info_4', 'info_5', 'info_6', 'info_7',
  'info_8', 'info_9', 'info_10', 'info_11', 'info_12', 'info_13', 'transparency_global',
  'inter_comm_1', 'inter_comm_2', 'inter_comm_3', 'inter_part_1', 'inter_part_2', 'inter_part_3',
  'interaction_global', 'communication_quality_global',
  'trust_1', 'trust_2', 'trust_3', 'trust_4', 'trust_5',
]);
const beneficiaryOnlyKeys = [
  'satisfaction_1', 'satisfaction_2', 'satisfaction_3',
  'impact_personal_1', 'impact_personal_2', 'impact_personal_3',
];
const routeRequirements = {
  ENTRY_G2_BENEFICIARY: g2Keys.concat(beneficiaryOnlyKeys),
  ENTRY_G2_OTHER: g2Keys,
  ENTRY_OFFICIAL_BENEFICIARY: officialKeys.concat(beneficiaryOnlyKeys),
  ENTRY_OFFICIAL_OTHER: officialKeys,
};
for (const [name, expectedKeys] of Object.entries(routeRequirements)) {
  const actualKeys = Object.keys(maps[name]);
  expect(expectedKeys.every(key => actualKeys.includes(key)), 'Des champs Google Forms manquent dans ' + name + '.');
  expect(actualKeys.every(key => expectedKeys.includes(key)), 'Des champs non applicables sont présents dans ' + name + '.');
}
const allEntryIds = Object.values(maps).flatMap(map => Object.values(map));
expect(new Set(allEntryIds).size === allEntryIds.length, 'Chaque champ Google Forms doit avoir un identifiant unique.');

expect(source.includes("q1:'299895912',q2:'1225420672'"), 'Les filtres Q1/Q2 doivent utiliser les identifiants actuels.');
expect(source.includes("external_sources:'1040032',status:'1268123456'"), 'Les questions partagées du parcours non officiel doivent être actuelles.');
expect(source.includes("official_sources:'1856677935',status:'739440927'"), 'Les questions partagées du parcours officiel doivent être actuelles.');

expect(source.includes("const route=()=>val('q1')==='لا'?'g1':val('q2')==='لا'?'g2':'official'"), 'Le routage analytique G1/G2/officiel doit être conservé.');
expect(source.includes("route()==='g1'?'g1':route()+'_'+(beneficiary()?'beneficiary':'other')"), 'Le routage d’envoi doit distinguer bénéficiaires et autres répondants.');
expect(source.includes("if(val('q1')==='لا')return['filters','demographics']"), 'Une réponse Non à Q1 doit aller directement aux données démographiques.');
expect(source.includes("s.push('interaction','understanding','trust','legitimacy','evaluation')"), 'Le parcours G2 doit conserver les sections analytiquement pertinentes.');
expect(source.includes("if(beneficiary())s.push('impact')"), 'L’impact personnel doit être réservé aux bénéficiaires personnels.');
expect(source.includes("if(beneficiary())h+=table(G.satisfaction)"), 'La satisfaction doit être réservée aux bénéficiaires personnels.');
expect(source.includes("let h=scaleLegend()+table(G.ease)+table(G.accept)"), 'La facilité doit rester accessible à tous les répondants connaissant le programme.');

for (const history of [
  "pages.push(7,8,9,10,11,12,46)",
  "pages.push(17,18,19,20,21,46)",
  "pages.push(28,29,30,31,32,33,34,46)",
  "pages.push(40,41,42,43,44,45,46)",
  "val('residence')==='داخل المغرب'?47:48",
]) {
  expect(source.includes(history), 'Historique de pages absent ou obsolète : ' + history);
}

const interactiveChannelsInstruction = 'يرجى الإجابة بناءً على معرفتكم أو تجربتكم مع قنوات التواصل المتاحة بشأن برنامج «دعم سكن»، مثل خدمات التواصل عبر منصة أو تطبيق «دعم سكن»، والموقع الإلكتروني للوزارة، ورقم الهاتف والبريد الإلكتروني المخصصين للدعم، وكذلك الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي.';
expect(source.includes(interactiveChannelsInstruction), 'La formulation validée sur les canaux interactifs doit être conservée mot pour mot.');
const protectedTexts = [
  'س1. هل سبق لكم أن سمعتم ببرنامج الدعم المباشر للسكن؟',
  'س2. هل سبق لكم الاطلاع على معلومات حول برنامج الدعم المباشر للسكن عبر إحدى وسائل التواصل الرسمية للوزارة؟',
  'من خلال أي من وسائل التواصل الرسمية التالية اطلعتم على معلومات حول البرنامج؟',
  'من خلال أي من المصادر التالية اطلعتم على معلومات حول البرنامج؟',
  'ما هي طبيعة علاقتكم الحالية ببرنامج الدعم المباشر للسكن؟',
  'في إطار إعداد بحث أكاديمي بسلك الدكتوراه، أضع بين أيديكم هذا الاستبيان، الذي يندرج ضمن دراسة حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن.',
  'وتكتسي مشاركتكم أهمية كبيرة، لما ستوفره من معطيات أساسية تسهم في إغناء هذا البحث وتعزيز نتائجه من الناحية العلمية. لذلك، نرجو منكم الإجابة عن الأسئلة بكل موضوعية ودقة.',
  'جميع الأجوبة سرية، ولن تُستعمل إلا لأغراض البحث العلمي.',
  'هل سبق لكم استخدام إحدى القنوات الرسمية للتواصل أو التفاعل بشأن البرنامج، لطرح سؤال أو طلب توضيح أو تقديم ملاحظة أو مقترح أو شكاية؟',
  'من خلال أي قناة تم آخر تواصل لكم بشأن البرنامج؟',
  'هل توصلتم برد بشأن هذا التواصل؟',
  'ما أهم التغييرات أو الإجراءات التي تقترحونها لتحسين التواصل والتفاعل بين الوزارة والمواطنين بشأن برنامج الدعم المباشر للسكن؟',
];
for (const text of protectedTexts) {
  expect(source.includes(text), 'Texte protégé absent ou modifié : ' + text);
}
expect(source.includes('وسائل التواصل الرسمية للوزارة:</strong> يقصد بها مجموع القنوات والوسائط التي تعتمدها الوزارة رسمياً'), 'La définition des moyens officiels doit rester présente.');
expect(source.includes('وسائل التواصل الرسمية التي تتيح التفاعل:'), 'La définition des canaux interactifs doit rester présente.');
expect(!source.includes('لن تُعرض الإجابات الصحيحة أثناء الاستبيان.'), 'La mention supprimée sur les bonnes réponses ne doit pas réapparaître.');
expect(!source.includes('بصفة عامة، يحظى برنامج الدعم المباشر للسكن بتأييدي.'), 'L’ancienne affirmation supprimée ne doit pas réapparaître.');
expect(!source.includes('البريد الإلكتروني الشخصي'), 'Le site ne doit pas demander l’adresse e-mail personnelle.');

expect(source.includes("interGlobal:[['التقييم العام لإمكانية التفاعل مع الوزارة'"), 'L’évaluation générale de l’interaction doit rester dans la section 3.');
expect(source.includes("communicationQuality:[['التقييم العام لجودة تواصل الوزارة'"), 'L’évaluation générale de la qualité doit rester dans la section 3.');
expect(source.includes("if(official)h+=table(G.interGlobal)+table(G.communicationQuality)"), 'Les évaluations générales doivent suivre le parcours officiel.');
expect(source.includes("if(val('reponse_recue')==='نعم')h+=`<p class=\"question-help\">يرجى تقييم الرد الذي توصلتم به:</p>${table(G.response)}`"), 'La qualité de la réponse ne doit être affichée qu’après une réponse reçue.');

const interaction = source.slice(source.indexOf('function interaction()'), source.indexOf('function understanding()'));
const evaluation = source.slice(source.indexOf('function evaluation()'), source.indexOf('const demographics='));
expect((interaction.match(/scaleLegend\(\)/g) || []).length === 1, 'La section 3 doit afficher une seule légende Likert.');
expect((evaluation.match(/scaleLegend\(\)/g) || []).length === 1, 'La section 7 doit afficher une seule légende Likert.');

expect(!source.includes('لا أعرف / لا أستطيع التقييم'), 'L’option supprimée ne doit jamais réapparaître dans le questionnaire.');
expect(!index.includes('لا أعرف / لا أستطيع التقييم'), 'L’option supprimée ne doit jamais réapparaître dans la présentation.');
expect(!source.includes('UNKNOWN_SCALE'), 'Toutes les échelles doivent utiliser uniquement les cinq modalités validées.');
expect(!source.includes('has-unknown'), 'La mise en page à six modalités ne doit pas réapparaître.');
expect(source.includes('.likert-table thead{display:table-header-group}'), 'L’en-tête du tableau doit rester visible sur mobile.');
expect(source.includes('.likert-table input{width:28px;height:28px;margin:0}'), 'Les boutons Likert mobiles doivent rester suffisamment grands.');
expect(!source.includes('display:grid;grid-template-columns:repeat(5,1fr)'), 'Les échelles doivent rester sous forme de tableaux sur mobile.');

expect(source.includes('استفدت شخصيًا من البرنامج'), 'Le statut bénéficiaire personnel doit être conservé.');
expect(source.includes('استفاد أحد أفراد أسرتي من البرنامج'), 'Le statut membre de la famille doit être conservé.');
expect(!source.includes('accept_4'), 'Une quatrième affirmation d’acceptation ne doit pas réapparaître.');

const quizStart = source.indexOf('const quiz=[') + 'const quiz='.length;
const quizEnd = source.indexOf(';\nconst G={', quizStart);
const quiz = Function('return ' + source.slice(quizStart, quizEnd))();
const positions = quiz.map(question => question[2].indexOf(question[3]) + 1);
expect(quiz.length === 6, 'La compréhension doit contenir six questions.');
expect(quiz.every((question, index) => question[1].startsWith((index + 1) + '. ')), 'Les questions de compréhension doivent être numérotées de 1 à 6.');
expect(JSON.stringify(positions) === JSON.stringify([2, 3, 4, 2, 3, 4]), 'L’ordre validé des bonnes réponses doit être conservé.');

expect((index.match(/questionnaire\.js\?v=/g) || []).length === 1, 'index.html doit charger un seul fichier questionnaire versionné.');
expect(index.includes('questionnaire.js?v=20260810-google-account-v7'), 'Le cache doit être invalidé pour cette version.');
expect((index.match(/<script[^>]+src=/g) || []).length === 1, 'index.html doit charger un seul JavaScript fonctionnel.');

expect(source.includes("const GOOGLE_CLIENT_ID='285878510024-7dhdojiucp6ff20m2snuro018t70c6s5.apps.googleusercontent.com'"), 'Le site doit utiliser le client Google public configuré.');
expect(source.includes("const AUTH_BRIDGE_URL='https://script.google.com/macros/s/AKfycbxmwpYfo8bhwBmPPsKrIsqIfW4DQUxOxrwYavWgojHvLzR0e-TDK-DQj7t3LNeODRSv/exec'"), 'Le site doit utiliser le déploiement Apps Script actif.');
expect(!source.includes('__URL_APPLICATION_WEB_APPS_SCRIPT__'), 'Une URL Apps Script provisoire ne doit jamais être publiée.');
expect(source.includes("callAuthBridge('check',jeton)"), 'Le compte Google doit être contrôlé avant l’affichage du questionnaire.');
expect(source.includes("callAuthBridge('claim',auth.idToken)"), 'La participation doit être réservée avant l’envoi à Google Forms.');
expect(source.includes('if(!auth.allowed){renderAuthGate();return;}'), 'Le questionnaire ne doit pas apparaître avant la validation du compte.');
expect(!source.includes('GOCSPX-'), 'Aucun code secret OAuth ne doit être publié dans le site.');

const authServer = fs.readFileSync('apps-script/controle-participation-google.gs', 'utf8');
expect(authServer.includes("SHEET_NAME: 'Contrôle participations'"), 'Le service doit utiliser une feuille technique séparée.');
expect(authServer.includes("proprietes.setProperty('PARTICIPATION_TEST_EMAIL', adresseProprietaire)"), 'L’exception de test doit rester privée dans Apps Script.');
expect(authServer.includes('Utilities.computeDigest('), 'Le compte doit être pseudonymisé avant son enregistrement.');
expect(authServer.includes('LockService.getScriptLock()'), 'La réservation doit être atomique pour bloquer les doubles envois simultanés.');
expect(authServer.includes('function doPost(e)'), 'Le jeton Google doit être reçu par POST et non dans l’URL.');
expect(authServer.includes('window.top.postMessage('), 'Apps Script doit renvoyer le résultat au site malgré son iframe intermédiaire.');
expect(source.includes("form.method='POST'"), 'Le site doit transmettre le jeton au contrôle Apps Script par POST.');
expect(!source.includes("AUTH_BRIDGE_URL+'?"), 'Le jeton Google ne doit jamais être placé dans l’URL Apps Script.');
expect(!authServer.includes('GOCSPX-'), 'Le service ne doit contenir aucun code secret OAuth.');

if (failures.length) {
  console.error('Régressions détectées :');
  failures.forEach(message => console.error('- ' + message));
  process.exit(1);
}

console.log('Questionnaire validé : contenu, parcours, envoi et affichage mobile cohérents.');
