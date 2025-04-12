"use client"

import {
    ArchiveBoxIcon,
    ArrowTrendingUpIcon,
    HomeIcon,
    SparklesIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
    { href: "/collection", icon: ArchiveBoxIcon },
    { href: "/top", icon: ArrowTrendingUpIcon },
    { href: "/home", icon: HomeIcon },
    { href: "/feed", icon: SparklesIcon },
    { href: "/profile", icon: UserCircleIcon },
]

export function BottomNav() {
    const path = usePathname()
    const page = path.slice(1)

    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-10">
            <nav className="flex w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 py-1 justify-around items-center bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                {navItems.map(({ href, icon: Icon }) => {
                    const isActive = page === href.slice(1)

                    return (
                        <div
                            key={href}
                            className={`size-14 transition-all flex justify-center items-center rounded-full ${isActive ? "shadow-[0_4px_20px_#1e293b66] -translate-y-4" : ""
                                }`}
                        >
                            <Link
                                href={href}
                                className={`size-12 flex justify-center items-center rounded-full transition-all ${isActive
                                    ? "bg-blue-600 text-slate-100 cursor-default"
                                    : "text-slate-400 hover:bg-blue-800 hover:text-neutral-100"
                                    }`}
                            >
                                <Icon className="size-6" />
                            </Link>
                        </div>
                    )
                })}
            </nav>
        </div>
    )
}
