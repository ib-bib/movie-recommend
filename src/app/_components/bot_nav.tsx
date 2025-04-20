"use client"

import {
    HomeIcon as OutlineHome,
    FilmIcon as OutlineFilm,
    UserCircleIcon as OutlineUser,
} from "@heroicons/react/24/outline"
import {
    HomeIcon as SolidHome,
    FilmIcon as SolidFilm,
    UserCircleIcon as SolidUser,
} from "@heroicons/react/24/solid"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useMemo } from "react"
import { useLastHomePathStore, useLastMoviesPathStore } from "../utils/store"
import { api } from "~/trpc/react"

const navItems = [
    {
        href: "/movies",
        label: "Your Movies",
        icon: {
            outline: OutlineFilm,
            solid: SolidFilm,
        },
    },
    {
        href: "/home",
        label: "Home",
        icon: {
            outline: OutlineHome,
            solid: SolidHome,
        },
    },
    {
        href: "/profile",
        label: "Profile",
        icon: {
            outline: OutlineUser,
            solid: SolidUser,
        },
    },
]

export function BottomNav() {
    const [data] = api.movie.getMyMostRecent4Recommendations.useSuspenseQuery()

    const path = usePathname()
    const page = path.slice(1)

    const [showFeedBadge, setShowFeedBadge] = useState(true)

    const { lastHomePath } = useLastHomePathStore()
    const { lastMoviesPath } = useLastMoviesPathStore()

    const recommendations = useMemo(() => {
        return data ?? []
    }, [data])

    const shouldShowBadge = showFeedBadge && recommendations.length > 0 && !path.startsWith("/movies")

    const getHref = (href: string) => {
        const isHome = href === "/home"
        const isMovies = href === "/movies"
        const isHomeActive = path.startsWith("/home")
        const isMoviesActive = path.startsWith("/movies")

        if (isHome && !isHomeActive) {
            return lastHomePath
        }

        if (isMovies && !isMoviesActive) {
            return lastMoviesPath
        }

        return href
    }

    const handleClick = (href: string) => {
        const isMovies = href === "/movies"

        if (isMovies) {
            setShowFeedBadge(false)
        }
    }

    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-10">
            <nav className="flex w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 py-1 justify-around items-center bg-neutral-800/20 backdrop-blur-lg rounded-full shadow-lg border border-neutral-100/20">
                {navItems.map(({ href, icon, label }) => {
                    const isActive =
                        (href === "/movies" && path.startsWith("/movies")) ||
                        page === href.slice(1) ||
                        (href === "/home" && path.startsWith("/home/movie"))

                    const finalHref = getHref(href)
                    const Icon = isActive ? icon.solid : icon.outline

                    return (
                        <div
                            key={href}
                            className={`flex flex-col justify-center items-center gap-1 transition-all ${isActive ? "-translate-y-4" : ""
                                }`}
                        >
                            <div className="relative">
                                <Link
                                    href={finalHref}
                                    onClick={() => handleClick(href)}
                                    className={`size-12 flex justify-center items-center rounded-full transition-all ${isActive
                                        ? "bg-blue-600 text-slate-100 cursor-default shadow-[0_4px_20px_#1e293b66] border-3 border-[#001333]"
                                        : "text-slate-200 hover:bg-blue-800 hover:text-neutral-50"
                                        }`}
                                >
                                    <Icon className="size-6" />
                                </Link>

                                {href === "/movies" && (
                                    <div
                                        className={`absolute inline-flex items-center justify-center size-3 bg-red-500 rounded-full border-2 border-[#001333] right-2 top-3 transition-all duration-300 ease-in-out ${shouldShowBadge ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                                    ></div>
                                )}

                            </div>

                            <span
                                className={`text-[0.65rem] font-medium ${isActive ? "text-blue-200" : "text-slate-200"
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
