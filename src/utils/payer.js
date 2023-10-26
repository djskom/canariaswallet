import { ethers } from 'ethers';
import { mineGasForTransaction } from '../skale-miner';


export default class Payer {
  constructor(tokenContractAddress, abi, provider, privateKey) {
    this.tokenContractAddress = tokenContractAddress;
    this.provider = provider;
    this.privateKey = privateKey;
    this.abi = abi; // Asegúrate de declarar la propiedad abi en el constructor
  }

  async pay(to, amount) {
    const wallet = new ethers.Wallet(this.privateKey, this.provider);
    const tokenContract = new ethers.Contract(this.tokenContractAddress, this.abi, wallet);

    const amountInWei = ethers.utils.parseUnits(String(amount), 18);

    const gasLimit = 300000;
    const gasPrice = await this.provider.getGasPrice();

    await mineGasForTransaction(this.provider, {
      from: wallet.address,
      nonce: await this.provider.getTransactionCount(wallet.address),
      gas: undefined,
    });

    const powEthers = new powEthers(this.provider, wallet);
    await powEthers.mineGasForTransaction(this.provider, {
      from: wallet.address,
      nonce: await this.provider.getTransactionCount(wallet.address),
      gas: undefined,
    });

    const transaction = await tokenContract.transfer(to, amountInWei, {
      gasLimit,
      gasPrice: gasPrice.toString(),
    });

    const receipt = await transaction.wait();

    return receipt;
  }
}
