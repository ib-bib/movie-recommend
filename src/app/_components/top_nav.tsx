"use client"

import { ArrowRightEndOnRectangleIcon, ArrowLeftStartOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function TopNav({ signedIn }: { signedIn: boolean }) {
    const path = usePathname()

    return <nav className="w-full py-6 flex justify-between items-center px-4">
        <Link href='/'>
            <Image src='/logo-full.png' alt="Fusion" width={100} height={100} />
        </Link>
        {signedIn ?
            <Link href={path == '/' ? '/profile' : '/api/auth/signout'} className="hover:underline underline-offset-4 flex justify-center gap-1">
                {
                    path == '/' ? <><UserCircleIcon className="size-6 " />Profile</>
                        : <> <ArrowLeftStartOnRectangleIcon className="size-6 " />Sign Out</>
                }
            </Link>
            :
            <Link href='/api/auth/signin' className="hover:underline underline-offset-4 flex justify-center gap-1">
                <ArrowRightEndOnRectangleIcon className="size-6 " />
                Sign In
            </Link>
        }
    </nav>
}
