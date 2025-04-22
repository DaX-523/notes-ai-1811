"use client";

import Script from "next/script";
import { CredentialResponse } from "google-one-tap";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    google: any;
  }
}

declare const google: any;

// boilerplate for initiating google auth
const GoogleOneTapComponent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
    const randomValues = crypto.getRandomValues(new Uint8Array(32));
    const charArray = Array.from(randomValues).map((val) =>
      String.fromCharCode(val)
    );
    const nonce = btoa(charArray.join(""));
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return [nonce, hashedNonce];
  };

  // Manual Google sign-in handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const [nonce, hashedNonce] = await generateNonce();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            nonce: hashedNonce,
          },
          // our route to catch the access code
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // The redirect will happen automatically by Supabase
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to sign in with Google",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Define Google One Tap initialization function using useCallback to ensure stability
  const initializeGoogleOneTap = useCallback(async () => {
    try {
      const [nonce, hashedNonce] = await generateNonce();

      // Check if there's already an existing session before initializing the one-tap UI
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session", error);
      }
      if (data.session) {
        router.push("/notes");
        return;
      }

      if (
        window.google?.accounts?.id &&
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      ) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response: CredentialResponse) => {
            try {
              setIsLoading(true);
              // send id token returned in response.credential to supabase
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
                nonce,
              });

              if (error) throw error;

              // Save user to local storage if needed
              if (data.user) {
                localStorage.setItem(
                  "auth_user",
                  JSON.stringify({
                    id: data.user.id,
                    name:
                      data.user.user_metadata.name ||
                      data.user.user_metadata.full_name,
                    created_at: data.user.created_at,
                  })
                );
              }

              toast({
                title: "Success",
                description: "Successfully signed in with Google",
              });

              // redirect to protected page
              router.push("/notes");
            } catch (error) {
              console.error("Error logging in with Google One Tap", error);
              toast({
                title: "Error",
                description:
                  error instanceof Error
                    ? error.message
                    : "Failed to sign in with Google",
                variant: "destructive",
              });
            } finally {
              setIsLoading(false);
            }
          },
          nonce: hashedNonce,
          use_fedcm_for_prompt: true,
        });
        // this is a fallback google sign in button
        window.google.accounts.id.renderButton(
          document.getElementById("googleButtonContainer"),
          { theme: "outline", size: "large", width: 280 }
        );
        window.google.accounts.id.prompt();
      }
    } catch (err) {
      console.error("Error initializing Google One Tap", err);
    }
  }, [router, toast]);

  useEffect(() => {
    let initialized = false;

    const init = async () => {
      if (initialized) return;
      initialized = true;

      // Try to initialize now if Google is already loaded
      if (window.google?.accounts) {
        await initializeGoogleOneTap();
      }
    };

    init();

    return () => {
      initialized = false;
    };
  }, [initializeGoogleOneTap]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => initializeGoogleOneTap()}
      />
      {/* fallback google signin button */}
      {/* <div
        id="googleButtonContainer"
        className="w-full flex justify-center my-2"
      /> */}
      <Button
        onClick={handleGoogleSignIn}
        variant="outline"
        disabled={isLoading}
        className="w-full border border-gray-300 flex items-center justify-center gap-2 py-2"
      >
        <svg
          width="18"
          height="18"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </Button>
    </>
  );
};

export default GoogleOneTapComponent;
