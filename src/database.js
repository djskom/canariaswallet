import { getDatabase, ref, set } from 'firebase/database';
import { firebaseApp } from './FirebaseConfig';

// Función para guardar datos de usuario en la base de datos
export const guardarDatosUsuario = (uid, nombre, correo, address , seedPhrase) => {
  const db = getDatabase(firebaseApp);
  const userRef = ref(db, `usuarios/${uid}`);
  
  return set(userRef, {
    nombre,
    correo,
    address,
    seedPhrase,
  });
};

export { firebaseApp };
