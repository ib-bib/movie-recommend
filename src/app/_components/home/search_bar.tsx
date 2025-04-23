"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { staticMovies } from "~/lib/staticMovies";
import { normalizeTitle } from "~/app/utils/normalized_strings";
import FallbackImage from "../fallback_image";

// Debounce Hook
function useDebouncedValue<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

export const SearchBar = () => {
    const path = usePathname();
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebouncedValue(query, 150);
    const [showSuggestions, setShowSuggestions] = useState(false);

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
                <Image src="/logo-full.png" alt="Fusion" width={500} height={500} className="h-24 w-auto" />
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
                    <div className="rounded-full h-14 px-4 flex items-center border-neutral-100 border gap-2 bg-neutral-100/5 backdrop-blur-md">
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
                        <ul className="absolute z-50 mt-2 w-full bg-neutral-100/10 backdrop-blur-md text-white border border-neutral-100/20 rounded-md max-h-60 overflow-y-auto shadow-lg">
                            {filteredMovies.map((movie) => (
                                <li
                                    key={movie.id}
                                    className="p-2 hover:bg-indigo-500/30 cursor-pointer"
                                >
                                    <Link
                                        className="flex items-center gap-2 w-full"
                                        href={`/home/movie/${movie.movieId}`}
                                    >
                                        <span className="w-[40px] h-[60px]">
                                            <FallbackImage movieId={movie.movieId} title={movie.title} className="rounded-sm object-cover" />
                                        </span>
                                        <span className="truncate">
                                            {normalizeTitle(movie.title)} - {movie.releaseYear}
                                        </span>
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
