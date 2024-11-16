import { defineStore } from 'pinia';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    userStatus: null,
  }),

  actions: {
    async validateDNI(dni) {
      try {
        const estudiantesRef = collection(db, 'estudiantes');
        const q = query(estudiantesRef, where("DNI", "==", dni));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
      } catch (error) {
        console.error('Error validando DNI:', error);
        return false;
      }
    },

    async registerParticipant(userData) {
      try {
        const { dni, code, fullName } = userData;
        await setDoc(doc(db, 'estudiantes', dni), {
          dni,
          code,
          fullName,
          status: 'no_registrado',
        });

        // Guardar en localStorage
        localStorage.setItem('userInfo', JSON.stringify(userData));
        return true;
      } catch (error) {
        console.error('Error registering participant:', error);
        return false;
      }
    },

    async validateAdmin(username) {
      const adminsRef = collection(db, 'admins');
      const q = query(adminsRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    },

    async updateParticipantStatusToAdmin(dni) {
      try {
        // Primero buscamos el documento por el campo DNI
        const estudiantesRef = collection(db, 'estudiantes');
        const q = query(estudiantesRef, where("DNI", "==", dni));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          return { success: false, message: 'Usuario no encontrado' };
        }

        // Obtenemos el primer documento que coincida
        const docSnapshot = querySnapshot.docs[0];
        const userData = docSnapshot.data();
        const docRef = doc(db, 'estudiantes', docSnapshot.id);

        // Lógica para cambiar el estado
        if (userData.status === 'registrado') {
          return {
            success: false,
            message: 'Usuario ya uso su entrada',
            data: userData
          };
        }

        // Actualizamos el estado a 'registrado'
        await updateDoc(docRef, {
          status: 'registrado'
        });

        // Actualizamos userData con el nuevo estado
        userData.status = 'registrado';

        return {
          success: true,
          message: 'Usuario registrado exitosamente',
          data: userData
        };

      } catch (error) {
        console.error('Error al actualizar estado:', error);
        return {
          success: false,
          message: error.message
        };
      }
    },

    async updateParticipantStatus(dni) {
      try {
        // Primero buscamos el documento por el campo DNI
        const estudiantesRef = collection(db, 'estudiantes');
        const q = query(estudiantesRef, where("DNI", "==", dni));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          return { success: false, message: 'Usuario no encontrado' };
        }

        // Obtenemos el primer documento que coincida
        const docSnapshot = querySnapshot.docs[0];
        const userData = docSnapshot.data();
        const docRef = doc(db, 'estudiantes', docSnapshot.id);

        // Verificamos si existe el campo status
        if (!userData.hasOwnProperty('status')) {
          // Si no existe el campo status, lo creamos como 'no_registrado'
          await updateDoc(docRef, {
            status: 'no_registrado'
          });
          // Actualizamos userData con el nuevo campo
          userData.status = 'no_registrado';
        }

        return true
      } catch (error) {
        console.error('Error al actualizar estado:', error);
        return false
      }
    },
  }
});