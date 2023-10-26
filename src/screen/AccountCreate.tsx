import React, { useCallback, useEffect, useState } from 'react';
import { generateAccount } from '../utils/AccountUtils';
import { Account } from '../models/Account';
import AccountDetail from './AccountDetail';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from '@firebase/app'; // Importa initializeApp desde '@firebase/app'
import auth from '@react-native-firebase/auth'; // Importa auth desde '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'; // Importa firestore desde '@react-native-firebase/firestore'

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

// Inicializa Firebase con la configuración
const firebaseApp = initializeApp(firebaseConfig);

const recoveryPhraseKeyName = 'recoveryPhrase';

function AccountCreate() {
  const [seedphrase, setSeedphrase] = useState('');
  const [account, setAccount] = useState<Account | null>(null);
  const [showRecoverInput, setShowRecoverInput] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletSeedPhrase, setWalletSeedPhrase] = useState<string | null>(null);

  const handleChange = (text: string) => {
    setSeedphrase(text);
  };

  const recoverAccount = useCallback(async (recoveryPhrase: string) => {
    const result = await generateAccount(recoveryPhrase);
    setAccount(result.account);

    if (recoveryPhraseKeyName !== recoveryPhrase) {
      try {
        // Utiliza AsyncStorage para almacenar la frase de recuperación en lugar de localStorage
        await AsyncStorage.setItem(recoveryPhraseKeyName, recoveryPhrase);
      } catch (error) {
        console.error('Error al guardar la frase de recuperación en AsyncStorage:', error);
      }
    }
  }, []);

  const createAccount = async () => {
    const result = await generateAccount();
    setAccount(result.account);

    // Aquí también guardamos los datos en Firestore si es necesario
    const user = auth().currentUser; // Utiliza auth() en lugar de firebaseApp.auth()
    if (user) {
      const uid = user.uid;

      try {
        await firestore().collection('wallets').doc(uid).set({
          address: result.account.address,
          seedPhrase: result.seedPhrase,
        });
      } catch (error) {
        console.error('Error al guardar en Firestore:', error);
      }
    }
  };

  useEffect(() => {
    const loadRecoveryPhrase = async () => {
      try {
        // Utiliza AsyncStorage para cargar la frase de recuperación en lugar de localStorage
        const storedRecoveryPhrase = await AsyncStorage.getItem(recoveryPhraseKeyName);
        if (storedRecoveryPhrase) {
          // Si se encuentra una frase de recuperación almacenada, muestra el campo de recuperación
          setShowRecoverInput(true);
          setSeedphrase(storedRecoveryPhrase);
        }
      } catch (error) {
        console.error('Error al cargar la frase de recuperación desde AsyncStorage:', error);
      }
    };
    loadRecoveryPhrase();
  }, []);

  const handleRecoverPress = () => {
    if (showRecoverInput) {
      recoverAccount(seedphrase);
    } else {
      setShowRecoverInput(true);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Canaria's Coins Wallet</Text>
      <Button title="Create Account" onPress={createAccount} />
      <Button
        title={showRecoverInput ? 'Recover Account' : 'Show Recover Input'}
        onPress={handleRecoverPress}
        disabled={showRecoverInput && !seedphrase}
      />
      {showRecoverInput && (
        <TextInput
          placeholder='Seedphrase or private key for recovery'
          value={seedphrase}
          onChangeText={handleChange}
          onSubmitEditing={() => recoverAccount(seedphrase)}
        />
      )}
      {account && (
        <>
          <Text style={{ marginBottom: 10 }}>
  {account ? account.address : 'Dirección de la billetera no disponible'}
</Text>
          <AccountDetail account={account} />
        </>
      )}
    </View>
  );
}

export default AccountCreate;
