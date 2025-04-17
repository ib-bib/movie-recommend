import { notFound } from "next/navigation";
import Link from "next/link";
import { recommendedMovies } from "../page"; // reusing the same list
import {
    ArrowDownCircleIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import {
    ArrowDownCircleIcon as SolidArrowDownIcon,
    ArrowUpCircleIcon as SolidArrowUpIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";

type Props = {
    params: { movieId: number };
};

export default async function RecommendedMoviesScrollView({ params }: Props) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const { movieId } = await params
    const movieIndex = recommendedMovies.findIndex((m) => m.id === movieId);
    if (movieIndex === -1) return notFound();

    const movie = recommendedMovies[movieIndex];
    const prev = recommendedMovies[movieIndex - 1];
    const next = recommendedMovies[movieIndex + 1];

    return (
        <main className="w-full min-h-screen flex flex-col items-center justify-center gap-8 p-4">
            <h1 className="text-3xl font-bold">{movie?.title}</h1>
            <Image width={0} height={0} src={`/images/${movie?.image ?? 'placeholder.png'}`} alt={movie?.title ?? "Movie"} className="max-w-xs rounded-lg shadow" />
            <p className="text-neutral-400 text-sm">{movie?.bayesianRating} / 5</p>

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
