// store/walletReducer.js
const initialState = {
    walletGenerated: false,
  };
  
  const walletReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'WALLET_GENERATED':
        return {
          ...state,
          walletGenerated: true,
        };
      default:
        return state;
    }
  };
  
  export default walletReducer;
  