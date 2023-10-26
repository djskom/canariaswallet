export type Chain = {
    chainId: string;
    name: string;
    blockExplorerUrl: string;
    rpcUrl: string;
  };
  

export const skale: Chain = {
    chainId: '1351057110',
    name: 'skale',
    blockExplorerUrl: 'https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com/',
    rpcUrl: 'https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix',
};
export const CHAINS_CONFIG = {
   
   
    [skale.chainId]: skale
   
};