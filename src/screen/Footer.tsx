import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FooterProps {
  navigation: any; // Puedes usar 'any' si no deseas especificar un tipo más preciso
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Agrega los elementos del footer aquí */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Account')}
      >
        <Text>Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Wallet')}
      >
        <Text>Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Transfer')}
      >
        <Text>Transfer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Staking')}
      >
        <Text>Staking</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Buy')}
      >
        <Text>Buy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff', // Color de fondo del pie de página
    height: 50, // Altura del pie de página
    borderTopWidth: 1, // Línea superior para separar el pie de página del contenido
    borderColor: '#ccc', // Color de la línea superior
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Footer;
