import { notFound } from "next/navigation";
import Link from "next/link";
import { NormalizedTitle } from "~/app/_components/normalized_title";
import { MovieActions } from "~/app/_components/home/movie_actions";
import FallbackImage from "~/app/_components/fallback_image";
import {
    ChevronLeftIcon,
    ArrowLeftIcon,
    StarIcon
} from "@heroicons/react/24/solid";
import { api } from "~/trpc/server";
import { getMovieById } from "~/lib/movies_map";

export default async function Movie({ params }: { params: Promise<{ movieId: string }> }) {
    const { movieId: movie_id } = await params;
    const movieId = Number(movie_id)

    const genres = await api.movie.getMovieGenres({ id: movieId })

    const movie = getMovieById(movieId);

    if (!movie) return notFound();

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
            <div className="flex flex-wrap w-11/12 gap-6 justify-center pb-4 max-h-[26rem] overflow-y-auto">
                <div className="flex flex-row gap-4 items-center">
                    <MovieActions
                        movieId={movie.movieId}
                        title={movie.title}
                    />
                    <div className="h-72 grow md:h-80 lg:h-96 flex items-center justify-center bg-neutral-100/10 rounded-md overflow-hidden">
                        <FallbackImage
                            movieId={movie.movieId}
                            title={movie.title}
                        />
                    </div>
                    <div className="w-24 invisible"></div>
                </div>
                <div className='flex flex-col gap-2 w-full md:w-1/3 items-center justify-center'>
                    <div className="flex items-center justify-between w-11/12">
                        <div>
                            <span className="font-bold">Release Year: </span>
                            {movie.releaseYear ?? 'Unavailable'}
                        </div>
                        <div className="flex gap-1 items-center">
                            <div>
                                <span className="font-bold">Rating: </span>
                                {movie.bayesianRating} / 5
                            </div>
                            <StarIcon className="size-4 md:size-5 text-amber-400" />
                        </div>
                    </div>
                    {!genres[0] ?
                        <div className='w-11/12 flex justify-center'>Unknown Genre</div>
                        :
                        <div className='w-11/12'>
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
