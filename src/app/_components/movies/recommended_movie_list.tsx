'use client';

import { api } from "~/trpc/react";
import MovieCard from "./movie_card";
import { getMovieById } from "~/lib/movies_map";

export default function RecommendedMovieList() {
    const { data: recommendedMovies = [], isLoading } = api.movie.getMyRecommendations.useQuery();

    if (isLoading) {
        return <p className="text-neutral-300 pt-10">Loading recommended movies...</p>;
    }

    if (!recommendedMovies || recommendedMovies.length === 0) {
        return <p className="text-neutral-400 pt-10">No recommended yet.</p>;
    }

    return (
        <div className="flex text-sm flex-wrap gap-4 pb-32 w-11/12 justify-center overflow-y-auto max-h-[30.6rem]">
            {recommendedMovies.map((rec) => {
                const movie = getMovieById(rec.movieId);
                if (!movie?.movieId || !movie.title) return null;

                return (
                    <MovieCard
                        key={String(movie.movieId + rec.model)}
                        movieId={movie.movieId}
                        title={movie.title}
                        rating={movie.bayesianRating}
                        model={rec.model}
                        recId={rec.id}
                        content="recommended"
                    />
                );
            })}
        </div>
    );
}
