import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync('assets/questionnaire.js','utf8');
const radioInputs = [], checkboxInputs = [];
const detailIds = ['preferred_public_channel_other','official_other_detail','external_other_detail','no_official_reason_other','contact_reason_other_detail','noninteraction_reason_other_detail','contact_channel_other_detail','housing_other_detail'];
let app, focused = '';
const inputs = Object.fromEntries(detailIds.map(id => [id,{dataset:{text:id},value:'',focus(){focused=id;}}]));
const visible = id => app && app.section().includes('data-text="'+id+'"');
const document = {
  querySelector(selector) {
    const id=selector.match(/^\[data-text="([^"]+)"\]$/)?.[1];
    return id && visible(id) ? inputs[id] : null;
  },
  querySelectorAll(selector) {
    if(selector==='input[type=radio][data-id]') return radioInputs;
    if(selector==='input[type=checkbox][data-check]') return checkboxInputs;
    if(selector==='[data-text]') return detailIds.filter(visible).map(id=>inputs[id]);
    return [];
  }
};
const appSource=source.slice(0,source.indexOf("const style=document.createElement('style')"));
app=Function('document','window',appSource+`
  render=()=>{};
  const sent=[];
  confirmSubmissionAutomatically=async(id,payload,supplemental)=>{sent.push({payload,supplemental});return {allowed:true};};
  return {state,auth,G,sent,section,filters,interaction,demo,requiredIds,valid,bind,submit,
    CONTACT_REASON_OTHER,NONINTERACTION_REASON_OTHER,OTHER_CONTACT_CHANNEL,HOUSING_OTHER,PUBLIC_CHANNEL_OTHER,NO_OFFICIAL_REASON_OTHER,
    OFFICIAL_SOURCE_OTHER_ID,EXTERNAL_SOURCE_OTHER_ID,officialSourceCodes,
    publicCommunicationChannels,noOfficialReasons,contactReasons,nonInteractionReasons,contactChannels,demographics,statuses,
    COMBINED_BENEFICIARY,Q3_DETAIL_PERSONAL,Q3_DETAIL_FAMILY,
    ENTRY_COMMON,ENTRY_G2_SHARED,ENTRY_OFFICIAL_SHARED,ENTRY_G2_BENEFICIARY,ENTRY_G2_OTHER,ENTRY_OFFICIAL_BENEFICIARY,ENTRY_OFFICIAL_OTHER};
`)(document,{addEventListener(){}});

