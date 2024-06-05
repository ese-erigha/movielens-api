import { SVD_Prediction } from "./database.types.ts";
import { buildPagination } from "./pagination.ts";
import { getClient } from "./supabase.client.ts";
export async function findMoviesForUser(
  id: number,
  page: number,
  size: number,
): Promise<SVD_Prediction[]> {
  const client = getClient();
  const { start, end } = buildPagination(page, size);
  const resp = await client.from("svd_predictions").select("*").eq(
    "user_id",
    id,
  ).range(start, end).throwOnError();
  return resp.data || [];
}
