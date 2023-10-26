import { ethers } from 'ethers';
import FCCTokenAbi from "../abi/FCTToken.json";
import Payer from './payer';

const DIFFICULTY: ethers.BigNumber = ethers.BigNumber.from(1);

export async function sendToken(
  amount: number,
  from: string,
  to: string,
  privateKey: string,
  tokenContractAddress: string,
): Promise<ethers.ContractReceipt> {
  try {
    const rpcUrl: string = "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix";
    const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

    const payer = new Payer(tokenContractAddress, FCCTokenAbi.abi, provider, privateKey); // Crear una instancia de la clase Payer
    const receipt = await payer.pay(to, amount);

    return receipt;
  } catch (error) {
    console.error("Error en la transferencia:", error);
    throw error;
  }
}

export async function mineGasForTransaction(provider: ethers.providers.JsonRpcProvider, tx: any) {
  if (tx.from === undefined || tx.nonce === undefined) {
    throw new Error("Not enough fields for mining gas (from, nonce)");
  }
  if (!tx.gas) {
    console.log("Estimating gas...");
    tx.gas = await provider.estimateGas(tx);
    console.log("Gas estimated:", tx.gas.toString());
  }
  let address: string = tx.from;
  let nonce: string = ethers.utils.hexlify(tx.nonce);
  let gas: string = ethers.utils.hexlify(tx.gas);
  tx.gasPrice = await mineFreeGas(gas, address, nonce, provider);
}

function mineFreeGas(gasAmount: string, address: string, nonce: string, provider: ethers.providers.JsonRpcProvider) {
  console.log('Mining free gas: ', gasAmount.toString());
  let nonceHash: string = ethers.utils.keccak256(nonce);
  let addressHash: string = ethers.utils.keccak256(address);
  console.log('Nonce hash:', nonceHash);
  console.log('Address hash:', addressHash);
  let nonceAddressXOR: ethers.BigNumber = ethers.BigNumber.from(nonceHash).xor(ethers.BigNumber.from(addressHash));
  console.log('Nonce-Address XOR:', nonceAddressXOR.toString());
  let maxNumber: ethers.BigNumber = ethers.constants.MaxUint256;
  let divConstant: ethers.BigNumber = maxNumber.div(DIFFICULTY);
  console.log('Max number:', maxNumber.toString());
  console.log('Div constant:', divConstant.toString());
  let candidate: ethers.BigNumber;
  while (true) {
    candidate = ethers.BigNumber.from(ethers.utils.hexlify(ethers.utils.randomBytes(32)));
    console.log('Candidate:', candidate.toString());
    let candidateHex = ethers.utils.hexZeroPad(candidate.toHexString(), 32);
    let candidateHash: string = ethers.utils.keccak256(candidateHex);
    console.log('Candidate hash:', candidateHash);
    let resultHash: ethers.BigNumber = nonceAddressXOR.xor(ethers.BigNumber.from(candidateHash));
    console.log('Result hash:', resultHash.toString());
    let externalGas: number = divConstant.div(resultHash).toNumber();
    console.log('External gas:', externalGas);
    if (externalGas >= parseInt(gasAmount)) {
      break;
    }
  }
  return candidate.toString();
}
