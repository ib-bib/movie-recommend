'use client'

import {
    XCircleIcon as OutlineDislike,
} from "@heroicons/react/24/outline";
import {
    XCircleIcon as SolidDislike,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export function RemoveDislikeButton({ movieId }: { movieId: number }) {
    const [disliked, setDisliked] = useState(true)

    const utils = api.useUtils()

    let loadingToastID: number | string
    const unDislikeMovie = api.movie.unDislikeMovie.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading("Removing movie from dislikes...")
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID)
            toast.success("Movie removed from dislikes")
            void utils.movie.getDislikedMovies.invalidate()
            void utils.movie.getMostRecent4DislikedMovies.invalidate()
            setDisliked(false)
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Unable to remove movie from dislikes. Please try again")
        }
    })


    return <div className='flex flex-col items-center gap-1'>
        <button
            onClick={() => {
                unDislikeMovie.mutate({ movieId })
            }}
            className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
            <OutlineDislike className="group-hover:text-red-500 size-6 group-active:block hidden" />
            <SolidDislike className="text-red-500 size-6 group-active:hidden block" />
        </button>
        <span className='text-xs text-neutral-400'>{disliked ? 'Disiked' : 'Dislike'}</span>
    </div>
}