const FORM_ACTION='https://docs.google.com/forms/d/e/1FAIpQLSfIOkBS04JQVuTRE0npIB6QOJ6UPg0ckoBTqAdLG9PT3yUOkA/formResponse';
const FORM_PUBLIC_URL='https://docs.google.com/forms/d/e/1FAIpQLSfIOkBS04JQVuTRE0npIB6QOJ6UPg0ckoBTqAdLG9PT3yUOkA/viewform';
const GOOGLE_CLIENT_ID='285878510024-7dhdojiucp6ff20m2snuro018t70c6s5.apps.googleusercontent.com';
const AUTH_BRIDGE_URL='https://script.google.com/macros/s/AKfycbxmwpYfo8bhwBmPPsKrIsqIfW4DQUxOxrwYavWgojHvLzR0e-TDK-DQj7t3LNeODRSv/exec';
const AUTH_CHANNEL='questionnaire-logement-auth-v1';
const SCHEMA_VERSION='2026-08-10-profils-g1-g5-v5-five-point-scales';
const ENTRY_COMMON={
 q1:'299895912',q2:'1225420672',age:'1577939573',gender:'2068308268',education:'1330802393',housing:'1373868444',residence:'865830704',professional:'1061681182',region:'861634292',country:'1099313147'
};
const ENTRY_G2_SHARED={external_sources:'1040032',status:'1268123456'};
const ENTRY_OFFICIAL_SHARED={official_sources:'1856677935',status:'739440927'};
const ENTRY_G2_BENEFICIARY={
 contact_reel:'237635013',canal_dernier_contact:'1051412983',reponse_recue:'1024258489',
 clarte_reponse:'1650482042',suffisance_reponse:'59663361',delai_reponse:'2100269279',
 understanding_1:'1845717094',understanding_2:'323132636',understanding_3:'1183906650',understanding_4:'1622342161',understanding_5:'838382116',understanding_6:'882397137',
 trust_general:'1545023701',legit_1:'1486461560',legit_2:'1904067536',legit_3:'1513964979',legit_4:'1092411069',
 ease_1:'1248958122',ease_2:'1537513608',ease_3:'664408094',accept_1:'1011219132',accept_2:'1200558200',accept_3:'844136116',
 satisfaction_1:'2008127058',satisfaction_2:'1587790851',satisfaction_3:'411578762',impact_general_1:'278562098',impact_general_2:'1951841168',impact_general_3:'2073040464',success_global:'2115818671',
 impact_personal_1:'271992870',impact_personal_2:'301943015',impact_personal_3:'1511212139',suggestion:'704695728'
};
const ENTRY_G2_OTHER={
 contact_reel:'328033588',canal_dernier_contact:'1748054727',reponse_recue:'476498187',
 clarte_reponse:'716145318',suffisance_reponse:'166426109',delai_reponse:'1813469453',
 understanding_1:'1374327145',understanding_2:'2115575476',understanding_3:'2111378965',understanding_4:'310689731',understanding_5:'1860201892',understanding_6:'1729249596',
 trust_general:'873189515',legit_1:'1677021184',legit_2:'520351974',legit_3:'1645334930',legit_4:'961995117',
 ease_1:'1198945725',ease_2:'1009069255',ease_3:'258582065',accept_1:'1265924651',accept_2:'1744035836',accept_3:'89167698',
 impact_general_1:'471635203',impact_general_2:'1258806770',impact_general_3:'708920828',success_global:'2059950392',suggestion:'159882139'
};
const ENTRY_OFFICIAL_BENEFICIARY={
 info_1:'1262380031',info_2:'618372618',info_3:'1276906943',info_4:'1758509584',info_5:'1958940162',info_6:'1042862389',
 info_7:'89201942',info_8:'2061798367',info_9:'699276498',info_10:'3577675',info_11:'1107060713',info_12:'483431253',info_13:'135111340',transparency_global:'1552438031',
 inter_comm_1:'1924785794',inter_comm_2:'1564005720',inter_comm_3:'589116406',inter_part_1:'1689196695',inter_part_2:'578326184',inter_part_3:'578057116',
 contact_reel:'1807617813',canal_dernier_contact:'1917194186',reponse_recue:'1188398753',clarte_reponse:'401614676',suffisance_reponse:'2030949688',delai_reponse:'1948428970',interaction_global:'1955561785',communication_quality_global:'1618370412',
 understanding_1:'366290689',understanding_2:'2118812173',understanding_3:'1797114715',understanding_4:'857685078',understanding_5:'1190608777',understanding_6:'2009753717',
 trust_1:'933937764',trust_2:'844787965',trust_3:'1182559343',trust_4:'91257242',trust_5:'674993537',
 legit_1:'1896687752',legit_2:'500642904',legit_3:'1151297594',legit_4:'1948347725',
 ease_1:'2143980090',ease_2:'1321206863',ease_3:'833854624',accept_1:'1229613680',accept_2:'3871385',accept_3:'1641681581',
 satisfaction_1:'1415343217',satisfaction_2:'1319006138',satisfaction_3:'1388444923',impact_general_1:'127822252',impact_general_2:'1335208252',impact_general_3:'1591834057',success_global:'1010115912',
 impact_personal_1:'1864877569',impact_personal_2:'800971163',impact_personal_3:'750218004',suggestion:'317816934'
};
const ENTRY_OFFICIAL_OTHER={
 info_1:'1389225289',info_2:'1504812338',info_3:'2684055',info_4:'1111425501',info_5:'1367527335',info_6:'2078777661',
 info_7:'495302381',info_8:'20488223',info_9:'2047790623',info_10:'73359176',info_11:'125291520',info_12:'733383354',info_13:'1717414505',transparency_global:'1912399868',
 inter_comm_1:'45196571',inter_comm_2:'1898453798',inter_comm_3:'1748147612',inter_part_1:'2104567946',inter_part_2:'1775831782',inter_part_3:'1629335611',
 contact_reel:'1924533978',canal_dernier_contact:'641302619',reponse_recue:'778119099',clarte_reponse:'2066363404',suffisance_reponse:'89722042',delai_reponse:'1975544690',interaction_global:'83983109',communication_quality_global:'1469339541',
 understanding_1:'850668692',understanding_2:'243215310',understanding_3:'1457325425',understanding_4:'1228145603',understanding_5:'1607620672',understanding_6:'1608907783',
 trust_1:'1808656211',trust_2:'1992870685',trust_3:'1344743776',trust_4:'2037118212',trust_5:'1300161676',
 legit_1:'1119108321',legit_2:'825450485',legit_3:'901308624',legit_4:'2085038932',
 ease_1:'883213170',ease_2:'1032356922',ease_3:'634945297',accept_1:'1155871809',accept_2:'917543744',accept_3:'397729049',
 impact_general_1:'157757540',impact_general_2:'222082286',impact_general_3:'50030157',success_global:'1505158683',suggestion:'217452855'
};
const SCALE=[['1','لا أوافق إطلاقًا'],['2','لا أوافق'],['3','لا أوافق ولا أعارض'],['4','أوافق'],['5','أوافق تمامًا']];
const state={a:{},step:'filters',intro:true,error:'',sending:false,done:false};
const auth={allowed:false,idToken:'',checking:false,blocked:false,error:'',gisReady:false};
const authRequests=new Map();
const $=s=>document.querySelector(s); const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const val=id=>state.a[id]??''; const set=(id,v)=>{state.a[id]=v;state.error='';};
const del=(...ids)=>ids.forEach(id=>delete state.a[id]);
const PERSONAL_BENEFICIARY='استفدت شخصيًا من البرنامج';
const FAMILY_BENEFICIARY='استفاد أحد أفراد أسرتي من البرنامج';
const beneficiary=()=>val('status')===PERSONAL_BENEFICIARY;
const route=()=>val('q1')==='لا'?'g1':val('q2')==='لا'?'g2':'official';
const submissionRoute=()=>route()==='g1'?'g1':route()+'_'+(beneficiary()?'beneficiary':'other');
const officialSources=[['official_daamsakane_web','المنصة الإلكترونية «دعم سكن» (daamsakane.ma)'],['official_daamsakane_app','تطبيق «دعم سكن» على الهاتف المحمول'],['official_ministry_web','الموقع الإلكتروني الرسمي للوزارة'],['official_social','الصفحات أو الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي']];
const externalSources=[['external_tv_radio','التلفزيون أو الإذاعة'],['external_press','الصحافة الإلكترونية أو الورقية'],['external_unofficial_social','مواقع أو صفحات غير رسمية على شبكات التواصل الاجتماعي'],['external_family','الأسرة أو الأصدقاء أو المعارف']];
const statuses=[PERSONAL_BENEFICIARY,FAMILY_BENEFICIARY,'قدمت طلبًا وما زال قيد المعالجة','قدمت طلبًا ولم تتم الموافقة عليه','اطلعت على البرنامج ولم أتقدم بطلب للاستفادة منه'];
const contactChannels=['خدمة «اتصل بنا» على منصة «دعم سكن»','خدمة التواصل أو نموذج الاتصال عبر الموقع الإلكتروني الرسمي للوزارة','البوابة الوطنية للشكايات «Chikaya.ma»','الرقم الهاتفي أو مركز الاتصال الرسمي المخصص للاستفسارات بشأن البرنامج','البريد الإلكتروني الرسمي المخصص للتواصل بشأن البرنامج','الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي، عبر الرسائل الخاصة أو التعليقات'];
const quiz=[
 ['understanding_1','1. ما الذي يقدمه برنامج الدعم المباشر للسكن؟',['قرضاً بنكياً لاقتناء سكن','دعماً مالياً للمساعدة على اقتناء سكن','سكناً مجانياً','دعماً لأداء واجبات الكراء'],'دعماً مالياً للمساعدة على اقتناء سكن'],
 ['understanding_2','2. السكن الذي يتم اقتناؤه في إطار البرنامج يجب أن يكون:',['سكناً مخصصاً للكراء','سكناً ثانوياً','سكناً رئيسياً للمستفيد','محلاً للاستعمال المهني'],'سكناً رئيسياً للمستفيد'],
 ['understanding_3','3. أي من الحالات التالية يتعارض مع شروط الاستفادة من البرنامج؟',['العمل في القطاع الخاص','عدم الزواج','الإقامة خارج المغرب','سبق الاستفادة من دعم أو امتياز من الدولة في مجال السكن'],'سبق الاستفادة من دعم أو امتياز من الدولة في مجال السكن'],
 ['understanding_4','4. أي من العبارات التالية صحيحة بخصوص مبلغ الدعم؟',['70.000 درهم لجميع المساكن مهما كان ثمنها','100.000 درهم للسكن الذي لا يتجاوز ثمنه 300.000 درهم، و70.000 درهم للسكن الذي يفوق ثمنه 300.000 درهم ولا يتجاوز 700.000 درهم','100.000 درهم لجميع المساكن مهما كان ثمنها','مبلغ الدعم لا يرتبط بثمن السكن'],'100.000 درهم للسكن الذي لا يتجاوز ثمنه 300.000 درهم، و70.000 درهم للسكن الذي يفوق ثمنه 300.000 درهم ولا يتجاوز 700.000 درهم'],
 ['understanding_5','5. ما الذي تتيحه منصة «دعم سكن» للراغبين في الاستفادة من البرنامج؟',['البحث عن مساكن للبيع وحجزها','الحصول على قرض سكني من البنك','تقديم طلب الاستفادة وتتبع مراحل الملف','أداء ثمن السكن عبر المنصة'],'تقديم طلب الاستفادة وتتبع مراحل الملف'],
 ['understanding_6','6. بعد الموافقة الأولية على طلب الاستفادة، تُستكمل إجراءات طلب الدعم عن طريق:',['البنك','الجماعة','الوكالة العقارية','الموثق'],'الموثق']
];
const G={
 information:[
  ['أولًا: الوصول إلى المعلومات',[['info_1','1. يسهل التعرف على القنوات الرسمية التي تنشر المعلومات المتعلقة ببرنامج الدعم المباشر للسكن.'],['info_2','2. يسهل الوصول إلى المعلومات المتعلقة بالبرنامج عبر وسائل التواصل الرسمية للوزارة.'],['info_3','3. أجد المعلومات الرسمية المتعلقة بالبرنامج متاحة عندما أحتاج إليها.']]],
  ['ثانيًا: وضوح المعلومات وسهولة فهمها',[['info_4','4. تُقدَّم المعلومات الرسمية المتعلقة بالبرنامج بلغة واضحة.'],['info_5','5. تُشرح المصطلحات والإجراءات المتعلقة بالبرنامج في المعلومات الرسمية بطريقة يسهل فهمها.'],['info_6','6. تشرح المعلومات الرسمية بوضوح الخطوات التي يجب اتباعها للاستفادة من البرنامج.']]],
  ['ثالثًا: كفاية المعلومات',[['info_7','7. توفر المعلومات الرسمية تفاصيل كافية حول شروط الاستفادة من البرنامج.'],['info_8','8. تحدد المعلومات الرسمية الوثائق المطلوبة لتقديم الطلب.'],['info_9','9. توضح المعلومات الرسمية مختلف مراحل معالجة الطلب.'],['info_10','10. توفر المعلومات الرسمية تفاصيل كافية حول قيمة الدعم وكيفية الاستفادة منه.']]],
  ['رابعًا: دقة المعلومات وتحيينها',[['info_11','11. المعلومات الرسمية التي تنشرها الوزارة بشأن البرنامج دقيقة.'],['info_12','12. تتسم المعلومات المنشورة عبر وسائل التواصل الرسمية للوزارة بالاتساق وعدم التناقض.'],['info_13','13. تعكس المعلومات المنشورة آخر المستجدات المتعلقة بالبرنامج.']]],
  ['التقييم العام للشفافية',[['transparency_global','14. بصفة عامة، أرى أن التواصل العمومي للوزارة حول برنامج الدعم المباشر للسكن يتسم بالشفافية.']]]
 ],
 interComm:[['أولًا: إمكانية التواصل مع الوزارة حول البرنامج',[['inter_comm_1','1. تتيح القنوات الرسمية للمواطنين توجيه استفساراتهم إلى الوزارة بشأن البرنامج.'],['inter_comm_2','2. تتيح القنوات الرسمية للمواطنين طلب توضيحات إضافية بشأن المعلومات المتعلقة بالبرنامج.'],['inter_comm_3','3. تُمكّن القنوات الرسمية المواطنين من مواصلة التواصل مع الوزارة عند الحاجة إلى معلومات أو توضيحات إضافية.']]]],
 interPart:[['ثانيًا: إمكانية المشاركة',[['inter_part_1','4. تتيح القنوات الرسمية للمواطنين تقديم ملاحظاتهم بشأن البرنامج.'],['inter_part_2','5. تتيح القنوات الرسمية للمواطنين تقديم مقترحات لتحسين البرنامج أو التواصل المرتبط به.'],['inter_part_3','6. تتيح القنوات الرسمية للمواطنين التعبير عن الصعوبات أو تقديم الشكايات المرتبطة بالبرنامج.']]]],
 interGlobal:[['التقييم العام لإمكانية التفاعل مع الوزارة',[['interaction_global','7. بصفة عامة، أرى أن وسائل التواصل الرسمية تتيح للمواطنين التفاعل مع الوزارة بشأن البرنامج.']]]],
 communicationQuality:[['التقييم العام لجودة تواصل الوزارة',[['communication_quality_global','1. بصفة عامة، أقيّم جودة تواصل الوزارة حول البرنامج تقييمًا إيجابيًا.']]]],
 response:[['تقييم الرد الذي توصلتم به',[['clarte_reponse','1. كان الرد الذي توصلت به واضحًا.'],['suffisance_reponse','2. تضمن الرد معلومات كافية بشأن الموضوع الذي تواصلت حوله.'],['delai_reponse','3. توصلت بالرد في أجل اعتبرته مناسبًا.']]]],
 trustGeneral:[['الثقة العامة في الوزارة',[['trust_general','بصفة عامة، أثق في قدرة الوزارة على تدبير برنامج الدعم المباشر للسكن.']]]],
 trust:[['الثقة في الوزارة',[['trust_1','1. المعلومات التي تنشرها الوزارة بشأن البرنامج دقيقة وموثوقة.'],['trust_2','2. لدى الوزارة القدرة على تدبير البرنامج بكفاءة.'],['trust_3','3. تُعالج طلبات الاستفادة وفق القواعد المعلنة.'],['trust_4','4. تطبق الوزارة معايير الاستفادة على جميع طالبي الدعم بصورة عادلة ودون تمييز.'],['trust_5','5. تفي الوزارة بالتزاماتها المعلنة بشأن البرنامج.']]]],
 legitimacy:[['مشروعية البرنامج',[['legit_1','1. تدخل الدولة من خلال برنامج الدعم المباشر للسكن مبرر بالنظر إلى صعوبات الولوج إلى السكن.'],['legit_2','2. تسهيل الولوج إلى السكن من خلال هذا البرنامج غاية اجتماعية تستحق الدعم.'],['legit_3','3. معايير الاستفادة المعتمدة في البرنامج عادلة.'],['legit_4','4. تخصيص موارد عمومية لتمويل البرنامج أمر مبرر.']]]],
 ease:[['أولًا: سهولة الاستفادة من البرنامج',[['ease_1','1. إجراءات طلب الاستفادة من البرنامج ميسرة بالنسبة للراغبين في الاستفادة.'],['ease_2','2. الوثائق المطلوبة للاستفادة من البرنامج يمكن توفيرها دون صعوبة كبيرة.'],['ease_3','3. شروط الاستفادة المحددة في البرنامج قابلة للاستيفاء بالنسبة للفئات المستهدفة.']]]],
 accept:[['ثانيًا: قبول البرنامج وتأييده',[['accept_1','1. أؤيد تطبيق برنامج الدعم المباشر للسكن.'],['accept_2','2. أؤيد استمرار العمل ببرنامج الدعم المباشر للسكن.'],['accept_3','3. أوصي بالاستفادة من البرنامج للأشخاص المؤهلين لذلك.']]]],
 satisfaction:[['ثالثًا: الرضا عن تجربة الاستفادة من البرنامج',[['satisfaction_1','1. كانت تجربتي في الاستفادة من البرنامج مرضية.'],['satisfaction_2','2. أنا راضٍ عن الدعم الذي حصلت عليه في إطار البرنامج.'],['satisfaction_3','3. جاءت تجربتي في الاستفادة من البرنامج في مستوى توقعاتي.']]]],
 generalImpact:[['رابعًا: الأثر العام للبرنامج',[['impact_general_1','1. يسهم البرنامج في تسهيل اقتناء السكن بالنسبة للفئات المستهدفة.'],['impact_general_2','2. يسهم البرنامج في تخفيف العبء المالي المرتبط باقتناء السكن.'],['impact_general_3','3. يسهم البرنامج في تحسين الظروف السكنية للمستفيدين.']]]],
 success:[['التقييم العام لنجاح البرنامج',[['success_global','بصفة عامة، أقيّم نجاح برنامج الدعم المباشر للسكن تقييمًا إيجابيًا.']]]],
 personalImpact:[['أثر الاستفادة من البرنامج على الوضع السكني',[['impact_personal_1','1. خفف الدعم من العبء المالي المرتبط باقتناء السكن.'],['impact_personal_2','2. ساهم الدعم في إتمام عملية اقتناء السكن.'],['impact_personal_3','3. ساهمت الاستفادة من البرنامج في تحسين وضعي السكني.']]]]
};
const stepTitles={filters:'القسم الأول: معلومات أولية حول علاقتكم بالبرنامج',information:'القسم الثاني: شفافية المعلومات الرسمية المتعلقة بالبرنامج',interaction:'القسم الثالث: التواصل والتفاعل مع الوزارة حول البرنامج',understanding:'القسم الرابع: فهم البرنامج',trust:'القسم الخامس: الثقة في الوزارة',legitimacy:'القسم السادس: مشروعية البرنامج',evaluation:'القسم السابع: تقييم البرنامج',impact:'القسم الثامن: أثر الاستفادة من البرنامج على الوضع السكني',suggestions:'القسم التاسع: مقترحاتكم',demographics:'القسم العاشر: معلومات عامة'};
function currentStepTitle(step){if(step==='interaction'&&route()==='g2')return'القسم الثالث: تجربة التواصل الفعلي مع الوزارة';if(step==='trust'&&route()==='g2')return'القسم الخامس: الثقة العامة في الوزارة';return stepTitles[step];}
function steps(){
 if(!val('q1'))return['filters'];
 if(val('q1')==='لا')return['filters','demographics'];
 if(!val('q2'))return['filters'];
 let s=['filters'];
 if(route()==='official')s.push('information');
 s.push('interaction','understanding','trust','legitimacy','evaluation');
 if(beneficiary())s.push('impact');
 s.push('suggestions','demographics');
 return s;
}
function radio(id,label,options,required=true,help=''){return `<fieldset class="question-card"><legend>${esc(label)}${required?'<span class="required-mark"> *</span>':''}</legend>${help?`<p class="question-help">${esc(help)}</p>`:''}<div class="standard-options">${options.map(o=>{let v=Array.isArray(o)?o[0]:o,t=Array.isArray(o)?o[1]:o;return `<label class="choice ${val(id)===v?'choice-selected':''}"><input type="radio" data-id="${esc(id)}" value="${esc(v)}" ${val(id)===v?'checked':''}><span>${esc(t)}</span></label>`}).join('')}</div></fieldset>`}
function checks(items,instruction='يمكن اختيار أكثر من جواب.'){return `<fieldset class="question-card"><legend>${instruction}</legend><div class="standard-options">${items.map(([id,t])=>`<label class="choice ${val(id)?'choice-selected':''}"><input type="checkbox" data-check="${id}" ${val(id)?'checked':''}><span>${esc(t)}</span></label>`).join('')}</div></fieldset>`}
function scaleLegend(scale=SCALE){return `<div class="instruction-card"><strong>يرجى تحديد درجة موافقتكم على العبارات التالية:</strong><div class="legend-grid">${scale.map(([n,t])=>`<span>${n===t?'':esc(n)+' — '}${esc(t)}</span>`).join('')}</div></div>`}
function table(groups,scale=SCALE){return groups.map(([title,rows])=>`<section class="group-card"><div class="group-heading"><h3>${esc(title)}</h3></div><div class="likert-wrap"><table class="likert-table"><thead><tr><th>العبارة</th>${scale.map(([n,t])=>`<th title="${esc(t)}" aria-label="${esc(t)}">${esc(n)}</th>`).join('')}</tr></thead><tbody>${rows.map(([id,label])=>`<tr><td>${esc(label)}</td>${scale.map(([n,t])=>`<td><label aria-label="${esc(t)}"><input type="radio" data-id="${id}" value="${esc(n)}" ${val(id)===n?'checked':''}></label></td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`).join('')}
function filters(){let h=radio('q1','س1. هل سبق لكم أن سمعتم ببرنامج الدعم المباشر للسكن؟',['نعم','لا']);if(val('q1')==='لا')return h+`<div class="instruction-card compact"><p>ستنتقلون مباشرة إلى قسم المعلومات العامة.</p></div>`;if(val('q1')==='نعم'){h+=radio('q2','س2. هل سبق لكم الاطلاع على معلومات حول برنامج الدعم المباشر للسكن عبر إحدى وسائل التواصل الرسمية للوزارة؟',['نعم','لا']);if(val('q2')==='نعم')h+=`<div class="group-card"><h3>من خلال أي من وسائل التواصل الرسمية التالية اطلعتم على معلومات حول البرنامج؟</h3>${checks(officialSources)}</div>`;if(val('q2')==='لا')h+=`<div class="group-card"><h3>من خلال أي من المصادر التالية اطلعتم على معلومات حول البرنامج؟</h3>${checks(externalSources)}</div>`;if(val('q2'))h+=radio('status','ما هي طبيعة علاقتكم الحالية ببرنامج الدعم المباشر للسكن؟',statuses);}return h;}
function interaction(){
 let official=route()==='official';
 let h=official?`<div class="instruction-card"><p>يرجى الإجابة بناءً على معرفتكم أو تجربتكم مع قنوات التواصل المتاحة بشأن برنامج «دعم سكن»، مثل خدمات التواصل عبر منصة أو تطبيق «دعم سكن»، والموقع الإلكتروني للوزارة، ورقم الهاتف والبريد الإلكتروني المخصصين للدعم، وكذلك الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي.</p></div>${scaleLegend()}${table(G.interComm)}${table(G.interPart)}`:`<div class="instruction-card compact"><p>يجيب المشارك هنا فقط عن تجربة تواصل فعلية مع الوزارة بشأن البرنامج.</p></div>`;
 h+=`<section class="group-card"><div class="group-heading"><h3>${official?'ثالثًا: تجربة التواصل الفعلي مع الوزارة':'القسم الثالث: تجربة التواصل الفعلي مع الوزارة'}</h3></div>${radio('contact_reel','هل سبق لكم استخدام إحدى القنوات الرسمية للتواصل أو التفاعل بشأن البرنامج، لطرح سؤال أو طلب توضيح أو تقديم ملاحظة أو مقترح أو شكاية؟',['نعم','لا'])}`;
 if(val('contact_reel')==='نعم'){h+=radio('canal_dernier_contact','عبر أي قناة رسمية تم آخر تواصل لكم بشأن برنامج الدعم المباشر للسكن؟',contactChannels);h+=radio('reponse_recue','هل توصلتم برد بشأن هذا التواصل؟',['نعم','لا']);if(val('reponse_recue')==='نعم')h+=`<p class="question-help">يرجى تقييم الرد الذي توصلتم به:</p>${table(G.response)}`;}
 h+='</section>';
 if(official)h+=table(G.interGlobal)+table(G.communicationQuality);
 return h;
}
function understanding(){return `<div class="instruction-card"><strong>فهم البرنامج</strong><p>يرجى اختيار جواب واحد لكل سؤال.</p></div>${quiz.map(([id,q,opts])=>radio(id,q,opts)).join('')}`}
function evaluation(){let h=scaleLegend()+table(G.ease)+table(G.accept);if(beneficiary())h+=table(G.satisfaction);h+=table(G.generalImpact)+table(G.success);return h;}
const demographics={age:['من 18 إلى 24 سنة','من 25 إلى 34 سنة','من 35 إلى 44 سنة','من 45 إلى 54 سنة','55 سنة فأكثر'],gender:['ذكر','أنثى'],education:['بدون تعليم نظامي','التعليم الابتدائي','التعليم الإعدادي','التعليم الثانوي','التعليم العالي'],housing:['أملك السكن الذي أقيم فيه','أكتري السكن الذي أقيم فيه','أقيم مع الأسرة','أقيم في سكن وظيفي أو مؤقت','وضع سكني آخر'],residence:['داخل المغرب','خارج المغرب'],region:['طنجة - تطوان - الحسيمة','الشرق','فاس - مكناس','الرباط - سلا - القنيطرة','الدار البيضاء - سطات','بني ملال - خنيفرة','مراكش - آسفي','درعة - تافيلالت','سوس - ماسة','كلميم - واد نون','العيون - الساقية الحمراء','الداخلة - وادي الذهب'],professional:['موظف أو موظفة في القطاع العام','مستخدم أو مستخدمة في القطاع الخاص','مقاول أو مقاولة','متقاعد أو متقاعدة','طالب أو طالبة','بدون عمل']};
function demo(){let h=`<div class="instruction-card compact"><strong>المعلومات العامة</strong><p>تساعد هذه المعلومات في التحليل العلمي للنتائج، ولا تُستعمل للتعرف على هوية المشارك.</p></div>${radio('age','1. ما هي فئتكم العمرية؟',demographics.age)}${radio('gender','2. ما هو جنسكم؟',demographics.gender)}${radio('education','3. ما هو أعلى مستوى دراسي حصلتم عليه؟',demographics.education)}${radio('housing','4. ما هو وضعكم السكني الحالي؟',demographics.housing)}${radio('residence','5. أين تقيمون حاليًا؟',demographics.residence)}`; if(val('residence')==='داخل المغرب')h+=`<fieldset class="question-card"><legend>5-أ. جهة الإقامة داخل المغرب <span class="required-mark"> *</span></legend><select class="text-input" id="region-select"><option value="">اختاروا الجهة</option>${demographics.region.map(x=>`<option ${val('region')===x?'selected':''}>${esc(x)}</option>`).join('')}</select></fieldset>`;if(val('residence')==='خارج المغرب')h+=`<fieldset class="question-card"><legend>5-ب. بلد الإقامة خارج المغرب <span class="required-mark"> *</span></legend><input class="text-input" id="country-input" value="${esc(val('country'))}" placeholder="اكتبوا اسم البلد"></fieldset>`;h+=radio('professional','6. ما هو وضعكم المهني الحالي؟',demographics.professional);return h;}
function section(){switch(state.step){case'filters':return filters();case'information':return scaleLegend()+table(G.information);case'interaction':return interaction();case'understanding':return understanding();case'trust':return scaleLegend()+table(route()==='g2'?G.trustGeneral:G.trust);case'legitimacy':return scaleLegend()+table(G.legitimacy);case'evaluation':return evaluation();case'impact':return `<div class="instruction-card compact"><p>هذا القسم خاص بمن استفاد شخصيًا من البرنامج.</p></div>`+scaleLegend()+table(G.personalImpact);case'suggestions':return `<fieldset class="question-card"><legend>ما أهم التغييرات أو الإجراءات التي تقترحونها لتحسين التواصل والتفاعل بين الوزارة والمواطنين بشأن برنامج الدعم المباشر للسكن؟</legend><textarea id="suggestion" rows="7" placeholder="اكتبوا مقترحاتكم هنا…">${esc(val('suggestion'))}</textarea></fieldset>`;case'demographics':return demo();}}
function requiredIds(step){
 if(step==='filters'){if(val('q1')==='لا')return['q1'];let ids=['q1','q2'];if(val('q2'))ids.push('status');return ids;}
 if(step==='information')return G.information.flatMap(g=>g[1].map(r=>r[0]));
 if(step==='interaction'){let ids=[];if(route()==='official')ids.push(...[...G.interComm,...G.interPart,...G.interGlobal,...G.communicationQuality].flatMap(g=>g[1].map(r=>r[0])));ids.push('contact_reel');if(val('contact_reel')==='نعم'){ids.push('canal_dernier_contact','reponse_recue');if(val('reponse_recue')==='نعم')ids.push(...G.response[0][1].map(r=>r[0]));}return ids;}
 if(step==='understanding')return quiz.map(q=>q[0]);
 if(step==='trust')return(route()==='g2'?G.trustGeneral:G.trust)[0][1].map(r=>r[0]);
 if(step==='legitimacy')return G.legitimacy[0][1].map(r=>r[0]);
 if(step==='evaluation'){let ids=[...G.ease,...G.accept,...G.generalImpact,...G.success].flatMap(g=>g[1].map(r=>r[0]));if(beneficiary())ids.push(...G.satisfaction[0][1].map(r=>r[0]));return ids;}
 if(step==='impact')return G.personalImpact[0][1].map(r=>r[0]);
 if(step==='demographics'){let ids=['age','gender','education','housing','residence','professional'];if(val('residence')==='داخل المغرب')ids.push('region');if(val('residence')==='خارج المغرب')ids.push('country');return ids;}
 return[];
}
function valid(){if(state.step==='filters'&&val('q2')==='نعم'&&!officialSources.some(([id])=>val(id))){state.error='يرجى اختيار وسيلة رسمية واحدة على الأقل.';return false;}if(state.step==='filters'&&val('q2')==='لا'&&!externalSources.some(([id])=>val(id))){state.error='يرجى اختيار مصدر واحد على الأقل.';return false;}for(const id of requiredIds(state.step)){if(!val(id)){state.error='يرجى الإجابة عن جميع الأسئلة المطلوبة قبل المتابعة.';return false;}}state.error='';return true;}
function mean(ids){let nums=ids.map(id=>Number(val(id))).filter(Number.isFinite);return nums.length===ids.length?nums.reduce((a,b)=>a+b,0)/nums.length:null;}
function scores(){return{information_access:route()==='official'?mean(G.information[0][1].map(r=>r[0])):null,information_clarity:route()==='official'?mean(G.information[1][1].map(r=>r[0])):null,information_sufficiency:route()==='official'?mean(G.information[2][1].map(r=>r[0])):null,information_accuracy:route()==='official'?mean(G.information[3][1].map(r=>r[0])):null,transparency:route()==='official'?mean(G.information[4][1].map(r=>r[0])):null,communication_possibility:route()==='official'?mean(G.interComm[0][1].map(r=>r[0])):null,participation_possibility:route()==='official'?mean(G.interPart[0][1].map(r=>r[0])):null,response_quality:val('reponse_recue')==='نعم'?mean(G.response[0][1].map(r=>r[0])):null,interaction_global:route()==='official'?mean(G.interGlobal[0][1].map(r=>r[0])):null,communication_quality_global:route()==='official'?mean(G.communicationQuality[0][1].map(r=>r[0])):null,trust:mean((route()==='g2'?G.trustGeneral:G.trust)[0][1].map(r=>r[0])),legitimacy:mean(G.legitimacy[0][1].map(r=>r[0])),ease:mean(G.ease[0][1].map(r=>r[0])),acceptance:mean(G.accept[0][1].map(r=>r[0])),satisfaction:beneficiary()?mean(G.satisfaction[0][1].map(r=>r[0])):null,general_impact:mean(G.generalImpact[0][1].map(r=>r[0])),success:mean(G.success[0][1].map(r=>r[0])),personal_impact:beneficiary()?mean(G.personalImpact[0][1].map(r=>r[0])):null,understanding:route()==='g1'?null:quiz.reduce((s,[id,,,correct])=>s+(val(id)===correct?1:0),0)};}
function authConfigured(){return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(AUTH_BRIDGE_URL);}
function authRequestId(){return globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);}
function authGateMessage(){
 if(auth.blocked)return'<div class="auth-alert auth-alert-blocked" role="alert"><strong>سبق إرسال إجابة بهذا الحساب.</strong><p>لا يمكن المشاركة أكثر من مرة بالحساب نفسه.</p></div>';
 if(auth.error)return`<div class="auth-alert" role="alert"><strong>تعذر التحقق من الحساب.</strong><p>${esc(auth.error)}</p></div>`;
 return'<p class="auth-help">يُستخدم حساب Google فقط للتحقق من أن المشاركة تُرسل مرة واحدة. لا يُضاف البريد إلى إجابات الاستبيان ولا يُحفظ في ورقة الردود.</p>';
}
function renderAuthGate(){
 $('#root').innerHTML=`<main class="site-shell auth-shell" dir="rtl"><header class="hero"><div class="hero-accent"></div><p class="eyebrow">بحث أكاديمي بسلك الدكتوراه</p><h1>استبيان حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن</h1><p class="hero-lead">في إطار إعداد بحث أكاديمي بسلك الدكتوراه، أضع بين أيديكم هذا الاستبيان، الذي يندرج ضمن دراسة حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن.</p><div class="privacy-note"><span>◉</span><p>جميع الأجوبة سرية، ولن تُستعمل إلا لأغراض البحث العلمي.</p></div></header><section class="auth-card" aria-labelledby="auth-title"><div class="auth-icon" aria-hidden="true">G</div><h2 id="auth-title">تسجيل الدخول للمشاركة</h2>${authGateMessage()}${auth.checking?'<div class="auth-loading" role="status"><span></span> جارٍ التحقق من الحساب…</div>':'<div id="google-signin-button" class="google-signin-button"></div>'}${!authConfigured()?'<p class="auth-config-error">لم يكتمل بعد ربط خدمة التحقق بالموقع.</p>':''}</section><footer><p>شكرًا لتعاونكم ومساهمتكم في هذا البحث العلمي.</p></footer></main>`;
 requestAnimationFrame(initAuthGate);
}
function initAuthGate(){
 if(!authConfigured())return;
 ensureGoogleIdentity();
 renderGoogleSignInButton();
}
function ensureGoogleIdentity(){
 if(window.google?.accounts?.id){initializeGoogleIdentity();return;}
 if(document.getElementById('google-identity-services'))return;
 const script=document.createElement('script');
 script.id='google-identity-services';
 script.src='https://accounts.google.com/gsi/client';
 script.async=true;
 script.defer=true;
 script.onload=initializeGoogleIdentity;
 script.onerror=()=>{auth.error='تعذر تحميل خدمة تسجيل الدخول إلى Google. يرجى التحقق من الاتصال ثم إعادة المحاولة.';render();};
 document.head.appendChild(script);
}
function initializeGoogleIdentity(){
 if(!window.google?.accounts?.id)return;
 if(!auth.gisReady){
  google.accounts.id.initialize({client_id:GOOGLE_CLIENT_ID,callback:handleGoogleCredential,auto_select:false,cancel_on_tap_outside:false});
  auth.gisReady=true;
 }
 renderGoogleSignInButton();
}
function renderGoogleSignInButton(){
 if(!auth.gisReady||auth.checking)return;
 const target=document.getElementById('google-signin-button');
 if(!target)return;
 target.innerHTML='';
 google.accounts.id.renderButton(target,{type:'standard',theme:'outline',size:'large',text:'continue_with',shape:'rectangular',logo_alignment:'left',locale:'ar',width:Math.min(360,Math.max(240,document.documentElement.clientWidth-72))});
}
async function handleGoogleCredential(response){
 const jeton=String(response?.credential||'');
 if(!jeton)return;
 auth.checking=true;auth.error='';auth.blocked=false;render();
 try{
  const resultat=await callAuthBridge('check',jeton);
  if(resultat?.allowed){auth.allowed=true;auth.idToken=jeton;auth.blocked=false;auth.error='';}
  else{auth.allowed=false;auth.idToken='';auth.blocked=resultat?.reason==='already_submitted';auth.error=auth.blocked?'':'تعذر تأكيد صلاحية الحساب. يرجى إعادة المحاولة.';}
 }catch(_){auth.allowed=false;auth.idToken='';auth.error='تعذر الاتصال بخدمة التحقق. يرجى إعادة المحاولة بعد لحظات.';}
 finally{auth.checking=false;render();}
}
function callAuthBridge(action,idToken){
 const requestId=authRequestId();
 return new Promise((resolve,reject)=>{
  const frame=document.createElement('iframe');
  const frameName='participation-auth-'+requestId;
  frame.name=frameName;
  frame.title='التحقق من المشاركة';
  frame.setAttribute('aria-hidden','true');
  frame.tabIndex=-1;
  frame.style.display='none';
  const form=document.createElement('form');
  form.method='POST';
  form.action=AUTH_BRIDGE_URL;
  form.target=frameName;
  form.style.display='none';
  const add=(name,value)=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.appendChild(input);};
  add('requestId',requestId);add('action',action);add('idToken',idToken);
  const cleanup=()=>{form.remove();frame.remove();};
  const timer=setTimeout(()=>{authRequests.delete(requestId);cleanup();reject(new Error('request_timeout'));},25000);
  authRequests.set(requestId,{resolve:result=>{clearTimeout(timer);cleanup();resolve(result);}});
  document.body.append(frame,form);
  form.submit();
 });
}
window.addEventListener('message',event=>{
 if(!/^https:\/\/[-a-z0-9]+-script\.googleusercontent\.com$/.test(event.origin))return;
 const message=event.data||{};
 if(message.channel!==AUTH_CHANNEL)return;
 if(message.type==='response'&&message.requestId){
  const pending=authRequests.get(message.requestId);
  if(!pending)return;
  authRequests.delete(message.requestId);
  pending.resolve(message.result||{ok:false,allowed:false,reason:'server_error'});
 }
});
async function submit(){
 if(!valid())return render();
 state.sending=true;render();
 let autorisation;
 try{autorisation=await callAuthBridge('claim',auth.idToken);}
 catch(_){state.sending=false;state.error='تعذر التحقق من المشاركة قبل الإرسال. لم تُرسل إجاباتكم، ويمكنكم إعادة المحاولة.';render();return;}
 if(!autorisation?.allowed){
  state.sending=false;
  if(autorisation?.reason==='already_submitted'){
   auth.allowed=false;auth.idToken='';auth.blocked=true;auth.error='';render();return;
  }
  if(autorisation?.reason==='reauthentication_required'){
   auth.allowed=false;auth.idToken='';auth.blocked=false;auth.error='انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مجددًا، وستبقى إجاباتكم محفوظة في هذه الصفحة.';render();return;
  }
  state.error='تعذر تأكيد صلاحية الحساب. لم تُرسل إجاباتكم، ويمكنكم إعادة المحاولة.';render();return;
 }
 let form=document.createElement('form');form.method='POST';form.action=FORM_ACTION;form.target='google-form-response';form.style.display='none';
 let add=(id,v)=>{if(!id||v===undefined||v===null||v==='')return;let i=document.createElement('input');i.name='entry.'+id;i.value=v;form.appendChild(i)};
 let addRaw=(name,v)=>{let i=document.createElement('input');i.name=name;i.value=v;form.appendChild(i)};
 let routeName=submissionRoute();
 let routeEntries={g2_beneficiary:ENTRY_G2_BENEFICIARY,g2_other:ENTRY_G2_OTHER,official_beneficiary:ENTRY_OFFICIAL_BENEFICIARY,official_other:ENTRY_OFFICIAL_OTHER};
 let active=routeEntries[routeName]||{};
 let shared=route()==='g2'?ENTRY_G2_SHARED:ENTRY_OFFICIAL_SHARED;
 let addCommon=(key,v)=>add(ENTRY_COMMON[key],v);
 let addKey=(key,v)=>add(active[key],v);
 let addScale=(key)=>{let n=val(key);if(!n)return;let row=SCALE.find(([value])=>value===n);addKey(key,row?n+' — '+row[1]:n);};
 addCommon('q1',val('q1'));
 if(val('q1')==='نعم')addCommon('q2',val('q2'));
 if(route()==='official')officialSources.forEach(([id,label])=>{if(val(id))add(ENTRY_OFFICIAL_SHARED.official_sources,label);});
 if(route()==='g2')externalSources.forEach(([id,label])=>{if(val(id))add(ENTRY_G2_SHARED.external_sources,label);});
 if(route()!=='g1')add(shared.status,val('status'));
 [
  'info_1','info_2','info_3','info_4','info_5','info_6','info_7','info_8','info_9','info_10','info_11','info_12','info_13','transparency_global',
  'inter_comm_1','inter_comm_2','inter_comm_3','inter_part_1','inter_part_2','inter_part_3','interaction_global','communication_quality_global','clarte_reponse','suffisance_reponse','delai_reponse',
  'trust_general','trust_1','trust_2','trust_3','trust_4','trust_5','legit_1','legit_2','legit_3','legit_4',
  'ease_1','ease_2','ease_3','accept_1','accept_2','accept_3','satisfaction_1','satisfaction_2','satisfaction_3',
  'impact_general_1','impact_general_2','impact_general_3','success_global','impact_personal_1','impact_personal_2','impact_personal_3'
 ].forEach(addScale);
 if(route()!=='g1'){
  addKey('contact_reel',val('contact_reel'));
  addKey('canal_dernier_contact',val('canal_dernier_contact'));
  addKey('reponse_recue',val('reponse_recue'));
  quiz.forEach(([id])=>addKey(id,val(id)));
  addKey('suggestion',val('suggestion'));
 }
 ['age','gender','education','housing','residence','region','country','professional'].forEach(k=>addCommon(k,val(k)));
 let pages=[0];
 if(routeName==='g1')pages.push(46);
 if(routeName==='g2_beneficiary'){
  pages.push(1,2,3);
  if(val('contact_reel')==='نعم'){pages.push(4,5);if(val('reponse_recue')==='نعم')pages.push(6);}
  pages.push(7,8,9,10,11,12,46);
 }
 if(routeName==='g2_other'){
  pages.push(1,2,13);
  if(val('contact_reel')==='نعم'){pages.push(14,15);if(val('reponse_recue')==='نعم')pages.push(16);}
  pages.push(17,18,19,20,21,46);
 }
 if(routeName==='official_beneficiary'){
  pages.push(1,22,23,24);
  if(val('contact_reel')==='نعم'){pages.push(25,26);if(val('reponse_recue')==='نعم')pages.push(27);}
  pages.push(28,29,30,31,32,33,34,46);
 }
 if(routeName==='official_other'){
  pages.push(1,22,35,36);
  if(val('contact_reel')==='نعم'){pages.push(37,38);if(val('reponse_recue')==='نعم')pages.push(39);}
  pages.push(40,41,42,43,44,45,46);
 }
 pages.push(val('residence')==='داخل المغرب'?47:48);
 addRaw('fvv','1');
 addRaw('pageHistory',pages.join(','));
 let completed=false;
 let finish=()=>{if(completed)return;completed=true;state.done=true;state.sending=false;render();};
 let responseFrame=document.querySelector('iframe[name="google-form-response"]');
 if(responseFrame)responseFrame.addEventListener('load',finish,{once:true});
 document.body.appendChild(form);form.submit();
 setTimeout(finish,8000);
}
function nav(){let ss=steps(),i=ss.indexOf(state.step);return `<nav class="form-actions">${i>0?'<button class="secondary-button" id="prev" type="button">السابق</button>':'<span></span>'}${i<ss.length-1?'<button class="primary-button" id="next" type="button">التالي</button>':`<button class="primary-button submit-button" id="submit" type="button" ${state.sending?'disabled':''}>${state.sending?'جارٍ إرسال الإجابات…':'إرسال الإجابات'}</button>`}</nav>`;}
function render(){if(!auth.allowed){renderAuthGate();return;}if(state.done){$('#root').innerHTML=`<main class="site-shell" dir="rtl"><section class="success-card"><div class="success-icon">✓</div><p class="eyebrow">نهاية الاستبيان</p><h1>شكرًا جزيلًا على مشاركتكم</h1><p>تم تسجيل إجاباتكم بنجاح، ولن تُستعمل إلا لأغراض البحث العلمي.</p></section></main>`;return;}let ss=steps(),i=Math.max(ss.indexOf(state.step),0),pct=(i+1)/ss.length*100,title=currentStepTitle(state.step);$('#root').innerHTML=`<main class="site-shell" dir="rtl"><header class="hero"><div class="hero-accent"></div><p class="eyebrow">بحث أكاديمي بسلك الدكتوراه</p><h1>استبيان حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن</h1><p class="hero-lead">في إطار إعداد بحث أكاديمي بسلك الدكتوراه، أضع بين أيديكم هذا الاستبيان، الذي يندرج ضمن دراسة حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن.</p><div class="privacy-note"><span>◉</span><p>جميع الأجوبة سرية، ولن تُستعمل إلا لأغراض البحث العلمي.</p></div><button class="intro-toggle" id="intro-toggle" type="button">${state.intro?'إخفاء مقدمة الاستبيان':'عرض مقدمة الاستبيان'} <span>${state.intro?'−':'+'}</span></button>${state.intro?`<div class="intro-copy"><p>وتكتسي مشاركتكم أهمية كبيرة، لما ستوفره من معطيات أساسية تسهم في إغناء هذا البحث وتعزيز نتائجه من الناحية العلمية. لذلك، نرجو منكم الإجابة عن الأسئلة بكل موضوعية ودقة.</p><details><summary>توضيحات</summary><div class="definition-list"><p><strong>الوزارة:</strong> وزارة إعداد التراب الوطني والتعمير والإسكان وسياسة المدينة.</p><p><strong>وسائل التواصل الرسمية للوزارة:</strong> يقصد بها مجموع القنوات والوسائط التي تعتمدها الوزارة رسمياً للتواصل العمومي بشأن برنامج الدعم المباشر للسكن، سواء لنشر المعلومات المتعلقة بأهدافه وشروط الاستفادة منه وإجراءاته ومستجداته، أو لتيسير الولوج إلى المعطيات والخدمات المرتبطة به. وتشمل، على الخصوص، الموقع الإلكتروني للوزارة، ومنصة «دعم سكن» وتطبيقها، والحسابات الرسمية على شبكات التواصل الاجتماعي، والبلاغات والمنشورات الرسمية. ولا تفترض هذه الوسائل، بالضرورة، إتاحة تواصل مباشر بين المواطن والوزارة.</p><p><strong>وسائل التواصل الرسمية التي تتيح التفاعل:</strong> يقصد بها القنوات الرسمية التي تمكّن المواطنين من التواصل مع الوزارة بشأن برنامج الدعم المباشر للسكن، من خلال توجيه الاستفسارات وطلب التوضيحات وتقديم الملاحظات أو المقترحات أو الشكايات، مع إمكانية تلقي جواب أو تتبع مآل الطلبات والشكايات المقدمة. وتشمل، على الخصوص، خدمات التواصل والمساعدة عبر منصة «دعم سكن» وتطبيقها، والبريد الإلكتروني ورقم المساعدة المخصصين للبرنامج، والبوابة الوطنية للشكايات، وخدمات المراسلة عبر الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي.</p></div></details></div>`:''}</header><section class="progress-panel"><div class="progress-copy"><span>المرحلة ${i+1}</span><strong>${esc(title)}</strong><span dir="ltr">${i+1} / ${ss.length}</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></section><section id="questionnaire-form" class="form-section"><div class="section-heading"><p>الاستبيان</p><h2>${esc(title)}</h2></div>${state.error?`<div class="error-message" role="alert">${esc(state.error)}</div>`:''}${section()}${nav()}</section><iframe name="google-form-response" class="submission-frame" title="إرسال الاستبيان"></iframe><footer><p>شكرًا لتعاونكم ومساهمتكم في هذا البحث العلمي.</p></footer></main>`;bind();}
function bind(){document.querySelectorAll('input[type=radio][data-id]').forEach(x=>x.onchange=()=>{let id=x.dataset.id;set(id,x.value);if(id==='q1'&&x.value!=='نعم')del('q2','status',...officialSources.map(z=>z[0]),...externalSources.map(z=>z[0]));if(id==='q2'){del('status');if(x.value==='نعم')del(...externalSources.map(z=>z[0]));else del(...officialSources.map(z=>z[0]));}if(id==='status'&&!beneficiary())del(...G.satisfaction[0][1].map(r=>r[0]),...G.personalImpact[0][1].map(r=>r[0]));if(id==='contact_reel'&&x.value==='لا')del('canal_dernier_contact','reponse_recue',...G.response[0][1].map(r=>r[0]));if(id==='reponse_recue'&&x.value==='لا')del(...G.response[0][1].map(r=>r[0]));if(id==='residence'){if(x.value==='داخل المغرب')del('country');else del('region');}render();});document.querySelectorAll('input[type=checkbox][data-check]').forEach(x=>x.onchange=()=>{set(x.dataset.check,x.checked?'1':'');render();});let s=$('#suggestion');if(s)s.oninput=()=>set('suggestion',s.value);let r=$('#region-select');if(r)r.onchange=()=>{set('region',r.value);render();};let c=$('#country-input');if(c)c.oninput=()=>set('country',c.value);let it=$('#intro-toggle');if(it)it.onclick=()=>{state.intro=!state.intro;render();};let n=$('#next');if(n)n.onclick=()=>{if(!valid())return render();let ss=steps(),i=ss.indexOf(state.step);state.step=ss[i+1];state.error='';render();scrollToForm();};let p=$('#prev');if(p)p.onclick=()=>{let ss=steps(),i=ss.indexOf(state.step);state.step=ss[i-1];state.error='';render();scrollToForm();};let sub=$('#submit');if(sub)sub.onclick=submit;}
function scrollToForm(){requestAnimationFrame(()=>$('#questionnaire-form')?.scrollIntoView({behavior:'smooth',block:'start'}));}
const style=document.createElement('style');style.textContent=`.likert-wrap{overflow-x:auto}.likert-table{width:100%;border-collapse:collapse;min-width:760px;background:#fff}.likert-table th,.likert-table td{border:1px solid rgba(15,23,42,.12);padding:.85rem;text-align:center}.likert-table th:first-child,.likert-table td:first-child{text-align:right;min-width:360px}.likert-table input{width:20px;height:20px}.likert-table thead th{font-weight:800;background:rgba(15,23,42,.04)}.group-card+.instruction-card{margin-top:1rem}@media(max-width:700px){.likert-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}.likert-table{width:100%;min-width:0;table-layout:fixed;border-collapse:collapse;background:#fff}.likert-table thead{display:table-header-group}.likert-table thead th{font-size:1.12rem;font-weight:800;padding-block:.85rem}.likert-table thead th:first-child{font-size:1.08rem}.likert-table tbody{display:table-row-group}.likert-table tr{display:table-row}.likert-table th,.likert-table td{display:table-cell;padding:.76rem .24rem;font-size:1rem;vertical-align:middle}.likert-table th:first-child,.likert-table td:first-child{display:table-cell;width:45%;min-width:0;padding:.95rem .6rem;text-align:right;line-height:1.75}.likert-table th:not(:first-child),.likert-table td:not(:first-child){width:11%;min-width:0;padding-inline:.08rem}.likert-table tbody td label{display:flex;width:100%;min-height:60px;align-items:center;justify-content:center}.likert-table input{width:28px;height:28px;margin:0}}@media(max-width:380px){.likert-table th,.likert-table td{padding:.6rem .12rem;font-size:.88rem}.likert-table thead th{font-size:.98rem;padding-block:.68rem}.likert-table thead th:first-child{font-size:.96rem}.likert-table th:first-child,.likert-table td:first-child{width:45%;padding:.78rem .38rem}.likert-table th:not(:first-child),.likert-table td:not(:first-child){width:11%}.likert-table input{width:25px;height:25px}}`;document.head.appendChild(style);
render();
