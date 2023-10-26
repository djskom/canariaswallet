import firestore from '@react-native-firebase/firestore';

const agregarInformacionDeBilletera = async (userID, walletInfo) => {
  try {
    const userRef = firestore().collection('users').doc(userID);
    await userRef.collection('walletInfo').add(walletInfo);
    console.log('Información de la billetera agregada correctamente');
  } catch (error) {
    console.error('Error al agregar información de la billetera:', error);
  }
};

export { agregarInformacionDeBilletera };
