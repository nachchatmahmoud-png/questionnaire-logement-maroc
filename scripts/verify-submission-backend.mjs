import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const properties = new Map();
const ItemType = new Proxy({}, {get: (_, key) => key});
const context = vm.createContext({
  FormApp: {ItemType}, console,
  PropertiesService: {getScriptProperties: () => ({
    getProperty: key => properties.get(key) ?? null,
    setProperty: (key, value) => properties.set(key, value),
    deleteProperty: key => properties.delete(key),
  })},
});
const source = fs.readFileSync('apps-script/controle-participation-google.gs', 'utf8');
vm.runInContext(source, context);
const {control, update} = vm.runInContext('({control:CONTROLE_PARTICIPATION,update:MISE_A_JOUR_QUESTIONNAIRE})', context);

function item(id, type, title, entry, choices = []) {
  const obj = {
    getId: () => Number(id), getType: () => type, getTitle: () => title,
    getChoices: () => choices.map(value => ({getValue: () => value})),
    getRows: () => ['row'], getColumns: () => update.LIKERT_COLUMNS,
    createResponse: value => {
      if (type === ItemType.MULTIPLE_CHOICE && !choices.includes(value)) throw new Error('invalid choice');
      return {id, entry, value};
    },
  };
  for (const name of ['Text','ParagraphText','MultipleChoice','Grid','CheckboxGrid','List','Checkbox','Scale']) obj['as'+name+'Item'] = () => obj;
  return obj;
}
function form(items) {
  let reads = 0;
  return {
    reads: () => reads,
    getItems: () => { reads++; return items; },
    createResponse: () => {
      const responses = [];
      const response = {
        responses,
        withItemResponse: value => {responses.push(value); return response;},
        toPrefilledUrl: () => 'https://docs.google.com/forms/viewform?' + responses.map(r => 'entry.'+r.entry+'=mapping').join('&'),
        submit: () => {throw new Error('No synthetic responses may be submitted by verification.');},
      };
      return response;
    },
  };
}
const technical = item('777', ItemType.TEXT, control.SUBMISSION_ID_TITLE, '888');
const education = item('123', ItemType.TEXT, 'Higher education', '54285798');
const live = form([technical, education]);
const bundle = context.chargerItemsFormulaireV30_(live);
properties.set(control.ENTRY_ITEM_MAP_PROPERTY, JSON.stringify({[control.SUBMISSION_ENTRY_ID]: {itemId:'911730967'}}));
const refreshed = context.obtenirCorrespondanceFormulaire_(live, bundle);
assert.equal(refreshed[control.SUBMISSION_ENTRY_ID].itemId, '777', 'An open page must retain the old transport ID as an alias to the current technical item.');
assert.equal(refreshed['888'].itemId, '777', 'The actual current Google Forms entry must also remain mapped.');
const reads = live.reads();
context.obtenirCorrespondanceFormulaire_(live, bundle);
assert.equal(live.reads(), reads, 'A valid mapping must not reload the whole form.');

context.creerReferenceTechniqueSignee_ = () => 'site:test:signature';
const draft = context.preparerReponseUltraRapideV30_(live, technical, 'test', {'54285798':'Doctorat'}, {}, refreshed,
  {descripteurs:{},supplementaires:{}}, bundle);
assert.equal(draft.responses.find(r => r.id === '123').value, 'Doctorat', 'A stale hardcoded item must yield to the valid live mapping.');
assert.equal(draft.responses.find(r => r.id === '777').value, 'site:test:signature');

