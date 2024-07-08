'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserFromServer, logoutAction } from '@/data/actions/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserFromServer();
      setUser(userData);
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await logoutAction();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
