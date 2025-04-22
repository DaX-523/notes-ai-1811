"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  AuthContextType,
  AuthState,
  AuthUser,
  LoginCredentials,
  SignupCredentials,
} from "./auth-types";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Check for stored auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check for Supabase session
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session) {
          // Fetch user data from session
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", sessionData.session.user.id)
            .single();

          // If user exists in the users table
          if (userData) {
            const user: AuthUser = {
              id: userData.id,
              name:
                userData.name ||
                sessionData.session.user.user_metadata.name ||
                sessionData.session.user.user_metadata.full_name ||
                sessionData.session.user.email?.split("@")[0] ||
                "User",
              created_at:
                userData.created_at || sessionData.session.user.created_at,
            };

            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            localStorage.setItem("auth_user", JSON.stringify(user));
            return;
          }
          // If user doesn't exist in users table but has valid session, create the user
          else {
            const newUser: AuthUser = {
              id: sessionData.session.user.id,
              name:
                sessionData.session.user.user_metadata.name ||
                sessionData.session.user.user_metadata.full_name ||
                sessionData.session.user.email?.split("@")[0] ||
                "User",
              created_at: sessionData.session.user.created_at,
            };

            // Insert the user into the users table
            const { error: insertError } = await supabase
              .from("users")
              .insert(newUser);

            if (!insertError) {
              setAuthState({
                user: newUser,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              localStorage.setItem("auth_user", JSON.stringify(newUser));
              return;
            }
          }
        }

        // Fallback to localStorage if no valid session
        const storedUser = localStorage.getItem("auth_user");

        if (storedUser) {
          const user = JSON.parse(storedUser) as AuthUser;
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Authentication failed",
        });
      }
    };

    checkAuth();
  }, []);

  const signIn = async (credentials: LoginCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) {
        throw new Error(error.message);
      }
      const response = await supabase
        .from("users")
        .select()
        .eq("id", data?.user?.id);

      if (response.error) {
        throw response.error;
      }
      if (response.data) {
        const user = response?.data[0];

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        localStorage.setItem("auth_user", JSON.stringify(user));
      }
    } catch (error) {
      // populate proper error msg for better UX
      let errorMsg = error instanceof Error ? error.message : "Login failed";

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      throw new Error(errorMsg);
    }
  };

  // Signup function
  const signUp = async (credentials: SignupCredentials) => {
    try {
      // Validate password match
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.name,
          },
        },
      });
      if (error) {
        // for some reason supabase does not send proper error message if user already exists
        if (error.code === "23505") {
          console.error("Email already exists. Please log in.");
          throw new Error("Email already exists. Please log in.");
        }
        console.error("Signup error:", error.message);
        throw new Error(error.message);
      }

      // Create new user
      const newUser: AuthUser = {
        id: data?.user?.id as string,
        name: credentials.name,
        created_at: data?.user?.created_at as string,
      };

      const response = await supabase.from("users").insert(newUser);

      if (response.error) {
        if (response.error.code === "23505") {
          console.error("Email already exists. Please log in.");
          throw new Error("Email already exists. Please log in.");
        }
        throw response.error;
      }
      router.push("/signin");
    } catch (error) {
      let errorMsg = error instanceof Error ? error.message : "Signup failed";
      console.log(error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      throw new Error(errorMsg);
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear stored auth
      localStorage.removeItem("auth_user");

      // Reset state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      // Redirect to login
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, signIn, signUp, signOut }}>
      {children}
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
