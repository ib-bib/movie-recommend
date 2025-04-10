"use client"

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const SearchBar = () => {
    const path = usePathname()

    return path == '/' ?
        <div>Sign in to get movies recommended</div>
        : <section className='w-full flex flex-col flex-1/2 items-center justify-center gap-4'>
            <Image src='/logo-full.png' alt="Fusion" width={300} height={300} />
            <div className='w-11/12 sm:w-3/4 md:w-3/5 lg:w-2/5 rounded-full h-14 px-4 flex items-center border-white border gap-2'>
                <MagnifyingGlassIcon className="size-6 " />
                <input type='text' placeholder='Search Movies...' className='outline-none grow flex' />
            </div>
        </section>
}