import { CBR_Prediction } from "./database.types.ts";
import { buildPagination } from "./pagination.ts";
import { getClient } from "./supabase.client.ts";
export async function findSimilarMovies(
  movieId: number,
  page: number,
  size: number,
): Promise<CBR_Prediction[]> {
  const client = getClient();
  const { start, end } = buildPagination(page, size);
  const resp = await client.from("cbr_predictions").select("*").eq(
    "movie_id",
    movieId,
  ).range(start, end).throwOnError();
  return resp.data || [];
}
