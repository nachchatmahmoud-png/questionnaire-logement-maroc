# Questionnaire logement Maroc

Interface publique d’un questionnaire académique consacré à la communication publique autour du **Programme d’aide directe au logement au Maroc**.

**Site public :** https://nachchatmahmoud-png.github.io/questionnaire-logement-maroc/

Ce README explique en détail comment le questionnaire a été construit, comment fonctionne sa logique conditionnelle, comment les réponses sont préparées pour Google Forms et comment le site est publié avec GitHub Pages.

---

## 1. Objectif du projet

L’objectif était de transformer un questionnaire académique classique en une interface web plus claire, plus agréable à utiliser et mieux adaptée à une enquête de recherche.

Le questionnaire devait notamment permettre :

- un affichage intégralement en arabe et de droite à gauche (`RTL`) ;
- une présentation professionnelle adaptée à un travail doctoral ;
- une navigation par sections ;
- des questions conditionnelles selon les réponses précédentes ;
- une échelle de Likert homogène à 5 modalités ;
- la distinction entre absence d’expérience, réponse négative et question non applicable ;
- le calcul de plusieurs scores analytiques ;
- la collecte des réponses à travers Google Forms ;
- une publication publique gratuite avec GitHub Pages ;
- une interface utilisable sur ordinateur et sur téléphone.

---

# 2. Architecture générale

Le questionnaire n’est pas un Google Form affiché directement dans une page. Il s’agit d’une **interface web personnalisée en HTML, CSS et JavaScript**, reliée ensuite à Google Forms pour la validation finale et la collecte des données.

L’architecture est la suivante :

```text
Utilisateur
   │
   ▼
GitHub Pages
   │
   ▼
index.html
   │
   ├── CSS principal
   ├── questionnaire-final-20260807.js
   ├── ui-cleanup-20260807.js
   └── google-form-final-validation-20260807.js
                 │
                 ▼
             Google Forms
```

Le dépôt contient donc une couche de **présentation**, une couche de **logique du questionnaire** et une couche de **connexion avec Google Forms**.

---

# 3. Les principaux fichiers

## `index.html`

C’est le point d’entrée du site.

Il définit notamment :

- la langue arabe ;
- le sens d’écriture `RTL` ;
- les métadonnées de la page ;
- le chargement du CSS ;
- le chargement des scripts JavaScript ;
- un message de secours si le questionnaire ne démarre pas correctement.

Extrait simplifié :

```html
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

Le questionnaire est ensuite construit dynamiquement dans l’élément :

```html
<div id="root"></div>
```

---

## `assets/questionnaire-final-20260807.js`

C’est le **moteur principal du questionnaire**.

Il contient :

- toutes les questions ;
- les modalités de réponse ;
- les sections ;
- les règles conditionnelles ;
- les contrôles des champs obligatoires ;
- la navigation suivant/précédent ;
- les calculs de scores ;
- la préparation des données destinées au formulaire Google.

Le questionnaire fonctionne autour d’un objet d’état simplifié :

```javascript
const state = {
  a: {},
  step: 'filters',
  intro: true,
  error: '',
  sending: false,
  done: false
};
```

`state.a` contient les réponses du participant.

Par exemple :

```javascript
state.a.q1 = 'نعم';
state.a.status = 'استفدت من البرنامج';
state.a.trust_1 = '4';
```

Cette méthode permet de conserver toutes les réponses dans un même objet et de recalculer immédiatement l’interface lorsqu’une réponse change.

---

## `assets/ui-cleanup-20260807.js`

Ce fichier est consacré à la **présentation et aux ajustements visuels**.

Il sert notamment à :

- alléger les titres trop gras ;
- distinguer visuellement titre principal, titre de section, sous-section et question ;
- améliorer les espacements ;
- améliorer l’affichage mobile ;
- harmoniser les cartes et les tableaux ;
- masquer le champ e-mail hérité de l’ancienne logique du questionnaire.

La hiérarchie typographique a volontairement été différenciée :

```css
.hero h1 {
  font-weight: 750;
}

.section-heading h2 {
  font-weight: 700;
}

.group-card h3 {
  font-weight: 650;
}

.question-card legend {
  font-weight: 560;
}
```

Le but est d’éviter que tous les textes apparaissent avec le même niveau de graisse.

---

## `assets/google-form-final-validation-20260807.js`

Ce fichier relie l’interface personnalisée au **Google Form réel**.

Au lieu de simplement envoyer silencieusement les réponses vers `formResponse`, le script intercepte l’envoi final et ouvre le formulaire Google avec les champs compatibles préremplis.

Principe :

```javascript
const FORM_VIEW =
  `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`;
