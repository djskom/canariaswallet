import Web3 from 'web3';
import { skale } from '../models/Chain';

export class TransactionService {
  static async getTransactions(address: string) { // Agrega el tipo explícito 'string'
    const web3 = new Web3(new Web3.providers.HttpProvider(skale.rpcUrl));

    try {
      const transactions = await this.getTransactionsFromApi(address);
      return transactions;
    } catch (error) {
      throw new Error('Error fetching transaction history');
    }
  }

  static async getTransactionsFromApi(address: string) { // Agrega el tipo explícito 'string'
    const apiUrl = `https://api.chaos.skale.network/getTransactions?address=${address}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Error fetching transaction history');
    }

    const data = await response.json();
    return data.transactions;
  }
}
