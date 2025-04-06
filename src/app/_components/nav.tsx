"use client"

import { ArchiveBoxIcon, ArrowRightEndOnRectangleIcon, ArrowLeftStartOnRectangleIcon, ArrowTrendingUpIcon, HomeIcon, SparklesIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"


export function TopNav({ signedIn }: { signedIn: boolean }) {
    return <nav className="w-full py-6 flex justify-between items-center px-4">
        <Link href='/'>
            <Image src='/logo-full.png' alt="Fusion" width={100} height={100} />
        </Link>
        {signedIn ?
            <Link href='/api/auth/signout' className="hover:underline underline-offset-4 flex justify-center gap-1">
                <ArrowLeftStartOnRectangleIcon className="size-6 text-white-500" />
                Sign out
            </Link>
            :
            <Link href='/api/auth/signin' className="hover:underline underline-offset-4 flex justify-center gap-1">
                <ArrowRightEndOnRectangleIcon className="size-6 text-white-500" />
                Sign In
            </Link>
        }
    </nav>
}

export function BottomNav() {
    const path = usePathname()
    const page = path.split('/')[1]

    return <nav className="flex w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 py-1 justify-around items-center bg-cyan-800 rounded-full">
        <div className={`size-14 transition-all ${page == 'collection' ? 'bg-gradient-to-b from-[#002088] to-[#121325] -translate-y-6' : ''} flex justify-center items-center rounded-full`}>
            <Link href='/collection' className={`transition-all ${page == "collection" ? 'bg-cyan-950' : ''} size-12 rounded-full flex justify-center items-center`}>
                <ArchiveBoxIcon className="size-6 text-white-500" />
            </Link>
        </div>
        <div className={`size-14 transition-all ${page == 'top' ? 'bg-gradient-to-b from-[#002088] to-[#121325] -translate-y-6' : ''} flex justify-center items-center rounded-full`}>
            <Link href='/top' className={`transition-all ${page == "top" ? 'bg-cyan-950' : ''} size-12 rounded-full flex justify-center items-center`}>
                <ArrowTrendingUpIcon className="size-6 text-white-500" />
            </Link>
        </div>
        <div className={`size-14 transition-all ${page == 'home' ? 'bg-gradient-to-b from-[#002088] to-[#121325] -translate-y-6' : ''} flex justify-center items-center rounded-full`}>
            <Link href='/home' className={`transition-all ${page == "home" ? 'bg-cyan-950' : ''} size-12 rounded-full flex justify-center items-center`}>
                <HomeIcon className="size-6 text-white-500" />
            </Link>
        </div>
        <div className={`size-14 transition-all ${page == 'feed' ? 'bg-gradient-to-b from-[#002088] to-[#121325] -translate-y-6' : ''} flex justify-center items-center rounded-full`}>
            <Link href='/feed' className={`transition-all ${page == "feed" ? 'bg-cyan-950' : ''} size-12 rounded-full flex justify-center items-center`}>
                <SparklesIcon className="size-6 text-white-500" />
            </Link>
        </div>
        <div className={`size-14 transition-all ${page == 'profile' ? 'bg-gradient-to-b from-[#002088] to-[#121325] -translate-y-6' : ''} flex justify-center items-center rounded-full`}>
            <Link href='/profile' className={`transition-all ${page == "profile" ? 'bg-cyan-950' : ''} size-12 rounded-full flex justify-center items-center`}>
                <UserCircleIcon className="size-6 text-white-500" />
            </Link>
        </div>
    </nav >
}