// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

// @deno-types="npm:@types/express@4.17.15"
import express, { Application, Request, Response } from "npm:express@4.18.2";
import cors from "npm:cors";
import {
  exceptionHandler,
  pageNotFoundExceptionHandler,
} from "../_shared/exception.handler.ts";
import {
  fetchTopRatedMovies,
  recommendMoviesForUser,
  recommendSimilarMovies,
} from "../_shared/recommender.service.ts";

import { PAGINATION_LIMIT } from "../_shared/pagination.ts";
import { MovieResponseDto } from "../_shared/movie.dto.ts";

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(exceptionHandler);
const port = 3000;

app.get(
  "/recommendations/user/:userId/:page",
  async (
    req: Request<{ userId: number; page: number }>,
    res: Response<MovieResponseDto>,
  ) => {
    const { userId, page } = req.params;
    const response = await recommendMoviesForUser(
      userId,
      page,
    );
    res.status(200).send(response);
  },
);

app.get(
  "/recommendations/movie/:movieId/:page",
  async (
    req: Request<{ movieId: number; page: number }>,
    res: Response<MovieResponseDto>,
  ) => {
    const { movieId, page } = req.params;
    const response = await recommendSimilarMovies(
      movieId,
      page,
    );
    res.status(200).send(response);
  },
);

app.get(
  "/recommendations/movies/top-rated/:page",
  async (
    req: Request<{ page: number }>,
    res: Response<MovieResponseDto>,
  ) => {
    const { page } = req.params;
    const response = await fetchTopRatedMovies(page, PAGINATION_LIMIT);
    res.status(200).send(response);
  },
);

app.use("*", pageNotFoundExceptionHandler);
app.listen(port, () => {
  console.log(`recommendations app listening on port ${port}`);
});
