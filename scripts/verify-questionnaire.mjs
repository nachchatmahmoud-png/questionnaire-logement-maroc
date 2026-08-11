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
  contentFingerprint === '3fef93b3a7385dcae7b71356daa84354e844afa90ef5014f1d43b3a312123b76',
  'Le contenu validé du questionnaire a été modifié sans mise à jour explicite de son empreinte.'
);

const publicFormId = '1FAIpQLSfIOkBS04JQVuTRE0npIB6QOJ6UPg0ckoBTqAdLG9PT3yUOkA';
expect(source.includes(publicFormId + '/formResponse'), 'Le site doit envoyer vers le Google Form actif.');
expect(source.includes(publicFormId + '/viewform'), 'Le lien public doit viser le Google Form actif.');
expect(source.includes("2026-08-11-comprehension-v3"), 'La version du schéma doit correspondre au formulaire actuel.');

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
expect(source.includes("official_sources:'1856677935',source_principale:"), 'La source principale doit être distincte des réponses multiples.');
expect(source.includes("status:'739440927'"), 'Le statut partagé du parcours officiel doit être actuel.');

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

const interactiveChannelsInstruction = 'يرجى الإجابة بناءً على معرفتكم أو تجربتكم مع قنوات التواصل الرسمية التي تتيح التفاعل بشأن برنامج «دعم سكن».';
expect(source.includes(interactiveChannelsInstruction), 'La formulation validée sur les canaux interactifs doit être conservée mot pour mot.');
expect(JSON.stringify(questionnaireData.officialSources) === JSON.stringify([
  ['official_daamsakane_web', 'المنصة الإلكترونية «دعم سكن» (DaamSakane.ma)'],
  ['official_daamsakane_app', 'تطبيق «دعم سكن» على الهاتف المحمول'],
  ['official_ministry_web', 'الموقع الإلكتروني الرسمي للوزارة (mhpv.gov.ma)'],
  ['official_social', 'الصفحات أو الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي'],
  ['official_guides_publications', 'الدلائل والمطويات والبلاغات الرسمية المتعلقة بالبرنامج'],
  ['official_meetings_campaigns', 'اللقاءات أو الحملات والأنشطة التواصلية الرسمية المنظمة للتعريف بالبرنامج'],
]), 'Les six sources officielles d’information doivent être conservées dans leur ordre validé.');

const sourcePrincipaleLogicSource = source.slice(
  source.indexOf('const officialSources=['),
  source.indexOf('const externalSources=')
);
const sourcePrincipaleLogic = Function(`
  const state={a:{}};
  const val=id=>state.a[id]??'';
  const del=(...ids)=>ids.forEach(id=>delete state.a[id]);
  ${sourcePrincipaleLogicSource}
  return {state,officialSourceCodes,reconcileSourcePrincipale,officialSourceData,sourcePrincipaleLabel};
`)();
expect(JSON.stringify(sourcePrincipaleLogic.officialSourceCodes) === JSON.stringify({
  official_daamsakane_web: 'daamsakane',
  official_daamsakane_app: 'application',
  official_ministry_web: 'ministere',
  official_social: 'reseaux_sociaux',
  official_guides_publications: 'documents_officiels',
  official_meetings_campaigns: 'rencontres_officielles',
}), 'Les codes analytiques de sourcePrincipale doivent rester stables.');

