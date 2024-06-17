import { CBR_Prediction, Movie } from "./database.types.ts";
import { TMDBMovie } from "./tmdb.types.ts";
import { MovieItemDto } from "./movie.dto.ts";
import { SVD_Prediction } from "./database.types.ts";

function clampNumber(
  num: number,
  currMax: number = 1.00,
  range: number = 5.00,
) {
  return (num / currMax) * range;
}

function sorter(itemA: MovieItemDto, itemB: MovieItemDto) {
  return itemB.match_score - itemA.match_score;
}

export class MovieMapper {
  public static fromTMDB(
    movies: TMDBMovie[],
    movieMap: Record<number, Movie>,
  ): MovieItemDto[] {
    return movies.map((movie) => {
      const localMovie: Movie = movieMap[movie.id];
      return {
        ...movie,
        match_score: localMovie.average_rating,
        local_movie_id: localMovie.id, // id of the recommended movie on our local database
      };
    }).sort(sorter);
  }

  public static fromCBR(
    movies: TMDBMovie[],
    tmdbbSimMap: Record<number, number>,
    simCbrMap: Record<number, CBR_Prediction>,
  ): MovieItemDto[] {
    return movies.map((movie) => {
      const simMovieId = tmdbbSimMap[movie.id];
      const prediction = simCbrMap[simMovieId];
      return {
        ...movie,
        match_score: clampNumber(prediction.score),
        local_movie_id: simMovieId, // id of the recommended movie on our local database
      };
    }).sort(sorter);
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
        local_movie_id: movieId, // id of the recommended movie
      };
    }).sort(sorter);
  }
}
