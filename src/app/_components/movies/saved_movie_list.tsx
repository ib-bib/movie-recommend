'use client';

import MovieCard from "~/app/_components/movies/movie_card";
import { api } from "~/trpc/react";
import { getMovieById } from "~/lib/movies_map";

export default function SavedMoviesList() {
    const { data: savedMovies = [], isLoading } = api.movie.getSavedMovies.useQuery();

    if (isLoading) {
        return <p className="text-neutral-300 pt-10">Loading saved movies...</p>;
    }

    if (!savedMovies || savedMovies.length === 0) {
        return <p className="text-neutral-400 pt-10">No movies saved for later</p>;
    }

    return (
        <div className="flex text-sm flex-wrap gap-4 pb-32 w-11/12 justify-center overflow-y-auto max-h-[30.6rem]">
            {savedMovies.map((saved) => {
                const movie = getMovieById(saved.movieId);
                if (!movie?.movieId || !movie.title) return null;

                return (
                    <MovieCard
                        key={movie.movieId}
                        movieId={movie.movieId}
                        title={movie.title}
                        rating={movie.bayesianRating}
                        content="saved"
                    />
                );
            })}
        </div>
    );
}
