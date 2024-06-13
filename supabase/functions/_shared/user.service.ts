import { getClient } from "./supabase.client.ts";
import { User } from "./database.types.ts";

export async function getUserById(id: number): Promise<User | null> {
  const client = getClient();

  const resp = await client.from("users").select("*").eq("id", id).single();
  if (resp.error) {
    if (resp.error.code === "PGRST116") return null;
    throw new Error(resp.error.message, { cause: resp.error.code });
  }

  return resp.data;
}
