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
- Le titre est `رابعًا: الأثر العام للبرنامج`, sans `المدرك`.
- La section `القسم الرابع: فهم البرنامج` contient six questions numérotées.
- Les positions validées des bonnes réponses sont : 2, 3, 4, 2, 3, 4.
- Les choix `استفدت شخصيًا من البرنامج` et `استفاد أحد أفراد أسرتي من البرنامج` restent séparés.
- Les questions d’expérience personnelle ne s’affichent que pour le bénéficiaire personnel.
- L’affirmation `4. بصفة عامة، يحظى برنامج الدعم المباشر للسكن بتأييدي.` reste supprimée.
- La phrase `لن تُعرض الإجابات الصحيحة أثناء الاستبيان.` reste supprimée.
- Le site envoie les réponses au formulaire Google actif identifié dans le fichier principal.
- Les corrections futures doivent préserver toutes les règles ci-dessus.

## Vérification

Exécuter avant toute publication :

```bash
node scripts/verify-questionnaire.mjs
```

La même vérification est lancée automatiquement par GitHub Actions après chaque modification.
