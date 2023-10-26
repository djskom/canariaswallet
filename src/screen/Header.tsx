import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const Header = () => {
  const [userName, setUserName] = useState<string | null>(null); // Asegura que setUserName acepta string | null

  useEffect(() => {
    // Obtener el nombre de usuario actual al cargar el componente
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || null); // Usa user.displayName o null si no existe
      } else {
        setUserName(null);
      }
    });

    return () => {
      // Limpia el listener al desmontar el componente
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      // Puedes realizar acciones adicionales después de cerrar sesión si es necesario
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Manejar errores de cierre de sesión si es necesario
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../logo.png')} style={styles.logo} />
      {userName && <Text style={styles.userName}>Hola, {userName}</Text>}
      {userName && (
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Cerrar Sesión</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff', // Color de fondo del encabezado
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    fontSize: 16,
    color: 'blue', // Color del botón de cierre de sesión
  },
});

export default Header;
