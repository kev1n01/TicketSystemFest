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

  async function updateParticipantStatusToAdmin(identifier) {
    try {
      var collectionName = 'estudiantes'
      var whereSearch = 'cod'
      var typeParticipant = 'estudiante'
      if (identifier.length === 10) {
        collectionName = 'estudiantes';
        whereSearch = 'cod'
        typeParticipant = 'estudiante'
      } else {
        collectionName = 'invitados';
        whereSearch = 'dni'
        typeParticipant = 'invitado'
      };

      const estudiantesRef = collection(db, collectionName);
      const q = query(estudiantesRef, where(whereSearch, "==", identifier));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: "Usuario no encontrado" };
      }

      const docSnapshot = querySnapshot.docs[0];
      const userData = docSnapshot.data();
      const docRef = doc(db, collectionName, docSnapshot.id);

      if (userData.status === "registrado") {
        return {
          success: false,
          type: typeParticipant,
          message: `${userData.nombres} ya utilizó su entrada.`,
          data: userData,
        };
      }

      // Actualizar estado a 'registrado'
      await updateDoc(docRef, { status: "registrado" });
      userData.status = "registrado";

      return {
        success: true,
        type: typeParticipant,
        message: `Entrada registrado exitosamente, bienvenido ${userData.nombres} diviertete.`,
        data: userData,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function updateParticipantStatus(code) {
    try {
      const estudiantesRef = collection(db, "estudiantes");
      const q = query(
        estudiantesRef,
        where("cod", "==", code)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: "Código incorrecto o no estas registrado como estudiante." };
      }

      const docSnapshot = querySnapshot.docs[0];
      const docRef = doc(db, "estudiantes", docSnapshot.id);
      const userData = docSnapshot.data();

      if (!userData.status) {
        await updateDoc(docRef, { status: "no_registrado" });
        userData.status = "no_registrado";
      }

      // Actualizar estado de Pinia
      userQr.value = await QRCode.toDataURL(code);
      userCode.value = code;
      userHashCode.value = bcrypt.hashSync(code, 10);
      userFullName.value = userData.nombres;

      if (userData.status === "no_registrado") {
        return { success: true, message: `Hola, ${userData.nombres}. tu ticket se generó correctamente` };
      } else {
        return {
          success: true,
          message: `Bienvenido de nuevo ${userData.nombres}`,
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
  async function updateParticipantGuessStatus(dni) {
    try {
      const guessRef = collection(db, "invitados");
      const q = query(
        guessRef,
        where("dni", "==", dni)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: "DNI incorrecto o no estas registrado como invitados." };
      }

      const docSnapshot = querySnapshot.docs[0];
      const docRef = doc(db, "invitados", docSnapshot.id);
      const userData = docSnapshot.data();

      if (!userData.status) {
        await updateDoc(docRef, { status: "no_registrado" });
        userData.status = "no_registrado";
      }

      // Actualizar estado de Pinia
      userQr.value = await QRCode.toDataURL(dni);
      userDni.value = dni;
      userHashCode.value = bcrypt.hashSync(dni, 10);
      userFullName.value = userData.nombres;

      if (userData.status === "no_registrado") {
        return { success: true, message: `Hola, ${userData.nombres}. tu ticket se generó correctamente` };
      } else {
        return {
          success: true,
          message: `Bienvenido de nuevo ${userData.nombres}`,
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
    updateParticipantGuessStatus,
    logout
  };
}, {
  persist: true
});
