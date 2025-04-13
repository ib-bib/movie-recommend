"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { staticMovies } from "~/lib/staticMovies";
import { useSelectedMovieStore } from "../utils/store";

// Debounce Hook
function useDebouncedValue<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

export const normalizeTitle = (title: string): string => {
    // Move trailing article to the front
    const re = /^(.*),\s(The|A|An|Les|La|L')$/i;
    const match = re.exec(title);
    if (match) {
        return `${match[2]} ${match[1]}`;
    }
    return title;
};


export const SearchBar = () => {
    const path = usePathname();
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebouncedValue(query, 150);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { setMovie } = useSelectedMovieStore()

    // Preprocess movies with lowercase titles (once)
    const searchableMovies = useMemo(
        () =>
            staticMovies.map((movie) => {
                const normalized = normalizeTitle(movie.title);
                return {
                    ...movie,
                    normalizedTitle: normalized.toLowerCase(),
                };
            }),
        []
    );

    // Only show top 15 filtered results
    const filteredMovies = useMemo(() => {
        if (!debouncedQuery.trim()) return [];
        const q = debouncedQuery.toLowerCase();
        return searchableMovies
            .filter((movie) => movie.normalizedTitle.includes(q))
            .slice(0, 15);
    }, [debouncedQuery, searchableMovies]);


    return (
        <section className="w-full flex flex-col flex-1/2 items-center justify-center gap-4">
            <div className="relative">
                <Image src="/logo-full.png" alt="Fusion" width={300} height={300} objectFit="contain" />
            </div>
            <div className="text-lg pt-1 pb-2">
                A{" "}
                <span className="text-indigo-300 tracking-wider font-bold">
                    hybrid
                </span>{" "}
                recommender system for movies
            </div>
            {path === "/" ? (
                <div className="text-lg">
                    <Link
                        className="underline underline-offset-4 font-bold"
                        href="/api/auth/signin"
                    >
                        Sign in
                    </Link>{" "}
                    to get movies recommended
                </div>
            ) : (
                <div className="relative w-11/12 sm:w-3/4 md:w-3/5 lg:w-2/5">
                    <div className="rounded-full h-14 px-4 flex items-center border-white border gap-2 bg-white/5 backdrop-blur-md">
                        <MagnifyingGlassIcon className="size-6" />
                        <input
                            type="text"
                            placeholder="Search Movies..."
                            className="outline-none grow bg-transparent text-white"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            onFocus={() => setShowSuggestions(true)}
                        />
                    </div>
                    {showSuggestions && filteredMovies.length > 0 && (
                        <ul className="absolute z-50 mt-2 w-full bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-md max-h-60 overflow-y-auto shadow-lg">
                            {filteredMovies.map((movie) => (
                                <li
                                    key={movie.id}
                                    className="p-2 hover:bg-indigo-500/30 cursor-pointer"
                                    onClick={() => {
                                        const { movieId, title, releaseYear, bayesianRating, image } = movie
                                        setMovie({
                                            movieId,
                                            title,
                                            releaseYear,
                                            bayesianRating,
                                            image: image ?? '/images/placeholder.png'
                                        })
                                    }}
                                >
                                    <Link href={`/movies/${movie.movieId}`}>
                                        {movie.title} - {movie.releaseYear}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
};
