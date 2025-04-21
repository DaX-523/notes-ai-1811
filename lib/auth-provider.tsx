"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // In a real app, you would validate credentials against a backend
    // For demo purposes, we'll check against localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find((u: any) => u.email === email);

    if (!foundUser || foundUser.password !== password) {
      throw new Error("Invalid credentials");
    }

    const authenticatedUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
    };

    setUser(authenticatedUser);
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
  };

  const signUp = async (name: string, email: string, password: string) => {
    // In a real app, you would send this data to your backend
    // For demo purposes, we'll store in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      throw new Error("User already exists");
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, NEVER store plain text passwords
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
