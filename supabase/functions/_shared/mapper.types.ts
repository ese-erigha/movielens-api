import { CBR_Prediction, Movie } from "./database.types.ts";
import { TMDBMovie } from "./tmdb.types.ts";
import { MovieItemDto } from "./movie.dto.ts";
import { SVD_Prediction } from "./database.types.ts";

const clampNumber = (
  num: number,
  currMax: number = 1.00,
  range: number = 5.00,
) => {
  return (num / currMax) * range;
};

export class MovieMapper {
  public static fromTMDB(
    movies: TMDBMovie[],
    movieMap: Record<number, Movie>,
  ): MovieItemDto[] {
    return movies.map((movie) => {
      return {
        ...movie,
        match_score: movieMap[movie.id].average_rating,
      };
    });
  }

  public static fromCBR(
    movies: TMDBMovie[],
    tmdbbSimMap: Record<number, number>,
    simCbrMap: Record<number, CBR_Prediction>,
  ): MovieItemDto[] {
    return movies.map((movie) => {
      const simMovieId = tmdbbSimMap[movie.id];
      const prediction = simCbrMap[simMovieId];
      const score = prediction.score;
      return {
        ...movie,
        match_score: clampNumber(score),
      };
    });
  }

  public static fromSVD(
    movies: TMDBMovie[],
    tmdbbMovieMap: Record<number, number>,
    movieSvdMap: Record<number, SVD_Prediction>,
  ): MovieItemDto[] {
    return movies.map((movie) => {
      const movieId = tmdbbMovieMap[movie.id];
      const prediction = movieSvdMap[movieId];
      return {
        ...movie,
        match_score: prediction.score,
      };
    });
  }
}
