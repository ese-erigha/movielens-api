import { Movie } from "./database.types.ts";
import { Movie as TMDBMovie } from "./tmdb.types.ts";

export type MappedMovie = Omit<Movie, "average_rating"> & { score: number };

export type MovieResponseDto = {
  results: TMDBMovie[];
  page: number;
  total_pages: number;
  total_results: number;
};
