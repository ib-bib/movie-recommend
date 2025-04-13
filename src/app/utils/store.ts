import { create } from "zustand";

export type PageType = "profile" | "feed" | "collection" | "home" | "top";

interface CurrentPage {
  page: PageType;
  setPage: (newPage: PageType) => void;
}

export const useCurrentPageStore = create<CurrentPage>((set) => ({
  page: "profile",
  setPage: (newPage: PageType) => set({ page: newPage }),
}));

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