function base(q2='نعم',personal=false) {
  radioInputs.length=0; checkboxInputs.length=0; focused='';
  app.state.a={q1:'نعم',q2,status:personal?app.COMBINED_BENEFICIARY:app.statuses[1],
    ...(personal?{q3_detail:app.Q3_DETAIL_PERSONAL}:{}),
    official_daamsakane_web:'1',sourcePrincipale:'daamsakane',external_family:'1',no_official_reason:app.noOfficialReasons[0],
    contact_reel:'نعم',contact_reason:app.contactReasons[0],noninteraction_reason:app.nonInteractionReasons[0],
    canal_dernier_contact:app.contactChannels[0],reponse_recue:'لا',
    age:app.demographics.age[0],gender:app.demographics.gender[0],education:app.demographics.education[0],
    housing:app.demographics.housing[0],residence:'داخل المغرب',region:app.demographics.region[0],professional:app.demographics.professional[0]};
  app.G.interactionPerceptions.flatMap(([,rows])=>rows).forEach(([id])=>{app.state.a[id]='3';});
  app.state.step='filters'; app.state.done=false; app.state.error='';
  app.state.pendingSubmissionId='verification-local-autres-20261106';
}
function select(id,value,checkbox=false) {
  radioInputs.length=0;checkboxInputs.length=0;
  const input=checkbox?{dataset:{check:id},checked:value}:{dataset:{id},value};
  (checkbox?checkboxInputs:radioInputs).push(input);
  app.bind(); input.onchange();
}
function type(id,value) {
  app.bind(); assert.equal(typeof inputs[id].oninput,'function','Visible detail must accept input: '+id);
  inputs[id].value=value; inputs[id].oninput();
}
const cases=[
  {name:'canal public préféré',key:'preferred_public_channel',other:app.PUBLIC_CHANNEL_OTHER,detail:'preferred_public_channel_other',step:'filters',setup(){select('q1','لا');},fixed:app.publicCommunicationChannels[0]},
  {name:'source officielle',key:app.OFFICIAL_SOURCE_OTHER_ID,other:true,detail:'official_other_detail',step:'filters',checkbox:true},
  {name:'source externe',key:app.EXTERNAL_SOURCE_OTHER_ID,other:true,detail:'external_other_detail',step:'filters',checkbox:true,setup(){app.state.a.q2='لا';}},
  {name:'motif de non-exposition',key:'no_official_reason',other:app.NO_OFFICIAL_REASON_OTHER,detail:'no_official_reason_other',step:'filters',setup(){app.state.a.q2='لا';},fixed:app.noOfficialReasons[0]},
  {name:'motif de contact',key:'contact_reason',other:app.CONTACT_REASON_OTHER,detail:'contact_reason_other_detail',step:'interaction',fixed:app.contactReasons[0]},
  {name:'motif de non-contact',key:'noninteraction_reason',other:app.NONINTERACTION_REASON_OTHER,detail:'noninteraction_reason_other_detail',step:'interaction',setup(){select('contact_reel','لا');},fixed:app.nonInteractionReasons[0]},
  {name:'canal de contact',key:'canal_dernier_contact',other:app.OTHER_CONTACT_CHANNEL,detail:'contact_channel_other_detail',step:'interaction',fixed:app.contactChannels[0]},
  {name:'situation de logement',key:'housing',other:app.HOUSING_OTHER,detail:'housing_other_detail',step:'demographics',fixed:app.demographics.housing[0]},
];
const precision='تفصيل توضيحي <&" للتحقق';
for(const c of cases) {
  base(); c.setup?.(); app.state.step=c.step;
  assert.equal(visible(c.detail),false,'Detail must be hidden initially: '+c.name);
  select(c.key,c.other,c.checkbox);
  assert.equal(visible(c.detail),true,'Other must display an input: '+c.name);
  assert.equal(focused,c.detail,'Selecting Other must place the cursor in its input: '+c.name);
  const tag=app.section().match(new RegExp('<input[^>]*data-text="'+c.detail+'"[^>]*>'))?.[0]||'';
  assert.ok(tag.includes('type="text"') && tag.includes('aria-label=') && tag.includes('maxlength="500"') && tag.includes('required'));
  assert.ok(!tag.includes('disabled') && !tag.includes('readonly'));
  assert.ok(app.requiredIds(c.step).includes(c.detail));
  assert.equal(app.valid(),false,'An empty precision must block progression: '+c.name);
  type(c.detail,'   '); assert.equal(app.valid(),false);
  type(c.detail,precision); assert.equal(app.state.a[c.detail],precision);
  assert.equal(app.valid(),true,'A valid precision must allow progression: '+c.name);
  assert.ok(app.section().includes('&lt;&amp;&quot;'),'Rerender must preserve and escape the precision: '+c.name);
  select(c.key,c.checkbox?false:c.fixed,c.checkbox);
  assert.equal(visible(c.detail),false);
  assert.equal(Object.hasOwn(app.state.a,c.detail),false,'A deselected detail must be cleared: '+c.name);
  assert.equal(app.requiredIds(c.step).includes(c.detail),false);
}

// The primary-source Other choice reuses the official-source precision.
base();select(app.OFFICIAL_SOURCE_OTHER_ID,true,true);type('official_other_detail',precision);
focused='';select('sourcePrincipale',app.officialSourceCodes[app.OFFICIAL_SOURCE_OTHER_ID]);
assert.equal(focused,'official_other_detail');assert.equal(app.state.a.official_other_detail,precision);
focused='';select('sourcePrincipale',app.officialSourceCodes.official_daamsakane_web);
assert.equal(focused,'');assert.equal(app.state.a.official_other_detail,precision,'Changing the primary source must preserve details of a source that remains checked.');

// Abandoning a branch must remove its now-inapplicable precision.
base();app.state.step='interaction';select('contact_reel','لا');
select('noninteraction_reason',app.NONINTERACTION_REASON_OTHER);type('noninteraction_reason_other_detail',precision);
select('contact_reel','نعم');
assert.equal(Object.hasOwn(app.state.a,'noninteraction_reason_other_detail'),false);
assert.equal(app.requiredIds('interaction').includes('noninteraction_reason_other_detail'),false);
base();select(app.OFFICIAL_SOURCE_OTHER_ID,true,true);type('official_other_detail',precision);
select('q2','لا');assert.equal(Object.hasOwn(app.state.a,'official_other_detail'),false);
select(app.EXTERNAL_SOURCE_OTHER_ID,true,true);type('external_other_detail',precision);
select('no_official_reason',app.NO_OFFICIAL_REASON_OTHER);type('no_official_reason_other',precision);
select('q2','نعم');
assert.equal(Object.hasOwn(app.state.a,'external_other_detail'),false);
assert.equal(Object.hasOwn(app.state.a,'no_official_reason_other'),false);
for(const id of detailIds.filter(id=>!['preferred_public_channel_other','housing_other_detail'].includes(id))) app.state.a[id]=precision;
select('q1','لا');
for(const id of detailIds.filter(id=>!['preferred_public_channel_other','housing_other_detail'].includes(id))) assert.equal(Object.hasOwn(app.state.a,id),false);
select('preferred_public_channel',app.PUBLIC_CHANNEL_OTHER);type('preferred_public_channel_other',precision);
select('q1','نعم');assert.equal(Object.hasOwn(app.state.a,'preferred_public_channel_other'),false);

