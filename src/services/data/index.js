// Data access entry point. The app talks to `dataSource` and never to Firestore directly.
// When Firebase credentials are missing (or VITE_USE_DEMO_DATA=true) it falls back to
// bundled demo data persisted in the browser, so every view works without a backend.

const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const isDemoMode =
  env.VITE_USE_DEMO_DATA === "true" || !firebaseConfig.apiKey || !firebaseConfig.projectId;

let adapterPromise = null;

// Adapters are loaded lazily so the Firebase SDK is never downloaded in demo mode.
function getAdapter() {
  if (!adapterPromise) {
    adapterPromise = (
      isDemoMode
        ? import("./localAdapter.js").then((m) => m.createLocalAdapter())
        : import("./firestoreAdapter.js").then((m) => m.createFirestoreAdapter(firebaseConfig))
    ).catch((error) => {
      adapterPromise = null;
      throw error;
    });
  }
  return adapterPromise;
}

const delegate =
  (method) =>
  async (...args) =>
    (await getAdapter())[method](...args);

/**
 * Both adapters implement this contract:
 * - findAdminByUsername(username): Promise<boolean>
 * - findParticipant(collectionName, field, value): Promise<{ id, data } | null>
 * - updateParticipantStatus(collectionName, id, status, { withTimestamp }): Promise<void>
 * - listParticipants(collectionName): Promise<Array<{ id, ...data }>>
 * - addParticipant(collectionName, data): Promise<void>
 * - addWinner(winner): Promise<void>
 * - subscribeWinners(callback): () => void
 * Participant `timestamp` values are always returned as `Date` (or absent).
 */
export const dataSource = {
  findAdminByUsername: delegate("findAdminByUsername"),
  findParticipant: delegate("findParticipant"),
  updateParticipantStatus: delegate("updateParticipantStatus"),
  listParticipants: delegate("listParticipants"),
  addParticipant: delegate("addParticipant"),
  addWinner: delegate("addWinner"),
  subscribeWinners(callback) {
    let unsubscribe = null;
    let active = true;
    getAdapter()
      .then((adapter) => {
        if (active) unsubscribe = adapter.subscribeWinners(callback);
      })
      .catch((error) => console.error("Could not subscribe to winners:", error));
    return () => {
      active = false;
      unsubscribe?.();
    };
  },
};
