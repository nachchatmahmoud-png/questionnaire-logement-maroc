import fs from 'node:fs';
import crypto from 'node:crypto';

const source = fs.readFileSync('assets/questionnaire.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const lockCss = fs.readFileSync('assets/questionnaire-ui-lock.css', 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const LOCK_HREF = '/questionnaire-logement-maroc/assets/questionnaire-ui-lock.css?v=20260812-ui-lock-v1';
const LOCK_SHA256 = '8594822d6bf4254ba51513485d7c343fda61a7114fdd9748a69f67fd2fe8e0bd';
const lockHash = crypto.createHash('sha256').update(lockCss).digest('hex');

expect(lockHash === LOCK_SHA256, 'Le fichier de style verrouillé a été modifié. Toute modification doit être explicitement validée.');
expect(index.includes(LOCK_HREF), 'Le fichier de style verrouillé doit rester chargé dans index.html.');

const lockPos = index.indexOf(LOCK_HREF);
const lastStylePos = index.lastIndexOf('</style>');
const headEndPos = index.indexOf('</head>');
expect(lockPos > lastStylePos, 'Le style verrouillé doit être chargé après tous les styles intégrés.');
expect(lockPos > -1 && lockPos < headEndPos, 'Le style verrouillé doit être chargé dans <head>.');
if (lockPos > -1 && headEndPos > lockPos) {
  const afterLock = index.slice(lockPos + LOCK_HREF.length, headEndPos);
  expect(!/<style\b/i.test(afterLock), 'Aucun <style> ne peut être ajouté après le style verrouillé.');
  expect(!/<link[^>]+rel=["\']stylesheet["\']/i.test(afterLock), 'Aucune feuille de style ne peut être chargée après le style verrouillé.');
}

expect(source.includes('checkbox-question-title'), 'Les titres des questions à cases à cocher doivent conserver la classe checkbox-question-title.');
expect(source.includes('instruction-text'), 'Les consignes doivent conserver la classe instruction-text.');
expect(source.includes('س1-أ. عبر أي وسيلة تفضلون التوصل بمعلومات حول البرامج العمومية؟'), 'La numérotation س1-أ doit être conservée.');
expect(source.includes('س2-أ. من خلال أي من المصادر التالية اطلعتم على معلومات حول البرنامج؟'), 'La numérotation س2-أ doit être conservée.');
expect(source.includes('س2-ب. ما السبب الرئيسي لعدم اطلاعكم على معلومات حول البرنامج عبر القنوات الرسمية للوزارة؟'), 'La numérotation س2-ب doit être conservée.');

expect(lockCss.includes('color: #111827 !important;'), 'Les titres de questions protégés doivent rester noirs.');
expect(lockCss.includes('color: #6b7280 !important;'), 'Les consignes doivent rester grises.');
expect(lockCss.includes('font-size: 14px !important;'), 'Les consignes doivent rester en 14 px.');
expect(lockCss.includes('font-size: 16px !important;'), 'Les questions protégées doivent rester en 16 px.');
expect(lockCss.includes('margin: 6px 0 12px !important;'), 'L’espacement question/consigne doit rester fixé à 6 px.');
expect(lockCss.includes('@media (min-width: 761px)'), 'Le verrou desktop doit rester présent.');
expect(lockCss.includes('@media (max-width: 760px)'), 'Le verrou mobile doit rester présent.');

// Vérifie le comportement réel du parcours et des réponses, y compris après retour en arrière.
const radioInputs = [];
const testDocument = {
  querySelector: () => null,
  querySelectorAll: selector => selector === 'input[type=radio][data-id]' ? radioInputs : [],
};
const appSource = source.slice(0, source.indexOf("const style=document.createElement('style')"));
const app = Function('document', 'window', appSource + `
  render = () => {};
  return {state, G, beneficiary, evaluation, requiredIds, submissionRoute, scores,
    bind, clearInapplicableBeneficiaryAnswers,
    COMBINED_BENEFICIARY, Q3_DETAIL_PERSONAL, Q3_DETAIL_FAMILY};
`)(testDocument, {addEventListener() {}});
const personalIds = app.G.satisfaction.flatMap(([, rows]) => rows.map(([id]) => id));
const generalIds = app.G.generalImpact.flatMap(([, rows]) => rows.map(([id]) => id));
function selectAnswer(id, value) {
  radioInputs.length = 0;
  const input = {dataset: {id}, value};
  radioInputs.push(input);
  app.bind();
  input.onchange();
}
function setBeneficiaryRoute(q2, detail) {
  app.state.a = {q1: 'نعم', q2, status: app.COMBINED_BENEFICIARY, q3_detail: detail};
}
for (const q2 of ['نعم', 'لا']) {
  const route = q2 === 'نعم' ? 'official' : 'g2';
  setBeneficiaryRoute(q2, app.Q3_DETAIL_PERSONAL);
  expect(app.beneficiary(), 'Le bénéficiaire direct doit être reconnu dans le parcours ' + route + '.');
  expect(app.submissionRoute() === route + '_beneficiary', 'Le bénéficiaire direct doit conserver son parcours Google Forms.');
  expect(personalIds.every(id => app.evaluation().includes('data-id="' + id + '"')), 'Les affirmations personnelles doivent être affichées au bénéficiaire direct.');
  expect(personalIds.every(id => app.requiredIds('evaluation').includes(id)), 'Les affirmations personnelles doivent être requises uniquement pour le bénéficiaire direct.');
  personalIds.forEach(id => { app.state.a[id] = '5'; });
  selectAnswer('q3_detail', app.Q3_DETAIL_FAMILY);
  expect(!app.beneficiary(), 'Un membre de la famille ne doit jamais être reconnu comme bénéficiaire direct.');
  expect(app.submissionRoute() === route + '_other', 'Le membre de famille doit utiliser le parcours Google Forms sans impact personnel.');
  expect(personalIds.every(id => !app.evaluation().includes('data-id="' + id + '"')), 'Aucune affirmation personnelle ne doit être affichée au membre de famille.');
  expect(personalIds.every(id => !app.requiredIds('evaluation').includes(id)), 'Les affirmations personnelles ne doivent pas bloquer le membre de famille.');
  expect(personalIds.every(id => !Object.hasOwn(app.state.a, id)), 'Les anciennes réponses personnelles doivent être effacées après passage au membre de famille.');
  expect(app.scores().dimensions.personal_impact.score === null, 'Le score d’impact personnel du membre de famille doit rester non applicable.');
  expect(personalIds.every(id => app.scores().raw_answers[id] === null), 'Aucune ancienne réponse personnelle ne doit subsister dans les données analytiques.');
  expect(generalIds.every(id => app.evaluation().includes('data-id="' + id + '"')), 'Le membre de famille conserve les affirmations d’impact général.');
  generalIds.forEach(id => { app.state.a[id] = '4'; });
  selectAnswer('q3_detail', app.Q3_DETAIL_PERSONAL);
  expect(personalIds.every(id => app.evaluation().includes('data-id="' + id + '"')), 'Les affirmations personnelles doivent réapparaître si le répondant devient bénéficiaire direct.');
  expect(generalIds.every(id => !Object.hasOwn(app.state.a, id)), 'Les anciennes réponses d’impact général doivent être effacées après passage au bénéficiaire direct.');
  for (const [id, value] of [['q1', 'لا'], ['q2', q2 === 'نعم' ? 'لا' : 'نعم'], ['status', 'قدمت طلبًا وما زال قيد المعالجة.']]) {
    setBeneficiaryRoute(q2, app.Q3_DETAIL_PERSONAL);
    personalIds.forEach(key => { app.state.a[key] = '5'; });
    selectAnswer(id, value);
    expect(!app.beneficiary(), 'Le changement de filtre ' + id + ' doit invalider le statut personnel antérieur.');
    expect(personalIds.every(key => !Object.hasOwn(app.state.a, key)), 'Le changement de filtre ' + id + ' doit effacer les réponses personnelles devenues inapplicables.');
  }
}
for (const overrides of [
  {q1: 'لا'}, {q2: ''}, {status: 'قدمت طلبًا وما زال قيد المعالجة.'}, {q3_detail: ''},
  {q3_detail: app.Q3_DETAIL_FAMILY},
]) {
  setBeneficiaryRoute('نعم', app.Q3_DETAIL_PERSONAL);
  Object.assign(app.state.a, overrides);
  personalIds.forEach(id => { app.state.a[id] = '5'; });
  expect(!app.beneficiary(), 'Une réponse personnelle isolée ne doit pas suffire lorsque les filtres sont incohérents.');
  app.clearInapplicableBeneficiaryAnswers();
  expect(personalIds.every(id => !Object.hasOwn(app.state.a, id)), 'Le nettoyage avant envoi doit écarter tout impact personnel non applicable.');
}
expect(index.includes('questionnaire.js?v=20261106-contact-reason-other-v1'), 'Le cache du fichier principal doit être actualisé pour ce correctif.');

if (failures.length) {
  console.error('\nVERROU UI REFUSE :');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('QUESTIONNAIRE OK : affichage mobile et ordinateur, impact personnel réservé aux bénéficiaires directs.');
