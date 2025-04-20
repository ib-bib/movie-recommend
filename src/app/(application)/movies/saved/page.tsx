import { ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import MovieCard from "~/app/_components/movies/movie_card";
import { api } from "~/trpc/server";
import { getMovieById } from "~/lib/movies_map";

export default async function SavedMoviesPage() {
    const savedMovies = await api.movie.getSavedMovies()

    return (
        <main className="w-full flex flex-col grow items-center">
            <div className="w-11/12">
                <Link href='/movies' className="group hover:underline underline-offset-4 w-fit flex gap-1 items-center">
                    <ChevronLeftIcon className="size-4 group-hover:hidden block" />
                    <ArrowLeftIcon className="size-4 group-hover:block hidden" />
                    Return
                </Link>
            </div>
            <h1 className="text-2xl font-bold pt-2 pb-4">Saved</h1>
            <div className="flex text-sm flex-wrap gap-4 pb-32 w-11/12 justify-center overflow-y-auto h-[30rem]">
                {savedMovies.map((saved) => {
                    const movie = getMovieById(saved.movieId);

                    if (!movie?.movieId || !movie.title) return null;

                    return (
                        <MovieCard
                            key={movie.movieId}
                            movieId={movie.movieId}
                            title={movie.title}
                            rating={movie.bayesianRating}
                            mode="saved"
                        />
                    );
                }
                )}
            </div>
        </main>
    );
}
