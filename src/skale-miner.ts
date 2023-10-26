import { BigNumber, utils } from 'ethers';

interface Params {
  difficulty: BigNumber;
}

const MAX_NUMBER = BigNumber.from(2).pow(256).sub(1);

export default class BaseMiner {
  public difficulty: BigNumber = BigNumber.from(1);

  constructor(params?: Params) {
    if (params && params.difficulty) this.difficulty = params.difficulty;
  }

  public async mineGasForTransaction(
    nonce: string | number,
    gas: string | number,
    from: string
  ): Promise<BigNumber> {
    let address = from;
    let nonceBN = typeof nonce === 'string' ? BigNumber.from(nonce) : BigNumber.from(nonce);
    let gasBN = typeof gas === 'string' ? BigNumber.from(gas) : BigNumber.from(gas);
    return await this.mineFreeGas(gasBN.toNumber(), address, nonceBN.toNumber());
  }

  public async mineFreeGas(gasAmount: number, address: string, nonce: number): Promise<BigNumber> {
    let nonceHash = BigNumber.from(utils.keccak256(utils.arrayify(utils.hexlify(nonce))));
    let addressHash = BigNumber.from(utils.keccak256(utils.toUtf8Bytes(address)));
    let nonceAddressXOR = nonceHash.xor(addressHash);
    let divConstant = MAX_NUMBER.div(this.difficulty);
    let candidate: Uint8Array;
    let iterations = 0;
    const start = Date.now();
    while (true) {
      candidate = utils.randomBytes(32);
      let candidateHash = BigNumber.from(utils.keccak256(candidate));
      let resultHash = nonceAddressXOR.xor(candidateHash);
      let externalGas = divConstant.div(resultHash);
      if (externalGas.gte(gasAmount)) {
        break;
      }
      // cada 2k iteraciones, cede al bucle de eventos
      if (iterations++ % 5000 === 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      }
    }
    const end = Date.now();
    console.log(`Tiempo de ejecución de PoW: ${end - start} ms`);
    return BigNumber.from(candidate);
  }
}
