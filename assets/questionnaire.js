const GOOGLE_CLIENT_ID='285878510024-7dhdojiucp6ff20m2snuro018t70c6s5.apps.googleusercontent.com';
const AUTH_BRIDGE_URL='https://script.google.com/macros/s/AKfycbxmwpYfo8bhwBmPPsKrIsqIfW4DQUxOxrwYavWgojHvLzR0e-TDK-DQj7t3LNeODRSv/exec';
const AUTH_CHANNEL='questionnaire-logement-auth-v1';
const SCHEMA_VERSION='2026-08-15-interaction-fusion-v2';
const ENTRY_COMMON={
 q1:'299895912',q2:'1225420672',age:'1577939573',gender:'2068308268',education:'1330802393',housing:'1373868444',residence:'865830704',professional:'1061681182',region:'861634292',country:'1099313147'
};
const ENTRY_G2_SHARED={external_sources:'1040032',status:'1268123456',q3_detail:'1819501263'};
const ENTRY_OFFICIAL_SHARED={official_sources:'1856677935',source_principale:'1646951693',status:'739440927',q3_detail:'2025224647'};
const ENTRY_G2_BENEFICIARY={
 contact_reel:'237635013',canal_dernier_contact:'1051412983',reponse_recue:'1024258489',
 contact_reason:'990000000000000001',noninteraction_reason:'990000000000000002',perception_info_clarification:'990000000000000003',perception_observations_proposals:'990000000000000004',perception_complaints:'990000000000000005',
 clarte_reponse:'1650482042',suffisance_reponse:'59663361',delai_reponse:'2100269279',
 understanding_1:'1845717094',understanding_2:'323132636',understanding_3:'1183906650',understanding_4:'1622342161',understanding_5:'838382116',understanding_6:'882397137',
 trust_1:'990000000000000041',trust_2:'990000000000000042',trust_3:'990000000000000043',trust_4:'990000000000000044',trust_5:'990000000000000045',legit_1:'1486461560',legit_2:'1904067536',legit_3:'1513964979',legit_4:'1092411069',
 ease_1:'1248958122',ease_2:'1537513608',ease_3:'664408094',accept_1:'1011219132',accept_2:'1200558200',accept_3:'844136116',
 satisfaction_1:'2008127058',satisfaction_2:'1587790851',satisfaction_3:'411578762',impact_general_1:'278562098',impact_general_2:'1951841168',impact_general_3:'2073040464',success_global:'2115818671',
 impact_personal_1:'271992870',impact_personal_2:'301943015',impact_personal_3:'1511212139',suggestion:'704695728'
};
const ENTRY_G2_OTHER={
 contact_reel:'328033588',canal_dernier_contact:'1748054727',reponse_recue:'476498187',
 contact_reason:'990000000000000011',noninteraction_reason:'990000000000000012',perception_info_clarification:'990000000000000013',perception_observations_proposals:'990000000000000014',perception_complaints:'990000000000000015',
 clarte_reponse:'716145318',suffisance_reponse:'166426109',delai_reponse:'1813469453',
 understanding_1:'1374327145',understanding_2:'2115575476',understanding_3:'2111378965',understanding_4:'310689731',understanding_5:'1860201892',understanding_6:'1729249596',
 trust_1:'990000000000000051',trust_2:'990000000000000052',trust_3:'990000000000000053',trust_4:'990000000000000054',trust_5:'990000000000000055',legit_1:'1677021184',legit_2:'520351974',legit_3:'1645334930',legit_4:'961995117',
 ease_1:'1198945725',ease_2:'1009069255',ease_3:'258582065',accept_1:'1265924651',accept_2:'1744035836',accept_3:'89167698',
 impact_general_1:'471635203',impact_general_2:'1258806770',impact_general_3:'708920828',success_global:'2059950392',suggestion:'159882139'
};
const ENTRY_OFFICIAL_BENEFICIARY={
 info_1:'1262380031',info_2:'618372618',info_3:'1276906943',info_4:'1758509584',info_5:'1958940162',info_6:'1042862389',
 info_7:'89201942',info_8:'2061798367',info_9:'699276498',info_10:'3577675',info_11:'1107060713',info_12:'483431253',info_13:'135111340',
 inter_comm_1:'1924785794',inter_comm_2:'1564005720',inter_comm_3:'589116406',inter_part_1:'1689196695',inter_part_2:'578326184',inter_part_3:'578057116',
 contact_reel:'1807617813',canal_dernier_contact:'1917194186',reponse_recue:'1188398753',clarte_reponse:'401614676',suffisance_reponse:'2030949688',delai_reponse:'1948428970',interaction_global:'1955561785',communication_quality_global:'1618370412',
 contact_reason:'990000000000000021',noninteraction_reason:'990000000000000022',perception_info_clarification:'990000000000000023',perception_observations_proposals:'990000000000000024',perception_complaints:'990000000000000025',
 understanding_1:'366290689',understanding_2:'2118812173',understanding_3:'1797114715',understanding_4:'857685078',understanding_5:'1190608777',understanding_6:'2009753717',
 trust_1:'933937764',trust_2:'844787965',trust_3:'1182559343',trust_4:'91257242',trust_5:'674993537',
 legit_1:'1896687752',legit_2:'500642904',legit_3:'1151297594',legit_4:'1948347725',
 ease_1:'2143980090',ease_2:'1321206863',ease_3:'833854624',accept_1:'1229613680',accept_2:'3871385',accept_3:'1641681581',
 satisfaction_1:'1415343217',satisfaction_2:'1319006138',satisfaction_3:'1388444923',impact_general_1:'127822252',impact_general_2:'1335208252',impact_general_3:'1591834057',success_global:'1010115912',
 impact_personal_1:'1864877569',impact_personal_2:'800971163',impact_personal_3:'750218004',suggestion:'317816934'
};
const ENTRY_OFFICIAL_OTHER={
 info_1:'1389225289',info_2:'1504812338',info_3:'2684055',info_4:'1111425501',info_5:'1367527335',info_6:'2078777661',
 info_7:'495302381',info_8:'20488223',info_9:'2047790623',info_10:'73359176',info_11:'125291520',info_12:'733383354',info_13:'1717414505',
 inter_comm_1:'45196571',inter_comm_2:'1898453798',inter_comm_3:'1748147612',inter_part_1:'2104567946',inter_part_2:'1775831782',inter_part_3:'1629335611',
 contact_reel:'1924533978',canal_dernier_contact:'641302619',reponse_recue:'778119099',clarte_reponse:'2066363404',suffisance_reponse:'89722042',delai_reponse:'1975544690',interaction_global:'83983109',communication_quality_global:'1469339541',
 contact_reason:'990000000000000031',noninteraction_reason:'990000000000000032',perception_info_clarification:'990000000000000033',perception_observations_proposals:'990000000000000034',perception_complaints:'990000000000000035',
 understanding_1:'850668692',understanding_2:'243215310',understanding_3:'1457325425',understanding_4:'1228145603',understanding_5:'1607620672',understanding_6:'1608907783',
 trust_1:'1808656211',trust_2:'1992870685',trust_3:'1344743776',trust_4:'2037118212',trust_5:'1300161676',
 legit_1:'1119108321',legit_2:'825450485',legit_3:'901308624',legit_4:'2085038932',
 ease_1:'883213170',ease_2:'1032356922',ease_3:'634945297',accept_1:'1155871809',accept_2:'917543744',accept_3:'397729049',
 impact_general_1:'157757540',impact_general_2:'222082286',impact_general_3:'50030157',success_global:'1505158683',suggestion:'217452855'
};
const SCALE=[['1','لا أوافق إطلاقًا'],['2','لا أوافق'],['3','لا أوافق ولا أعارض'],['4','أوافق'],['5','أوافق تمامًا']];
const state={a:{},step:'filters',intro:true,error:'',sending:false,done:false,pendingSubmissionId:''};
const auth={allowed:false,idToken:'',checking:false,blocked:false,error:'',gisReady:false,submissionEntryId:''};
const authRequests=new Map();
const $=s=>document.querySelector(s); const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const val=id=>state.a[id]??''; const set=(id,v)=>{state.a[id]=v;state.error='';};
const del=(...ids)=>ids.forEach(id=>delete state.a[id]);
const PERSONAL_BENEFICIARY='استفدت شخصيًا من البرنامج';
const FAMILY_BENEFICIARY='استفاد أحد أفراد أسرتي من البرنامج';
const COMBINED_BENEFICIARY='استفدت شخصيًا من البرنامج أو استفاد أحد أفراد أسرتي منه.';
const Q3_DETAIL_PERSONAL='نعم، استفدت شخصيًا من البرنامج.';
const Q3_DETAIL_FAMILY='لا، المستفيد هو أحد أفراد أسرتي.';
const Q3_DETAIL_CHOICES=[Q3_DETAIL_PERSONAL,Q3_DETAIL_FAMILY];
const OFFICIAL_SOURCE_OTHER_ID='official_other';
const EXTERNAL_SOURCE_OTHER_ID='external_other';
const PUBLIC_CHANNEL_OTHER='وسيلة أخرى';
const NO_OFFICIAL_REASON_OTHER='سبب آخر، يرجى التحديد:';
const OTHER_CONTACT_CHANNEL='قناة رسمية أخرى';
const contactReasons=[
 'طلب معلومات حول البرنامج أو شروط الاستفادة منه.',
 'طلب توضيح بشأن معلومة أو إجراء متعلق بالبرنامج.',
 'طلب المساعدة بشأن تقديم الطلب أو استكمال الإجراءات.',
 'الاستفسار عن وضعية الطلب أو متابعة معالجة الملف.',
 'الإبلاغ عن صعوبة أو مشكلة واجهتني أثناء الاستفادة من البرنامج.',
 'تقديم شكاية مرتبطة بالبرنامج.',
 'تقديم ملاحظة أو مقترح بشأن البرنامج.',
 'سبب آخر، يرجى تحديده:',
];
const nonInteractionReasons=[
 'لم أكن بحاجة إلى التواصل مع الوزارة.',
 'وجدت المعلومات التي أحتاجها دون الحاجة إلى التواصل مع الوزارة.',
 'حصلت على المعلومات التي أحتاجها من مصادر أخرى.',
 'لم أكن أعرف بوجود قنوات رسمية للتواصل مع الوزارة.',
 'كنت أعرف بوجود قنوات للتواصل، لكن لم يكن واضحًا لي أي قناة ينبغي استخدامها.',
 'واجهت صعوبة في الوصول إلى قنوات التواصل أو استخدامها.',
 'لم أتوقع أن يؤدي التواصل إلى الحصول على جواب أو حل مفيد.',
 'سبب آخر، يرجى تحديده:',
];
const interactionPerceptionIds=()=>G.interactionPerceptions.flatMap(group=>group[1].map(row=>row[0]));
function clearAbandonedInteractionBranch(answer){
 if(answer==='لا')del('contact_reason','canal_dernier_contact','contact_channel_other_detail','reponse_recue',...G.response[0][1].map(row=>row[0]));
 if(answer==='نعم')del('noninteraction_reason',...interactionPerceptionIds());
}
const beneficiary=()=>val('q3_detail')===Q3_DETAIL_PERSONAL;
const route=()=>val('q1')==='لا'?'g1':val('q2')==='لا'?'g2':'official';
const submissionRoute=()=>route()==='g1'?'g1':route()+'_'+(beneficiary()?'beneficiary':'other');
const officialSources=[
 ['official_daamsakane_web','المنصة الإلكترونية «دعم سكن» (DaamSakane.ma)'],
 ['official_daamsakane_app','تطبيق «دعم سكن» على الهاتف المحمول'],
 ['official_ministry_web','الموقع الإلكتروني الرسمي للوزارة (mhpv.gov.ma)'],
 ['official_social','الصفحات أو الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي'],
 ['official_guides_publications','الدلائل والمطويات والبلاغات الرسمية المتعلقة بالبرنامج'],
 ['official_meetings_campaigns','اللقاءات أو الحملات والأنشطة التواصلية الرسمية المنظمة للتعريف بالبرنامج'],
 [OFFICIAL_SOURCE_OTHER_ID,'مصدر رسمي آخر'],
];
const officialSourceCodes=Object.freeze({
 official_daamsakane_web:'daamsakane',
 official_daamsakane_app:'application',
 official_ministry_web:'ministere',
 official_social:'reseaux_sociaux',
 official_guides_publications:'documents_officiels',
 official_meetings_campaigns:'rencontres_officielles',
 [OFFICIAL_SOURCE_OTHER_ID]:'other_official',
});
const officialSourceFields=Object.freeze({
 official_daamsakane_web:'infoDaamSakane',
 official_daamsakane_app:'infoApplication',
 official_ministry_web:'infoMinistere',
 official_social:'infoReseauxSociaux',
 official_guides_publications:'infoDocumentsOfficiels',
 official_meetings_campaigns:'infoRencontresOfficielles',
 [OFFICIAL_SOURCE_OTHER_ID]:'infoOtherOfficial',
});
const selectedOfficialSources=()=>officialSources.filter(([id])=>Boolean(val(id)));
function reconcileSourcePrincipale(){
 const selected=selectedOfficialSources();
 const selectedCodes=selected.map(([id])=>officialSourceCodes[id]);
 if(selected.length===0){del('sourcePrincipale');return;}
 if(selected.length===1){state.a.sourcePrincipale=selectedCodes[0];return;}
 if(!selectedCodes.includes(val('sourcePrincipale')))del('sourcePrincipale');
}
function officialSourceData(){
 const data=Object.fromEntries(officialSources.map(([id])=>[officialSourceFields[id],Boolean(val(id))]));
 return {...data,sourcePrincipale:val('sourcePrincipale')||null};
}
function sourcePrincipaleLabel(){
 const code=val('sourcePrincipale');
 const source=officialSources.find(([id])=>officialSourceCodes[id]===code);
 if(!source)return'';
 return source[0]===OFFICIAL_SOURCE_OTHER_ID?String(val('official_other_detail')).trim():source[1];
}
const externalSources=[['external_tv_radio','التلفزيون أو الإذاعة'],['external_press','الصحافة الإلكترونية أو الورقية'],['external_unofficial_social','مواقع أو صفحات غير رسمية على شبكات التواصل الاجتماعي'],['external_family','الأسرة أو الأصدقاء أو المعارف'],[EXTERNAL_SOURCE_OTHER_ID,'مصدر آخر']];
const publicCommunicationChannels=['التلفزيون أو الإذاعة','المواقع الإلكترونية الرسمية للإدارات والمؤسسات العمومية','الصفحات والحسابات الرسمية على شبكات التواصل الاجتماعي','الصحافة الإلكترونية أو الورقية','اللقاءات أو الحملات التواصلية الميدانية',PUBLIC_CHANNEL_OTHER];
const noOfficialReasons=['لم أكن أعلم بوجود قنوات رسمية توفر معلومات حول البرنامج.','كنت أعلم بوجود قنوات رسمية، لكن لم يكن واضحًا لي ما هي القنوات أو الحسابات الرسمية المعتمدة.','لم أفكر في الرجوع إلى القنوات الرسمية للحصول على معلومات حول البرنامج.','فضّلت الاعتماد على مصادر أخرى لأنها بدت لي أسهل أو أنسب للحصول على المعلومات.','حاولت الوصول إلى القنوات الرسمية، لكن واجهت صعوبة في العثور عليها أو الوصول إليها.','وصلت إلى القنوات الرسمية، لكن واجهت صعوبة في استخدامها أو تصفح محتواها.','وصلت إلى القنوات الرسمية، لكنني لم أجد المعلومات التي كنت أبحث عنها.','لا أستخدم عادةً القنوات الرقمية للحصول على معلومات حول البرامج العمومية.',NO_OFFICIAL_REASON_OTHER];
const statuses=[COMBINED_BENEFICIARY,'قدمت طلبًا وما زال قيد المعالجة.','قدمت طلبًا ولم تتم الموافقة عليه.','اطلعت على البرنامج ولم أتقدم بطلب للاستفادة منه.'];
const contactChannels=[
 'منصة دعم سكن – DaamSakane.ma → عبر خدمة «اتصل بنا» على المنصة الرسمية.',
 'الموقع الرسمي للوزارة – mhpv.gov.ma → عبر نموذج الاتصال / خدمة التواصل على الموقع الرسمي للوزارة.',
 'البوابة الوطنية للشكايات – Chikaya.ma → عبر إيداع أو متابعة شكاية رسمية.',
 'الهاتف / مركز الاتصال الرسمي → عبر الرقم: \u200E+212 5 37 71 81 81',
 'البريد الإلكتروني الرسمي → عبر: contact@daamsakane.ma',
 'شبكات التواصل الاجتماعي الرسمية للوزارة → عبر Facebook أو Instagram أو باقي الحسابات الرسمية للوزارة، من خلال الرسائل الخاصة أو التعليقات.',
 OTHER_CONTACT_CHANNEL,
];
const quiz=[
 ['understanding_1','1. ما الغاية الأساسية من برنامج الدعم المباشر للسكن؟',['مساعدة المواطنين على أداء واجبات كراء السكن','مساعدة الأشخاص المؤهلين على اقتناء سكن رئيسي من خلال دعم مالي مباشر','تمويل بناء مساكن عمومية مخصصة للكراء','منح قروض بنكية بدون فوائد لبناء سكن'],'مساعدة الأشخاص المؤهلين على اقتناء سكن رئيسي من خلال دعم مالي مباشر'],
 ['understanding_2','2. أي من الشروط التالية يجب أن يتوفر في الشخص للاستفادة من برنامج الدعم المباشر للسكن؟',['أن يكون حاملاً للجنسية المغربية، وألا يكون قد سبق له الاستفادة من إعانة أو امتياز ممنوح من طرف الدولة في مجال السكن.','أن يكون حاملاً للجنسية المغربية، وأن يكون مقيماً بصفة دائمة داخل المغرب عند تقديم طلب الاستفادة.','أن يكون حاملاً للجنسية المغربية، وأن يتراوح عمره عند تقديم الطلب بين 18 و45 سنة.','أن يكون حاملاً للجنسية المغربية، وأن يكون مسجلاً في السجل الاجتماعي الموحد ضمن عتبة الاستفادة المحددة.'],'أن يكون حاملاً للجنسية المغربية، وألا يكون قد سبق له الاستفادة من إعانة أو امتياز ممنوح من طرف الدولة في مجال السكن.'],
 ['understanding_3','3. أين يُقدَّم طلب الاستفادة، وكيف تُتابع مراحل معالجة الملف؟',['مباشرة لدى مصالح الوزارة، مع تتبع الملف عبر البريد الإلكتروني','لدى الوكالة البنكية، مع تتبع الملف عبر تطبيقها الإلكتروني','عبر منصة «دعم سكن»، مع تتبع مراحل معالجة الملف من خلالها','لدى مصالح الجماعة الترابية، مع تتبع الملف بواسطة وصل الإيداع'],'عبر منصة «دعم سكن»، مع تتبع مراحل معالجة الملف من خلالها'],
 ['understanding_4','4. ما قيمة الدعم حسب ثمن بيع السكن مع احتساب الرسوم؟',['100.000 درهم إذا لم يتجاوز الثمن 300.000 درهم، و70.000 درهم إذا فاق 300.000 درهم ولم يتجاوز 700.000 درهم','70.000 درهم إذا لم يتجاوز الثمن 300.000 درهم، و100.000 درهم إذا فاق 300.000 درهم ولم يتجاوز 700.000 درهم','70.000 درهم لجميع المساكن التي لا يتجاوز ثمنها 700.000 درهم','100.000 درهم لجميع المساكن التي لا يتجاوز ثمنها 700.000 درهم'],'100.000 درهم إذا لم يتجاوز الثمن 300.000 درهم، و70.000 درهم إذا فاق 300.000 درهم ولم يتجاوز 700.000 درهم'],
 ['understanding_5','5. ما شروط السكن المؤهل للاستفادة من الدعم؟',['أن يتكون من غرفة واحدة على الأقل، وأن يكون موضوع بيع أول، وأن تكون رخصة السكن صادرة ابتداءً من فاتح يناير 2023','أن يتكون من غرفتين على الأقل، وأن يكون موضوع بيع أول، وأن تكون رخصة السكن صادرة ابتداءً من فاتح يناير 2023','أن يتكون من غرفتين على الأقل، وأن يكون موضوع بيع ثانٍ، وأن تكون رخصة السكن صادرة ابتداءً من فاتح يناير 2023','أن يتكون من غرفتين على الأقل، وأن يكون موضوع بيع أول، وأن تكون رخصة السكن صادرة قبل فاتح يناير 2023'],'أن يتكون من غرفتين على الأقل، وأن يكون موضوع بيع أول، وأن تكون رخصة السكن صادرة ابتداءً من فاتح يناير 2023'],
 ['understanding_6','6. ما المدة التي يجب أن يبقى خلالها السكن مخصصًا للسكن الرئيسي ابتداءً من تاريخ إبرام عقد البيع النهائي؟',['ثلاث (3) سنوات','أربع (4) سنوات','خمس (5) سنوات','سبع (7) سنوات'],'خمس (5) سنوات']
];
const G={
 information:[
  ['الوصول إلى المعلومات',[['info_1','1. يسهل التعرف على القنوات الرسمية للوزارة التي تنشر المعلومات المتعلقة ببرنامج الدعم المباشر للسكن.'],['info_2','2. يسهل الوصول إلى المعلومات المتعلقة بالبرنامج عبر وسائل التواصل الرسمية للوزارة.'],['info_3','3. أجد المعلومات الرسمية المتعلقة بالبرنامج متاحة عندما أحتاج إليها.']]],
  ['وضوح المعلومات وسهولة فهمها',[['info_4','4. تُقدَّم المعلومات الرسمية المتعلقة بالبرنامج بلغة واضحة.'],['info_5','5. تُشرح المصطلحات والإجراءات المتعلقة بالبرنامج في المعلومات الرسمية بطريقة يسهل فهمها.'],['info_6','6. تشرح المعلومات الرسمية بوضوح الخطوات التي يجب اتباعها للاستفادة من البرنامج.']]],
  ['محتوى المعلومات المتعلقة بالبرنامج',[['info_7','7. توفر المعلومات الرسمية تفاصيل كافية حول شروط الاستفادة من البرنامج.'],['info_8','8. تحدد المعلومات الرسمية الوثائق المطلوبة لتقديم الطلب.'],['info_9','9. توضح المعلومات الرسمية مختلف مراحل معالجة الطلب.'],['info_10','10. توفر المعلومات الرسمية تفاصيل كافية حول قيمة الدعم وكيفية الاستفادة منه.']]],
  ['دقة المعلومات وتحيينها',[['info_11','11. المعلومات الرسمية التي تنشرها الوزارة بشأن البرنامج دقيقة.'],['info_12','12. تتسم المعلومات المنشورة عبر وسائل التواصل الرسمية للوزارة بالاتساق وعدم التناقض.'],['info_13','13. تعكس المعلومات المنشورة آخر المستجدات المتعلقة بالبرنامج.']]],
 ],
 interactionPerceptions:[
  ['الاستفسارات وطلب التوضيحات',[['perception_info_clarification','تتيح القنوات الرسمية للمواطنين توجيه استفساراتهم وطلب توضيحات من الوزارة بشأن البرنامج.']]],
  ['الملاحظات والمقترحات والشكايات المتعلقة بالبرنامج',[
   ['perception_observations_proposals','تتيح القنوات الرسمية للمواطنين تقديم ملاحظاتهم ومقترحاتهم بشأن البرنامج.'],
   ['perception_complaints','تتيح القنوات الرسمية للمواطنين تقديم الشكايات المرتبطة بالبرنامج.']
  ]],
 ],
 response:[['حول الرد الذي توصلتم به',[['clarte_reponse','1. كان الرد الذي توصلت به واضحًا.'],['suffisance_reponse','2. تضمن الرد معلومات كافية بشأن الموضوع الذي تواصلت حوله.'],['delai_reponse','3. توصلت بالرد في أجل اعتبرته مناسبًا.']]]],
 trust:[['آراؤكم حول تدبير الوزارة للبرنامج',[['trust_1','1. المعلومات التي تنشرها الوزارة بشأن البرنامج دقيقة وموثوقة.'],['trust_2','2. لدى الوزارة القدرة على تدبير البرنامج بكفاءة.'],['trust_3','3. تُعالج طلبات الاستفادة وفق القواعد المعلنة.'],['trust_4','4. تطبق الوزارة معايير الاستفادة على جميع طالبي الدعم بصورة عادلة ودون تمييز.'],['trust_5','5. تفي الوزارة بالتزاماتها المعلنة بشأن البرنامج.']]]],
 legitimacy:[['آراؤكم حول بعض جوانب البرنامج',[['legit_1','1. تخصيص برنامج لامتلاك السكن أمر جيد.'],['legit_2','2. يساهم برنامج الدعم المباشر للسكن في تسهيل امتلاك السكن.'],['legit_3','3. تخصيص موارد عمومية لتمويل برنامج الدعم المباشر للسكن أمر مناسب.'],['legit_4','4. معايير الاستفادة المعتمدة في البرنامج عادلة.']]]],
 ease:[['شروط وإجراءات الاستفادة من البرنامج',[['ease_1','1. شروط الاستفادة المحددة في البرنامج قابلة للاستيفاء (أي يمكن تحقيقها).'],['ease_2','2. إجراءات طلب الاستفادة من البرنامج ميسرة.'],['ease_3','3. الوثائق المطلوبة للاستفادة من البرنامج يمكن توفيرها دون صعوبة كبيرة.']]]],
 accept:[['آراؤكم حول البرنامج',[['accept_1','1. الاستفادة من برنامج الدعم المباشر للسكن خيار مناسب لاقتناء السكن.'],['accept_2','2. برنامج الدعم المباشر للسكن جدير بالاستمرار.'],['accept_3','3. أوصي أصدقائي وأفراد أسرتي المؤهلين بالاستفادة من برنامج الدعم المباشر للسكن.']]]],
 satisfaction:[['تجربتكم في الاستفادة من البرنامج وأثرها على وضعكم السكني',[['satisfaction_1','1. مكنني البرنامج من اقتناء السكن.'],['satisfaction_2','2. شروط وإجراءات الاستفادة من البرنامج ميسرة.'],['satisfaction_3','3. كانت المدة بين معالجة ملف الاستفادة واقتناء السكن مناسبة.'],['impact_personal_1','4. ساهمت الاستفادة من البرنامج في تحسين ظروفي السكنية والمعيشية.'],['impact_personal_2','5. خفف الدعم العبء المالي المرتبط باقتناء السكن.']]]],
 generalImpact:[['آثار البرنامج',[['impact_general_1','1. يساهم برنامج الدعم المباشر للسكن في تحسين الأوضاع السكنية.'],['impact_general_2','2. يساهم برنامج الدعم المباشر للسكن في تخفيف العبء المالي المرتبط باقتناء السكن.']]]]
};
const stepTitles={filters:'معلومات حول علاقتكم بالبرنامج',information:'المعلومات الرسمية المتعلقة بالبرنامج',interaction:'التفاعل مع الوزارة بشأن البرنامج',understanding:'أسئلة حول برنامج الدعم المباشر للسكن',trust:'آراؤكم حول تدبير الوزارة للبرنامج',legitimacy:'آراؤكم حول بعض جوانب البرنامج',evaluation:'آراؤكم حول البرنامج',suggestions:'مقترحاتكم بشأن البرنامج',demographics:'معلومات عامة'};
function currentStepTitle(step){if(step==='trust'&&route()==='g2')return'آراؤكم حول تدبير الوزارة للبرنامج';return stepTitles[step];}
function steps(){
 if(!val('q1'))return['filters'];
 if(val('q1')==='لا')return['filters','demographics'];
 if(!val('q2'))return['filters'];
 let s=['filters'];
 if(route()==='official')s.push('information');
 s.push('interaction','understanding','trust','legitimacy','evaluation');
 s.push('suggestions','demographics');
 return s;
}
function radio(id,label,options,required=true,help=''){return `<fieldset class="question-card"><legend>${esc(label)}${required?'<span class="required-mark"> *</span>':''}</legend>${help?`<p class="question-help instruction-text">${esc(help)}</p>`:''}<div class="standard-options">${options.map(o=>{let v=Array.isArray(o)?o[0]:o,t=Array.isArray(o)?o[1]:o;return `<label class="choice ${val(id)===v?'choice-selected':''}"><input type="radio" data-id="${esc(id)}" value="${esc(v)}" ${val(id)===v?'checked':''}><span>${esc(t)}</span></label>`}).join('')}</div></fieldset>`}
function checks(items,question,instruction='يمكن اختيار أكثر من جواب.'){return `<fieldset class="question-card"><legend class="question-title checkbox-question-title">${esc(question)}</legend><p class="instruction-text">${esc(instruction)}</p><div class="standard-options">${items.map(([id,t])=>`<label class="choice ${val(id)?'choice-selected':''}"><input type="checkbox" data-check="${id}" ${val(id)?'checked':''}><span>${esc(t)}</span></label>`).join('')}</div></fieldset>`}
function textField(id,label,placeholder){return `<fieldset class="question-card"><legend>${esc(label)} <span class="required-mark"> *</span></legend><input class="text-input" data-text="${esc(id)}" value="${esc(val(id))}" placeholder="${esc(placeholder)}"></fieldset>`}
function scaleLegend(scale=SCALE){return `<div class="instruction-card"><strong class="instruction-text">يرجى تحديد درجة موافقتكم على العبارات التالية:</strong><div class="legend-grid">${scale.map(([n,t])=>`<span>${n===t?'':esc(n)+' — '}${esc(t)}</span>`).join('')}</div></div>`}
function table(groups,scale=SCALE){return groups.map(([title,rows])=>`<section class="group-card"><div class="group-heading"><h3>${esc(title)}</h3></div><div class="likert-wrap"><table class="likert-table"><thead><tr><th>العبارة</th>${scale.map(([n,t])=>`<th title="${esc(t)}" aria-label="${esc(t)}">${esc(n)}</th>`).join('')}</tr></thead><tbody>${rows.map(([id,label])=>`<tr><td>${esc(label)}</td>${scale.map(([n,t])=>`<td><label data-label="${esc(t)}" aria-label="${esc(t)}"><input type="radio" data-id="${id}" value="${esc(n)}" ${val(id)===n?'checked':''}></label></td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`).join('')}
function filters(){
 let h=radio('q1','س1. هل سبق لكم أن سمعتم ببرنامج الدعم المباشر للسكن؟',['نعم','لا']);
 if(val('q1')==='لا'){
  h+=radio('preferred_public_channel','س1-أ. عبر أي وسيلة تفضلون التوصل بمعلومات حول البرامج العمومية؟',publicCommunicationChannels,true,'يرجى اختيار الوسيلة المفضلة لديكم.');
  if(val('preferred_public_channel')===PUBLIC_CHANNEL_OTHER)h+=textField('preferred_public_channel_other','يرجى تحديد الوسيلة الأخرى:','اكتبوا الوسيلة المفضلة لديكم');
  return h+`<div class="instruction-card compact"><p class="instruction-text">ستنتقلون بعد ذلك إلى قسم المعلومات العامة.</p></div>`;
 }
 if(val('q1')==='نعم'){
  h+=radio('q2','س2. هل سبق أن اطلعتم على معلومات حول برنامج الدعم المباشر للسكن من خلال إحدى القنوات الرسمية للوزارة؟',['نعم','لا']);
  if(val('q2')==='نعم'){
   let selected=selectedOfficialSources();
   h+=checks(officialSources,'من خلال أي من وسائل التواصل الرسمية التالية اطلعتم على معلومات حول البرنامج؟');
   if(val(OFFICIAL_SOURCE_OTHER_ID))h+=textField('official_other_detail','يرجى تحديد المصدر الرسمي الآخر:','اكتبوا اسم المصدر الرسمي الآخر');
   if(selected.length>=2)h+=radio('sourcePrincipale','من بين وسائل التواصل الرسمية التي اخترتموها، ما هي الوسيلة الرئيسية التي اعتمدتم عليها للاطلاع على معلومات حول البرنامج؟',selected.map(([id,label])=>[officialSourceCodes[id],label]),true,'يرجى اختيار جواب واحد فقط.');
  }
  if(val('q2')==='لا'){
   h+=checks(externalSources,'س2-أ. من خلال أي من المصادر التالية اطلعتم على معلومات حول البرنامج؟');
   if(val(EXTERNAL_SOURCE_OTHER_ID))h+=textField('external_other_detail','يرجى تحديد المصدر الآخر:','اكتبوا المصدر الآخر');
   h+=radio('no_official_reason','س2-ب. ما السبب الرئيسي لعدم اطلاعكم على معلومات حول البرنامج عبر القنوات الرسمية للوزارة؟',noOfficialReasons,true,'يرجى اختيار جواب واحد فقط.');
   if(val('no_official_reason')===NO_OFFICIAL_REASON_OTHER)h+=textField('no_official_reason_other','يرجى تحديد السبب الآخر:','اكتبوا السبب الآخر');
  }
  if(val('q2')){h+=radio('status','س3. ضع علامة أمام الإجابة التي تناسب وضعيتكم.',statuses);if(val('status')===COMBINED_BENEFICIARY)h+=radio('q3_detail','س3-أ. هل استفدتم شخصيًا من البرنامج؟',Q3_DETAIL_CHOICES);}
 }
 return h;
}
function interaction(){
 let h=`<div class="instruction-card compact"><p class="instruction-text">يرجى الإجابة بناءً على معرفتكم أو تجربتكم مع قنوات التواصل الرسمية التي تتيح التفاعل بشأن برنامج «دعم سكن».</p></div>`;
 h+=radio('contact_reel','هل سبق لكم استخدام إحدى القنوات الرسمية للتواصل أو التفاعل بشأن البرنامج، لطرح سؤال أو طلب توضيح أو تقديم ملاحظة أو مقترح أو شكاية؟',['نعم','لا']);
 if(val('contact_reel')==='نعم'){
  h+=radio('contact_reason','ما السبب الرئيسي الذي دفعكم إلى التواصل مع الوزارة بشأن البرنامج؟',contactReasons);
  h+=radio('canal_dernier_contact','عبر أي قناة رسمية تم آخر تواصل لكم بشأن برنامج الدعم المباشر للسكن؟',contactChannels);
  if(val('canal_dernier_contact')===OTHER_CONTACT_CHANNEL)h+=textField('contact_channel_other_detail','يرجى تحديد القناة الرسمية الأخرى:','اكتبوا اسم القناة الرسمية الأخرى');
  h+=radio('reponse_recue','هل توصلتم برد بشأن هذا التواصل؟',['نعم','لا']);
  if(val('reponse_recue')==='نعم')h+=`<p class="question-help instruction-text">يرجى تقييم الرد الذي توصلتم به:</p>${table(G.response)}`;
  if(val('reponse_recue')==='لا'&&route()==='official')h+=`<p class="question-help instruction-text">بما أنكم لم تتوصلوا برد، يرجى تقييم إمكانات التفاعل التي تتيحها القنوات الرسمية:</p>${scaleLegend()}${table(G.interactionPerceptions)}`;
 }
 if(val('contact_reel')==='لا'){
  h+=radio('noninteraction_reason','ما السبب الرئيسي لعدم تواصلكم مع الوزارة بشأن البرنامج؟',nonInteractionReasons);
  if(route()==='official')h+=scaleLegend()+table(G.interactionPerceptions);
 }
 return h;
}
function understanding(){return `<div class="instruction-card"><strong>أسئلة حول برنامج الدعم المباشر للسكن</strong><p class="instruction-text">يرجى اختيار جواب واحد لكل سؤال.</p></div>${quiz.map(([id,q,opts])=>radio(id,q,opts)).join('')}`}
function evaluation(){let h=scaleLegend()+table(G.ease)+table(G.accept);h+=beneficiary()?table(G.satisfaction):table(G.generalImpact);return h;}
const demographics={age:['من 18 إلى 24 سنة','من 25 إلى 34 سنة','من 35 إلى 44 سنة','من 45 إلى 54 سنة','55 سنة فأكثر'],gender:['ذكر','أنثى'],education:['بدون تعليم نظامي','التعليم الابتدائي','التعليم الإعدادي','التعليم الثانوي','التعليم العالي'],housing:['أملك السكن الذي أقيم فيه','أكتري السكن الذي أقيم فيه','أقيم مع الأسرة','أقيم في سكن وظيفي أو مؤقت','وضع سكني آخر'],residence:['داخل المغرب','خارج المغرب'],region:['طنجة - تطوان - الحسيمة','الشرق','فاس - مكناس','الرباط - سلا - القنيطرة','الدار البيضاء - سطات','بني ملال - خنيفرة','مراكش - آسفي','درعة - تافيلالت','سوس - ماسة','كلميم - واد نون','العيون - الساقية الحمراء','الداخلة - وادي الذهب'],professional:['موظف أو موظفة في القطاع العام','مستخدم أو مستخدمة في القطاع الخاص','مقاول أو مقاولة','متقاعد أو متقاعدة','طالب أو طالبة','بدون عمل']};
function demo(){let h=`<div class="instruction-card compact"><strong>المعلومات العامة</strong><p class="instruction-text">تساعد هذه المعلومات في التحليل العلمي للنتائج، ولا تُستعمل للتعرف على هوية المشارك.</p></div>${radio('age','1. ما هي فئتكم العمرية؟',demographics.age)}${radio('gender','2. ما هو جنسكم؟',demographics.gender)}${radio('education','3. ما هو أعلى مستوى دراسي حصلتم عليه؟',demographics.education)}${radio('housing','4. ما هو وضعكم السكني الحالي؟',demographics.housing)}${radio('residence','5. أين تقيمون حاليًا؟',demographics.residence)}`; if(val('residence')==='داخل المغرب')h+=`<fieldset class="question-card"><legend>5-أ. جهة الإقامة داخل المغرب <span class="required-mark"> *</span></legend><select class="text-input" id="region-select"><option value="">اختاروا الجهة</option>${demographics.region.map(x=>`<option ${val('region')===x?'selected':''}>${esc(x)}</option>`).join('')}</select></fieldset>`;if(val('residence')==='خارج المغرب')h+=`<fieldset class="question-card"><legend>5-ب. بلد الإقامة خارج المغرب <span class="required-mark"> *</span></legend><input class="text-input" id="country-input" value="${esc(val('country'))}" placeholder="اكتبوا اسم البلد"></fieldset>`;h+=radio('professional','6. ما هو وضعكم المهني الحالي؟',demographics.professional);return h;}
function section(){switch(state.step){case'filters':return filters();case'information':return scaleLegend()+table(G.information);case'interaction':return interaction();case'understanding':return understanding();case'trust':return scaleLegend()+table(G.trust);case'legitimacy':return scaleLegend()+table(G.legitimacy);case'evaluation':return evaluation();case'suggestions':return `<fieldset class="question-card"><legend>ما أهم التغييرات أو الإجراءات التي تقترحونها لتحسين التواصل والتفاعل بين الوزارة والمواطنين بشأن برنامج الدعم المباشر للسكن؟</legend><textarea id="suggestion" rows="7" placeholder="اكتبوا مقترحاتكم هنا…">${esc(val('suggestion'))}</textarea></fieldset>`;case'demographics':return demo();}}
function requiredIds(step){
 if(step==='filters'){
  if(val('q1')==='لا')return['q1','preferred_public_channel',...(val('preferred_public_channel')===PUBLIC_CHANNEL_OTHER?['preferred_public_channel_other']:[])];
  let ids=['q1','q2'];
  if(val('q2')==='نعم'){
   if(val(OFFICIAL_SOURCE_OTHER_ID))ids.push('official_other_detail');
   if(selectedOfficialSources().length>=2)ids.push('sourcePrincipale');
  }
  if(val('q2')==='لا'){
   ids.push('no_official_reason');
   if(val(EXTERNAL_SOURCE_OTHER_ID))ids.push('external_other_detail');
   if(val('no_official_reason')===NO_OFFICIAL_REASON_OTHER)ids.push('no_official_reason_other');
  }
  if(val('q2')){ids.push('status');if(val('status')===COMBINED_BENEFICIARY)ids.push('q3_detail');}
  return ids;
 }
 if(step==='information')return G.information.flatMap(g=>g[1].map(r=>r[0]));
 if(step==='interaction'){let ids=['contact_reel'];if(val('contact_reel')==='نعم'){ids.push('contact_reason','canal_dernier_contact','reponse_recue');if(val('canal_dernier_contact')===OTHER_CONTACT_CHANNEL)ids.push('contact_channel_other_detail');if(val('reponse_recue')==='نعم')ids.push(...G.response[0][1].map(r=>r[0]));if(val('reponse_recue')==='لا'&&route()==='official')ids.push(...interactionPerceptionIds());}if(val('contact_reel')==='لا'){ids.push('noninteraction_reason');if(route()==='official')ids.push(...interactionPerceptionIds());}return ids;}
 if(step==='understanding')return quiz.map(q=>q[0]);
 if(step==='trust')return G.trust[0][1].map(r=>r[0]);
 if(step==='legitimacy')return G.legitimacy[0][1].map(r=>r[0]);
 if(step==='evaluation'){return [...G.ease,...G.accept,...(beneficiary()?G.satisfaction:G.generalImpact)].flatMap(g=>g[1].map(r=>r[0]));}
 if(step==='demographics'){let ids=['age','gender','education','housing','residence','professional'];if(val('residence')==='داخل المغرب')ids.push('region');if(val('residence')==='خارج المغرب')ids.push('country');return ids;}
 return[];
}
function valid(){if(state.step==='filters'&&val('q2')==='نعم'&&!officialSources.some(([id])=>val(id))){state.error='يرجى اختيار وسيلة رسمية واحدة على الأقل.';return false;}if(state.step==='filters'&&val('q2')==='نعم'&&selectedOfficialSources().length>=2&&!val('sourcePrincipale')){state.error='يرجى اختيار وسيلة التواصل الرسمية الرئيسية قبل المتابعة.';return false;}if(state.step==='filters'&&val('q2')==='لا'&&!externalSources.some(([id])=>val(id))){state.error='يرجى اختيار مصدر واحد على الأقل.';return false;}for(const id of requiredIds(state.step)){if(!String(val(id)).trim()){state.error='يرجى الإجابة عن جميع الأسئلة المطلوبة قبل المتابعة.';return false;}}state.error='';return true;}
function mean(ids){
 const raw=ids.map(id=>String(val(id)).trim());
 if(raw.some(value=>value===''))return null;
 const nums=raw.map(Number);
 return nums.every(value=>Number.isFinite(value)&&value>=1&&value<=5)?nums.reduce((sum,value)=>sum+value,0)/nums.length:null;
}
function likertIndex(score){return score===null?null:(score-1)/4*100;}
function likertClassification(score){return score===null?null:score<3?'negative':score>3?'positive':'neutral';}
function likertResult(score,itemCount){
 return{score,index:likertIndex(score),classification:likertClassification(score),item_count:itemCount};
}
function likertDimension(ids,enabled=true){return likertResult(enabled?mean(ids):null,ids.length);}
function likertComposite(dimensions){
 const values=dimensions.map(d=>d.score);
 const score=values.every(value=>value!==null)?values.reduce((sum,value)=>sum+value,0)/values.length:null;
 return{...likertResult(score,dimensions.reduce((sum,d)=>sum+d.item_count,0)),dimension_count:dimensions.length,positive_dimension_count:score===null?null:dimensions.filter(d=>d.score>3).length};
}
function comprehensionScoring(){
 const namedScores={};
 const rawAnswers={};
 quiz.forEach(([id,,,correct],index)=>{
  const answer=val(id);
  rawAnswers[id]=answer||null;
  namedScores[`Compréhension_Q${index+1}_correct`]=answer===''?null:(answer===correct?1:0);
 });
 const values=Object.values(namedScores);
 const complete=route()!=='g1'&&values.every(value=>value===0||value===1);
 const score=complete?values.reduce((sum,value)=>sum+value,0):null;
 return{
  raw_answers:rawAnswers,
  correct_by_question:namedScores,
  Score_Compréhension_0_6:score,
  Pourcentage_Compréhension_0_100:score===null?null:Math.round(score/6*1000)/10
 };
}
function scores(){
 const official=route()==='official';
 const interactivityApplicable=official&&(val('contact_reel')==='لا'||(val('contact_reel')==='نعم'&&val('reponse_recue')==='لا'));
 const dimensions={
  information_accessibility:likertDimension(G.information[0][1].map(r=>r[0]),official),
  information_clarity:likertDimension(G.information[1][1].map(r=>r[0]),official),
  information_completeness:likertDimension(G.information[2][1].map(r=>r[0]),official),
  information_accuracy:likertDimension(G.information[3][1].map(r=>r[0]),official),
  interaction_information_clarifications:likertDimension(G.interactionPerceptions[0][1].map(r=>r[0]),interactivityApplicable),
  interaction_observations_proposals:likertDimension([G.interactionPerceptions[1][1][0][0]],interactivityApplicable),
  interaction_complaints:likertDimension([G.interactionPerceptions[1][1][1][0]],interactivityApplicable),
  institutional_trust:likertDimension(G.trust[0][1].map(r=>r[0]),route()!=='g1'),
  programme_legitimacy:likertDimension(G.legitimacy[0][1].map(r=>r[0]),route()!=='g1'),
  access_ease:likertDimension(G.ease[0][1].map(r=>r[0]),route()!=='g1'),
  programme_acceptance:likertDimension(G.accept[0][1].map(r=>r[0]),route()!=='g1'),
  beneficiary_satisfaction:likertDimension(G.satisfaction[0][1].slice(0,3).map(r=>r[0]),beneficiary()),
  general_impact:likertDimension(G.generalImpact[0][1].map(r=>r[0]),route()!=='g1'&&!beneficiary()),
  response_quality:likertDimension(G.response[0][1].map(r=>r[0]),val('reponse_recue')==='نعم'),
  personal_impact:likertDimension(G.satisfaction[0][1].slice(3).map(r=>r[0]),beneficiary())
 };
 const transparency=likertComposite([dimensions.information_accessibility,dimensions.information_clarity,dimensions.information_completeness,dimensions.information_accuracy]);
 const interactivity=likertComposite([dimensions.interaction_information_clarifications,dimensions.interaction_observations_proposals,dimensions.interaction_complaints]);
 const communicationQuality=transparency.score===null?likertResult(null,0):(val('contact_reel')==='نعم'&&val('reponse_recue')==='نعم'?likertComposite([transparency,dimensions.response_quality]):interactivity.score!==null?likertComposite([transparency,interactivity]):likertResult(null,0));
 const programmeSuccess=beneficiary()?likertComposite([dimensions.access_ease,dimensions.programme_acceptance,dimensions.beneficiary_satisfaction,dimensions.personal_impact]):likertResult(null,0);
 const singleItems={};
 const rawAnswers=Object.fromEntries([...new Set(Object.values(G).flatMap(groups=>groups.flatMap(([,rows])=>rows.map(([id])=>id))))].map(id=>[id,val(id)||null]));
 const comprehension=comprehensionScoring();
 return{
  raw_answers:rawAnswers,
  dimensions,
  global_scores:{transparency,interactivity,communication_quality:communicationQuality,programme_success:programmeSuccess},
  single_items:singleItems,
  understanding:comprehension.Score_Compréhension_0_6,
  understanding_correct:comprehension.correct_by_question,
  understanding_percentage:comprehension.Pourcentage_Compréhension_0_100
 };
}
function authConfigured(){return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(AUTH_BRIDGE_URL);}
function authRequestId(){return globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);}
function authGateMessage(){
 if(auth.blocked)return'<div class="auth-alert auth-alert-blocked" role="alert"><strong>سبق إرسال إجابة بهذا الحساب.</strong><p>لا يمكن المشاركة أكثر من مرة بالحساب نفسه.</p></div>';
 if(auth.error)return`<div class="auth-alert" role="alert"><strong>تعذر التحقق من الحساب.</strong><p>${esc(auth.error)}</p></div>`;
 return'<p class="auth-help">يُستخدم حساب Google فقط للتحقق من أن المشاركة تُرسل مرة واحدة. لا يُضاف البريد إلى إجابات الاستبيان ولا يُحفظ في ورقة الردود.</p>';
}
function renderAuthGate(){
 $('#root').innerHTML=`<main class="site-shell auth-shell" dir="rtl"><header class="hero"><div class="hero-accent"></div><p class="eyebrow">بحث أكاديمي بسلك الدكتوراه</p><h1>استبيان حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن</h1><p class="hero-lead"><span class="hero-lead-desktop">في إطار إعداد بحث أكاديمي بسلك الدكتوراه، أضع بين أيديكم هذا الاستبيان، الذي يندرج ضمن دراسة حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن.</span><span class="hero-lead-mobile">ندعوكم للمشاركة في هذا الاستبيان الأكاديمي حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن.</span></p><div class="privacy-note"><span>◉</span><p>جميع الأجوبة سرية، ولن تُستعمل إلا لأغراض البحث العلمي.</p></div></header><section class="auth-card" aria-labelledby="auth-title"><div class="auth-icon" aria-hidden="true">G</div><h2 id="auth-title">تسجيل الدخول للمشاركة</h2>${authGateMessage()}${auth.checking?'<div class="auth-loading" role="status"><span></span> جارٍ التحقق من الحساب…</div>':'<p class="auth-action-hint">اضغط على زر «المواصلة باستخدام Google» للمتابعة.</p><div id="google-signin-button" class="google-signin-button"></div>'}${!authConfigured()?'<p class="auth-config-error">لم يكتمل بعد ربط خدمة التحقق بالموقع.</p>':''}</section><footer><p>شكرًا لتعاونكم ومساهمتكم في هذا البحث العلمي.</p></footer></main>`;
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
 const viewportWidth=document.documentElement.clientWidth;
 const buttonWidth=viewportWidth<=480
  ?Math.min(280,Math.max(220,viewportWidth-88))
  :viewportWidth<=760
   ?Math.min(320,Math.max(240,viewportWidth-96))
   :Math.min(360,Math.max(240,viewportWidth-72));
 google.accounts.id.renderButton(target,{type:'standard',theme:'outline',size:'large',text:'continue_with',shape:'rectangular',logo_alignment:'left',locale:'ar',width:buttonWidth});
}
async function handleGoogleCredential(response){
 const jeton=String(response?.credential||'');
 if(!jeton)return;
 auth.checking=true;auth.error='';auth.blocked=false;render();
 try{
  const resultat=await callAuthBridge('check',jeton);
  const entryId=String(resultat?.submissionEntryId||'');
  if(resultat?.allowed&&/^\d+$/.test(entryId)){auth.allowed=true;auth.idToken=jeton;auth.submissionEntryId=entryId;auth.blocked=false;auth.error='';}
  else{auth.allowed=false;auth.idToken='';auth.submissionEntryId='';auth.blocked=resultat?.reason==='already_submitted';auth.error=auth.blocked?'':resultat?.reason==='configuration_error'?'خدمة الإرسال قيد الإعداد. يرجى المحاولة لاحقًا.':'تعذر تأكيد صلاحية الحساب. يرجى إعادة المحاولة.';}
 }catch(_){auth.allowed=false;auth.idToken='';auth.submissionEntryId='';auth.error='تعذر الاتصال بخدمة التحقق. يرجى إعادة المحاولة بعد لحظات.';}
 finally{auth.checking=false;render();}
}
function callAuthBridge(action,idToken,extra={}){
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
  Object.entries(extra).forEach(([name,value])=>add(name,String(value??'')));
  const cleanup=()=>{form.remove();frame.remove();};
  const timeoutMs=action==='check'?15000:120000;
  const timer=setTimeout(()=>{authRequests.delete(requestId);cleanup();reject(new Error('request_timeout'));},timeoutMs);
  authRequests.set(requestId,{resolve:result=>{clearTimeout(timer);cleanup();resolve(result);}});
  document.body.append(frame,form);
  form.submit();
 });
}
window.addEventListener('message',event=>{
 const origineGoogleValide=event.origin==='https://script.google.com'||event.origin==='https://script.googleusercontent.com'||/^https:\/\/[-a-z0-9]+-script\.googleusercontent\.com$/.test(event.origin)||/^https:\/\/[-a-z0-9]+\.script\.googleusercontent\.com$/.test(event.origin);
 if(!origineGoogleValide)return;
 const message=event.data||{};
 if(message.channel!==AUTH_CHANNEL)return;
 if(message.type==='response'&&message.requestId){
  const pending=authRequests.get(message.requestId);
  if(!pending)return;
  authRequests.delete(message.requestId);
  pending.resolve(message.result||{ok:false,allowed:false,reason:'server_error'});
 }
});
function handleSubmissionRefusal(resultat){
 state.sending=false;
 if(resultat?.reason==='already_submitted'){
  auth.allowed=false;auth.idToken='';auth.submissionEntryId='';auth.blocked=true;auth.error='';render();return;
 }
 if(resultat?.reason==='reauthentication_required'){
  auth.allowed=false;auth.idToken='';auth.submissionEntryId='';auth.blocked=false;auth.error='انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مجددًا، وستبقى إجاباتكم محفوظة في هذه الصفحة.';render();return;
 }
 state.error=resultat?.reason==='invalid_answers'
  ?'تعذر إرسال الإجابات بسبب تعارض تقني في بنية الاستبيان. لم تُسجّل مشاركة ناقصة، وبقيت إجاباتكم محفوظة في الصفحة.'
  :'تعذر إرسال الإجابات إلى Google Forms بعد محاولة التأكيد التلقائي. بقيت إجاباتكم محفوظة في الصفحة ولم تُعرض رسالة نجاح.';
 render();
}
function shouldRetrySubmission(resultat){
 return !resultat||['server_error','token_service_unavailable','submission_not_found','network_error'].includes(resultat.reason);
}
async function confirmSubmissionAutomatically(submissionId,payload,supplemental){
 let resultat=null;
 for(let tentative=0;tentative<2;tentative++){
  if(tentative)await new Promise(resolve=>setTimeout(resolve,1200));
  try{
   resultat=await callAuthBridge('submit',auth.idToken,{
    submissionId,
    payload:JSON.stringify(payload),
    supplemental:JSON.stringify(supplemental),
    schemaVersion:SCHEMA_VERSION
   });
  }catch(_){
   resultat={allowed:false,reason:'network_error'};
  }
  if(resultat?.allowed||!shouldRetrySubmission(resultat))return resultat;
 }
 return resultat||{allowed:false,reason:'server_error'};
}
async function submit(){
 if(!valid())return render();
 state.sending=true;render();
 const entryId=String(auth.submissionEntryId||'');
 if(!auth.allowed||!auth.idToken||!/^\d+$/.test(entryId)){
  handleSubmissionRefusal({allowed:false,reason:'reauthentication_required'});
  return;
 }
 const submissionId=state.pendingSubmissionId||authRequestId().replace(/-/g,'');
 state.pendingSubmissionId=submissionId;
 const payload={};
 const supplemental={};
 let add=(id,v)=>{
  if(!id||v===undefined||v===null||v==='')return;
  const key=String(id);
  if(Object.prototype.hasOwnProperty.call(payload,key))payload[key]=Array.isArray(payload[key])?[...payload[key],String(v)]:[payload[key],String(v)];
  else payload[key]=String(v);
 };
 let routeName=submissionRoute();
 let routeEntries={g2_beneficiary:ENTRY_G2_BENEFICIARY,g2_other:ENTRY_G2_OTHER,official_beneficiary:ENTRY_OFFICIAL_BENEFICIARY,official_other:ENTRY_OFFICIAL_OTHER};
 let active=routeEntries[routeName]||{};
 let shared=route()==='g2'?ENTRY_G2_SHARED:ENTRY_OFFICIAL_SHARED;
 let addCommon=(key,v)=>add(ENTRY_COMMON[key],v);
 let addKey=(key,v)=>add(active[key],v);
 let scaleValue=(n)=>{let row=SCALE.find(([value])=>value===n);return row?n+' — '+row[1]:n;};
 let addScale=(key)=>{let n=val(key);if(n)addKey(key,scaleValue(n));};
 addCommon('q1',val('q1'));
 if(val('q1')==='نعم')addCommon('q2',val('q2'));
 if(route()==='official'){
  officialSources.forEach(([id,label])=>{if(val(id))add(ENTRY_OFFICIAL_SHARED.official_sources,label);});
  if(val(OFFICIAL_SOURCE_OTHER_ID))supplemental.official_source_other_detail=String(val('official_other_detail')).trim();
  add(ENTRY_OFFICIAL_SHARED.source_principale,val('sourcePrincipale')===officialSourceCodes[OFFICIAL_SOURCE_OTHER_ID]?'مصدر رسمي آخر':sourcePrincipaleLabel());
 }
 if(route()==='g2'){
  externalSources.forEach(([id,label])=>{if(val(id))add(ENTRY_G2_SHARED.external_sources,label);});
  if(val(EXTERNAL_SOURCE_OTHER_ID))supplemental.external_source_other_detail=String(val('external_other_detail')).trim();
 }
 if(route()!=='g1'){add(shared.status,val('status'));if(val('status')===COMBINED_BENEFICIARY)add(shared.q3_detail,val('q3_detail'));}
 [
  'info_1','info_2','info_3','info_4','info_5','info_6','info_7','info_8','info_9','info_10','info_11','info_12','info_13',
  'perception_info_clarification','perception_observations_proposals','perception_complaints','clarte_reponse','suffisance_reponse','delai_reponse',
  'trust_1','trust_2','trust_3','trust_4','trust_5','legit_1','legit_2','legit_3','legit_4',
  'ease_1','ease_2','ease_3','accept_1','accept_2','accept_3','satisfaction_1','satisfaction_2','satisfaction_3',
  'impact_general_1','impact_general_2','impact_personal_1','impact_personal_2'
 ].forEach(addScale);
 if(route()==='g1')supplemental.preferred_public_channel=val('preferred_public_channel')===PUBLIC_CHANNEL_OTHER?String(val('preferred_public_channel_other')).trim():val('preferred_public_channel');
 if(route()==='g2')supplemental.no_official_reason=val('no_official_reason')===NO_OFFICIAL_REASON_OTHER?String(val('no_official_reason_other')).trim():val('no_official_reason');
 if(route()!=='g1'){
  addKey('contact_reel',val('contact_reel'));
  addKey('contact_reason',val('contact_reason'));
  addKey('noninteraction_reason',val('noninteraction_reason'));
  addKey('canal_dernier_contact',val('canal_dernier_contact'));
  if(val('canal_dernier_contact')===OTHER_CONTACT_CHANNEL)supplemental.contact_channel_other_detail=String(val('contact_channel_other_detail')).trim();
  addKey('reponse_recue',val('reponse_recue'));
  quiz.forEach(([id])=>addKey(id,val(id)));
  addKey('suggestion',val('suggestion'));
 }
 ['age','gender','education','housing','residence','region','country','professional'].forEach(k=>addCommon(k,val(k)));
 add(entryId,submissionId);
 try{
  const confirmation=await confirmSubmissionAutomatically(submissionId,payload,supplemental);
  if(confirmation?.allowed){state.pendingSubmissionId='';state.done=true;state.sending=false;state.error='';render();return;}
  handleSubmissionRefusal(confirmation);
 }catch(_){handleSubmissionRefusal({allowed:false,reason:'server_error'});}
}
function nav(){let ss=steps(),i=ss.indexOf(state.step),label=state.sending?'جارٍ إرسال الإجابات…':'إرسال الإجابات';return `<nav class="form-actions">${i>0?'<button class="secondary-button" id="prev" type="button">السابق</button>':'<span></span>'}${i<ss.length-1?'<button class="primary-button" id="next" type="button">التالي</button>':`<button class="primary-button submit-button" id="submit" type="button" ${state.sending?'disabled':''}>${label}</button>`}</nav>`;}
function render(){if(!auth.allowed){renderAuthGate();return;}if(state.done){$('#root').innerHTML=`<main class="site-shell" dir="rtl"><section class="success-card"><div class="success-icon">✓</div><p class="eyebrow">نهاية الاستبيان</p><h1>شكرًا جزيلًا على مشاركتكم</h1><p>تم تسجيل إجاباتكم بنجاح، ولن تُستعمل إلا لأغراض البحث العلمي.</p></section></main>`;return;}let ss=steps(),i=Math.max(ss.indexOf(state.step),0),pct=(i+1)/ss.length*100,title=currentStepTitle(state.step);$('#root').innerHTML=`<main class="site-shell" dir="rtl"><header class="hero"><div class="hero-accent"></div><p class="eyebrow">بحث أكاديمي بسلك الدكتوراه</p><h1>استبيان حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن</h1><p class="hero-lead"><span class="hero-lead-desktop">في إطار إعداد بحث أكاديمي بسلك الدكتوراه، أضع بين أيديكم هذا الاستبيان، الذي يندرج ضمن دراسة حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن.</span><span class="hero-lead-mobile">ندعوكم للمشاركة في هذا الاستبيان الأكاديمي حول التواصل العمومي المرتبط ببرنامج الدعم المباشر للسكن.</span></p><div class="privacy-note"><span>◉</span><p>جميع الأجوبة سرية، ولن تُستعمل إلا لأغراض البحث العلمي.</p></div><button class="intro-toggle" id="intro-toggle" type="button">${state.intro?'إخفاء مقدمة الاستبيان':'عرض مقدمة الاستبيان'} <span>${state.intro?'−':'+'}</span></button>${state.intro?`<div class="intro-copy"><p>وتكتسي مشاركتكم أهمية كبيرة، لما ستوفره من معطيات أساسية تسهم في إغناء هذا البحث وتعزيز نتائجه من الناحية العلمية. لذلك، نرجو منكم الإجابة عن الأسئلة بكل موضوعية ودقة.</p><details><summary>توضيحات</summary><div class="definition-list"><p><strong>الوزارة:</strong> وزارة إعداد التراب الوطني والتعمير والإسكان وسياسة المدينة.</p><p><strong>وسائل التواصل الرسمية للوزارة:</strong> يقصد بها مجموع القنوات والوسائط التي تعتمدها الوزارة رسمياً للتواصل العمومي بشأن برنامج الدعم المباشر للسكن، سواء لنشر المعلومات المتعلقة بأهدافه وشروط الاستفادة منه وإجراءاته ومستجداته، أو لتيسير الولوج إلى المعطيات والخدمات المرتبطة به. وتشمل، على الخصوص، الموقع الإلكتروني للوزارة، ومنصة «دعم سكن» وتطبيقها، والحسابات الرسمية على شبكات التواصل الاجتماعي، والبلاغات والمنشورات الرسمية. ولا تفترض هذه الوسائل، بالضرورة، إتاحة تواصل مباشر بين المواطن والوزارة.</p><p><strong>وسائل التواصل الرسمية التي تتيح التفاعل:</strong> يقصد بها القنوات الرسمية التي تمكّن المواطنين من التواصل مع الوزارة بشأن برنامج الدعم المباشر للسكن، من خلال توجيه الاستفسارات وطلب التوضيحات وتقديم الملاحظات أو المقترحات أو الشكايات، مع إمكانية تلقي جواب أو تتبع مآل الطلبات والشكايات المقدمة. وتشمل، على الخصوص، خدمات التواصل والمساعدة عبر منصة «دعم سكن» وتطبيقها، والبريد الإلكتروني ورقم المساعدة المخصصين للبرنامج، والبوابة الوطنية للشكايات، وخدمات المراسلة عبر الحسابات الرسمية للوزارة على شبكات التواصل الاجتماعي.</p></div></details></div>`:''}</header><section class="progress-panel"><div class="progress-copy"><span>المرحلة ${i+1}</span><strong>${esc(title)}</strong><span dir="ltr">${i+1} / ${ss.length}</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></section><section id="questionnaire-form" class="form-section"><div class="section-heading"><p>الاستبيان</p><h2>${esc(title)}</h2></div>${state.error?`<div class="error-message" role="alert">${esc(state.error)}</div>`:''}${section()}${nav()}</section><footer><p>شكرًا لتعاونكم ومساهمتكم في هذا البحث العلمي.</p></footer></main>`;bind();}
function bind(){document.querySelectorAll('input[type=radio][data-id]').forEach(x=>x.onchange=()=>{let id=x.dataset.id;set(id,x.value);if(id==='q1'){if(x.value!=='نعم')del('q2','status','q3_detail','sourcePrincipale','no_official_reason','no_official_reason_other','official_other_detail','external_other_detail','contact_reel','contact_reason','noninteraction_reason','canal_dernier_contact','contact_channel_other_detail','reponse_recue',...interactionPerceptionIds(),...G.response[0][1].map(r=>r[0]),...officialSources.map(z=>z[0]),...externalSources.map(z=>z[0]));else del('preferred_public_channel','preferred_public_channel_other');}if(id==='q2'){del('status','q3_detail','sourcePrincipale');if(x.value==='نعم')del('no_official_reason','no_official_reason_other','external_other_detail',...externalSources.map(z=>z[0]));else del('official_other_detail',...interactionPerceptionIds(),...officialSources.map(z=>z[0]));}if(id==='preferred_public_channel'&&x.value!==PUBLIC_CHANNEL_OTHER)del('preferred_public_channel_other');if(id==='no_official_reason'&&x.value!==NO_OFFICIAL_REASON_OTHER)del('no_official_reason_other');if(id==='canal_dernier_contact'&&x.value!==OTHER_CONTACT_CHANNEL)del('contact_channel_other_detail');if(id==='status'){if(x.value!==COMBINED_BENEFICIARY)del('q3_detail');if(x.value!==COMBINED_BENEFICIARY)del(...G.satisfaction[0][1].map(r=>r[0]));}if(id==='q3_detail'){if(beneficiary())del(...G.generalImpact[0][1].map(r=>r[0]));else del(...G.satisfaction[0][1].map(r=>r[0]));}if(id==='contact_reel')clearAbandonedInteractionBranch(x.value);if(id==='reponse_recue'){if(x.value==='لا')del(...G.response[0][1].map(r=>r[0]));if(x.value==='نعم')del(...interactionPerceptionIds());}if(id==='residence'){if(x.value==='داخل المغرب')del('country');else del('region');}render();});document.querySelectorAll('input[type=checkbox][data-check]').forEach(x=>x.onchange=()=>{let id=x.dataset.check;set(id,x.checked?'1':'');if(!x.checked&&id===OFFICIAL_SOURCE_OTHER_ID)del('official_other_detail');if(!x.checked&&id===EXTERNAL_SOURCE_OTHER_ID)del('external_other_detail');if(officialSourceCodes[id])reconcileSourcePrincipale();render();});document.querySelectorAll('[data-text]').forEach(x=>x.oninput=()=>set(x.dataset.text,x.value));let s=$('#suggestion');if(s)s.oninput=()=>set('suggestion',s.value);let r=$('#region-select');if(r)r.onchange=()=>{set('region',r.value);render();};let c=$('#country-input');if(c)c.oninput=()=>set('country',c.value);let it=$('#intro-toggle');if(it)it.onclick=()=>{state.intro=!state.intro;render();};let n=$('#next');if(n)n.onclick=()=>{if(!valid())return render();let ss=steps(),i=ss.indexOf(state.step);state.step=ss[i+1];state.error='';render();scrollToForm();};let p=$('#prev');if(p)p.onclick=()=>{let ss=steps(),i=ss.indexOf(state.step);state.step=ss[i-1];state.error='';render();scrollToForm();};let sub=$('#submit');if(sub)sub.onclick=submit;}
function scrollToForm(){requestAnimationFrame(()=>$('#questionnaire-form')?.scrollIntoView({behavior:'smooth',block:'start'}));}
const style=document.createElement('style');style.textContent=`.likert-wrap{overflow-x:auto}.likert-table{width:100%;border-collapse:collapse;min-width:760px;background:#fff}.likert-table th,.likert-table td{border:1px solid rgba(15,23,42,.12);padding:.85rem;text-align:center}.likert-table th:first-child,.likert-table td:first-child{text-align:right;min-width:360px}.likert-table input{width:20px;height:20px}.likert-table thead th{font-weight:800;background:rgba(15,23,42,.04)}.group-card+.instruction-card{margin-top:1rem}@media(max-width:700px){.likert-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}.likert-table{width:100%;min-width:0;table-layout:fixed;border-collapse:collapse;background:#fff}.likert-table thead{display:table-header-group}.likert-table thead th{font-size:1.12rem;font-weight:800;padding-block:.85rem}.likert-table thead th:first-child{font-size:1.08rem}.likert-table tbody{display:table-row-group}.likert-table tr{display:table-row}.likert-table th,.likert-table td{display:table-cell;padding:.76rem .24rem;font-size:1rem;vertical-align:middle}.likert-table th:first-child,.likert-table td:first-child{display:table-cell;width:45%;min-width:0;padding:.95rem .6rem;text-align:right;line-height:1.75}.likert-table th:not(:first-child),.likert-table td:not(:first-child){width:11%;min-width:0;padding-inline:.08rem}.likert-table tbody td label{display:flex;width:100%;min-height:60px;align-items:center;justify-content:center}.likert-table input{width:28px;height:28px;margin:0}}@media(max-width:380px){.likert-table th,.likert-table td{padding:.6rem .12rem;font-size:.88rem}.likert-table thead th{font-size:.98rem;padding-block:.68rem}.likert-table thead th:first-child{font-size:.96rem}.likert-table th:first-child,.likert-table td:first-child{width:45%;padding:.78rem .38rem}.likert-table th:not(:first-child),.likert-table td:not(:first-child){width:11%;min-width:0}.likert-table input{width:25px;height:25px}}`;document.head.appendChild(style);
render();
