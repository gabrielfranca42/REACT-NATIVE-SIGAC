import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones padrão do Expo

import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MaterialScreen from './src/screens/MaterialScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Este componente é o menu inferior com as 4 opções que você pediu
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#1e1e1e' },
        headerTintColor: '#fff',
        tabBarStyle: { 
          backgroundColor: '#1e1e1e', 
          borderTopColor: '#333',
          paddingBottom: 5,
          height: 60
        },
        tabBarActiveTintColor: '#ff6600', // Cor do ícone ativo
        tabBarInactiveTintColor: '#888',   // Cor do ícone inativo
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Define os ícones para cada aba do rodapé automaticamente
          if (route.name === 'Dashboard') {
            iconName = 'grid-outline';
          } else if (route.name === 'Material') {
            iconName = 'cloud-upload-outline';
          } else if (route.name === 'Perfil') {
            iconName = 'person-outline';
          } else if (route.name === 'Sair') {
            iconName = 'log-out-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Painel' }} />
      <Tab.Screen name="Material" component={MaterialScreen} options={{ title: 'Subir Material' }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Meu Perfil' }} />
      {/* A aba Sair vai usar o mesmo componente de perfil por segurança estrutural, mas vamos interceptar o clique */}
      <Tab.Screen 
        name="Sair" 
        component={ProfileScreen} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Previne a navegação para a tela
            navigation.replace('Login'); // Joga o usuário de volta para o login
          },
        })}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        {/* Quando logar, o Stack chama o grupo de abas (Menu inferior) */}
        <Stack.Screen 
          name="Home" 
          component={HomeTabs} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}