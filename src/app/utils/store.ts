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
