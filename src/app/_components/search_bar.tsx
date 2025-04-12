"use client"

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { staticMovies } from '~/lib/staticMovies';


export const SearchBar = () => {
    const path = usePathname();
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const movies = staticMovies

    const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <section className='w-full flex flex-col flex-1/2 items-center justify-center gap-4'>
            <Image src='/logo-full.png' alt="Fusion" width={300} height={300} />
            <div className='text-xl pt-1 pb-2'>
                A <span className='text-indigo-300 tracking-wider font-bold'>hybrid</span> recommender system for movies
            </div>
            {path === '/' ? (
                <div className='text-lg'>
                    <Link className='underline underline-offset-4 font-bold' href="/api/auth/signin">Sign in</Link> to get movies recommended
                </div>
            ) : (
                <div className='relative w-11/12 sm:w-3/4 md:w-3/5 lg:w-2/5'>
                    <div className='rounded-full h-14 px-4 flex items-center border-white border gap-2 bg-white/5 backdrop-blur-md'>
                        <MagnifyingGlassIcon className="size-6" />
                        <input
                            type='text'
                            placeholder='Search Movies...'
                            className='outline-none grow bg-transparent text-white'
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay so click still works
                            onFocus={() => setShowSuggestions(true)}
                        />
                    </div>
                    {showSuggestions && filteredMovies.length > 0 && (
                        <ul className='absolute z-50 mt-2 w-full bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-md max-h-60 overflow-y-auto shadow-lg'>
                            {filteredMovies.map((movie) => (
                                <li key={movie.id} className='p-2 hover:bg-indigo-500/30 cursor-pointer'>
                                    <Link href={`/movies/${movie.movieId}`}>
                                        {movie.title} - {movie.releaseYear}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
};
