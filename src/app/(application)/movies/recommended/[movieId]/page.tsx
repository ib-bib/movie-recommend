import { notFound } from "next/navigation";
import Link from "next/link";
import { recommendedMovies } from "~/app/utils/data/movies";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { ArrowDownCircleIcon as SolidArrowDownIcon, ArrowUpCircleIcon as SolidArrowUpIcon } from "@heroicons/react/24/solid";

type Props = {
    params: { movieId: string | number };
};

export default function RecommendedMoviesScrollView({ params }: Props) {
    const movieIndex = recommendedMovies.findIndex((m) => m.id === params.movieId);
    if (movieIndex === -1) return notFound();

    const movie = recommendedMovies[movieIndex];
    const prev = recommendedMovies[movieIndex - 1];
    const next = recommendedMovies[movieIndex + 1];

    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-center gap-8 p-4">
            <h1 className="text-3xl font-bold">{movie?.title ?? 'Movie Title'}</h1>

            <div className="flex gap-4">
                {prev && (
                    <Link href={`/movies/recommended/${prev.id}`}>
                        <button className="group border rounded-full p-2 hover:scale-95 transition-all">
                            <SolidArrowUpIcon className="size-8 hidden group-hover:block" />
                            <ArrowUpCircleIcon className="size-8 group-hover:hidden" />
                        </button>
                    </Link>
                )}

                {next && (
                    <Link href={`/movies/recommended/${next.id}`}>
                        <button className="group border rounded-full p-2 hover:scale-95 transition-all">
                            <SolidArrowDownIcon className="size-8 hidden group-hover:block" />
                            <ArrowDownCircleIcon className="size-8 group-hover:hidden" />
                        </button>
                    </Link>
                )}
            </div>
        </main>
    );
}
