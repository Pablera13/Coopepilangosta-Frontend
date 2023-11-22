import axios from 'axios';

const api = axios.create({
  baseURL: 'https://coopepilangosta.azurewebsites.net/api/',
  headers: {
    Authorization:`Bearer ${localStorage.getItem('bearer')}`
  }
});

export default api;
