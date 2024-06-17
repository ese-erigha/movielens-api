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
import { errorHandler, NotFoundException } from "./http.exceptions.ts";
import { getMovie } from "./tmdb.service.ts";
import { MovieResponseDto } from "./movie.dto.ts";
import { TMDBMovie } from "./tmdb.types.ts";
import { MovieMapper } from "./mapper.types.ts";

async function fetchMovie(movie: Movie) {
  try {
    const res = await getMovie(movie.tmdb_id.toString());
    return res;
  } catch (error) {
    console.log({ id: movie.tmdb_id, ...errorHandler(error) });
    throw error;
  }
}

async function fetchMoviesFromTMDB(movies: Movie[]): Promise<TMDBMovie[]> {
  const tmdbMovies: TMDBMovie[] = [];
  const results = await Promise.allSettled(
    movies.map((movie) => fetchMovie(movie)),
  );

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      tmdbMovies.push(result.value);
    }
  });
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

  const movieIds: number[] = [];
  const movieSvdMap: Record<number, SVD_Prediction> = {};

  recommendations.forEach((recommendation) => {
    movieIds.push(recommendation.movie_id);
    movieSvdMap[recommendation.movie_id] = recommendation;
  });

  const movies = await findManyByIds(movieIds);
  const tmdbMovieMap: Record<number, number> = {};
  movies.forEach((movie) => tmdbMovieMap[movie.tmdb_id] = movie.id);

  const tmdbMovies = await fetchMoviesFromTMDB(movies);

  return {
    results: MovieMapper.fromSVD(tmdbMovies, tmdbMovieMap, movieSvdMap),
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

  const simMovieIds: number[] = [];
  const simCbrMap: Record<number, CBR_Prediction> = {};

  recommendations.forEach((recommendation) => {
    simMovieIds.push(recommendation.sim_movie_id);
    simCbrMap[recommendation.sim_movie_id] = recommendation;
  });

  const simMovies = await findManyByIds(simMovieIds);
  const tmdbSimMap: Record<number, number> = {};
  simMovies.forEach((simMovie) => tmdbSimMap[simMovie.tmdb_id] = simMovie.id);

  const tmdbMovies = await fetchMoviesFromTMDB(simMovies);

  return {
    results: MovieMapper.fromCBR(tmdbMovies, tmdbSimMap, simCbrMap),
    page,
    ...getPaginationOutput(size),
  };
}

export async function fetchTopRatedMovies(
  page: number,
  size: number,
): Promise<MovieResponseDto> {
  const movies = await findTopRatedMovies(page, size);
  const movieMap: Record<number, Movie> = {};
  movies.forEach((movie) => movieMap[movie.tmdb_id] = movie);
  const tmdbMovies = await fetchMoviesFromTMDB(movies);

  return {
    results: MovieMapper.fromTMDB(tmdbMovies, movieMap),
    page,
    ...getPaginationOutput(size, 9742),
  };
}
