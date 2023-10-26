import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initializeApp } from '@react-native-firebase/app';

// Inicializa Firebase antes de renderizar la aplicación
initializeApp({
  // Configuración de Firebase aquí
});

AppRegistry.registerComponent(appName, () => App);
