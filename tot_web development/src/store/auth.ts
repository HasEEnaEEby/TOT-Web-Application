export type UserRole = 'restaurant' | 'customer' | 'guest';

export interface User {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDarkMode: boolean;
}