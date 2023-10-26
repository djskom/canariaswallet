import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import Header from './Header'; // Importa el componente Header
import Footer from './Footer'; // Importa el componente Footer

const TransferScreen = () => {
  const navigation = useNavigation(); // Obtiene la navegación utilizando useNavigation

  return (
    <View>
      <Header />
      <Text>Transfer Screen</Text>
      
      <Footer navigation={navigation} /> 
    </View>
  );
};

export default TransferScreen;
