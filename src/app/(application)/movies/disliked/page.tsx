import { ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import MovieCard from "~/app/_components/movie_card";
import { api } from "~/trpc/server";
import { getMovieById } from "~/lib/movies_map";

export default async function DislikedMoviesPage() {
    const dislikedMovies = await api.movie.getDislikedMovies()

    return (
        <main className="w-full flex flex-col grow items-center">
            <div className="w-11/12">
                <Link href='/movies' className="group hover:underline underline-offset-4 w-fit flex gap-1 items-center">
                    <ChevronLeftIcon className="size-4 group-hover:hidden block" />
                    <ArrowLeftIcon className="size-4 group-hover:block hidden" />
                    Return
                </Link>
            </div>
            <h1 className="text-2xl font-bold pt-2 pb-4">Disliked</h1>
            <div className="flex text-sm flex-wrap gap-4 pb-32 w-11/12 justify-center overflow-y-auto h-[30rem]">
                {dislikedMovies.map((dislike) => {
                    const movie = getMovieById(dislike.movieId);

                    if (!movie?.movieId || !movie.title) return null;

                    return (
                        <MovieCard
                            key={movie.movieId}
                            id={movie.movieId}
                            title={movie.title ?? "Untitled"}
                            rating={movie.bayesianRating ?? 0}
                            image={movie.image ?? "placeholder.png"}
                            releaseYear={movie.releaseYear ?? 0}
                            mode="saved"
                        />
                    );
                }
                )}
            </div>
        </main>
    );
}
