import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowDownCircleIcon,
    ArrowUpCircleIcon,
    BookmarkIcon as OutlineSave,
    ChevronLeftIcon,
    ArrowLeftIcon
} from "@heroicons/react/24/outline";
import {
    ArrowDownCircleIcon as SolidArrowDownIcon,
    ArrowUpCircleIcon as SolidArrowUpIcon,
    StarIcon,
    BookmarkIcon as SolidSave,
} from "@heroicons/react/24/solid";
import FallbackImage from "~/app/_components/fallback_image";
import { NormalizedTitle } from "~/app/_components/normalized_title";
import { api } from "~/trpc/server";
import { getMovieById } from "~/lib/movies_map";

function normalizeTitle(title: string): string {
    return title
        // Keep letters (including accented), numbers, dashes, and spaces only
        .replace(/[^a-zA-Z0-9À-ž\- ]/g, "")
        .replace(/\s+/g, " ") // normalize spaces
        .trim();
}

export default async function SavedMoviesScrollView({ params }: { params: Promise<{ movieId: string }> }) {
    const { movieId: movie_id } = await params;
    const movieId = Number(movie_id)

    const savedMovies = await api.movie.getSavedMovies()
    const saveThisMovie = api.movie.saveMovie
    const genres = await api.movie.getMovieGenres({ id: movieId })

    const movie = getMovieById(movieId);

    const movieIndex = savedMovies.findIndex((m) => m.movieId === movieId);

    const prev = savedMovies[movieIndex - 1];
    const next = savedMovies[movieIndex + 1];

    if (!movie) return notFound();

    const imageFileName = `${movieId}__${normalizeTitle(movie.title)} ${movie.releaseYear}.jpg`;

    return (
        <main className="w-full flex flex-col grow items-center tracking-wider gap-2">
            <div className="w-11/12">
                <Link
                    href="/movies/saved"
                    className="gap-1 group flex items-center hover:underline underline-offset-4 w-fit"
                >
                    <ChevronLeftIcon className="size-4 group-hover:hidden block" />
                    <ArrowLeftIcon className="size-4 group-hover:block hidden" />
                    Return
                </Link>
            </div>

            <NormalizedTitle title={movie?.title} />

            {/* Main Content Layout */}
            <div className="flex flex-wrap w-11/12 sm:w-4/5 lg:w-2/3 gap-6 justify-center max-h-[26rem] overflow-y-auto">
                {/* Buttons + Poster */}
                <div className="flex flex-row gap-4 items-center">
                    {/* Action Buttons */}
                    <div className="flex flex-col items-start gap-4 w-24">
                        <button className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                            <OutlineSave className="group-hover:text-green-600 size-6 group-active:hidden block" />
                            <SolidSave className="text-green-600 size-6 group-active:block hidden" />
                        </button>
                    </div>

                    {/* Poster */}
                    <div className="h-72 grow md:h-80 lg:h-96 flex items-center justify-center bg-neutral-100/10 rounded-md overflow-hidden">
                        <FallbackImage
                            src={`/images/${imageFileName}`}
                            fallbackSrc={`/images/${movie?.image ?? "placeholder.png"}`}
                            alt={movie?.title ?? "Movie"}
                        />
                    </div>

                    {/* Prev / Next Buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 w-24">
                        {prev ? (
                            <Link href={`/movies/saved/${prev.movieId}`}>
                                <button className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                                    <SolidArrowUpIcon className="size-8 hidden group-hover:block transition-all" />
                                    <ArrowUpCircleIcon className="size-8 group-hover:hidden transition-all" />
                                </button>
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="size-10 flex justify-center items-center rounded-full text-gray-500 bg-neutral-700/20 cursor-not-allowed"
                            >
                                <ArrowUpCircleIcon className="size-8" />
                            </button>
                        )}
                        {next ? (
                            <Link href={`/movies/saved/${next.movieId}`}>
                                <button className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                                    <SolidArrowDownIcon className="size-8 hidden group-hover:block transition-all" />
                                    <ArrowDownCircleIcon className="size-8 group-hover:hidden transition-all" />
                                </button>
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="size-10 flex justify-center items-center rounded-full text-gray-500 bg-neutral-700/20 cursor-not-allowed"
                            >
                                <ArrowDownCircleIcon className="size-8" />
                            </button>
                        )}
                    </div>
                </div>
                {/* Metadata Section */}
                <div className="flex flex-col gap-2 w-full md:w-auto items-center justify-center text-sm md:text-base text-neutral-300">
                    {/* Rating + Year */}
                    <div className="flex items-center justify-between w-11/12">
                        <div className="flex gap-1 items-center-safe">
                            <span className="font-bold">Release Year: </span>
                            {movie?.releaseYear ?? "Unavailable"}
                        </div>
                        <div className="flex gap-1 items-center">
                            <div>
                                <span className="font-bold">Rating: </span>
                                {movie?.bayesianRating} / 5
                            </div>
                            <StarIcon className="size-4 md:size-5 text-amber-400" />
                        </div>
                    </div>
                    {!genres[0]?.name ?
                        <div className='w-11/12 flex justify-center '>Unknown Genre</div>
                        :
                        <div className='w-11/12  flex gap-1'>
                            <div className='font-semibold'>Genres: </div>
                            <ul className='flex flex-wrap gap-2'>
                                {genres.map(genre => <li key={genre?.id}> {genre?.name}</li>)}
                            </ul>
                        </div>
                    }
                </div>
            </div>
        </main>
    );
}
