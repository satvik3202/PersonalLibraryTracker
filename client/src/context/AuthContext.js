import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Yeh effect load par chalta hai check karne ke liye ki user logged in hai ya nahi
  useEffect(() => {
    const checkUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        // Yahaan hum token se user info decode kar rahe hain
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          // Asli app mein, aap /api/auth/me endpoint se user data fetch karte
          setUser({ _id: payload.id, email: "user@email.com" }); // Placeholder email
        } catch (e) {
          console.error("Invalid token");
          logout();
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);


  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, email: data.email });
      return true;
    } catch (error) {
      console.error('Login failed', error.response.data);
      throw new Error(error.response.data.message || 'Login Failed');
    }
  };

  const register = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, email: data.email });
      return true;
    } catch (error) {
      console.error('Registration failed', error.response.data);
      throw new Error(error.response.data.message || 'Registration Failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

