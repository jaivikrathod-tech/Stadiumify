import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateTicket } from '../services/mockData';

type UserProfile = {
  id: string;
  ticket_id: string;
  user_name: string;
  section_id: string;
  row_id: string;
  seat_number: string;
  current_location: { latitude: number; longitude: number };
};

type AuthContextType = {
  user: UserProfile | null;
  login: (ticketId: string, userName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const loadSession = async () => {
      try {
        const sessionStr = await AsyncStorage.getItem('stadiumify_session');
        if (sessionStr) {
          const sessionData = JSON.parse(sessionStr);
          // Check if session is expired (24 hours)
          const now = new Date().getTime();
          if (now - sessionData.timestamp < 24 * 60 * 60 * 1000) {
            setUser(sessionData.user);
          } else {
            await AsyncStorage.removeItem('stadiumify_session');
          }
        }
      } catch (error) {
        console.error('Failed to load session', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = async (ticketId: string, userName: string) => {
    const validUser = validateTicket(ticketId, userName);
    if (validUser) {
      setUser(validUser);
      await AsyncStorage.setItem(
        'stadiumify_session',
        JSON.stringify({ user: validUser, timestamp: new Date().getTime() })
      );
      return true;
    }
    return false;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('stadiumify_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
