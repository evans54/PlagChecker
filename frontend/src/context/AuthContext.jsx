import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for demo
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '0712345678',
    slots: 5,
    joinedDate: '2024-01-15',
    totalUploads: 12,
    subscriptionType: 'pay-as-you-go'
  });

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      setUser({
        id: 1,
        name: 'John Doe',
        email: email,
        phone: '0712345678',
        slots: 5,
        joinedDate: '2024-01-15',
        totalUploads: 12,
        subscriptionType: 'pay-as-you-go'
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      setUser({
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        slots: 1, // Free slot for new users
        joinedDate: new Date().toISOString().split('T')[0],
        totalUploads: 0,
        subscriptionType: 'free'
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }));
  };

  const updateSlots = (newSlots) => {
    setUser(prev => ({ ...prev, slots: newSlots }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    updateSlots
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
