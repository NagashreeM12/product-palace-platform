
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'customer' | 'vendor') => Promise<boolean>;
  logout: () => void;
  isVendor: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers = [
  { id: '1', name: 'Vendor User', email: 'vendor@example.com', password: 'password', role: 'vendor' as const },
  { id: '2', name: 'Customer User', email: 'customer@example.com', password: 'password', role: 'customer' as const }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check for saved user in localStorage on component mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      return true;
    } else {
      toast.error('Invalid email or password');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'customer' | 'vendor'): Promise<boolean> => {
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
      toast.error('Email already in use');
      return false;
    }

    // Mock user creation
    const newUser = {
      id: `${mockUsers.length + 1}`,
      name,
      email, 
      role
    };

    // Add to mock users (in a real app, this would be a database operation)
    mockUsers.push({ ...newUser, password });

    // Log in the user after registration
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    toast.success(`Welcome, ${name}!`);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  };

  const isVendor = user?.role === 'vendor';

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isVendor
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
