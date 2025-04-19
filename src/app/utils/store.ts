import { create } from "zustand";
import { shallow } from "zustand/shallow";

export const useLastMoviesPathStore = create<{
  lastMoviesPath: string;
  setLastMoviesPath: (path: string) => void;
}>((set) => ({
  lastMoviesPath: "/movies",
  setLastMoviesPath: (path) => set({ lastMoviesPath: path }),
}));

export const useLastHomePathStore = create<{
  lastHomePath: string;
  setLastHomePath: (path: string) => void;
}>((set) => ({
  lastHomePath: "/home",
  setLastHomePath: (path) => set({ lastHomePath: path }),
}));

export type Recommendation = {
  id: number;
  movieId: number;
  model: string;
};

interface RecommendationsState {
  recommendations: Recommendation[];
  setRecommendations: (recs: Recommendation[]) => void;
}

export const useRecommendationsStore = create<RecommendationsState>()(
  (set, get) => ({
    recommendations: [],
    setRecommendations: (incoming) => {
      const current = get().recommendations;
      const isSame =
        current.length === incoming.length &&
        shallow(
          current.map((r) => r.id),
          incoming.map((r) => r.id),
        );
      if (!isSame) {
        set({ recommendations: incoming });
      }
    },
  }),
);
