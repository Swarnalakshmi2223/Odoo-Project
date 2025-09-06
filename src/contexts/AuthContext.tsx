import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  ecoPoints: number;
  badges: string[];
  totalImpact: {
    co2Saved: number;
    waterSaved: number;
    energySaved: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing auth on mount
    const storedUser = localStorage.getItem('ecofinds-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - In real app, this would be an actual API call
      const users = JSON.parse(localStorage.getItem('ecofinds-users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser && existingUser.password === password) {
        const userData: User = {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          ecoPoints: existingUser.ecoPoints || 0,
          badges: existingUser.badges || [],
          totalImpact: existingUser.totalImpact || { co2Saved: 0, waterSaved: 0, energySaved: 0 }
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('ecofinds-user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('ecofinds-users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        return false; // User already exists
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In real app, this would be hashed
        ecoPoints: 50, // Welcome bonus
        badges: ['🌱 Welcome Warrior'],
        totalImpact: { co2Saved: 0, waterSaved: 0, energySaved: 0 }
      };

      users.push(newUser);
      localStorage.setItem('ecofinds-users', JSON.stringify(users));

      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        ecoPoints: newUser.ecoPoints,
        badges: newUser.badges,
        totalImpact: newUser.totalImpact
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('ecofinds-user', JSON.stringify(userData));
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ecofinds-user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('ecofinds-user', JSON.stringify(updatedUser));
      
      // Also update in users array
      const users = JSON.parse(localStorage.getItem('ecofinds-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('ecofinds-users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};