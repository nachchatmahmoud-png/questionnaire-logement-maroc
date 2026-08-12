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
expect(source.includes('س2-ب. ما السبب الرئيسي لعدم اطلاعكم على معلومات حول البرنامج عبر القنوات الرسمية للوزارة أو للبرنامج؟'), 'La numérotation س2-ب doit être conservée.');

expect(lockCss.includes('color: #111827 !important;'), 'Les titres de questions protégés doivent rester noirs.');
expect(lockCss.includes('color: #6b7280 !important;'), 'Les consignes doivent rester grises.');
expect(lockCss.includes('font-size: 14px !important;'), 'Les consignes doivent rester en 14 px.');
expect(lockCss.includes('font-size: 16px !important;'), 'Les questions protégées doivent rester en 16 px.');
expect(lockCss.includes('margin: 6px 0 12px !important;'), 'L’espacement question/consigne doit rester fixé à 6 px.');
expect(lockCss.includes('@media (min-width: 761px)'), 'Le verrou desktop doit rester présent.');
expect(lockCss.includes('@media (max-width: 760px)'), 'Le verrou mobile doit rester présent.');

if (failures.length) {
  console.error('\nVERROU UI REFUSE :');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('VERROU UI OK : mobile et ordinateur protégés.');
