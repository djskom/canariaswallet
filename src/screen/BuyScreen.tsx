import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { ethers } from 'ethers';
import BaseMiner from '../skale-miner';
import FCCTokenAbi from '../abi/FCTToken.json';

interface BuyScreenProps {
  account: {
    address: string;
    privateKey: string;
  } | undefined;
}

const BuyScreen: React.FC<BuyScreenProps> = ({ account }) => {
  const [faucetResponse, setFaucetResponse] = useState<string>('');

  const handleFaucet = async () => {
    try {
      if (account) {
        console.log("Faucet initiated for address:", account.address);

        const rpcUrl = 'https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix';
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        console.log("Provider:", provider);

        const gasLimit = 300000;
        const gasPrice = await provider.getGasPrice();
        const gasPriceValue = gasPrice.toNumber();
        console.log("Gas Price:", gasPriceValue);

        const baseMiner = new BaseMiner();
        const gasMined = await baseMiner.mineGasForTransaction(await provider.getTransactionCount(account.address), gasPriceValue, account.address);
        console.log("Gas Mined:", gasMined);

        const wallet = new ethers.Wallet(account.privateKey, provider);
        console.log("Wallet:", wallet);

        const tokenContract = new ethers.Contract('0x873EB0641ac9077F27897b2cbF804D408256fEBb', FCCTokenAbi.abi, wallet);
        console.log("Token Contract:", tokenContract);

        const faucetAmount = ethers.utils.parseUnits('100', 18); // Change this amount as needed
        console.log("Faucet Amount:", faucetAmount.toString());

        const transaction = await tokenContract.faucet(account.address, faucetAmount, {
          gasLimit,
          gasPrice: gasPrice.toString(),
        });
        console.log("Transaction:", transaction);

        const receipt = await transaction.wait();
        console.log("Receipt:", receipt);

        if (receipt.transactionHash) {
          setFaucetResponse('Faucet transaction successful.');
        } else {
          setFaucetResponse('Unknown error occurred while processing faucet transaction.');
        }
      }
    } catch (error: any) {
      console.error({ error });
      setFaucetResponse(error.message || 'Error occurred while processing faucet transaction.');
    }
  };

  return (
    <View style={{ marginTop: 30 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Faucet</Text>
      <Button title="Get 100 Ecan from Faucet" onPress={handleFaucet} disabled={!account} />
      {faucetResponse !== '' && <Text>{faucetResponse}</Text>}
    </View>
  );
};


export default BuyScreen;
