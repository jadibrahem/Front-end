import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/login/';

const login = async (username, password) => {
  const response = await axios.post(API_URL, {
    username,
    password,
  });
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  login,
  logout,
  getCurrentUser,
};