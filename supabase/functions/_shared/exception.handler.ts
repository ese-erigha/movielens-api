import { NextFunction, Request, Response } from "npm:express@4.18.2";
import { NotFoundException } from "./http.exceptions.ts";

export interface IHTTPError extends Error {
  statusCode: number;
}

export const exceptionHandler = (
  error: IHTTPError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong!";

  return res
    .status(statusCode)
    .send({ statusCode, message });
};

export const pageNotFoundExceptionHandler = (
  _req: Request,
  _res: Response,
  _next: NextFunction,
) => {
  throw new NotFoundException("Page not found!");
};
