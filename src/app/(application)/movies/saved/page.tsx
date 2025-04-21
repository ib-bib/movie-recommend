import { ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { api } from "~/trpc/server";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import SavedMoviesList from "~/app/_components/movies/saved_movie_list";

export default async function SavedMoviesPage() {
    await api.movie.getSavedMovies.prefetch()

    return (
        <main className="w-full flex flex-col grow items-center">
            <div className="w-11/12">
                <Link href='/movies' className="group hover:underline underline-offset-4 w-fit flex gap-1 items-center">
                    <ChevronLeftIcon className="size-4 group-hover:hidden block" />
                    <ArrowLeftIcon className="size-4 group-hover:block hidden" />
                    Return
                </Link>
            </div>
            <div className="flex items-center gap-2 pt-2 pb-4">
                <h1 className="text-2xl font-bold">Watch Later</h1>
                <BookmarkIcon className="text-green-500 size-7" />
            </div>
            <SavedMoviesList />
        </main>
    );
}
