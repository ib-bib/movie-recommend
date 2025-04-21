'use client';

import MovieCard from "~/app/_components/movies/movie_card";
import { api } from "~/trpc/react";
import { getMovieById } from "~/lib/movies_map";

export default function LikedMoviesList() {
    const { data: likedMovies = [], isLoading } = api.movie.getLikedMovies.useQuery();

    if (isLoading) {
        return <p className="text-neutral-300 pt-10">Loading disliked movies...</p>;
    }

    if (!likedMovies || likedMovies.length === 0) {
        return <p className="text-neutral-400 pt-10">No movies disliked for later</p>;
    }

    return <div className="flex text-sm flex-wrap gap-4 pb-32 w-11/12 justify-center overflow-y-auto max-h-[30.6rem]">
        {likedMovies.map((like) => {
            const movie = getMovieById(like.movieId);

            if (!movie?.movieId) return null;

            return (
                <MovieCard
                    key={movie.movieId}
                    movieId={movie.movieId}
                    title={movie.title}
                    rating={movie.bayesianRating}
                    content="liked"
                />
            );
        }
        )}
    </div>
}


