import React, { useState } from 'react';
import { View, Text, Button, Clipboard, StyleSheet } from 'react-native';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import firestore from '@react-native-firebase/firestore'; // Importa firestore desde Firebase correctamente
import 'react-native-get-random-values';

const WalletGenerationScreen = () => {
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [copied, setCopied] = useState(false);

  const generateWallet = () => {
    const provider = new JsonRpcProvider('https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix'); // Reemplaza con la URL RPC de Ethereum

    const wallet = Wallet.createRandom({ extraEntropy: provider });

    setAddress(wallet.address);
    setPrivateKey(wallet.privateKey);
    setCopied(false);

    // Guarda los datos generados en Firebase Firestore
    saveDataToFirestore(wallet.address, wallet.privateKey);
  };

  const saveDataToFirestore = async (address: string, privateKey: string) => {
    try {
      await firestore()
        .collection('wallets') // Nombre de la colección en Firestore
        .add({
          address,
          privateKey,
        });
      console.log('Datos guardados en Firestore con éxito');
    } catch (error) {
      console.error('Error al guardar en Firestore: ', error);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(privateKey);
    setCopied(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ethereum Wallet Address:</Text>
      <Text style={styles.address}>{address}</Text>

      <Text style={styles.label}>Private Key:</Text>
      <Text style={styles.privateKey}>{privateKey}</Text>

      <Button title="Generate New Wallet" onPress={generateWallet} />

      {privateKey && (
        <Button
          title={copied ? 'Copied!' : 'Copy Private Key'}
          onPress={copyToClipboard}
          disabled={copied}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  address: {
    fontSize: 16,
    marginTop: 5,
  },
  privateKey: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 20,
  },
});

export default WalletGenerationScreen;
