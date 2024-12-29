import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:4000/api'; 

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; 
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred during login.');
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { email, password });
    return response.data; 
  } catch (error) {

    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Sign-up failed');
    }
    throw new Error('An unexpected error occurred during sign-up.');
  }
};