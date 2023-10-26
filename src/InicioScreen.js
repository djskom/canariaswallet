// InicioScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const InicioScreen = ({ navigation }) => {
  useEffect(() => {
    // Redirigir a la página de registro/login después de 5 segundos
    const timer = setTimeout(() => {
      navigation.navigate('Registro');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('./logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default InicioScreen;
