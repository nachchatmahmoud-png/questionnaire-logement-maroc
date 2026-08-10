/**
 * Synchronisation automatique Google Form -> Google Sheets.
 *
 * À exécuter UNE SEULE FOIS : installerSynchronisationAutomatique
 *
 * Ensuite :
 * - chaque envoi est synchronisé immédiatement ;
 * - toutes les minutes, la feuille est reconstruite depuis les réponses
 *   encore présentes dans Google Forms ;
 * - une réponse supprimée dans Google Forms disparaît donc aussi des onglets
 *   « Réponses au formulaire » et « Réponses utiles » ;
 * - la numérotation de « Réponses utiles » repart toujours de 1.
 */

const SYNCHRO_REPONSES = Object.freeze({
  formId: '1Q5pRbUvCAIlI556txfiM_z1qInuVQ4854IjOdVMUnLo',
  spreadsheetId: '1VcNjC6_eF-9GiKALC7lVvgE1q_F3RM6CJUcs4RKyt-Q',
  rawSheetName: 'Réponses au formulaire',
  usefulSheetName: 'Réponses utiles',
  handler: 'synchroniserReponsesAutomatiquement'
});

const REPONSES_CORRECTES_COMPREHENSION = Object.freeze({
  '1. ما الذي يقدمه برنامج الدعم المباشر للسكن؟':
    'دعماً مالياً للمساعدة على اقتناء سكن',
  '2. السكن الذي يتم اقتناؤه في إطار البرنامج يجب أن يكون:':
    'سكناً رئيسياً للمستفيد',
  '3. أي من الحالات التالية يتعارض مع شروط الاستفادة من البرنامج؟':
    'سبق الاستفادة من دعم أو امتياز من الدولة في مجال السكن',
  '4. أي من العبارات التالية صحيحة بخصوص مبلغ الدعم؟':
    '100.000 درهم للسكن الذي لا يتجاوز ثمنه 300.000 درهم، و70.000 درهم للسكن الذي يفوق ثمنه 300.000 درهم ولا يتجاوز 700.000 درهم',
  '5. ما الذي تتيحه منصة «دعم سكن» للراغبين في الاستفادة من البرنامج؟':
    'تقديم طلب الاستفادة وتتبع مراحل الملف',
  '6. بعد الموافقة الأولية على طلب الاستفادة، تُستكمل إجراءات طلب الدعم عن طريق:':
    'الموثق'
});

/**
 * Fonction à lancer une seule fois depuis l’éditeur Apps Script.
 */
function installerSynchronisationAutomatique() {
  const form = FormApp.openById(SYNCHRO_REPONSES.formId);
  const spreadsheet = SpreadsheetApp.openById(SYNCHRO_REPONSES.spreadsheetId);

  exigerOnglet_(spreadsheet, SYNCHRO_REPONSES.rawSheetName);
  exigerOnglet_(spreadsheet, SYNCHRO_REPONSES.usefulSheetName);

  const anciensNoms = [
    SYNCHRO_REPONSES.handler,
    'synchroniserReponses',
    'synchroniserSuppressions',
    'synchroniserLesSuppressions',
    'actualiserReponsesUtiles'
  ];

  ScriptApp.getProjectTriggers().forEach(trigger => {
    const memeFonction = anciensNoms.includes(trigger.getHandlerFunction());
    let memeFormulaire = false;
    try {
      memeFormulaire = trigger.getTriggerSourceId() === SYNCHRO_REPONSES.formId;
    } catch (error) {
      memeFormulaire = false;
    }
    if (memeFonction || memeFormulaire) ScriptApp.deleteTrigger(trigger);
  });

  ScriptApp.newTrigger(SYNCHRO_REPONSES.handler)
    .forForm(form)
    .onFormSubmit()
    .create();

  ScriptApp.newTrigger(SYNCHRO_REPONSES.handler)
    .timeBased()
    .everyMinutes(1)
    .create();

  synchroniserReponsesAutomatiquement();

  Logger.log('SYNCHRONISATION_AUTOMATIQUE_INSTALLEE');
  Logger.log('FORM_ID: ' + SYNCHRO_REPONSES.formId);
  Logger.log('SPREADSHEET_ID: ' + SYNCHRO_REPONSES.spreadsheetId);
  Logger.log('DECLENCHEURS: envoi du formulaire + chaque minute');
}

/**
 * Ne pas lancer manuellement après l’installation : les déclencheurs le font.
 */
