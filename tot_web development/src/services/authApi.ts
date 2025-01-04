import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/login`, { email, password });
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'An error occurred while logging in';
      throw new Error(message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const register = async (name: string, email: string, password: string, role: string = 'customer') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
      name,
      email,
      password,
      role,
    });
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'An error occurred while signing up';
      throw new Error(message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};