app.auth.allowed=true;app.auth.idToken='local-test-token';app.auth.submissionEntryId='1955032181';
const routeCases=[['لا',true,app.ENTRY_G2_BENEFICIARY],['لا',false,app.ENTRY_G2_OTHER],['نعم',true,app.ENTRY_OFFICIAL_BENEFICIARY],['نعم',false,app.ENTRY_OFFICIAL_OTHER]];
for(const [q2,personal,map] of routeCases) for(const contact of ['نعم','لا']) {
  base(q2,personal); app.state.step='demographics';
  app.state.a.housing=app.HOUSING_OTHER;app.state.a.housing_other_detail='  '+precision+'  ';
  if(q2==='نعم') Object.assign(app.state.a,{official_other:'1',official_other_detail:'  '+precision+'  ',sourcePrincipale:app.officialSourceCodes.official_other});
  else Object.assign(app.state.a,{external_other:'1',external_other_detail:'  '+precision+'  ',no_official_reason:app.NO_OFFICIAL_REASON_OTHER,no_official_reason_other:'  '+precision+'  '});
  select('contact_reel',contact);
  if(contact==='نعم') Object.assign(app.state.a,{contact_reason:app.CONTACT_REASON_OTHER,contact_reason_other_detail:'  '+precision+'  ',canal_dernier_contact:app.OTHER_CONTACT_CHANNEL,contact_channel_other_detail:'  '+precision+'  ',reponse_recue:'لا'});
  else Object.assign(app.state.a,{noninteraction_reason:app.NONINTERACTION_REASON_OTHER,noninteraction_reason_other_detail:'  '+precision+'  '});
  await app.submit();
  assert.equal(app.state.done,true);
  const {payload,supplemental}=app.sent.at(-1);
  assert.equal(payload[app.ENTRY_COMMON.housing],precision);
  if(contact==='نعم') {
    assert.equal(payload[map.contact_reason],precision);
    assert.equal(payload[map.canal_dernier_contact],app.OTHER_CONTACT_CHANNEL);
    assert.equal(supplemental.contact_channel_other_detail,precision);
    assert.equal(Object.hasOwn(payload,map.noninteraction_reason),false);
  } else {
    assert.equal(payload[map.noninteraction_reason],precision);
    assert.equal(Object.hasOwn(payload,map.contact_reason),false);
    assert.equal(Object.hasOwn(supplemental,'contact_channel_other_detail'),false);
  }
  if(q2==='نعم') {
    assert.equal(supplemental.official_source_other_detail,precision);
    assert.ok([].concat(payload[app.ENTRY_OFFICIAL_SHARED.official_sources]).includes('مصدر رسمي آخر'));
    assert.equal(payload[app.ENTRY_OFFICIAL_SHARED.source_principale],'مصدر رسمي آخر');
  } else {
    assert.equal(supplemental.external_source_other_detail,precision);
    assert.equal(supplemental.no_official_reason,precision);
  }
}
base();app.state.step='demographics';select('q1','لا');
Object.assign(app.state.a,{preferred_public_channel:app.PUBLIC_CHANNEL_OTHER,preferred_public_channel_other:'  '+precision+'  ',housing:app.HOUSING_OTHER,housing_other_detail:'  '+precision+'  '});
await app.submit();assert.equal(app.sent.at(-1).supplemental.preferred_public_channel,precision);
assert.equal(app.sent.at(-1).payload[app.ENTRY_COMMON.housing],precision);

const backend=fs.readFileSync('apps-script/controle-participation-google.gs','utf8');
const parserCode=['parserChargeReponses_','parserReponsesSupplementaires_'].map(name=>backend.match(new RegExp('function '+name+'\\([\\s\\S]*?^}','m'))[0]).join('\n');
const parsers=Function(parserCode+'\nreturn {parserChargeReponses_,parserReponsesSupplementaires_};')();
for(const {payload,supplemental} of app.sent) {
  assert.deepEqual(parsers.parserChargeReponses_(JSON.stringify(payload)),payload);
  assert.deepEqual(parsers.parserReponsesSupplementaires_(JSON.stringify(supplemental)),supplemental);
}
console.log('All 8 Other fields verified: editable inputs, automatic focus, required and escaped text, cleanup, all route payloads and backend parsing; no network requests.');
