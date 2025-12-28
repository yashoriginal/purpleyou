"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  phoneNumber: string;
  name?: string;
  pincode?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);

    // TODO: API Integration - Save authentication token
    // Once you have a backend:
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     phoneNumber: userData.phoneNumber,
    //   }),
    // });
    // const { token, user } = await response.json();
    // localStorage.setItem('authToken', token);
    // setUser(user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);

    // TODO: API Integration - Clear authentication token
    // await fetch('/api/auth/logout', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    // });
    // localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
