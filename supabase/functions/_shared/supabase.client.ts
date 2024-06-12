import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Database } from "./database.types.ts";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config.ts";

export function getClient() {
  return createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  );
}
