// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // baseURL: 'http://SEU_IP_LOCAL:5000/api', 
  // Conectado ao backend oficial no Render
  baseURL: 'https://projeto-senac-geraldo-1.onrender.com/api/v1', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error('Erro ao recuperar token', err);
  }
  return config;
});

export default api;