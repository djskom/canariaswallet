import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navigation from './src/Navigation';
import Header from './src/screen/Header';
import { initializeApp } from '@react-native-firebase/app'; 
import { Provider } from 'react-redux';
import store from './src/store/index.js';

import { RouteProp } from '@react-navigation/native';

import auth from '@react-native-firebase/auth'; // Importa Firebase Authentication
import firestore from '@react-native-firebase/firestore'; // Importa Firestore

const firebaseConfig = {
  apiKey: "AIzaSyB4EWCWGHjTpb60Qf2R8opmch5Rym79dLo",
  authDomain: "myapp-2f8e1.firebaseapp.com",
  projectId: "myapp-2f8e1",
  databaseURL: "https://myapp-2f8e1-default-rtdb.europe-west1.firebasedatabase.app", 
  storageBucket: "myapp-2f8e1.appspot.com",
  messagingSenderId: "104956284102",
  appId: "1:104956284102:web:d6dc189dae34d3aeb11bc7",
  measurementId: "G-RCFY2VF137"
};

const firebaseApp = initializeApp(firebaseConfig);

const Stack = createStackNavigator();

// Define el tipo de AccountData
interface AccountData {
  address: string;
  seedPhrase: string;
  privateKey: string;
}

const App = () => {
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState<firebase.User | null>(null); // Para almacenar datos del usuario actual

  useEffect(() => {
    verificarRegistro();
  }, []);

  useEffect(() => {
    // Verificar el estado de autenticación actual
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setUsuarioActual(user);
      } else {
        setUsuarioActual(null);
      }
    });
    return unsubscribe;
  }, []);

  const verificarRegistro = async () => {
    try {
      const valor = await AsyncStorage.getItem('usuarioRegistrado');
      if (valor === 'true') {
        setUsuarioRegistrado(true);
      }
    } catch (error) {
      console.error('Error al verificar el registro:', error);
    }
  };

  const handleRegistroCompleto = async (accountData: AccountData) => {
    try {
      if (usuarioActual) {
        // Guarda los datos de la billetera en Firestore
        const uid = usuarioActual.uid;
        const userData = {
          nombre: usuarioActual.displayName || "",
          correo: usuarioActual.email || "",
          direccion_wallet: accountData.address,
          seedkey: accountData.seedPhrase || "", // Verifica si 'seedPhrase' es nulo
          privateKey: accountData.privateKey || "", // Agrega secretKey al objeto userData
        };
  
        console.log('La clave secreta generada es:', accountData.privateKey); // Agrega este console.log para verificar la secretKey
  
        // Accede a la colección "wallets" en Firestore y agrega los datos
        await firestore().collection('wallets').doc(uid).set(userData);
      } else {
        console.error('Usuario no autenticado');
      }
    } catch (error) {
      console.error('Error al guardar el registro:', error);
    }
  };
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={Navigation}
            options={({ route, navigation }) => ({
              header: () => (
                <Header
                  onRegistroCompleto={handleRegistroCompleto}
                  route={route}
                  navigation={navigation}
                  usuarioActual={usuarioActual} // Pasa el usuario actual como prop
                />
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default App;
