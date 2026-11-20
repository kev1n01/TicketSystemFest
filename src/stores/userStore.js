import { defineStore } from "pinia";
import { ref } from "vue";
import { dataSource } from "../services/data";
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
      const adminExists = await dataSource.findAdminByUsername(usernameInput);

      if (!adminExists) {
        return { success: false, message: "Nombre de usuario incorrecto o no existe." };
      }

      userHashCode.value = bcrypt.hashSync(usernameInput, 10);
      username.value = usernameInput;
      return { success: true, message: `Bienvenido admin, ${username.value}` };
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

      const participant = await dataSource.findParticipant(collectionName, whereSearch, identifier);

      if (!participant) {
        return { success: false, message: "Usuario no encontrado" };
      }

      const userData = participant.data;

      if (userData.status === "registrado") {
        return {
          success: false,
          type: typeParticipant,
          message: `${userData.nombres} ya utilizó su entrada.`,
          data: userData,
        };
      }

      await dataSource.updateParticipantStatus(collectionName, participant.id, "registrado", {
        withTimestamp: true,
      });
      
      userData.status = "registrado";
      userData.timestamp = new Date()

      return {
        success: true,
        type: typeParticipant,
        message: `Entrada registrada. Bienvenido, ${userData.nombres}. ¡Diviértete!`,
        data: userData,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function updateParticipantStatus(code) {
    try {
      const participant = await dataSource.findParticipant("estudiantes", "cod", code);

      if (!participant) {
        return { success: false, message: "Código incorrecto o no estás registrado como estudiante." };
      }

      const userData = participant.data;

      if (!userData.status) {
        await dataSource.updateParticipantStatus("estudiantes", participant.id, "no_registrado");
        userData.status = "no_registrado";
      }

      // Actualizar estado de Pinia
      userQr.value = await QRCode.toDataURL(code);
      userCode.value = code;
      userHashCode.value = bcrypt.hashSync(code, 10);
      userFullName.value = userData.nombres;

      if (userData.status === "no_registrado") {
        return { success: true, message: `Hola, ${userData.nombres}. Tu ticket se generó correctamente.` };
      } else {
        return {
          success: true,
          message: `Bienvenido de nuevo, ${userData.nombres}.`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          "Ocurrió un error al generar el ticket, inténtelo más tarde.",
      };
    }
  }
  async function updateParticipantGuessStatus(dni) {
    try {
      const participant = await dataSource.findParticipant("invitados", "dni", dni);

      if (!participant) {
        return { success: false, message: "DNI incorrecto o no estás registrado como invitado." };
      }

      const userData = participant.data;

      if (!userData.status) {
        await dataSource.updateParticipantStatus("invitados", participant.id, "no_registrado");
        userData.status = "no_registrado";
      }

      // Actualizar estado de Pinia
      userQr.value = await QRCode.toDataURL(dni);
      userDni.value = dni;
      userHashCode.value = bcrypt.hashSync(dni, 10);
      userFullName.value = userData.nombres;

      if (userData.status === "no_registrado") {
        return { success: true, message: `Hola, ${userData.nombres}. Tu ticket se generó correctamente.` };
      } else {
        return {
          success: true,
          message: `Bienvenido de nuevo, ${userData.nombres}.`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          "Ocurrió un error al generar el ticket, inténtelo más tarde.",
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
