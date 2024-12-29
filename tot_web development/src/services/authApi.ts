import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users'; // Your backend API URL

// Login API request
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; 
  } catch (error) {
    console.error('Login error', error);
    throw error; 
  }
};

// Register API request
export const register = async (name: string, email: string, password: string, role: string) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { name, email, password, role });
    return response.data; // Return user data
  } catch (error) {
    console.error('Registration error', error);
    throw error;
  }
};
