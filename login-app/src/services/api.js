// src/services/api.js
import axios from 'axios';

const api = axios.create({
  
  baseURL: 'http://SEU_IP_LOCAL:5000/api', 
  // Conectado ao backend oficial no Render
  //baseURL: 'https://projeto-senac-geraldo-1.onrender.com/api/v1', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;