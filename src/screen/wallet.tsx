import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Linking, ScrollView } from 'react-native';
import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from 'ethers';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FCCTokenAbi from "../abi/FCTToken.json";
import { sendToken } from '../utils/TransactionUtils';
import { skale } from '../models/Chain';
import { Account } from '../models/Account';

const Wallet = () => {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState('0');
  const [balance, setBalance] = useState('0');
  const [networkResponse, setNetworkResponse] = useState({
    status: null,
    message: '',
  });
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = auth().currentUser;

    if (user) {
      const uid = user.uid;

      const fetchUserData = async () => {
        try {
          const walletData = await firestore()
            .collection('wallets')
            .doc(uid)
            .get();

          if (walletData.exists) {
            setUserData(walletData.data());
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error('Error al obtener datos de Firestore:', error);
        }
      };

      fetchUserData();
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const rpcUrl = "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix";
      const provider = new JsonRpcProvider(rpcUrl);

      const tokenAbi = FCCTokenAbi.abi;
      const tokenContract = new ethers.Contract('0x873EB0641ac9077F27897b2cbF804D408256fEBb', tokenAbi, provider);

      const fetchBalance = async () => {
        if (userData.address) {
          const tokenBalance = await tokenContract.balanceOf(userData.address);
          setBalance(tokenBalance.toString());
        }
      };

      fetchBalance();
    }
  }, [userData]);

  const handleDestinationAddressChange = (text) => {
    setDestinationAddress(text);
  };

  const handleAmountChange = (text) => {
    setAmount(text);
  };

  const sendTokenTransaction = async () => {
    try {
      const amountValue = parseFloat(amount);

      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("La cantidad debe ser un número positivo.");
      }

      if (userData) {
        const receipt = await sendToken(
          amountValue,
          userData.address,
          destinationAddress,
          userData.SeedPhrase,
          '0x873EB0641ac9077F27897b2cbF804D408256fEBb'
        );

        if (receipt.transactionHash) {
          setNetworkResponse({
            status: 'complete',
            message: (
              <Text>
                ¡Transferencia completa!{' '}
                <Text
                  onPress={() => Linking.openURL(`${skale.blockExplorerUrl}/tx/${receipt.transactionHash}`)}
                  style={{ color: 'blue' }}
                >
                  Ver transacción
                </Text>
              </Text>
            ),
          });
        } else {
          console.log(`No se pudo enviar ${amountValue}`);
          setNetworkResponse({
            status: 'error',
            message: 'Error desconocido al enviar la transacción.',
          });
        }
      }
    } catch (error) {
      console.error({ error });
      setNetworkResponse({
        status: 'error',
        message: error.message || 'Ocurrió un error al transferir tokens.',
      });
    }
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 20 }}>
        <Button
          title="Verificar dirección"
          onPress={() => {
            if (userData && userData.address) {
              Linking.openURL(`https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com/address/${userData.address}`);
            }
          }}
        />
        <Text style={{ marginBottom: 10 }}>Saldo: {(Number(balance) / 1000000000000000000).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} eCAN</Text>

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          placeholder="Dirección de destino"
          onChangeText={handleDestinationAddressChange}
          value={destinationAddress}
        />

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          placeholder="Cantidad"
          onChangeText={handleAmountChange}
          value={amount}
          keyboardType="numeric"
        />

        <Button
          title={`Firmar y Enviar ${amount} eCAN`}
          onPress={sendTokenTransaction}
          disabled={!amount || networkResponse.status === 'pending'}
        />

        {networkResponse.status && (
          <>
            {networkResponse.status === 'pending' && <Text>La transferencia está pendiente...</Text>}
            {networkResponse.status === 'complete' && <Text>{networkResponse.message}</Text>}
            {networkResponse.status === 'error' && <Text>Ocurrió un error al transferir tokens: {networkResponse.message}</Text>}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default Wallet;