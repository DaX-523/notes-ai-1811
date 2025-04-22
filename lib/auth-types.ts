import type { User } from "./types";

export interface AuthUser extends User {
  id: string;
  name: string;
  created_at: string;
  avatar_url?: string;
  email?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface GoogleCredentials {
  token: string;
  nonce?: string;
}

export interface AuthContextType {
  authState: AuthState;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignupCredentials) => Promise<void>;
  signOut: () => void;
}
