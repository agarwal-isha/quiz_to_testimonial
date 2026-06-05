# Automated Student Card Generator

## Project Overview

An end-to-end automation that turns Google Form quiz submissions into branded image cards — with zero manual work after setup. When a student submits the quiz, their details are automatically captured, processed, and rendered into a personalized card image which is saved directly to Google Drive.

---

## How It Works

When a student submits the quiz form, their response (Name, Image URL, and AI Opinion) is captured in a linked Google Sheet. An n8n workflow detects the new row, maps the relevant fields, and feeds them into an HTML/CSS template — name at the top, the student's image on the right, and their written response below. This template is rendered into a finished image card using the htmlcsstoimage (HCTI) API. The generated image is then downloaded and saved into a designated Google Drive folder automatically.

---

## Pipeline

```
Google Form → Google Sheet → n8n Trigger → Field Mapping → HTML to Image → Download Image → Save to Google Drive
```

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Google Forms | Student quiz submission |
| Google Sheets | Stores form responses automatically |
| Google Apps Script | Links form to sheet reliably using Sheet ID |
| n8n Cloud | Workflow orchestration and automation |
| htmlcsstoimage (HCTI) API | Renders HTML/CSS template into a PNG image card |
| Google Drive | Final storage for generated image cards |

---

## Workflow Nodes (n8n)

1. **Google Sheets Trigger** — Detects when a new row is added (on form submit), polls every minute.
2. **Map Fields** — Maps sheet columns (Name, Image URL, AI Opinion) and captures the row number for later reference.
3. **HTML to Image** — Sends the mapped data to the HCTI API via HTTP POST, returns a generated image URL.
4. **Download Image** — Fetches the actual image file from the HCTI URL via HTTP GET (Response Format: File).
5. **Upload to Google Drive** — Uploads the downloaded image binary to a specified Drive folder, named after the student.

---

## Card Layout

```
+-----------------------------+
|  Student Name               |
|                  [ Image ]  |
|                             |
|  AI Opinion text goes here  |
|  below the image, full      |
|  width across the card.     |
+-----------------------------+
```

- **Name** — top, full width, large heading
- **Student Image** — right side, fetched from the submitted public URL
- **AI Opinion** — below, full width, readable body text

---

## Google Sheet Columns

| Column | Description |
|--------|-------------|
| `Name` | Student's full name |
| `Image URL` | Publicly accessible image link submitted by student |
| `AI Opinion` | Student's long-form written answer |

---

## Key Challenges Solved

- **Apps Script targeting issue** — `getActiveSpreadsheet()` was unreliable in standalone scripts. Fixed by switching to `SpreadsheetApp.openById('SHEET_ID')` for a stable, direct reference.
- **Workflow not auto-triggering** — Resolved by clicking **Publish** in n8n (newer versions renamed "Activate" to "Publish"). The workflow only runs automatically when published.
- **HCTI credential setup** — Uses HTTP Basic Auth where User = User ID and Password = API Key. Easy to confuse the two fields; User ID goes in the User field, not the Password field.
- **Image not rendering in card** — Public image URLs must be directly accessible (not behind a login or redirect). Google Drive sharing links require conversion to the `https://drive.google.com/uc?export=view&id=FILE_ID` format to render correctly in an `<img>` tag.

---

## Setup Instructions

### 1. Google Form + Sheet
- Create a Google Form with fields: Name, Image URL, AI Opinion.
- Link it to a Google Sheet (Responses tab).
- Note the **Sheet ID** from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

### 2. n8n Workflow
- Import `sheet-to-image-workflow.json` into n8n (⋯ menu → Import from File).
- Open **Google Sheets Trigger** → connect Google account → select your sheet and tab.
- Open **HTML to Image** → add HCTI Basic Auth credential (User ID + API Key).
- Open **Upload to Drive** → connect Google account → select target Drive folder.
- Click **Publish** (top-right) to activate the workflow.

### 3. htmlcsstoimage (HCTI)
- Sign up at [htmlcsstoimage.com](https://htmlcsstoimage.com).
- Go to Dashboard → copy your **User ID** and **API Key**.
- In n8n, add as an **HTTP Basic Auth** credential:
  - User = User ID
  - Password = API Key

### 4. Google Drive
- Create a folder in Drive where cards will be saved.
- Make sure the connected Google account has edit access to that folder.

---

## Important Notes

- The workflow polls Google Sheets **every minute**. After a student submits, allow up to 60 seconds for the card to generate and appear in Drive.
- The n8n Cloud free trial allows **1,000 executions**. Polling every minute = up to 1,440 checks/day. Consider changing the poll interval to every 5 minutes to conserve executions.
- HCTI free tier allows **50 images/month**. Sufficient for small classes and testing.
- Image URLs submitted by students must be **publicly accessible**. Private or restricted links will cause the image to be blank in the generated card.

---

## File Structure

```
project/
├── README.md                        ← This file
├── sheet-to-image-workflow.json     ← Importable n8n workflow
└── card-template.html               ← Standalone HTML card template (for design edits)
```

---

## Future Improvements

- Switch from polling to a **Webhook + Apps Script** setup for instant triggering on form submit.
- Add a **Google Sheets Update** node to write the generated image link back to the sheet as a reference.
- Add error handling nodes in n8n to catch failed image generations and send an alert.
- Upgrade HCTI plan or self-host n8n for production use with a full class.
