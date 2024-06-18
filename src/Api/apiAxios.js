import axios from 'axios';
import { dataDecrypt } from '../utils/data-decrypt';

const bearerItem = localStorage.getItem('bearer')

const api = axios.create({
  baseURL: 'https://coopeapi.azurewebsites.net/api/',
  headers: {
    Authorization:`Bearer ${dataDecrypt(bearerItem)}`
  }
});

export default api;
