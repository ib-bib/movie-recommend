"use client"

import {
    HomeIcon,
    FilmIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useSelectedMovieStore, useLastMoviesPathStore } from "../utils/store"

const navItems = [
    { href: "/movies", icon: FilmIcon, label: "Your Movies" },
    { href: "/home", icon: HomeIcon, label: "Home" },
    { href: "/profile", icon: UserCircleIcon, label: "Profile" },
]

export function BottomNav() {
    const path = usePathname()
    const page = path.slice(1)

    const [showFeedBadge, setShowFeedBadge] = useState(true)

    const { movie, setMovie } = useSelectedMovieStore()
    const { lastMoviesPath } = useLastMoviesPathStore()

    const getHref = (href: string) => {
        const isHome = href === "/home"
        const isMovies = href === "/movies"
        const isHomeActive = path.startsWith("/home")
        const isMoviesActive = path.startsWith("/movies")

        if (isHome && movie.movieId !== -1 && !isHomeActive) {
            return `/home/movie/${movie.movieId}`
        }

        if (isMovies && !isMoviesActive) {
            return lastMoviesPath
        }

        return href
    }

    const handleClick = (href: string) => {
        const isHome = href === "/home"
        const isMovies = href === "/movies"
        const isOnMovieDetail = path.startsWith("/home/movie")

        if (isMovies) {
            setShowFeedBadge(false)
        }

        if (isHome && isOnMovieDetail) {
            setMovie({
                movieId: -1,
                title: "Movie Title",
                image: "placeholder.png",
                bayesianRating: 0.0,
                releaseYear: 1000,
            })
        }
    }

    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-10">
            <nav className="flex w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 py-1 justify-around items-center bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const isActive =
                        (href === "/movies" && path.startsWith("/movies")) || page === href.slice(1) || (href === "/home" && path.startsWith("/home/movie"))

                    const finalHref = getHref(href)

                    return (
                        <div
                            key={href}
                            className={`flex flex-col justify-center items-center gap-1 transition-all ${isActive ? "-translate-y-2" : ""
                                }`}
                        >
                            <div className="relative">
                                <Link
                                    href={finalHref}
                                    onClick={() => handleClick(href)}
                                    className={`size-12 flex justify-center items-center rounded-full transition-all ${isActive
                                        ? "bg-blue-600 text-slate-100 cursor-default shadow-[0_4px_20px_#1e293b66]"
                                        : "text-slate-400 hover:bg-blue-800 hover:text-neutral-100"
                                        }`}
                                >
                                    <Icon className="size-6" />
                                </Link>

                                {href === "/movies" && showFeedBadge && (
                                    <div className="absolute inline-flex items-center justify-center size-3 text-[10px] bg-red-500 rounded-full top-0 -right-1"></div>
                                )}
                            </div>

                            <span
                                className={`text-[0.65rem] font-medium ${isActive ? "text-blue-300" : "text-slate-400"
                                    }`}
                            >
                                {label}
                            </span>
                        </div>
                    )
                })}
            </nav>
        </div>
    )
}
