import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const toDate = (value) => (typeof value?.toDate === "function" ? value.toDate() : value);

const normalize = (data) => (data.timestamp ? { ...data, timestamp: toDate(data.timestamp) } : data);

export function createFirestoreAdapter(config) {
  const db = getFirestore(initializeApp(config));

  return {
    async findAdminByUsername(username) {
      const snapshot = await getDocs(query(collection(db, "admins"), where("username", "==", username)));
      return !snapshot.empty;
    },

    async findParticipant(collectionName, field, value) {
      const snapshot = await getDocs(query(collection(db, collectionName), where(field, "==", value)));
      if (snapshot.empty) return null;
      const [first] = snapshot.docs;
      return { id: first.id, data: normalize(first.data()) };
    },

    async updateParticipantStatus(collectionName, id, status, { withTimestamp = false } = {}) {
      const fields = withTimestamp ? { status, timestamp: serverTimestamp() } : { status };
      await updateDoc(doc(db, collectionName, id), fields);
    },

    async listParticipants(collectionName) {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map((d) => ({ ...normalize(d.data()), id: d.id }));
    },

    async addParticipant(collectionName, data) {
      await addDoc(collection(db, collectionName), data);
    },

    async addWinner(winner) {
      await addDoc(collection(db, "winners"), winner);
    },

    subscribeWinners(callback) {
      return onSnapshot(collection(db, "winners"), (snapshot) => {
        callback(snapshot.docs.map((d) => ({ ...d.data(), id: d.id })));
      });
    },
  };
}