const contactValues = [
  'خدمة «اتصل بنا» على منصة «دعم سكن»',
  'خدمة التواصل عبر الموقع الإلكتروني الرسمي للوزارة',
  'الهاتف المخصص للتواصل',
  'البريد الإلكتروني المخصص للتواصل',
  'الصفحات أو الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي (عبر الرسائل أو التعليقات)',
  'قناة رسمية أخرى',
];
const contact = item('10', ItemType.MULTIPLE_CHOICE, 'Contact channel', '20', contactValues);
for (const [input, expected] of [
  ['الهاتف / مركز الاتصال الرسمي → عبر الرقم: \u200E+212 5 37 71 81 81', contactValues[2]],
  ['البريد الإلكتروني الرسمي → contact@daamsakane.ma', contactValues[3]],
  ['الموقع الرسمي للوزارة → mhpv.gov.ma', contactValues[1]],
  ['منصة دعم سكن – DaamSakane.ma → عبر خدمة «اتصل بنا» على المنصة الرسمية.', contactValues[0]],
]) assert.equal(context.creerReponseChoixUniqueCompatibleV26_(contact, input).value, expected);
assert.throws(() => context.creerReponseChoixUniqueCompatibleV26_(contact, 'Unrecognized channel'), /INVALID_CHOICE_V26/);
assert.throws(() => context.creerReponseChoixUniqueCompatibleV26_(
  item('11',ItemType.MULTIPLE_CHOICE,'Ambiguous phone','21',['الهاتف المخصص للتواصل','الهاتف المخصص للمساعدة']),
  'مركز الاتصال الرسمي'), /INVALID_CHOICE_V26/, 'Ambiguous choices must remain rejected.');

const supplements = [
  ['preferred_public_channel', ItemType.MULTIPLE_CHOICE, update.PREFERRED_CHANNEL_TITLE],
  ['no_official_reason', ItemType.MULTIPLE_CHOICE, update.NO_OFFICIAL_REASON_TITLE],
  ['trust_general_common', ItemType.GRID, update.TRUST_COMMON_TITLE],
  ['official_source_other_detail', ItemType.TEXT, update.OFFICIAL_SOURCE_OTHER_DETAIL_TITLE],
  ['external_source_other_detail', ItemType.TEXT, update.EXTERNAL_SOURCE_OTHER_DETAIL_TITLE],
  ['contact_channel_other_detail', ItemType.TEXT, update.CONTACT_CHANNEL_OTHER_DETAIL_TITLE],
].map(([,type,title], index) => item(String(1000+index), type, title, String(2000+index), ['sample']));
const planForm = form([technical, ...supplements]);
const planBundle = context.chargerItemsFormulaireV30_(planForm);
properties.set('FORM_FAST_PLAN_20260815_V24', JSON.stringify({
  version:'2026-10-28-v30.2',technicalItemId:'911730967',descripteurs:{},supplementaires:{},
}));
const rebuilt = context.obtenirPlanRapideV23_(planForm, {[control.SUBMISSION_ENTRY_ID]: {itemId:'777'}}, planBundle);
assert.equal(rebuilt.plan.technicalItemId, '777');
assert.equal(rebuilt.cache, false, 'A cache referring to a removed technical item must be rebuilt.');
const cached = context.obtenirPlanRapideV23_(planForm, {[control.SUBMISSION_ENTRY_ID]: {itemId:'777'}}, planBundle);
assert.equal(cached.cache, true);
assert.equal(planForm.reads(), 1, 'Plan validation must reuse the already loaded items.');
properties.delete('FORM_FAST_PLAN_20260815_V24');
const withoutLegacyTrust = form([technical, ...supplements.filter(i => i.getTitle() !== update.TRUST_COMMON_TITLE)]);
const withoutLegacyBundle = context.chargerItemsFormulaireV30_(withoutLegacyTrust);
const optionalPlan = context.obtenirPlanRapideV23_(withoutLegacyTrust, {[control.SUBMISSION_ENTRY_ID]: {itemId:'777'}}, withoutLegacyBundle);
assert.equal(Object.hasOwn(optionalPlan.plan.supplementaires, 'trust_general_common'), false, 'An unused removed legacy field must not block a valid current route.');
assert.throws(() => context.ajouterReponsesSupplementairesUltraRapideV30_(
  withoutLegacyTrust.createResponse(), {trust_general_common: update.LIKERT_COLUMNS[0]}, optionalPlan.plan, withoutLegacyBundle
), /CONFIGURATION_MISSING/, 'A requested missing field must still reject the response before submission.');
console.log('Backend verification passed: stale reference, open-page compatibility, live mapping, contact aliases, ambiguity rejection, cache invalidation; no responses submitted.');
