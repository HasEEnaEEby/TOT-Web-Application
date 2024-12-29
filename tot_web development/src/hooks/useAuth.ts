import { useState, useEffect } from 'react';
import { login, register } from '../services/authApi'; 

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null); // To store user data
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check localStorage for a stored user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set user if it exists
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await login(email, password); // Call login API
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user data in localStorage
      localStorage.setItem('token', data.token); // Store JWT token
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string, role: string) => {
    setLoading(true);
    try {
      const data = await register(name, email, password, role); 
      localStorage.setItem('user', JSON.stringify(data)); // Store user data in localStorage
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
