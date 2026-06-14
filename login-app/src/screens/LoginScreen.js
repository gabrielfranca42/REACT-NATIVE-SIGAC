import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!identifier || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Credenciais de demonstração ajustadas
    const CREDENCIAIS_DEMO = {
      usuario: 'alunoteste',
      senha: '123'
    };

    if (identifier === CREDENCIAIS_DEMO.usuario && password === CREDENCIAIS_DEMO.senha) {
      console.log('Login correto! Redirecionando para as Abas Principais (Home)...');
      
      // Redireciona para a rota 'Home' do App.js que contém as abas do footer
      navigation.replace('Home'); 
    } else {
      Alert.alert('Erro de Autenticação', 'Matrícula ou senha incorretos.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.formContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../assets/senac-logo.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <Text style={[styles.title, { color: theme.text }]}>ValidaUP</Text>
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Faça login para acessar sua carga horária</Text>

        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
          placeholder="E-mail ou Matrícula"
          placeholderTextColor="#888"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
          placeholder="Senha"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.button }]} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#1e1e1e',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  button: {
    backgroundColor: '#004a8d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});