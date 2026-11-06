# Règles stables du questionnaire

Le fichier canonique du site est `assets/questionnaire.js`.
Toute modification doit partir de sa version la plus récente. Il ne faut jamais remplacer
ce fichier par une copie ancienne ni placer une correction fonctionnelle uniquement dans
un fichier correctif temporaire.
`index.html` ne doit charger qu’un seul fichier JavaScript fonctionnel : `assets/questionnaire.js`.

## Règles validées

- Le site ne demande pas l’adresse e-mail personnelle.
- La légende Likert complète apparaît une seule fois par page concernée.
- Les numéros 1 à 5 restent visibles dans les tableaux sur ordinateur et sur mobile.
- La légende Likert complète apparaît une seule fois par page, sans masquer les colonnes du tableau.
- La version mobile affiche le même contenu que la version ordinateur.
- Sur mobile, le tableau conserve ses six colonnes : 45 % pour `العبارة` et 11 % pour chacune des mesures 1 à 5.
- Le titre est `رابعًا: الأثر العام للبرنامج`, sans `المدرك`.
- La section `القسم الرابع: فهم البرنامج` contient six questions numérotées.
- Les positions validées des bonnes réponses sont : 2, 3, 4, 2, 3, 4.
- Les choix `استفدت شخصيًا من البرنامج` et `استفاد أحد أفراد أسرتي من البرنامج` restent séparés.
- Les questions d’expérience personnelle ne s’affichent que pour le bénéficiaire personnel.
- L’affirmation `4. بصفة عامة، يحظى برنامج الدعم المباشر للسكن بتأييدي.` reste supprimée.
- La phrase `لن تُعرض الإجابات الصحيحة أثناء الاستبيان.` reste supprimée.
- La section 3 contient `التقييم العام لإمكانية التفاعل مع الوزارة` avec l’affirmation numérotée 7 et une échelle de 1 à 5.
- La section 3 contient `التقييم العام لجودة تواصل الوزارة` avec une échelle de 1 à 5.
- Toutes les échelles du questionnaire comportent exclusivement les cinq modalités de 1 à 5 ; l’option `لا أعرف / لا أستطيع التقييم` est interdite.
- Ces deux évaluations sont obligatoires et leurs réponses sont envoyées au formulaire Google.
- Dans la section 3, les deux évaluations générales apparaissent après le parcours de contact réel et avant la compréhension.
- La réponse `لا` à `هل توصلتم برد بشأن هذا التواصل؟` conduit aux deux évaluations générales, puis à la compréhension.
- La réponse `نعم` conduit d’abord à l’évaluation du retour reçu, puis aux deux évaluations générales et à la compréhension.
- Les questions, affirmations et choix de réponse du site doivent correspondre mot pour mot à ceux du Google Form.
- Les valeurs du statut et du canal sont envoyées directement, sans conversion vers d’anciennes formulations.
- L’instruction de la section 3 sur les canaux interactifs conserve mot pour mot la formulation validée commençant par `يرجى الإجابة بناءً على معرفتكم أو تجربتكم`.
- Le site envoie les réponses au formulaire Google actif identifié dans le fichier principal.
- Les corrections futures doivent préserver toutes les règles ci-dessus.

## Protection de la publication

- Dans la question `ما السبب الرئيسي الذي دفعكم إلى التواصل مع الوزارة بشأن البرنامج؟`, le choix `سبب آخر، يرجى تحديده:` affiche une zone de précision obligatoire. Le texte saisi est conservé lors de la navigation, effacé si un autre motif ou une autre branche est sélectionné, puis envoyé dans le champ du motif correspondant au parcours actif.
- Avant de publier ce champ, exécuter une fois `ACTIVER_SAISIE_AUTRE_MOTIF_CONTACT_20261106()` depuis `apps-script/activer-saisie-autre-motif-contact-20261106.gs` dans le projet de contrôle existant. Cette fonction active la réponse libre sur les questions du motif de contact et vérifie un brouillon sans soumettre de réponse. Le service d'envoi existant peut ensuite recevoir ces précisions sans redéploiement Apps Script.
- Chaque choix « autre » affiche une zone de texte obligatoire et éditable, avec le curseur placé dans la zone après la sélection. Cette règle couvre huit précisions distinctes : canal public préféré, source officielle, source externe, motif de non-exposition à la communication officielle, motif de contact, motif de non-contact, canal de contact et situation de logement.
- Le choix `مصدر رسمي آخر` comme source principale réutilise la précision de la source officielle cochée. Changer de source principale conserve cette précision tant que la source reste cochée.
- Les huit précisions acceptent jusqu'à 500 caractères, conservent le texte pendant la navigation et refusent une réponse composée uniquement d'espaces. Choisir une réponse fixe ou abandonner la branche correspondante efface la précision devenue inapplicable.
- Les motifs de contact et de non-contact ainsi que la situation de logement transmettent le texte libre dans leur champ Google Forms. Les sources et le canal de contact conservent leur modalité de classement et transmettent la précision dans le champ complémentaire associé. Le canal préféré et le motif de non-exposition transmettent directement la précision.
- Avant de publier les huit saisies, exécuter `ACTIVER_ET_VERIFIER_TOUS_CHAMPS_AUTRES_20261106()` depuis `apps-script/verifier-tous-champs-autres-20261106.gs` dans le projet existant. Ce contrôle active la réponse libre sur les onze questions concernées, puis vérifie les huit catégories dans un brouillon préparé par le service d'envoi, sans soumettre de réponse. Aucun redéploiement Apps Script n'est nécessaire.

- GitHub Pages publie uniquement le contenu validé de la branche `main` et ne modifie pas les fichiers source.
- Le déploiement attend obligatoirement la réussite de `scripts/verify-ui-lock.mjs`, `scripts/verify-contact-reason-other.mjs` et `scripts/verify-all-other-fields.mjs`.
- Si une mise à jour réintroduit une ancienne copie ou enfreint une règle protégée, le déploiement échoue et la dernière version publique valide reste en ligne.
- Une empreinte sémantique protège l’ensemble des titres, affirmations, choix et groupes du questionnaire, indépendamment des changements de mise en page.
- Toute modification volontaire d’une règle protégée doit mettre à jour simultanément le questionnaire, le validateur et ce document.

## Vérification

Exécuter avant toute publication :

```bash
node --check assets/questionnaire.js
node scripts/verify-ui-lock.mjs
node scripts/verify-contact-reason-other.mjs
node scripts/verify-all-other-fields.mjs
```

La même vérification est lancée automatiquement par GitHub Actions après chaque modification.

