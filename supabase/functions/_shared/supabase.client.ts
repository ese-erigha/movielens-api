import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Database } from "./database.types.ts";

export function getClient() {
  return createClient<Database>(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );
}