function synchroniserReponsesAutomatiquement() {
  const verrou = LockService.getScriptLock();
  if (!verrou.tryLock(25000)) return;

  try {
    const form = FormApp.openById(SYNCHRO_REPONSES.formId);
    const spreadsheet = SpreadsheetApp.openById(SYNCHRO_REPONSES.spreadsheetId);
    const rawSheet = exigerOnglet_(spreadsheet, SYNCHRO_REPONSES.rawSheetName);
    const usefulSheet = exigerOnglet_(spreadsheet, SYNCHRO_REPONSES.usefulSheetName);

    const schema = construireSchemaReponses_(form);
    const rawHeaders = lireEntetesNonVides_(rawSheet);

    if (rawHeaders.length !== schema.length + 1) {
      throw new Error(
        'Structure inattendue : ' + rawHeaders.length +
        ' colonnes dans Sheets contre ' + (schema.length + 1) +
        ' attendues depuis Google Forms.'
      );
    }

    const responses = form.getResponses().slice().sort((a, b) =>
      a.getTimestamp().getTime() - b.getTimestamp().getTime()
    );

    const rawRows = responses.map(response =>
      construireLigneBrute_(response, schema)
    );

    remplacerDonnees_(rawSheet, rawRows, rawHeaders.length);
    rawSheet.setFrozenRows(1);
    rawSheet.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');

    const usefulRows = construireLignesUtiles_(rawRows, rawHeaders);
    remplacerDonneesUtiles_(usefulSheet, usefulRows);

    SpreadsheetApp.flush();
    Logger.log(
      'SYNCHRONISATION_OK | réponses=' + responses.length +
      ' | lignes_utiles=' + usefulRows.length
    );
  } finally {
    verrou.releaseLock();
  }
}

function construireSchemaReponses_(form) {
  const schema = [];
  const typesSimples = [
    'CHECKBOX',
    'DATE',
    'DATETIME',
    'DURATION',
    'LIST',
    'MULTIPLE_CHOICE',
    'PARAGRAPH_TEXT',
    'RATING',
    'SCALE',
    'TEXT',
    'TIME'
  ];

  form.getItems().forEach(item => {
    const type = String(item.getType());
    const itemId = String(item.getId());

    if (type === 'GRID') {
      item.asGridItem().getRows().forEach((row, rowIndex) => {
        schema.push({ itemId, type, rowIndex, row });
      });
      return;
    }

    if (type === 'CHECKBOX_GRID') {
      item.asCheckboxGridItem().getRows().forEach((row, rowIndex) => {
        schema.push({ itemId, type, rowIndex, row });
      });
      return;
    }

    if (typesSimples.includes(type)) {
      schema.push({ itemId, type, rowIndex: null, row: null });
    }
  });

  return schema;
}

function construireLigneBrute_(formResponse, schema) {
  const valuesByItemId = {};

  formResponse.getItemResponses().forEach(itemResponse => {
    valuesByItemId[String(itemResponse.getItem().getId())] =
      itemResponse.getResponse();
  });

  const row = [formResponse.getTimestamp()];

  schema.forEach(column => {
    const response = valuesByItemId[column.itemId];

    if (column.type === 'GRID' || column.type === 'CHECKBOX_GRID') {
      const rowResponse = Array.isArray(response)
        ? response[column.rowIndex]
        : '';
      row.push(convertirValeurCellule_(rowResponse));
      return;
    }

    row.push(convertirValeurCellule_(response));
  });

  return row;
}

function convertirValeurCellule_(value) {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) {
    return value
      .map(element => Array.isArray(element) ? element.join(', ') : element)
      .filter(element => element !== '' && element !== null && element !== undefined)
      .join(', ');
  }
  return value;
}

function construireLignesUtiles_(rawRows, rawHeaders) {
  const rows = [];

  rawRows.forEach((rawRow, responseIndex) => {
    for (let columnIndex = 1; columnIndex < rawHeaders.length; columnIndex++) {
      const answer = rawRow[columnIndex];
      if (answer === '' || answer === null || answer === undefined) continue;

      const question = rawHeaders[columnIndex];
      rows.push([
        rawRow[0],
        responseIndex + 1,
        question,
        answer,
        calculerScore_(question, answer)
      ]);
    }
  });

  return rows;
}

function calculerScore_(question, answer) {
  const likert = String(answer).match(/^\s*([1-5])\s*(?:—|-)/);
  if (likert) return Number(likert[1]);

  const correctAnswer = REPONSES_CORRECTES_COMPREHENSION[question];
  if (correctAnswer !== undefined) return String(answer) === correctAnswer ? 1 : 0;

  return '';
}

function remplacerDonnees_(sheet, rows, columnCount) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, columnCount).clearContent();
  }

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, columnCount).setValues(rows);
  }
}

function remplacerDonneesUtiles_(sheet, rows) {
  const headers = [['Horodatage', 'Réponse n°', 'Question', 'Réponse', 'Score']];
  sheet.getRange(1, 1, 1, 5).setValues(headers);

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 5).clearContent();
  }

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 5).setValues(rows);
  }

  sheet.setFrozenRows(1);
  sheet.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
}

function lireEntetesNonVides_(sheet) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  while (headers.length > 0 && headers[headers.length - 1] === '') headers.pop();
  return headers;
}

function exigerOnglet_(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error('Onglet introuvable : ' + sheetName);
  return sheet;
}

