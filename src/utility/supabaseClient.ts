import { createClient } from "@refinedev/supabase";

const SUPABASE_URL = "https://rqrnfifdofbscdfvskat.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcm5maWZkb2Zic2NkZnZza2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4Mjc4MjksImV4cCI6MjA0NzQwMzgyOX0.Jwz7Qf0LW6xpd42SQAX4x-53fJebf6r7MOQLRTlBO_4"

// Check if environment variables are defined
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase URL or API Key is missing in environment variables.");
}

// Create the Supabase client
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
  },
});

// Function to check the connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabaseClient.from("pg_stat_activity").select("usename").limit(1);
    if (error) {
      console.error("Supabase connection failed:", error.message);
      return false;
    }
    console.log("Supabase connection successful:", data);
    return true;
  } catch (error) {
    console.error("Supabase connection check error:", error);
    return false;
  }
};
