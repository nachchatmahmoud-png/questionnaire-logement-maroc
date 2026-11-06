import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync('assets/questionnaire.js', 'utf8');
const radioInputs = [];
const testDocument = {
  querySelector: () => null,
  querySelectorAll: selector => selector === 'input[type=radio][data-id]' ? radioInputs : [],
};
const appSource = source.slice(0, source.indexOf("const style=document.createElement('style')"));
const app = Function('document', 'window', appSource + `
  render = () => {};
  const sent = [];
  confirmSubmissionAutomatically = async (id, payload) => {sent.push(payload); return {allowed:true};};
  return {state, auth, G, sent, interaction, requiredIds, valid, bind, submit,
    contactReasons, CONTACT_REASON_OTHER, contactReasonForSubmission,
    COMBINED_BENEFICIARY, Q3_DETAIL_PERSONAL, Q3_DETAIL_FAMILY,
    ENTRY_G2_BENEFICIARY, ENTRY_G2_OTHER, ENTRY_OFFICIAL_BENEFICIARY, ENTRY_OFFICIAL_OTHER};
`)(testDocument, {addEventListener() {}});

function select(id, value) {
  radioInputs.length = 0;
  const input = {dataset:{id},value};
  radioInputs.push(input);
  app.bind();
  input.onchange();
}
function initialize(q2='نعم', personal=true) {
  app.state.a = {
    q1:'نعم',q2,status:app.COMBINED_BENEFICIARY,
    q3_detail:personal ? app.Q3_DETAIL_PERSONAL : app.Q3_DETAIL_FAMILY,
    contact_reel:'نعم',contact_reason:app.CONTACT_REASON_OTHER,
    canal_dernier_contact:'الهاتف المخصص للتواصل',reponse_recue:'لا',
    age:'من 25 إلى 34 سنة',gender:'ذكر',education:'التعليم الثانوي',
    housing:'أكتري السكن الذي أقيم فيه',residence:'داخل المغرب',
    region:'الرباط - سلا - القنيطرة',professional:'موظف أو موظفة في القطاع العام',
  };
  app.G.interactionPerceptions.flatMap(([, rows]) => rows).forEach(([id]) => {app.state.a[id]='3';});
  app.state.step='interaction';
  app.state.done=false;
}

initialize();
assert.ok(app.interaction().includes('data-text="contact_reason_other_detail"'));
assert.ok(app.requiredIds('interaction').includes('contact_reason_other_detail'));
assert.equal(app.valid(),false,'Choosing Other must require a precision.');
app.state.a.contact_reason_other_detail='   ';
assert.equal(app.valid(),false,'Whitespace is not a valid reason.');
app.state.a.contact_reason_other_detail='  سبب توضيحي تجريبي  ';
assert.equal(app.valid(),true);
assert.equal(app.contactReasonForSubmission(),'سبب توضيحي تجريبي');
assert.ok(app.interaction().includes('سبب توضيحي تجريبي'),'Re-rendering must preserve the text.');
select('contact_reason',app.contactReasons[0]);
assert.equal(Object.hasOwn(app.state.a,'contact_reason_other_detail'),false);
assert.equal(app.interaction().includes('data-text="contact_reason_other_detail"'),false);
assert.equal(app.requiredIds('interaction').includes('contact_reason_other_detail'),false);
assert.equal(app.contactReasonForSubmission(),app.contactReasons[0]);
select('contact_reason',app.CONTACT_REASON_OTHER);
app.state.a.contact_reason_other_detail='ancienne précision';
select('contact_reel','لا');
assert.equal(Object.hasOwn(app.state.a,'contact_reason_other_detail'),false);
initialize();
app.state.a.contact_reason_other_detail='ancienne précision';
select('q1','لا');
assert.equal(Object.hasOwn(app.state.a,'contact_reason_other_detail'),false);

app.auth.allowed=true;
app.auth.idToken='local-test-token';
app.auth.submissionEntryId='1955032181';
for (const [q2,personal,map] of [
  ['لا',true,app.ENTRY_G2_BENEFICIARY],['لا',false,app.ENTRY_G2_OTHER],
  ['نعم',true,app.ENTRY_OFFICIAL_BENEFICIARY],['نعم',false,app.ENTRY_OFFICIAL_OTHER],
]) {
  initialize(q2,personal);
  app.state.step='demographics';
  app.state.pendingSubmissionId='local-test-submission-1234';
  app.state.a.contact_reason_other_detail='  سبب آخر توضيحي  ';
  await app.submit();
  assert.equal(app.sent.at(-1)[map.contact_reason],'سبب آخر توضيحي','The actual text must be included in the native Forms field for each route.');
  assert.equal(app.state.done,true);
}
console.log('Other contact reason verified: conditional input, required precision, cleanup and text sent in all four routes; no network requests.');
