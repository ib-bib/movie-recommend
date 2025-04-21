import { ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { api } from "~/trpc/server";
import LikedMoviesList from "~/app/_components/movies/liked_movie_list";

export default async function LikedMoviesPage() {
    await api.movie.getLikedMovies.prefetch()

    return (
        <main className="w-full flex flex-col grow items-center">
            <div className="w-11/12">
                <Link href='/movies' className="group hover:underline underline-offset-4 w-fit flex gap-1 items-center">
                    <ChevronLeftIcon className="size-4 group-hover:hidden block" />
                    <ArrowLeftIcon className="size-4 group-hover:block hidden" />
                    Return
                </Link>
            </div>
            <h1 className="text-2xl font-bold pt-2 pb-4">Liked</h1>
            <LikedMoviesList />
        </main>
    );
}
