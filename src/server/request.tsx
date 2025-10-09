import axios from 'axios';
import { store } from 'redux/store';
import { clearUser } from 'redux/slices/auth';

const request = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 12000,
});

request.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('emu_token');
    if (access_token) {
      config.headers.Authorization = 'Bearer ' + access_token;
    }
    return config;
  },

  (error) => errorHandler(error),
);

function errorHandler(error: any) {
  if (error?.response) {
    if (error?.response?.status === 403 || error?.response?.status === 401) {
      localStorage.removeItem('token');
      store.dispatch(clearUser());
    }
  }
  console.error('error => ', error);

  return Promise.reject(error.response);
}

request.interceptors.response.use((response) => response.data, errorHandler);

export default request;
