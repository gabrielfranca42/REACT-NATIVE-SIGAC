// src/services/api.js
import axios from 'axios';

const api = axios.create({
  // SUBSTITUA PELA SUA URL QUANDO SUBIR O BACKEND (Ex: http://192.168.100.29:5000)
  baseURL: 'http://SEU_IP_LOCAL:5000/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;