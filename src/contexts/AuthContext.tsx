import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  adminLogin: () => void;
  adminLogout: () => void;
  updateUser: (details: Partial<User>) => void;
  lastUserPath: string;
  setLastUserPath: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastUserPath, setLastUserPath] = useState('/');


  const login = () => {
    // In a real app, user data would come from an API
    setUser({ name: 'Alice Johnson', email: 'alice.j@example.com' });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const adminLogin = () => {
    setIsAdmin(true);
  };
  
  const adminLogout = () => {
    setIsAdmin(false);
  };

  const updateUser = (details: Partial<User>) => {
    if(user) {
        setUser(prev => ({...prev!, ...details}));
        // In a real app, you would also make an API call to persist this change.
        console.log("User updated:", {...user, ...details});
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout, adminLogin, adminLogout, updateUser, lastUserPath, setLastUserPath }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};