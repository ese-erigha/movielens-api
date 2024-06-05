import { getUserById } from "./user.service.ts";
import { findById, findManyByIds, findPopularMovies } from "./movie.service.ts";
import { CBR_Prediction, Movie, SVD_Prediction } from "./database.types.ts";
import { findMoviesForUser } from "./svd.service.ts";
import { findSimilarMovies } from "./cbr.service.ts";
import { PAGINATION_LIMIT } from "./pagination.ts";
import { NotFoundException } from "./http.exceptions.ts";

export async function recommendMoviesForUser(
  userId: number,
  page: number = 1,
  size: number = PAGINATION_LIMIT,
) {
  const user = await getUserById(userId);

  if (!user) {
    const movies: Movie[] = await findPopularMovies(page, size);
    return movies;
  }

  const recommendations = await findMoviesForUser(userId, page, size);
  const movieIds = [];
  const recommendationMap: Record<number, SVD_Prediction> = {};

  for (const recommendation of recommendations) {
    movieIds.push(recommendation.movie_id);
    recommendationMap[recommendation.movie_id] = recommendation;
  }

  const movies = await findManyByIds(movieIds);
  return movies;
}

export async function recommendSimilarMovies(
  movieId: number,
  page: number = 1,
  size: number = PAGINATION_LIMIT,
) {
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
  return movies;
}
