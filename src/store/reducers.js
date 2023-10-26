// store/reducers.js
import { combineReducers } from 'redux';
import walletReducer from './walletReducer'; // Importa el reductor de la billetera

const rootReducer = combineReducers({
  wallet: walletReducer, // Agrega el reductor de la billetera aquí
});

export default rootReducer;
