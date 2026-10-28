
function VERIFIER_PREPARATION_ENVOI_20261028() {
  const formulaire = obtenirFormulaire_();
  const bundle = chargerItemsFormulaireV30_(formulaire);
  const correspondance = obtenirCorrespondanceFormulaire_(formulaire, bundle);
  const plan = obtenirPlanRapideV23_(formulaire, correspondance, bundle).plan;
  const index = obtenirIndexFallbackV30_(formulaire, bundle);
  const parcours = {"ENTRY_G2_BENEFICIARY":["237635013","1051412983","1024258489","990000000000000001","990000000000000002","1650482042","59663361","2100269279","1845717094","323132636","1183906650","1622342161","838382116","882397137","990000000000000041","990000000000000042","990000000000000043","990000000000000044","990000000000000045","1486461560","1904067536","1513964979","1092411069","1248958122","1537513608","664408094","1011219132","1200558200","844136116","2008127058","1587790851","411578762","271992870","301943015","704695728"],"ENTRY_G2_OTHER":["328033588","1748054727","476498187","990000000000000011","990000000000000012","716145318","166426109","1813469453","1374327145","2115575476","2111378965","310689731","1860201892","1729249596","990000000000000051","990000000000000052","990000000000000053","990000000000000054","990000000000000055","1677021184","520351974","1645334930","961995117","1198945725","1009069255","258582065","1265924651","1744035836","89167698","471635203","1258806770","159882139"],"ENTRY_OFFICIAL_BENEFICIARY":["1262380031","618372618","1276906943","1758509584","1958940162","1042862389","89201942","2061798367","699276498","3577675","1107060713","483431253","135111340","1807617813","1917194186","1188398753","401614676","2030949688","1948428970","990000000000000021","990000000000000022","990000000000000023","990000000000000024","990000000000000025","366290689","2118812173","1797114715","857685078","1190608777","2009753717","933937764","844787965","1182559343","91257242","674993537","1896687752","500642904","1151297594","1948347725","2143980090","1321206863","833854624","1229613680","3871385","1641681581","1415343217","1319006138","1388444923","1864877569","800971163","317816934"],"ENTRY_OFFICIAL_OTHER":["1389225289","1504812338","2684055","1111425501","1367527335","2078777661","495302381","20488223","2047790623","73359176","125291520","733383354","1717414505","1924533978","641302619","778119099","2066363404","89722042","1975544690","990000000000000031","990000000000000032","990000000000000033","990000000000000034","990000000000000035","850668692","243215310","1457325425","1228145603","1607620672","1608907783","1808656211","1992870685","1344743776","2037118212","1300161676","1119108321","825450485","901308624","2085038932","883213170","1032356922","634945297","1155871809","917543744","397729049","157757540","222082286","217452855"]};
  Object.keys(parcours).forEach(function (nom) {
    const charge = {};
    parcours[nom].forEach(function (entryId) {
      let d = [descripteurAjoutsDirectsV301_(entryId), descripteurInteractionOfficielleV26_(entryId), plan.descripteurs[entryId], correspondance[entryId]]
        .find(function (c) { return descripteurExisteV302_(c, bundle); });
      if (!d) { try { d = resoudreDescripteurBlocActuel_(formulaire, correspondance, entryId, index) || resoudreDescripteurPlaceholder_(formulaire, correspondance, entryId, index); } catch (e) { throw new Error(nom + ':entry=' + entryId + ':' + e.message); } }
      const id = String(d && typeof d === 'object' ? d.itemId : d || '');
      const item = obtenirItemMemoireV30_(bundle, id);
      const type = item.getType();
      let valeur;
      if (type === FormApp.ItemType.GRID) valeur = item.asGridItem().getColumns()[0];
      else if (type === FormApp.ItemType.MULTIPLE_CHOICE) valeur = item.asMultipleChoiceItem().getChoices()[0].getValue();
      else if (type === FormApp.ItemType.CHECKBOX) valeur = [item.asCheckboxItem().getChoices()[0].getValue()];
      else if (type === FormApp.ItemType.LIST) valeur = item.asListItem().getChoices()[0].getValue();
      else if (type === FormApp.ItemType.SCALE) valeur = String(item.asScaleItem().getLowerBound());
      else valeur = 'Vérification technique sans soumission';
      charge[entryId] = valeur;
    });
    const brouillon = preparerReponseUltraRapideV30_(formulaire, null, 'verification20261028_' + nom, charge, {}, correspondance, plan, bundle);
    if (brouillon.getId() !== null) throw new Error('VERIFICATION_NE_DOIT_PAS_SOUMETTRE');
    console.log('PREPARATION_OK:' + nom + ';champs=' + Object.keys(charge).length + ';aucune_reponse_envoyee');
  });
}
