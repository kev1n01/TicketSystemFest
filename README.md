# TicketSystemFest

QR ticketing system for a university fest: students and guests generate a QR ticket, staff scan it at the door, and admins track entries and run a raffle. Built with Vue 3, Vite, Pinia and Tailwind CSS, backed by Firebase Firestore.

The app runs **without Firebase** too: when no Firebase credentials are configured it switches to a demo mode with bundled sample data, so every view can be tried out locally or in a portfolio deploy.

## Quick path

```bash
npm install
npm run dev
```

Open the app and click the **Modo demo** badge (bottom-left) to see the demo credentials.

## Data source

| Situation | Data source |
|-----------|-------------|
| `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_PROJECT_ID` set | Firestore |
| Any of them missing | Demo data (`src/services/data/demoSeed.json`) |
| `VITE_USE_DEMO_DATA=true` | Demo data, even if Firebase is configured |

To use Firestore, create a `.env.local` file with the values from your Firebase project:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
# Optional: "true" forces demo data even when Firebase is configured
VITE_USE_DEMO_DATA=
```

Demo mode stores changes (scans, raffle winners, uploads) in the browser's `localStorage`, so they survive reloads and are shared between tabs. Use **Restablecer datos demo** in the demo badge to go back to the original sample data. The Firebase SDK is not loaded in demo mode.

## Demo credentials

| Role | Where | Value |
|------|-------|-------|
| Student | `/generate-ticket` | code `2020100001` |
| Guest | `/generate-ticket-guess` | DNI `12345678` |
| Admin | `/admin` | username `admin` |

More sample participants (some already registered) are listed in `src/services/data/demoSeed.json`.

## Flow to try

1. Generate a ticket as a student or guest and see the QR on `/view-ticket` or `/view-ticket-guess`.
2. Log out, log in as admin and scan that QR on `/scanner` (needs a camera; you can show the QR from another device).
3. Check the entry in `/historial-register`.
4. Run the raffle on `/lottery`; winners also appear on `/view-winner`.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build |
