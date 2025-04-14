import { create } from "zustand";

export type Movie = {
  movieId: number;
  title: string;
  image: string;
  bayesianRating: number;
  releaseYear: number | null;
};

interface SelectedMovie {
  movie: Movie;
  setMovie: (movie: Movie) => void;
}

export const useSelectedMovieStore = create<SelectedMovie>((set) => ({
  movie: {
    movieId: -1,
    title: "Movie Title",
    image: "/images/placeholder.png",
    bayesianRating: 0.0,
    releaseYear: 1000,
  },
  setMovie: (newMovie: Movie) => set({ movie: newMovie }),
}));
