import axios from 'axios';

const API_URL = 'https://halotrust.pythonanywhere.com/login/';
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
  localStorage.removeItem('currentUser');
  sessionStorage.removeItem('token'); 
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  login,
  logout,
  getCurrentUser,
};