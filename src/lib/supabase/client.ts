import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // These are server-only; ensure they are configured in production.
  console.warn(
    "[Trendlo] Supabase admin client is not fully configured (missing URL or service role key).",
  );
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl ?? "http://localhost:54321",
  serviceRoleKey ?? "service-role-key-not-set",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

