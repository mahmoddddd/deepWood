'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
       try {
         // Attempt to fetch current user data
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
         });
         const data = await res.json();
         if (data.success) {
            setUser(data.data);
         } else {
            localStorage.removeItem('token');
            setUser(null);
         }
       } catch (err) {
         console.error("Auth check failed", err);
         localStorage.removeItem('token');
         setUser(null);
       }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('token', data.token);
            // Optionally set user immediately but best to fetch profile
            await checkUserLoggedIn();
            return { success: true };
        } else {
            return { success: false, error: data.error || 'Invalid credentials' };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
  };

  const register = async (userData) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('token', data.token);
            await checkUserLoggedIn();
            return { success: true };
        } else {
            return { success: false, error: data.error || 'Registration failed' };
        }
      } catch (error) {
          return { success: false, error: 'Network error' };
      }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.refresh(); // Refresh to update UI states
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
