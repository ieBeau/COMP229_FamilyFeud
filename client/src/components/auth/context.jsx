

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const
    [isLoggedIn, setIsLoggedIn] = useState(false),
    [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/validate', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUser(data.user);
        }
        else {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
      catch (e) {
        console.error('Session check failed:', e);
        setIsLoggedIn(false);
        setUser(null);
      };
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();

      setIsLoggedIn(true);
      setUser(data.user);

      return { success: true };
    }
    catch (e) {
      console.error('Login error:', e);
      return { success: false, message: e.message };
    };
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setIsLoggedIn(false);
      setUser(null);
      return { success: true };
    }
    catch (e) {
      console.error('Logout error:', e);
      return { success: false, message: e.message };
    };
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
