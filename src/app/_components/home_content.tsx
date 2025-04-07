"use server"

import { CogIcon, CommandLineIcon, DocumentIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default async function HomeContent() {
    return <main className="flex items-center justify-center flex-col gap-2 grow">
        <section className='w-full flex flex-col flex-1/2 items-center justify-center gap-4'>
            <Image src='/logo-full.png' alt="Fusion" width={300} height={300} />
            <div className='w-11/12 sm:w-3/4 md:w-3/5 lg:w-2/5 rounded-full h-14 px-4 flex items-center border-white border gap-2'>
                <MagnifyingGlassIcon className="size-6 " />
                <input type='text' placeholder='Search Movies...' className='outline-none grow flex' />
            </div>
        </section>
        <section className='flex items-center justify-around w-full flex-1/2 py-2'>
            <div className='flex flex-col h-full'>
                <Link href="/" className="hover:underline underline-offset-4 flex flex-col items-center justify-center">
                    <DocumentIcon className="size-6 " />
                    Research
                </Link>
            </div>
            <div className='flex flex-col h-full'>
                <Link href="/" className="hover:underline underline-offset-4 flex flex-col items-center justify-center">
                    <CogIcon className="size-6 " />
                    Engine
                </Link>
            </div>
            <div className='flex flex-col h-full'>
                <Link href="/" className="hover:underline underline-offset-4 flex flex-col items-center justify-center">
                    <CommandLineIcon className="size-6 " />
                    Application
                </Link>
            </div>
        </section>
    </main>
}