"use server"

import { CogIcon, CommandLineIcon, DocumentIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { SearchBar } from '~/app/_components/home/search_bar';

export default async function HomeContent() {
    return <main className="flex items-center justify-center flex-col gap-2 grow pb-4">
        <SearchBar />
        <section className='flex justify-around w-full flex-1/2 py-2'>
            <div className='flex flex-col h-full'>
                <Link href="https://docs.google.com/document/d/1BRCrUKjx5FkdV4g9n4iEd1rYq_ELcw9g2g3w77DUNTE" className="hover:underline underline-offset-4 flex flex-col items-center justify-center">
                    <DocumentIcon className="size-6 " />
                    Research
                </Link>
            </div>
            <div className='flex flex-col h-full'>
                <Link href="https://github.com/ib-bib/grad-proj" className="hover:underline underline-offset-4 flex flex-col items-center justify-center">
                    <CogIcon className="size-6 " />
                    Engine
                </Link>
            </div>
            <div className='flex flex-col h-full'>
                <Link href="https://github.com/ib-bib/movie-recommend" className="hover:underline underline-offset-4 flex flex-col items-center justify-center">
                    <CommandLineIcon className="size-6 " />
                    Application
                </Link>
            </div>
        </section>
    </main>
}