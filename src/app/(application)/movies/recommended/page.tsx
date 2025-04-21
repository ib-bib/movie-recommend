import { ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { api } from "~/trpc/server";
import { SparklesIcon } from "@heroicons/react/24/solid";
import RecommendedMovieList from "~/app/_components/movies/recommended_movie_list";

export default async function RecommendedMoviesPage() {
    await api.movie.getMyRecommendations.prefetch()

    return (
        <main className="w-full flex flex-col grow items-center">
            <div className="w-11/12">
                <Link href='/movies' className="group hover:underline underline-offset-4 w-fit flex gap-1 items-center">
                    <ChevronLeftIcon className="size-4 group-hover:hidden block" />
                    <ArrowLeftIcon className="size-4 group-hover:block hidden" />
                    Return
                </Link>
            </div>
            <div className="flex gap-2 items-center pt-2 pb-4">
                <h1 className="text-2xl font-bold">Recommended</h1>
                <SparklesIcon className="size-7 text-yellow-500" />
            </div>
            <RecommendedMovieList />
        </main>
    );
}