```

Les valeurs du formulaire sont transformées en paramètres :

```javascript
const params = new URLSearchParams();
params.set('usp', 'pp_url');
```

Puis le répondant est dirigé vers Google Forms :

```javascript
window.location.assign(`${FORM_VIEW}?${params.toString()}`);
```

Cette étape permet de laisser **Google Forms assurer la validation finale**.

> Important : l’option **« Limiter à 1 réponse »** doit être activée directement dans les paramètres du Google Form si l’on souhaite appliquer la règle « un compte Google = une réponse ».

---

# 4. Création de la structure du questionnaire

Le questionnaire a été organisé en sections plutôt qu’en une très longue page.

Les sections actuelles comprennent notamment :

1. informations initiales sur la relation du répondant avec le programme ;
2. transparence des informations officielles ;
3. communication et interaction avec le ministère ;
4. compréhension du programme ;
5. confiance dans le ministère ;
6. légitimité du programme ;
7. évaluation du programme ;
8. impact personnel pour les bénéficiaires ;
9. suggestions ;
10. informations sociodémographiques.

Les titres sont gérés dans un objet JavaScript :

```javascript
const stepTitles = {
  filters: 'القسم الأول: معلومات أولية حول علاقتكم بالبرنامج',
  information: 'القسم الثاني: شفافية المعلومات الرسمية المتعلقة بالبرنامج',
  interaction: 'القسم الثالث: التواصل والتفاعل مع الوزارة حول البرنامج',
  understanding: 'القسم الرابع: فهم البرنامج',
  trust: 'القسم الخامس: الثقة في الوزارة',
  legitimacy: 'القسم السادس: مشروعية البرنامج',
  evaluation: 'القسم السابع: تقييم البرنامج',
  impact: 'القسم الثامن: أثر الاستفادة من البرنامج على الوضع السكني',
  suggestions: 'القسم التاسع: مقترحاتكم',
  demographics: 'القسم العاشر: معلومات عامة'
};
```

---

# 5. Logique conditionnelle

Une partie importante du travail a consisté à ne pas poser les mêmes questions à tous les répondants.

La fonction `steps()` détermine les sections réellement applicables.

Exemple de logique :

```javascript
function steps() {
  let s = ['filters'];

  if (val('q1') === 'نعم' && val('q2') === 'نعم') {
    s.push(
      'information',
      'interaction',
      'understanding',
      'trust',
      'legitimacy',
      'evaluation'
    );

    if (beneficiary()) {
      s.push('impact');
    }

    s.push('suggestions', 'demographics');
  }

  return s;
}
```

Cette architecture évite d’afficher des questions qui n’ont pas de sens pour le répondant.

---

# 6. Exemple : première question filtre

La première question demande si le répondant connaît le Programme d’aide directe au logement.

```text
س1. هل سبق لكم أن سمعتم ببرنامج الدعم المباشر للسكن؟
```

Réponses :

```text
نعم
لا
```

Si la personne répond **« لا »**, le questionnaire s’arrête immédiatement.

C’est un choix méthodologique important : une personne qui n’a jamais entendu parler du programme ne doit pas être obligée d’évaluer sa transparence, son fonctionnement ou sa communication.

---

# 7. Deuxième filtre : exposition aux sources officielles

La seconde question distingue les personnes ayant consulté des informations officielles de celles ayant seulement connu le programme par d’autres sources.

Si la réponse est **oui**, le questionnaire propose les sources officielles :

- plateforme `دعم سكن` ;
- application mobile ;
- site officiel du ministère ;
- comptes officiels sur les réseaux sociaux.

Si la réponse est **non**, le questionnaire présente plutôt des sources externes :

- télévision ou radio ;
- presse ;
- réseaux sociaux non officiels ;
- famille, amis ou connaissances.

Cette distinction permet de ne pas demander à une personne d’évaluer une communication officielle qu’elle n’a jamais consultée.

---

# 8. Échelle de Likert à cinq modalités

Toutes les variables d’opinion principales utilisent la même échelle :

```javascript
const SCALE = [
  ['1', 'لا أوافق إطلاقًا'],
  ['2', 'لا أوافق'],
  ['3', 'لا أوافق ولا أعارض'],
  ['4', 'أوافق'],
  ['5', 'أوافق تمامًا']
];
```

Soit :

| Valeur | Modalité |
|---|---|
| 1 | لا أوافق إطلاقًا |
| 2 | لا أوافق |
| 3 | لا أوافق ولا أعارض |
| 4 | أوافق |
| 5 | أوافق تمامًا |

Le questionnaire évite d’ajouter automatiquement une modalité du type « je ne sais pas » à toutes les questions.

Lorsqu’une question n’est pas applicable à une personne, elle est **masquée par la logique conditionnelle** plutôt que transformée artificiellement en réponse négative.

---

# 9. Construction des tableaux Likert

Les séries d’affirmations sont affichées dans de vrais tableaux HTML.

Structure simplifiée :

```html
<table class="likert-table">
  <thead>
    <tr>
      <th>العبارة</th>
      <th>1</th>
      <th>2</th>
      <th>3</th>
      <th>4</th>
      <th>5</th>
    </tr>
  </thead>
