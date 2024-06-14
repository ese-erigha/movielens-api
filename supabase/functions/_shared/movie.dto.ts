import { Movie } from "./database.types.ts";
import { TMDBMovie } from "./tmdb.types.ts";

export type MappedMovie = Omit<Movie, "average_rating"> & { score: number };

export type MovieItemDto = TMDBMovie & { match_score: number };

export type MovieResponseDto = {
  results: Array<MovieItemDto>;
  page: number;
  total_pages: number;
  total_results: number;
};