const sourceState = sourcePrincipaleLogic.state.a;
sourceState.official_daamsakane_web = '1';
sourcePrincipaleLogic.reconcileSourcePrincipale();
expect(sourceState.sourcePrincipale === 'daamsakane', 'Une source unique doit devenir automatiquement la source principale.');
expect(sourcePrincipaleLogic.officialSourceData().infoDaamSakane === true, 'Le canal DaamSakane doit être exportable comme booléen.');
sourceState.official_daamsakane_app = '1';
delete sourceState.sourcePrincipale;
sourcePrincipaleLogic.reconcileSourcePrincipale();
expect(!sourceState.sourcePrincipale, 'Deux sources ou plus doivent exiger un choix principal explicite.');
sourceState.sourcePrincipale = 'ministere';
sourcePrincipaleLogic.reconcileSourcePrincipale();
expect(!sourceState.sourcePrincipale, 'Une source principale non sélectionnée doit être réinitialisée.');
sourceState.sourcePrincipale = 'application';
sourcePrincipaleLogic.reconcileSourcePrincipale();
expect(sourceState.sourcePrincipale === 'application', 'Une source principale encore sélectionnée doit être conservée.');
delete sourceState.official_daamsakane_app;
sourcePrincipaleLogic.reconcileSourcePrincipale();
expect(sourceState.sourcePrincipale === 'daamsakane', 'Le retour à une source unique doit réaffecter automatiquement sourcePrincipale.');
expect(sourcePrincipaleLogic.sourcePrincipaleLabel() === questionnaireData.officialSources[0][1], 'Le libellé envoyé à Google Forms doit correspondre au code analytique.');

