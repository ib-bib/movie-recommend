'use client'

import { StarIcon } from '@heroicons/react/24/solid'
import { api } from '~/trpc/react';
import { Spinner } from '~/app/_components/spinner';

export function MovieMeta({ movieId, releaseYear, rating }: { movieId: number; releaseYear?: number; rating?: number }) {
    const genresQuery = api.movie.getMovieGenres.useQuery({ id: movieId }, { refetchOnWindowFocus: false })

    if (!genresQuery.data) return <Spinner />

    return (
        <div className='flex flex-col gap-2 w-full md:w-1/3 items-center justify-center'>
            <div className="flex items-center justify-between w-11/12">
                <div>
                    <span className="font-bold">Release Year: </span>
                    {releaseYear ?? 'Unavailable'}
                </div>
                <div className="flex gap-1 items-center">
                    <div>
                        <span className="font-bold">Rating: </span>
                        {rating} / 5
                    </div>
                    <StarIcon className="size-4 md:size-5 text-amber-400" />
                </div>
            </div>
            {!genresQuery.data[0]?.name ?
                <div className='w-11/12 flex justify-center'>Unknown Genre</div>
                :
                <div className='w-11/12'>
                    <div className='font-semibold'>Genres: </div>
                    <ul className='flex flex-wrap gap-2'>
                        {genresQuery.data.map(genre => <li key={genre?.id}> {genre?.name}</li>)}
                    </ul>
                </div>
            }
        </div>
    )
}
