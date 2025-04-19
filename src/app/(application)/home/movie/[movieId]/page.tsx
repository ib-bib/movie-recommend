// app/movies/[movieId]/page.tsx (or wherever the route is)
import { notFound } from "next/navigation";
import Link from "next/link";
import { staticMovies } from "~/lib/staticMovies";
import { NormalizedTitle } from "~/app/_components/normalized_title";
import { MovieMeta } from "~/app/_components/home/movie_meta";
import { MovieActions } from "~/app/_components/home/movie_actions";
import FallbackImage from "~/app/_components/fallback_image";
import {
    ChevronLeftIcon,
    ArrowLeftIcon
} from "@heroicons/react/24/solid";

function normalizeTitle(title: string): string {
    return title
        // Keep letters (including accented), numbers, dashes, and spaces only
        .replace(/[^a-zA-Z0-9À-ž\- ]/g, "")
        .replace(/\s+/g, " ") // normalize spaces
        .trim();
}

export default async function Movie({ params }: { params: Promise<{ movieId: string }> }) {
    const { movieId } = await params

    const movie = staticMovies.find((m) => m.movieId === Number(movieId));

    if (!movie) return notFound();

    const imageFileName = `${movie.movieId}__${normalizeTitle(movie.title)} ${movie.releaseYear}.jpg`;

    return (
        <main className="w-full flex flex-col items-center tracking-wider">
            <div className="w-11/12">
                <Link
                    href="/home"
                    className="group hover:underline underline-offset-4 w-fit flex gap-1 items-center"
                >
                    <ChevronLeftIcon className="size-4 group-hover:hidden block" />
                    <ArrowLeftIcon className="size-4 group-hover:block hidden" />
                    Return
                </Link>
            </div>
            <NormalizedTitle title={movie.title} />
            {/* Wrapper for all content */}
            <div className="flex flex-wrap w-11/12 gap-6 justify-center max-h-[26rem] overflow-y-auto">
                {/* Buttons + Poster side-by-side always */}
                <div className="flex flex-row gap-4 items-center">
                    <MovieActions
                        movieId={movie.movieId}
                        title={movie.title}
                    />
                    <div className="h-72 grow md:h-80 lg:h-96 flex items-center justify-center bg-neutral-100/10 rounded-md overflow-hidden">
                        <FallbackImage
                            src={`/images/${imageFileName}`}
                            fallbackSrc={`/images/${movie.image ?? "placeholder.png"}`}
                            alt={movie.title}
                        />
                    </div>
                    <div className="w-24 invisible"></div>
                </div>
                {/* Metadata: below on mobile, beside on desktop */}
                <MovieMeta
                    movieId={movie.movieId}
                    releaseYear={movie.releaseYear!}
                    rating={movie.bayesianRating}
                />
            </div>
        </main>
    );
}
