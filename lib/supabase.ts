import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for browser usage
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
    },
  }
);

// Helper function to ensure data is serializable
export function serializeSupabaseData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
