import { Wallet } from 'ethers';
import { Account } from '../models/Account';

export function generateAccount(seedPhrase: string = "", index: number = 0): { account: Account, seedPhrase: string } {
  let wallet: Wallet;

  // Si no se proporciona una frase de semilla, generamos un mnemónico aleatorio usando un CSPRNG
  if (seedPhrase === "") {
    const randomWallet = Wallet.createRandom();
    if (randomWallet.mnemonic) {
      seedPhrase = randomWallet.mnemonic.phrase;
    } else {
      throw new Error("Fallo al generar un mnemónico.");
    }
  }

  // Si la frase de semilla no contiene espacios, probablemente sea un mnemónico
  if (seedPhrase.includes(" ")) {
    wallet = Wallet.fromMnemonic(seedPhrase, `m/44'/60'/0'/0/${index}`);
  } else {
    wallet = new Wallet(seedPhrase);
  }

  if (!wallet) {
    throw new Error("Fallo al crear una billetera.");
  }

  const { address } = wallet;
  const account = { address, privateKey: wallet.privateKey, balance: "0" };
  
  // Si la frase de semilla no incluye espacios, entonces es en realidad una clave privada, así que devolvemos una cadena en blanco.
  return { account, seedPhrase: seedPhrase.includes(" ") ? seedPhrase : "" };
}

export function shortenAddress(str: string, numChars: number = 4) {
  return `${str.substring(0, numChars)}...${str.substring(str.length - numChars)}`;
}

export function toFixedIfNecessary(value: string, decimalPlaces: number = 2) {
  return +parseFloat(value).toFixed(decimalPlaces);
}
