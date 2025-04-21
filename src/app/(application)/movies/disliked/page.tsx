import { ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import DislikedMoviesList from "~/app/_components/movies/disliked_movie_list";
import { api } from "~/trpc/server";

export default async function DislikedMoviesPage() {
    await api.movie.getDislikedMovies.prefetch()

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
            <DislikedMoviesList />
        </main>
    );
}
