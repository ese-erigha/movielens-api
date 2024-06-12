import { CBR_Prediction } from "./database.types.ts";
import { Movie, SVD_Prediction } from "./database.types.ts";
import { MovieResponseDto } from "./movie.dto.ts";

export class MovieMapper {
  public static fromMoviePrediction(
    movies: Movie[],
    predictionMap: Record<number, SVD_Prediction | CBR_Prediction>,
  ): MovieResponseDto[] {
    const mapped = movies.map((movie) => {
      const pred = predictionMap[movie.id];
      // deno-lint-ignore no-unused-vars
      const { average_rating, ...rest } = movie;
      return {
        ...rest,
        score: pred.score,
      };
    });

    return mapped.sort((a, b) => b.score - a.score);
  }

  public static fromMovieType(movies: Movie[]): MovieResponseDto[] {
    return movies.map((movie) => {
      const { average_rating, ...rest } = movie;
      return { ...rest, score: average_rating };
    });
  }
}
