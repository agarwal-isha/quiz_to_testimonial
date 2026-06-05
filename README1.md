# Google form to google sheet via app script
A simple quiz web app built with Google Apps Script. Students enter their name, an image URL, and their opinion on AI tools, then answer three beginner-level multiple-choice questions about Claude. On submit, the app scores the quiz and writes a row to a Google Sheet named **Testimonial**.

## Features

- Collects student **name**, **image URL**, and a free-text **AI opinion**
- Three MCQ questions worth **2 marks each** (6 total)
- Auto-scores answers on submit and shows the result to the student
- Appends each submission as a row in the **Testimonial** sheet
- Creates the header row automatically on the first submission

## Files

| File | Purpose |
|------|---------|
| `Code.gs` | Server-side logic: serves the form, scores the quiz, writes rows to the sheet |
| `form.html` | The form UI shown to students |

## Sheet columns

Rows are written in this order:

```
Timestamp | Name | AI Opinion | Image URL | Score
```

## Setup

1. Create (or open) a Google Sheet and rename it **Testimonial**.
2. Copy its **Sheet ID** from the URL — the long string between `/d/` and `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
   ```
3. Open the Apps Script editor: **Extensions → Apps Script**.
4. Add the two files from this repo:
   - Paste `Code.gs` into the default script file.
   - Click **+ → HTML** and create a file named exactly **`form`**, then paste in `form.html`.
5. In `Code.gs`, set your Sheet ID:
   ```javascript
   const ss = SpreadsheetApp.openById('YOUR_SHEET_ID_HERE');
   ```
6. **Save** the project.

## Deployment

1. Click **Deploy → New deployment**.
2. Select type **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** and authorize the app when prompted.
5. Copy the **Web app URL** and share it with students.

> **Re-deploying after edits:** Saving code is not enough. Whenever you change `Code.gs` or `form.html`, go to **Deploy → Manage deployments → (edit/pencil icon) → Version: New version → Deploy**, or the live app will keep running the old version.

## Usage

1. Open the web app URL.
2. Fill in name, image URL, and the AI opinion field.
3. Answer all three questions and click **Submit**.
4. The score appears on screen, and a new row is added to the **Testimonial** sheet.

## Customizing the quiz

The correct answers live in `Code.gs`:

```javascript
const ANSWER_KEY = { q1: 'b', q2: 'b', q3: 'c' };
```

If you reword a question or change its options, update the matching value here so scoring stays accurate.

## Notes

- This is a **web app**, not a native Google Form. A native Form cannot write custom rows to an existing sheet, which is why Apps Script is used.
- **Who has access: Anyone** means anyone with the link can submit. Fine for a class — but don't post the URL publicly, or you may collect junk submissions.
