
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

export const login = (credentials) => {
  return axios.post(`${BASE_URL}/auth/login`, credentials, { withCredentials: true });
};

export const register = (credentials) => {
  return axios.post(`${BASE_URL}/auth/register`, credentials, { withCredentials: true });
};