</table>
```

Sur téléphone, le tableau peut défiler horizontalement :

```css
.likert-wrap {
  overflow-x: auto;
}
```

Cela évite de réduire excessivement les textes arabes sur les petits écrans.

---

# 10. Section « interaction avec le ministère »

Cette partie distingue plusieurs concepts différents.

### Possibilité de communication

Exemples :

- possibilité d’adresser une question au ministère ;
- possibilité de demander une clarification ;
- possibilité de poursuivre l’échange si nécessaire.

### Possibilité de participation

Exemples :

- présenter des observations ;
- proposer des améliorations ;
- exprimer des difficultés ou déposer une plainte.

### Expérience réelle de contact

Une question supplémentaire demande si le répondant a réellement utilisé l’un des canaux officiels.

Si la réponse est **non**, aucune évaluation de la qualité d’une réponse administrative n’est demandée.

Si la réponse est **oui**, le questionnaire demande :

1. le canal utilisé ;
2. si une réponse a été reçue ;
3. uniquement si une réponse a été reçue : clarté, suffisance et délai de cette réponse.

Cette logique évite de confondre :

- absence de contact ;
- absence de réponse ;
- mauvaise qualité de réponse.

---

# 11. Mesure objective de la compréhension

La compréhension du programme n’est pas évaluée uniquement par une opinion subjective.

Six questions de connaissance sont utilisées sous forme de quiz.

Chaque question possède une réponse correcte définie dans le code :

```javascript
[
  'understanding_1',
  'ما الذي يقدمه برنامج الدعم المباشر للسكن؟',
  [...options],
  'دعماً مالياً للمساعدة على اقتناء سكن'
]
```

Le score est calculé automatiquement :

```javascript
understanding: quiz.reduce(
  (score, [id,,, correct]) =>
    score + (val(id) === correct ? 1 : 0),
  0
)
```

Le résultat varie donc de :

```text
0 à 6
```

Le score n’est pas affiché au répondant pendant le questionnaire.

---

# 12. Calcul des scores analytiques

Plusieurs dimensions sont calculées automatiquement à partir de la moyenne des réponses correspondantes.

Exemples :

- possibilité de communication ;
- possibilité de participation ;
- confiance ;
- légitimité ;
- facilité d’accès au programme ;
- satisfaction ;
- impact général perçu ;
- impact personnel.

Fonction générique :

```javascript
function mean(ids) {
  let nums = ids
    .map(id => Number(val(id)))
    .filter(Number.isFinite);

  return nums.length === ids.length
    ? nums.reduce((a, b) => a + b, 0) / nums.length
    : null;
}
```

Ainsi, une dimension n’est calculée que lorsque tous les items nécessaires sont présents.

---

# 13. Gestion des questions non applicables

Une règle importante du questionnaire consiste à distinguer une vraie réponse d’une donnée structurellement absente.

Par exemple, une personne qui n’est pas bénéficiaire ne doit pas recevoir un score de satisfaction égal à zéro.

Le score doit être :

```javascript
null
```

Le même principe est appliqué pour :

- la satisfaction des non-bénéficiaires ;
- l’impact personnel des non-bénéficiaires ;
- la qualité d’une réponse administrative lorsqu’aucune réponse n’a été reçue.

Cela facilite ensuite l’analyse statistique en évitant de créer artificiellement des réponses négatives.

---

# 14. Validation des questions obligatoires

Avant de passer à la section suivante, le site vérifie les questions requises.

Exemple simplifié :

```javascript
for (const id of requiredIds(state.step)) {
  if (!val(id)) {
    state.error =
      'يرجى الإجابة عن جميع الأسئلة المطلوبة قبل المتابعة.';
    return false;
  }
}
```

Cela évite les questionnaires incomplets tout en respectant les questions conditionnelles.

---

# 15. Navigation entre les sections

Les boutons sont générés selon la position du répondant dans le questionnaire.

```text
السابق
التالي
إرسال الإجابات
```

La barre de progression est recalculée selon les sections réellement applicables au participant.

Par exemple, un non-bénéficiaire n’a pas la section d’impact personnel ; le nombre total d’étapes affiché s’adapte donc à son parcours.

---

# 16. Connexion avec Google Forms

Le projet utilise l’identifiant du Google Form :

```javascript
const GOOGLE_FORM_ID = '...';
```

Les anciennes questions du formulaire Google possèdent des identifiants du type :

```text
entry.1394668946
entry.1229277243
entry.820545804
```

Dans le JavaScript, ils sont stockés dans un objet :

```javascript
const ENTRY = {
  q1: '1394668946',
  q2: '1229277243',
  status: '820545804',
  suggestion: '216640239'
};
```

Lors de la préparation de la réponse, le script construit des champs :

```javascript
input.name = 'entry.' + id;
input.value = value;
```

Les réponses compatibles peuvent ainsi être préremplies dans Google Forms.

---

# 17. Stockage structuré des données supplémentaires

Le questionnaire web contient davantage de variables que l’ancien Google Form.

Pour éviter de perdre ces informations, le code prépare aussi un objet structuré :

```javascript
const payload = {
  schema_version: '2026-08-07-final',
  submitted_at: new Date().toISOString(),
  answers: {...state.a},
  scores: scores(),
  structural_missing: {...}
};
```

Cet objet permet de conserver :

- les réponses détaillées ;
- les scores calculés ;
- les variables conditionnelles ;
- les données structurellement manquantes.

Le champ `schema_version` permet de savoir avec quelle version du questionnaire la réponse a été produite.

---

# 18. Suppression du champ e-mail personnel dans l’interface

Une première version demandait une adresse e-mail personnelle pour empêcher plusieurs participations depuis le même appareil.

Cette approche a ensuite été retirée de l’interface.

Le script `ui-cleanup-20260807.js` masque donc le champ hérité afin que le participant ne soit pas obligé de communiquer son adresse personnelle.

La limitation à une réponse doit plutôt être assurée par Google Forms lorsque l’option correspondante est activée.

---

# 19. Design responsive

Le design a été travaillé pour éviter une présentation trop lourde.

Les principes utilisés sont :

- titre principal visible mais pas surchargé ;
- titres de sections hiérarchisés ;
- questions moins grasses ;
- texte explicatif plus léger ;
- cartes avec bordures discrètes ;
- espace suffisant entre les blocs ;
- tableaux Likert défilables sur téléphone ;
- boutons suffisamment grands pour l’utilisation mobile.

Exemple :

```css
@media (max-width: 700px) {
  .hero h1 {
    font-size: clamp(1.55rem, 7vw, 2rem);
  }

  .question-card {
    border-radius: 14px;
  }
}
```

---

# 20. Gestion du sens arabe RTL

Le document principal utilise :

```html
<html lang="ar" dir="rtl">
```

Cela indique au navigateur :

- que le contenu principal est en arabe ;
- que le sens de lecture est de droite à gauche.

Les tableaux et certains éléments numériques sont ensuite ajustés individuellement lorsque nécessaire.

---

# 21. Publication avec GitHub Pages

Le site est hébergé directement dans ce dépôt GitHub.

La branche utilisée est :

```text
main
```

Le fichier principal est :

```text
/index.html
```

GitHub Pages publie alors le projet à l’adresse :

```text
https://nachchatmahmoud-png.github.io/questionnaire-logement-maroc/
```

Le fichier :

```text
.nojekyll
```

est présent pour indiquer à GitHub Pages de servir le projet comme un site statique sans traitement Jekyll.

---

# 22. Gestion du cache

Lorsqu’un fichier JavaScript est modifié sur GitHub Pages, le navigateur peut parfois conserver une ancienne version.

Pour forcer le chargement d’une nouvelle version, les fichiers sont appelés avec un paramètre de version :

```html
<script src=".../questionnaire-final-20260807.js?v=20260807-access-2"></script>
```

Lors d’une modification importante, il suffit de changer :

```text
?v=20260807-access-2
```

par exemple en :

```text
?v=20260807-access-3
```

Le navigateur considère alors qu’il s’agit d’une nouvelle ressource.

---

# 23. Comment modifier une question

Les textes des questions sont principalement dans :

```text
assets/questionnaire-final-20260807.js
```

Exemple :

```javascript
['trust_1',
 'المعلومات التي تنشرها الوزارة بشأن البرنامج دقيقة وموثوقة.']
