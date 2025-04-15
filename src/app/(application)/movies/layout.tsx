"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useLastMoviesPathStore } from "~/app/utils/store"

export default function MoviesLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const path = usePathname()
    const setLastMoviesPath = useLastMoviesPathStore((s) => s.setLastMoviesPath)

    useEffect(() => {
        if (path.startsWith("/movies")) {
            setLastMoviesPath(path)
        }
    }, [path, setLastMoviesPath])

    return <>{children}</>
}
