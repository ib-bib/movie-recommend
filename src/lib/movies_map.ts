import { staticMovies } from "~/lib/staticMovies";

export type StaticMovie = (typeof staticMovies)[number];

export const staticMovieMap = new Map(
  staticMovies.map((movie) => [movie.movieId, movie]),
);

export function getMovieById(movieId: number): StaticMovie | undefined {
  return staticMovieMap.get(movieId);
}
