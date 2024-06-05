// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/recommender' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";
import cors from "npm:cors";
import { getClient } from "../_shared/supabase.client.ts";
import { User } from "../_shared/database.types.ts";
import {
  exceptionHandler,
  pageNotFoundExceptionHandler,
} from "../_shared/exception.handler.ts";
import {
  recommendMoviesForUser,
  recommendSimilarMovies,
} from "../_shared/recommender.service.ts";

const getUserById = async (uid: string): Promise<User | null> => {
  const client = getClient();

  const resp = await client.from("users").select("*").eq("id", uid).single()
    .throwOnError();
  return resp.data;
};

const app = express();
app.use(express.json());
app.use(cors());
app.use(exceptionHandler);
const port = 3000;

app.get("/recommendations/user/:userId/:page", async (req, res) => {
  const { userId, page } = req.params;
  const movies = await recommendMoviesForUser(
    parseInt(userId),
    parseInt(page),
  );
  res.send({ data: { movies } });
});

app.get("/recommendations/movie/:movieId/:page", async (req, res) => {
  const { movieId, page } = req.params;
  const movies = await recommendSimilarMovies(
    parseInt(movieId),
    parseInt(page),
  );
  res.send({ data: { movies } });
});

app.use("*", pageNotFoundExceptionHandler);
app.listen(port, () => {
  console.log(`recommendations app listening on port ${port}`);
});
