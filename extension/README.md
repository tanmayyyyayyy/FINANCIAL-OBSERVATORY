# Financial Observatory — Chrome Extension

A compact Chrome toolbar companion for the Financial Observatory app.
Add expenses directly from the browser in seconds.

## Features

- Sign in with your existing Financial Observatory account
- Add expenses from any browser tab
- Same categories, same Firestore collection, same data as the main app
- Instant success feedback
- Dark UI matching the main app

## Setup & Installation (Developer Mode)

1. Ensure your Firebase configuration exists in `app/.env`.
2. Run `npm run build:extension` (from `app/`) to bundle Firebase locally and generate `extension/firebase-config.js`.
3. Open Chrome and navigate to `chrome://extensions`
4. Enable **Developer mode** (toggle in the top right)
5. Click **Load unpacked**
6. Select this directory: `extension/`
7. The Financial Observatory icon appears in your toolbar

## Usage

1. Click the Financial Observatory icon in the Chrome toolbar
2. Sign in with your Financial Observatory account credentials
3. Enter the expense amount
4. Optionally add a description and choose a category
5. Click **+ Add Expense**
6. The expense is saved to your Financial Observatory account immediately

## Architecture

- **Manifest V3 Compliant** — All JavaScript is packaged locally in the extension folder (no remote code execution)
- **Locally bundled Firebase JS SDK** — Bundled via `npm run build:extension` directly into `extension/firebase.js`
- **Firestore path**: `users/{uid}/transactions` (identical to the main app)
- **Auth**: Firebase Email/Password — same account, no separate system
- **No AI calls** — deterministic expense save only
- **No secrets** — Firebase client config is public by design, protected by Firestore Security Rules

## Security

- Firebase Web API key is public by design (standard Firebase client pattern)
- All data writes are scoped to the authenticated user's UID via Firestore Security Rules
- No Gemini API keys, Firebase Admin credentials, or private keys in this extension
- Users must be authenticated to write any transaction

## Distribution

To distribute as a ZIP for sideloading:

```bash
cd extension
zip -r ../financial-observatory-extension.zip . --exclude "*.DS_Store" --exclude "__MACOSX*"
```

For Chrome Web Store publication, submit the generated ZIP through the
[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/).
