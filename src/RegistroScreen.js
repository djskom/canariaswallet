import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const RegistroScreen = () => {
  const navigation = useNavigation();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const [emailInicioSesion, setEmailInicioSesion] = useState('');
  const [contraseñaInicioSesion, setContraseñaInicioSesion] = useState('');

  const validarDatos = (nombre, email, contraseña, esRegistro) => {
    if (esRegistro && (!nombre || !email || !contraseña)) {
      alert('Por favor, completa todos los campos.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('El correo electrónico no es válido.');
      return false;
    }

    if (esRegistro && contraseña.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const guardarDatos = async () => {
    if (!validarDatos(nombre, email, contraseña, true)) {
      return;
    }

    try {
      await auth().createUserWithEmailAndPassword(email, contraseña);

      const user = auth().currentUser;

      await user.updateProfile({
        displayName: nombre,
      });

      // Aquí puedes realizar acciones adicionales después de guardar los datos
      navigation.navigate('Wallet'); // Cambia 'PantallaDeseada' al nombre de tu pantalla deseada
    } catch (error) {
      console.error('Error al crear la cuenta:', error);
      alert('No se pudo crear la cuenta. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const iniciarSesion = async () => {
    if (!validarDatos('', emailInicioSesion, contraseñaInicioSesion, false)) {
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(emailInicioSesion, contraseñaInicioSesion);

      // Aquí puedes realizar acciones adicionales después de iniciar sesión
      navigation.navigate('Wallet'); // Cambia 'PantallaDeseada' al nombre de tu pantalla deseada
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('No se pudo iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  const cerrarSesion = async () => {
    try {
      await auth().signOut();
      // Puedes redirigir a la pantalla de inicio de sesión o realizar otras acciones
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('No se pudo cerrar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
      />
      <Button title="Registrarse" onPress={guardarDatos} />

      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={emailInicioSesion}
        onChangeText={setEmailInicioSesion}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseñaInicioSesion}
        onChangeText={setContraseñaInicioSesion}
        secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={iniciarSesion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingLeft: 10,
  },
});

export default RegistroScreen;