```

Pour changer uniquement le texte, il faut conserver l’identifiant :

```text
trust_1
```

et modifier uniquement le libellé.

Il est préférable de ne pas modifier les identifiants après le début de la collecte, car ils servent à l’analyse des données.

---

# 24. Comment ajouter une nouvelle affirmation Likert

Exemple :

```javascript
['trust_6', 'النص الجديد هنا']
```

Il faut ensuite vérifier :

1. qu’elle apparaît dans le bon groupe ;
2. qu’elle est incluse dans les questions obligatoires si nécessaire ;
3. qu’elle est incluse dans le calcul du score si elle appartient à une dimension existante ;
4. que le routage conditionnel reste correct.

---

# 25. Comment ajouter une nouvelle section

Pour ajouter une section, il faut généralement intervenir à quatre endroits :

### 1. Ajouter son titre

```javascript
stepTitles.newSection = 'عنوان القسم الجديد';
```

### 2. Ajouter son contenu

Créer une fonction, par exemple :

```javascript
function newSection() {
  return '...';
}
```

### 3. Ajouter la section dans `steps()`

```javascript
s.push('newSection');
```

### 4. Ajouter son rendu dans `section()`

```javascript
case 'newSection':
  return newSection();
```

Il faut également définir ses questions obligatoires dans `requiredIds()`.

---

# 26. Tests à réaliser après chaque modification

Après chaque modification, il est recommandé de tester au minimum les parcours suivants :

### Parcours A

```text
Q1 = Non
```

Résultat attendu : fin immédiate du questionnaire.

### Parcours B

```text
Q1 = Oui
Q2 = Non
```

Résultat attendu : sources externes uniquement, puis fin du parcours correspondant.

### Parcours C

```text
Q1 = Oui
Q2 = Oui
Statut = bénéficiaire
```

Résultat attendu : questionnaire complet + satisfaction + impact personnel.

### Parcours D

```text
Q1 = Oui
Q2 = Oui
Statut = non-bénéficiaire
```

Résultat attendu : aucune question de satisfaction personnelle ou d’impact personnel non applicable.

### Parcours E

```text
Contact réel = Non
```

Résultat attendu : aucune question sur la qualité de la réponse du ministère.

### Parcours F

```text
Contact réel = Oui
Réponse reçue = Non
```

Résultat attendu : le questionnaire enregistre l’absence de réponse mais ne demande pas d’évaluer la clarté ou le délai d’une réponse inexistante.

---

# 27. Bonnes pratiques méthodologiques utilisées

Le questionnaire suit plusieurs principes importants pour la qualité des données :

- ne pas confondre une question non applicable avec une réponse négative ;
- utiliser la même échelle pour les construits comparables ;
- ne pas forcer les personnes non exposées à évaluer la communication officielle ;
- distinguer perception et connaissance objective ;
- calculer les scores à partir d’items clairement identifiés ;
- conserver les identifiants techniques stables ;
- ne pas dupliquer les mêmes variables dans plusieurs sections ;
- adapter le parcours au profil du répondant ;
- éviter de recueillir une donnée personnelle si elle n’est pas nécessaire.

---

# 28. Résumé technique

Le projet repose finalement sur quatre éléments complémentaires :

| Élément | Fonction |
|---|---|
| `index.html` | charge l’application et définit la page |
| `questionnaire-final-20260807.js` | questions, navigation, logique, scores |
| `ui-cleanup-20260807.js` | design et ajustements d’interface |
| `google-form-final-validation-20260807.js` | passage final vers Google Forms |
| GitHub Pages | hébergement public du questionnaire |
| Google Forms | validation et collecte finale |

---

# 29. Adresse du questionnaire

Le questionnaire est publié ici :

**https://nachchatmahmoud-png.github.io/questionnaire-logement-maroc/**

---

# 30. Principe général à retenir

La méthode utilisée peut être résumée ainsi :

```text
1. Définir la méthodologie du questionnaire
2. Transformer les questions en structures JavaScript
3. Créer les règles conditionnelles
4. Construire l’interface HTML dynamique
5. Appliquer une échelle Likert homogène
6. Calculer automatiquement les scores
7. Adapter le design à l’arabe et au mobile
8. Relier les réponses aux champs Google Forms
9. Utiliser Google Forms pour la validation finale
10. Publier le site sur GitHub Pages
11. Tester tous les parcours conditionnels
```

Cette architecture permet de conserver la simplicité de Google Forms pour la collecte tout en bénéficiant d’une interface de questionnaire beaucoup plus personnalisée et d’une logique méthodologique plus fine.