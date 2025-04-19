import {
    SparklesIcon,
    BookmarkIcon,
    HeartIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import FallbackImage from "~/app/_components/fallback_image";
import { api } from "~/trpc/server";
import { getMovieById } from "~/lib/movies_map";


export default async function YourMovies() {
    const [likedMovies, dislikedMovies, savedMovies, recommendedMovies] = await Promise.all([
        api.movie.getMostRecent4LikedMovies(),
        api.movie.getMostRecent4DislikedMovies(),
        api.movie.getMostRecent4SavedMovies(),
        api.movie.getMyMostRecent4Recommendations(),
    ]);

    const movieCategories = [
        {
            title: "Recommended",
            href: "/movies/recommended",
            icon: <SparklesIcon className="size-6 text-amber-400" />,
            movies: recommendedMovies,
        },
        {
            title: "Watch Later",
            href: "/movies/saved",
            icon: <BookmarkIcon className="size-6 text-green-500" />,
            movies: savedMovies,
        },
        {
            title: "Liked",
            href: "/movies/liked",
            icon: <HeartIcon className="size-6 text-rose-500" />,
            movies: likedMovies,
        },
        {
            title: "Disliked",
            href: "/movies/disliked",
            icon: <XCircleIcon className="size-6 text-red-500" />,
            movies: dislikedMovies,
        },
    ];

    return (
        <main className="w-full flex flex-col grow items-center">
            <h1 className="text-2xl font-bold pt-2 pb-4">Your Movies</h1>

            <div className="flex max-h-[28rem] overflow-y-auto pb-32 flex-wrap gap-4 w-11/12 justify-center sm:justify-start">
                {movieCategories.map(({ title, href, icon, movies }) => (
                    <Link
                        key={title}
                        href={href}
                        className="bg-neutral-100/10 border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between hover:cursor-pointer"
                    >
                        <div className="font-bold w-full h-1/6">{title}</div>

                        <div className="w-full p-2 grid grid-cols-2 grid-rows-2 gap-[2px] h-4/6">
                            {Array.from({ length: 4 }, (_, i) => {
                                const movieId = movies[i]?.movieId
                                const movie = getMovieById(movieId ?? -1);

                                if (!movie) return <div key={i} className="w-full h-full" />;

                                const imageFileName = `/images/${movie.id}__${movie.title?.replace(/[^a-zA-Z0-9 -]/g, "").replace(/\s+/g, " ").trim()} ${movie.releaseYear}.jpg`;

                                return (
                                    <div
                                        key={i}
                                        className="flex justify-center items-center rounded overflow-hidden"
                                    >
                                        <FallbackImage
                                            src={imageFileName}
                                            fallbackSrc={`/images/${movie.image ?? "placeholder.png"}`}
                                            alt={movie.title ?? "Movie"}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex w-full items-end justify-end h-1/6">{icon}</div>
                    </Link>
                ))}
            </div>
        </main>
    );
}  