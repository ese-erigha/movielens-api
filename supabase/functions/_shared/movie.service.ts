import { getClient } from "./supabase.client.ts";
import { Movie } from "./database.types.ts";
import { buildPagination } from "./pagination.ts";

export async function findTopRatedMovies(
  page: number,
  size: number,
): Promise<Movie[]> {
  const client = getClient();
  const { start, end } = buildPagination(page, size);
  const resp = await client.from("movies").select("*").order("average_rating", {
    ascending: false,
  }).range(start, end).throwOnError();

  return resp.data || [];
}

export async function findManyByIds(ids: number[]) {
  const client = getClient();
  const resp = await client.from("movies").select("*").in("id", ids)
    .throwOnError();
  return resp.data || [];
}

export async function findById(id: number) {
  const client = getClient();
  const resp = await client.from("movies").select("*").eq("id", id).single()
    .throwOnError();

  return resp.data;
}
