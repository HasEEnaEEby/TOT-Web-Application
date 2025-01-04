export const API_URL = "http://localhost:4000/api"; 

export const AUTH_CONSTANTS = {
  MAX_TABLE_NUMBER: 50,
  GUEST_SESSION_DURATION: 3 * 60 * 60, 
} as const;
  
  export const ROUTES = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    GUEST: '/guest',
    HOME: '/',
  };
  
  export const THEMES = {
    light: {
      primary: 'bg-rose-50 text-gray-900',
      secondary: 'bg-white',
      accent: 'text-rose-600',
    },
    dark: {
      primary: 'bg-gray-900 text-white',
      secondary: 'bg-gray-800',
      accent: 'text-rose-400',
    },
  } as const;