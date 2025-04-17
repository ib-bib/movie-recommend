import MovieCard from "~/app/_components/movie_card";
import { staticMovies } from "~/lib/staticMovies";

export const recommendedMovies = staticMovies.slice(0, 10);

export default function RecommendedMoviesPage() {

    return (
        <main className="w-full flex flex-col grow items-center">
            <h1 className="text-2xl font-bold pt-2 pb-4">Recommended</h1>
            <div className="flex text-sm flex-wrap gap-4 pb-32 w-11/12 justify-center sm:justify-start overflow-y-scroll h-[30rem]">
                {recommendedMovies.map((movie) => <MovieCard
                    key={movie.movieId}
                    id={movie.movieId}
                    title={movie.title}
                    rating={movie.bayesianRating}
                    image={movie.image ?? "placeholder.png"}
                    releaseYear={movie.releaseYear ?? 0}
                />
                )}
            </div>
        </main>
    );
}
