import { defineStore } from "pinia";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null,
    userStatus: null,
  }),

  actions: {
    // Validar DNI y verificar que COD existe
    async validateDNI(dni) {
      try {
        const estudiantesRef = collection(db, "estudiantes");
        const q = query(estudiantesRef, where("DNI", "==", dni));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          const data = docSnapshot.data();

          if (data.COD) {
            return {
              COD: data.COD,
              PATERNO: data.PATERNO,
              MATERNO: data.MATERNO,
              NOMBRES: data.NOMBRES,
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error validando DNI:", error);
        return null;
      }
    },

    // Registrar un participante con sus datos iniciales
    async registerParticipant(userData) {
      try {
        const { dni, code, fullName } = userData;
        await setDoc(doc(db, "estudiantes", dni), {
          DNI: dni,
          COD: code,
          fullName,
          status: "no_registrado",
        });

        // Guardar en localStorage
        localStorage.setItem("userInfo", JSON.stringify(userData));
        return true;
      } catch (error) {
        console.error("Error registrando participante:", error);
        return false;
      }
    },

    // Validar si un usuario es administrador
    async validateAdmin(username) {
      try {
        const adminsRef = collection(db, "admins");
        const q = query(adminsRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
      } catch (error) {
        console.error("Error validando administrador:", error);
        return false;
      }
    },

    // Actualizar estado del participante por un administrador
    async updateParticipantStatusToAdmin(dni) {
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
            message: "El usuario ya está registrado",
            data: userData,
          };
        }

        // Actualizar estado a 'registrado'
        await updateDoc(docRef, { status: "registrado" });
        userData.status = "registrado";

        return {
          success: true,
          message: "Usuario registrado exitosamente",
          data: userData,
        };
      } catch (error) {
        console.error("Error al actualizar estado:", error);
        return { success: false, message: error.message };
      }
    },

    // Actualizar estado del participante
    async updateParticipantStatus(dni) {
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

        // Verificar si existe el campo 'status', si no existe, agregarlo
        if (!userData.hasOwnProperty("status")) {
          await updateDoc(docRef, { status: "no_registrado" });
          userData.status = "no_registrado";
        }

        return { success: true, message: "Estado actualizado", data: userData };
      } catch (error) {
        console.error("Error al actualizar estado:", error);
        return { success: false, message: error.message };
      }
    },
  },
});
