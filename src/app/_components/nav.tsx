"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// import { api } from "~/trpc/react"

export function BottomNav() {
    return <nav>
        <Link href='/collection'></Link>
        <Link href='/top'></Link>
        <Link href='/home'></Link>
        <Link href='/feed'></Link>
        <Link href='/profile'></Link>
    </nav>
}

export function TopNav() {
    const isHome = useState(true)
    return <nav className="w-full py-6 flex justify-between items-center px-4 z-10 top-0 absolute">
        <Link href='/' >
            {!isHome && <Image src='/logo-full.png' alt="Fusion" width={100} height={100} />}
        </Link>
        <Link href='/login'>Sign In</Link>
    </nav>
}