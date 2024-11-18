import { defineStore } from "pinia";
import { ref } from "vue";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";

export const useUserStore = defineStore("user", () => {
  // Definición de estado
  const userQr = ref(null);
  const userDni = ref(null);
  const userCode = ref(null);
  const userFullName = ref(null);
  const userHashCode = ref(null);
  const username = ref(null);

  // Acciones
  async function validateAdmin(usernameInput) {
    try {
      const adminsRef = collection(db, "admins");
      const q = query(adminsRef, where("username", "==", usernameInput));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: "Nombre de usuario incorrecto o no existe." };
      }

      userHashCode.value = bcrypt.hashSync(usernameInput, 10);
      username.value = usernameInput;
      return { success: true, message: `Bienvenido admin, ${username.value} 😎` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function updateParticipantStatusToAdmin(dni) {
    try {
      const estudiantesRef = collection(db, "estudiantes");
      const q = query(estudiantesRef, where("DNI", "==", dni));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: "Usuario no encontrado" };
      }

      const docSnapshot = querySnapshot.docs[0];
      const userData = docSnapshot.data();
      const docRef = doc(db, "estudiantes", docSnapshot.id);

      if (userData.status === "registrado") {
        return {
          success: false,
          message: "Este usuario ya utilizó su entrada.",
          data: userData,
        };
      }

      // Actualizar estado a 'registrado'
      await updateDoc(docRef, { status: "registrado" });
      userData.status = "registrado";

      return {
        success: true,
        message: "Entrada registrado exitosamente",
        data: userData,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function updateParticipantStatus(dni, code) {
    try {
      const estudiantesRef = collection(db, "estudiantes");
      const q = query(
        estudiantesRef,
        where("DNI", "==", dni),
        where("COD", "==", code)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: "DNI y/o código incorrectos." };
      }

      const docSnapshot = querySnapshot.docs[0];
      const docRef = doc(db, "estudiantes", docSnapshot.id);
      const userData = docSnapshot.data();

      if (!userData.status) {
        await updateDoc(docRef, { status: "no_registrado" });
        userData.status = "no_registrado";
      }

      // Actualizar estado de Pinia
      userQr.value = await QRCode.toDataURL(dni);
      userDni.value = dni;
      userCode.value = code;
      userHashCode.value = bcrypt.hashSync(dni, 10);
      userFullName.value = `${userData.PATERNO} ${userData.MATERNO} ${userData.NOMBRES}`;

      if (userData.status === "no_registrado") {
        return { success: true, message: "Ticket generado exitosamente" };
      } else {
        return {
          success: true,
          message: `Bienvenido de nuevo ${userData.NOMBRES} 🥳💖`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          "Ocurrió un error al generar el ticket, intentelo más tarde.",
      };
    }
  }

  const logout = () => {
    userQr.value = null;
    userDni.value = null;
    userCode.value = null;
    userFullName.value = null;
    userHashCode.value = null;
    username.value = null;
  };

  // Retornar estado y acciones
  return {
    userQr,
    userDni,
    userCode,
    userFullName,
    userHashCode,
    username,
    validateAdmin,
    updateParticipantStatusToAdmin,
    updateParticipantStatus,
    logout
  };
}, {
  persist: true
});
