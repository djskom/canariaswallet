import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, TextInput, View, Text, Button } from 'react-native';
import FCCTokenAbi from "../abi/FCTToken.json";
import { ethers } from 'ethers';
import BaseMiner from "../skale-miner";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native'; 
import BuyScreen from './BuyScreen';
const DIFFICULTY = ethers.BigNumber.from(1);

interface Account {
  address: string;
  balance: string;
  privateKey: string;
}

interface AccountDetailProps {
  account: Account | undefined;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ account }) => {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState('0');
  const [balance, setBalance] = useState(account ? account.balance.toString() : '0');
  const [contacts, setContacts] = useState<string[]>([]);

  const [networkResponse, setNetworkResponse] = useState<{
    status: null | 'pending' | 'complete' | 'error';
    message: string | React.ReactElement;
  }>({
    status: null,
    message: '',
  });

  useEffect(() => {
    if (account) {
      const fetchData = async () => {
        const rpcUrl = "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  
        const tokenAbi = FCCTokenAbi.abi;
        const tokenContract = new ethers.Contract('0x873EB0641ac9077F27897b2cbF804D408256fEBb', tokenAbi, provider);
        const tokenBalance = await tokenContract.balanceOf(account.address);
  
        setBalance(tokenBalance.toString());
  
        // Intervalo para actualizar el saldo cada 10 segundos
        const interval = setInterval(async () => {
          const updatedTokenBalance = await tokenContract.balanceOf(account.address);
          setBalance(updatedTokenBalance.toString());
        }, 5000); 
        return () => clearInterval(interval); 
      };
      fetchData();
    }
  }, [account]);
  const handleSelectContact = (selectedAddress: string) => {
    setDestinationAddress(selectedAddress);
  };
  const handleDestinationAddressChange = (text: string) => {
    setDestinationAddress(text);
  };

  const handleAmountChange = (text: string) => {
    setAmount(text);
  };

  const sendTokenTransaction = async () => {
    try {
      const amountValue = parseFloat(amount);
  
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("La cantidad debe ser un número positivo.");
      }
  
      if (account) {
        const rpcUrl = "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        console.log("Provider:", provider);
  
        const gasLimit = 300000;
        const gasPrice = await provider.getGasPrice();
        console.log("Gas Price:", gasPrice.toString());
        const gasPriceValue = gasPrice.toNumber(); 
  
        const baseMiner = new BaseMiner(); // Instancia de la clase BaseMiner
        const gasMined = await baseMiner.mineGasForTransaction(await provider.getTransactionCount(account.address), gasPriceValue, account.address);
        console.log("Gas Mined:", gasMined);
  
        const wallet = new ethers.Wallet(account.privateKey, provider);
        console.log("Wallet:", wallet);
  
        const tokenContract = new ethers.Contract('0x873EB0641ac9077F27897b2cbF804D408256fEBb', FCCTokenAbi.abi, wallet);
        console.log("Token Contract:", tokenContract);
  
        const amountInWei = ethers.utils.parseUnits(amount, 18);
  
        const transaction = await tokenContract.transfer(destinationAddress, amountInWei, {
          gasLimit,
          gasPrice: gasPrice.toString(),
        });
        console.log("Transaction:", transaction);
  
        const receipt = await transaction.wait();
        console.log("Receipt:", receipt);
  
        if (receipt.transactionHash) {
          setNetworkResponse({
            status: 'complete',
            message: (
              <Text>
                ¡Transferencia completa!{' '}
                <Text
                  onPress={() => Linking.openURL(`https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com/tx/${receipt.transactionHash}`)}
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
    } catch (error: any) {
      console.error({ error });
      setNetworkResponse({
        status: 'error',
        message: error.message || 'Ocurrió un error al transferir tokens.',
      });
    }
  };
  
  

  const handleSaveToContacts = async () => {
    if (destinationAddress.trim() !== '' && !contacts.includes(destinationAddress)) {
      const updatedContacts = [...contacts, destinationAddress];
      setContacts(updatedContacts);
      await saveAddressToDevice(destinationAddress); // Guarda la dirección en el dispositivo
    }
  };
  
  const saveAddressToDevice = async (address: string) => {
    try {
      let existingContacts = await AsyncStorage.getItem('savedContacts');
      existingContacts = existingContacts ? JSON.parse(existingContacts) : [];
  
      if (Array.isArray(existingContacts) && !existingContacts.includes(address)) {
        existingContacts.push(address);
        await AsyncStorage.setItem('savedContacts', JSON.stringify(existingContacts));
      }
    } catch (error) {
      console.error('Error al guardar la dirección:', error);
    }
  };
  

  const loadSavedContacts = async () => {
    try {
      const savedContacts = await AsyncStorage.getItem('savedContacts');
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
      }
    } catch (error) {
      console.error('Error al cargar las direcciones guardadas:', error);
    }
  };

  useEffect(() => {
    loadSavedContacts();
  }, []);

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 20 }}>
        <Button
          title="Verificar dirección"
          onPress={() =>
            Linking.openURL(`https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com/address/${account?.address}`)
          }
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

        <Button
          title="Guardar en la libreta de direcciones"
          onPress={handleSaveToContacts} // Aquí se ha corregido
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
<Text style={{ marginTop: 20, marginBottom: 10, fontWeight: 'bold' }}>Contactos guardados:</Text>
{contacts.map((contact, index) => (
  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
    <Text style={{ flex: 1 }}>{contact}</Text>
    <TouchableOpacity
      style={{ backgroundColor: '#DDDDDD', padding: 5, borderRadius: 5 }}
      onPress={() => handleSelectContact(contact)}
    >
      <Text style={{ fontSize: 12 }}>Seleccionar</Text>
    </TouchableOpacity>
  </View>
))}

        {networkResponse.status && (
          <>
            {networkResponse.status === 'pending' && <Text>La transferencia está pendiente...</Text>}
            {networkResponse.status === 'complete' && <Text>{networkResponse.message}</Text>}
            {networkResponse.status === 'error' && <Text>Ocurrió un error al transferir tokens: {networkResponse.message}</Text>}
          </>
        )}
        <BuyScreen account={account} />
      </View>
    </ScrollView>
  );
};

export default AccountDetail;
