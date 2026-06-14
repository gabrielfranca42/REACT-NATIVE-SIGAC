import React from 'react';
import { Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MaterialScreen from './src/screens/MaterialScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const { theme } = useTheme(); // Pega o tema atual (light ou dark)

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        headerRight: () => (
          <Image 
            source={require('./assets/senac-logo.png')} 
            style={{ width: 80, height: 30, marginRight: 15 }} 
            resizeMode="contain" 
          />
        ),
        tabBarStyle: { 
          backgroundColor: theme.tabBar, 
          borderTopColor: theme.border,
          paddingBottom: 5,
          height: 60
        },
        tabBarActiveTintColor: theme.button,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'grid-outline';
          else if (route.name === 'Material') iconName = 'cloud-upload-outline';
          else if (route.name === 'Perfil') iconName = 'person-outline';
          else if (route.name === 'Sair') iconName = 'log-out-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Painel' }} />
      <Tab.Screen name="Material" component={MaterialScreen} options={{ title: 'Subir Material' }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Meu Perfil' }} />
      <Tab.Screen 
        name="Sair" 
        component={ProfileScreen} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.replace('Login');
          },
        })}
      />
    </Tab.Navigator>
  );
}

// Criamos um componente interno para gerenciar a StatusBar dinâmica
function MainNavigation() {
  const { theme } = useTheme();
  return (
    <NavigationContainer>
      <StatusBar style={theme.statusBar} />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainNavigation />
    </ThemeProvider>
  );
}