expect(source.includes("selected.map(([id,label])=>[officialSourceCodes[id],label])"), 'La question principale doit proposer uniquement les sources sélectionnées.');
expect(source.includes("selectedOfficialSources().length>=2)ids.push('sourcePrincipale')"), 'La question principale doit être obligatoire lorsqu’elle apparaît.');
expect(source.includes("add(ENTRY_OFFICIAL_SHARED.source_principale,sourcePrincipaleLabel())"), 'La source principale doit être envoyée dans un champ Google Forms séparé.');
expect(/^\d+$/.test(String(maps.ENTRY_OFFICIAL_SHARED.source_principale || '')), 'L’identifiant Google Forms de source_principale doit être configuré avant publication.');
expect(JSON.stringify(questionnaireData.contactChannels) === JSON.stringify([
  'منصة دعم سكن – DaamSakane.ma → عبر خدمة «اتصل بنا» على المنصة الرسمية.',
  'الموقع الرسمي للوزارة – mhpv.gov.ma → عبر نموذج الاتصال / خدمة التواصل على الموقع الرسمي للوزارة.',
  'البوابة الوطنية للشكايات – Chikaya.ma → عبر إيداع أو متابعة شكاية رسمية.',
  'الهاتف / مركز الاتصال الرسمي → عبر الرقم: \u200E+212 5 37 71 81 81',
  'البريد الإلكتروني الرسمي → عبر: contact@daamsakane.ma',
  'شبكات التواصل الاجتماعي الرسمية للوزارة → عبر Facebook أو Instagram أو باقي الحسابات الرسمية للوزارة، من خلال الرسائل الخاصة أو التعليقات.',
]), 'Les six canaux officiels identifiés doivent être conservés dans leur ordre validé.');
expect(!source.includes('قناة رسمية أخرى للتواصل بشأن البرنامج، يرجى تحديدها: __________'), 'Le choix « autre canal » supprimé ne doit pas réapparaître.');
const protectedTexts = [
  'س1. هل سبق لكم أن سمعتم ببرنامج الدعم المباشر للسكن؟',
  'س2. هل سبق لكم الاطلاع على معلومات حول برنامج الدعم المباشر للسكن عبر إحدى وسائل التواصل الرسمية للوزارة؟',
  'من خلال أي من وسائل التواصل الرسمية التالية اطلعتم على معلومات حول البرنامج؟',
  'من بين وسائل التواصل الرسمية التي اخترتموها، ما هي الوسيلة الرئيسية التي اعتمدتم عليها للاطلاع على معلومات حول البرنامج؟',
  'يرجى اختيار جواب واحد فقط.',
  'من خلال أي من المصادر التالية اطلعتم على معلومات حول البرنامج؟',
  'ما هي طبيعة علاقتكم الحالية ببرنامج الدعم المباشر للسكن؟',
  'في إطار إعداد بحث أكاديمي بسلك الدكتوراه، أضع بين أيديكم هذا الاستبيان، الذي يندرج ضمن دراسة حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن.',
  'وتكتسي مشاركتكم أهمية كبيرة، لما ستوفره من معطيات أساسية تسهم في إغناء هذا البحث وتعزيز نتائجه من الناحية العلمية. لذلك، نرجو منكم الإجابة عن الأسئلة بكل موضوعية ودقة.',
  'جميع الأجوبة سرية، ولن تُستعمل إلا لأغراض البحث العلمي.',
  'هل سبق لكم استخدام إحدى القنوات الرسمية للتواصل أو التفاعل بشأن البرنامج، لطرح سؤال أو طلب توضيح أو تقديم ملاحظة أو مقترح أو شكاية؟',
  'عبر أي قناة رسمية تم آخر تواصل لكم بشأن برنامج الدعم المباشر للسكن؟',
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
expect(JSON.stringify(positions) === JSON.stringify([2, 4, 4, 3, 2, 2]), 'L’ordre validé des bonnes réponses doit être conservé.');

expect((index.match(/questionnaire\.js\?v=/g) || []).length === 1, 'index.html doit charger un seul fichier questionnaire versionné.');
expect(index.includes('questionnaire.js?v=20260811-comprehension-v28'), 'Le cache doit être invalidé pour cette version.');
expect(index.includes('/* Auth design v2 — lisible, rassurant et adapté au mobile. */'), 'Le design validé du contrôle Google doit être conservé.');
expect(index.includes('.auth-card{width:calc(100% - 20px);margin:10px auto 14px'), 'La carte de connexion doit rester adaptée aux petits écrans.');
expect(index.includes('.auth-help::before'), 'Le repère visuel de confidentialité doit rester présent.');
expect(index.includes('border:4px solid transparent;') && index.includes('linear-gradient(90deg,#4285f4 0 25%,#34a853 25% 50%,#fbbc05 50% 75%,#ea4335 75% 100%) border-box;'), 'La bordure épaisse aux couleurs de Google doit être conservée.');
expect(source.includes('اضغط على زر «المواصلة باستخدام Google» للمتابعة.'), 'L’indication de clic du bouton Google doit rester présente.');
expect(index.includes('.auth-action-hint{'), 'La mise en forme de l’indication de clic doit être conservée.');
expect(index.includes('.auth-action-hint::after{') && index.includes('content:"👇";'), 'Le doigt doit être affiché sous le texte et pointer vers le bouton Google.');
expect(!index.includes('.auth-action-hint::before{'), 'Le doigt ne doit plus être affiché avant le texte.');
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

const sourcePrincipaleFormScript = fs.readFileSync('apps-script/ajouter-source-principale-information.gs', 'utf8');
expect(sourcePrincipaleFormScript.includes("const FORM_ID = '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo'"), 'Le script doit cibler le Google Form actif.');
expect(sourcePrincipaleFormScript.includes('const ITEM_SOURCES_OFFICIELLES_ID = 330113323'), 'La nouvelle question doit être placée après la question des sources officielles.');
expect(sourcePrincipaleFormScript.includes('.setRequired(true)'), 'La question Google Forms de stockage doit être obligatoire dans le parcours officiel.');
expect(sourcePrincipaleFormScript.includes('.toPrefilledUrl()'), 'Le script doit produire un identifiant entry fiable pour la connexion au site.');
expect(sourcePrincipaleFormScript.includes("prefilledUrl.match(/[?&]entry\\.(\\d+)=/)"), 'Le script doit extraire le paramètre entry de la nouvelle question.');

if (failures.length) {
  console.error('Régressions détectées :');
  failures.forEach(message => console.error('- ' + message));
  process.exit(1);
}

console.log('Questionnaire validé : contenu, parcours, envoi et affichage mobile cohérents.');
