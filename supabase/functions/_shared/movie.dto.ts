import { Movie } from "./database.types.ts";

export type MovieResponseDto = Omit<Movie, "average_rating"> & { score: number };
