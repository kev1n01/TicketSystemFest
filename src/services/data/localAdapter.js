import seed from "./demoSeed.json";

// Demo data lives in localStorage so scans, raffle winners and uploads survive reloads
// and are shared between tabs (e.g. the winners screen open on a second display).
export const DEMO_STORAGE_KEY = "ticketfest:demo-db:v1";

const WINNERS = "winners";
const listeners = new Set();
let memoryDb = null; // fallback when localStorage is unavailable (private mode, blocked storage)

const clone = (value) => JSON.parse(JSON.stringify(value));

function loadDb() {
  try {
    const storage = globalThis.localStorage;
    if (storage) {
      // A missing key means fresh or reset data (possibly from another tab): start from the seed,
      // never from this tab's in-memory copy, or a stale tab would resurrect old data.
      const raw = storage.getItem(DEMO_STORAGE_KEY);
      return raw ? JSON.parse(raw) : clone(seed);
    }
  } catch (error) {
    console.warn("[demo] Could not read demo data, using in-memory copy.", error);
  }
  return memoryDb ?? clone(seed);
}

function saveDb(db) {
  memoryDb = db;
  try {
    globalThis.localStorage?.setItem(DEMO_STORAGE_KEY, JSON.stringify(db));
  } catch (error) {
    console.warn("[demo] Could not persist demo data.", error);
  }
}

const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

function toDoc({ id, ...data }) {
  return { id, data: data.timestamp ? { ...data, timestamp: new Date(data.timestamp) } : data };
}

const notifyWinners = () => listeners.forEach((emit) => emit());

export function createLocalAdapter() {
  return {
    async findAdminByUsername(username) {
      return (loadDb().admins ?? []).some((admin) => admin.username === username);
    },

    async findParticipant(collectionName, field, value) {
      const item = (loadDb()[collectionName] ?? []).find((entry) => entry[field] === value);
      return item ? toDoc(item) : null;
    },

    async updateParticipantStatus(collectionName, id, status, { withTimestamp = false } = {}) {
      const db = loadDb();
      const item = (db[collectionName] ?? []).find((entry) => entry.id === id);
      if (!item) throw new Error(`Document ${collectionName}/${id} not found`);
      item.status = status;
      if (withTimestamp) item.timestamp = new Date().toISOString();
      saveDb(db);
    },

    async listParticipants(collectionName) {
      return (loadDb()[collectionName] ?? []).map((item) => {
        const { id, data } = toDoc(item);
        return { ...data, id };
      });
    },

    async addParticipant(collectionName, data) {
      const db = loadDb();
      db[collectionName] = [...(db[collectionName] ?? []), { ...data, id: newId(collectionName) }];
      saveDb(db);
    },

    async addWinner(winner) {
      const db = loadDb();
      db[WINNERS] = [...(db[WINNERS] ?? []), { ...winner, id: newId(WINNERS) }];
      saveDb(db);
      notifyWinners();
    },

    subscribeWinners(callback) {
      let active = true;
      const emit = () => {
        if (active) callback(clone(loadDb()[WINNERS] ?? []));
      };
      const onStorage = (event) => {
        if (event.key === null || event.key === DEMO_STORAGE_KEY) emit();
      };
      listeners.add(emit);
      globalThis.addEventListener?.("storage", onStorage);
      queueMicrotask(emit); // like Firestore's onSnapshot, deliver the initial state asynchronously
      return () => {
        active = false;
        listeners.delete(emit);
        globalThis.removeEventListener?.("storage", onStorage);
      };
    },
  };
}

export function resetDemoData() {
  memoryDb = null;
  try {
    globalThis.localStorage?.removeItem(DEMO_STORAGE_KEY);
  } catch (error) {
    console.warn("[demo] Could not clear demo data.", error);
  }
  notifyWinners();
}

export function getDemoCredentials() {
  const notUsedYet = (participant) => participant.status !== "registrado";
  return {
    admin: seed.admins[0]?.username,
    studentCode: seed.estudiantes.find(notUsedYet)?.cod,
    guestDni: seed.invitados.find(notUsedYet)?.dni,
  };
}
