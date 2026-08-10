# Règles stables du questionnaire

Le fichier canonique du site est `assets/questionnaire-final-20260807.js`.
Toute modification doit partir de sa version la plus récente. Il ne faut jamais remplacer
ce fichier par une copie ancienne ni placer une correction fonctionnelle uniquement dans
un fichier correctif temporaire.

## Règles validées

- Le site ne demande pas l’adresse e-mail personnelle.
- La légende Likert complète apparaît une seule fois par page concernée.
- Les chiffres et libellés de l’échelle ne sont pas répétés dans les tableaux, y compris sur mobile.
- Les cinq colonnes des tableaux conservent des libellés accessibles invisibles.
- Le titre est `رابعًا: الأثر العام للبرنامج`, sans `المدرك`.
- La section `القسم الرابع: فهم البرنامج` contient six questions numérotées.
- Les positions validées des bonnes réponses sont : 2, 3, 4, 2, 3, 4.
- Les choix `استفدت شخصيًا من البرنامج` et `استفاد أحد أفراد أسرتي من البرنامج` restent séparés.
- Les questions d’expérience personnelle ne s’affichent que pour le bénéficiaire personnel.
- Le site envoie les réponses au formulaire Google actif identifié dans le fichier principal.
- Les corrections futures doivent préserver toutes les règles ci-dessus.

## Vérification

Exécuter avant toute publication :

```bash
node scripts/verify-questionnaire.mjs
```

La même vérification est lancée automatiquement par GitHub Actions après chaque modification.
