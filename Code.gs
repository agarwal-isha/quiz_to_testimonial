const SHEET_NAME = 'Testimonial';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('form')
    .setTitle('Claude Basics Quiz')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Correct answers: q1=b, q2=b, q3=c  (2 marks each)
const ANSWER_KEY = { q1: 'b', q2: 'b', q3: 'c' };

function submitForm(data) {
  let score = 0;
  if (data.q1 === ANSWER_KEY.q1) score += 2;
  if (data.q2 === ANSWER_KEY.q2) score += 2;
  if (data.q3 === ANSWER_KEY.q3) score += 2;

  const ss = SpreadsheetApp.openById('YOUR_SHEET_ID_HERE');
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  // Add header row once
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'AI Opinion', 'Image URL', 'Score']);
  }

  sheet.appendRow([
    new Date(),
    data.name,
    data.opinion,
    data.imageUrl,
    score + ' / 6'
  ]);

  return { score: score, total: 6 };
}
