import { getUserById } from "./user.service.ts";
import {
  findById,
  findManyByIds,
  findTopRatedMovies,
} from "./movie.service.ts";
import { CBR_Prediction, Movie, SVD_Prediction } from "./database.types.ts";
import { findMoviesForUser } from "./svd.service.ts";
import { findSimilarMovies } from "./cbr.service.ts";
import { getPaginationOutput, PAGINATION_LIMIT } from "./pagination.ts";
import { NotFoundException } from "./http.exceptions.ts";
import { getMovie } from "./tmdb.service.ts";
import { MovieResponseDto } from "./movie.dto.ts";

async function fetchMoviesFromTMBD(movies: Movie[]) {
  const ids = movies.map((movie) => movie.tmdb_id.toString());
  console.log(ids);

  const tmdbMovies = await Promise.all(ids.map((id) => getMovie(id)));
  return tmdbMovies;
}

export async function recommendMoviesForUser(
  userId: number,
  page: number = 1,
  size: number = PAGINATION_LIMIT,
): Promise<MovieResponseDto> {
  const user = await getUserById(userId);

  if (!user) {
    return fetchTopRatedMovies(page, size);
  }

  const recommendations = await findMoviesForUser(userId, page, size);
  const movieIds = [];
  const recommendationMap: Record<number, SVD_Prediction> = {};

  for (const recommendation of recommendations) {
    movieIds.push(recommendation.movie_id);
    recommendationMap[recommendation.movie_id] = recommendation;
  }

  const movies = await findManyByIds(movieIds);
  const results = await fetchMoviesFromTMBD(movies);
  return {
    results,
    page,
    ...getPaginationOutput(size),
  };
}

export async function recommendSimilarMovies(
  movieId: number,
  page: number = 1,
  size: number = PAGINATION_LIMIT,
): Promise<MovieResponseDto> {
  const movie = await findById(movieId);
  if (!movie) {
    throw new NotFoundException();
  }

  const recommendations = await findSimilarMovies(movieId, page, size);

  const movieIds = [];
  const recommendationMap: Record<number, CBR_Prediction> = {};

  for (const recommendation of recommendations) {
    movieIds.push(recommendation.sim_movie_id);
    recommendationMap[recommendation.sim_movie_id] = recommendation;
  }

  const movies = await findManyByIds(movieIds);
  const results = await fetchMoviesFromTMBD(movies);
  return {
    results,
    page,
    ...getPaginationOutput(size),
  };
}

export async function fetchTopRatedMovies(
  page: number,
  size: number,
): Promise<MovieResponseDto> {
  const movies = await findTopRatedMovies(page, size);
  const results = await fetchMoviesFromTMBD(movies);

  return {
    results,
    page,
    ...getPaginationOutput(size, 9742),
  };
}
