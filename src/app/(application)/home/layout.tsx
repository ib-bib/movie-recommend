"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useLastHomePathStore } from "~/app/utils/store"

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const path = usePathname()
    const setLastHomePath = useLastHomePathStore((s) => s.setLastHomePath)

    useEffect(() => {
        if (path.startsWith("/home")) {
            setLastHomePath(path)
        }
    }, [path, setLastHomePath])

    return <>{children}</>
}
