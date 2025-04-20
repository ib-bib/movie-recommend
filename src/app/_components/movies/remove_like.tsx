'use client'

import {
    HeartIcon as OutlineLike,
} from "@heroicons/react/24/outline";
import {
    HeartIcon as SolidLike,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export function RemoveLikeButton({ movieId }: { movieId: number }) {
    const [liked, setLiked] = useState(true)

    const utils = api.useUtils()

    let loadingToastID: number | string
    const unLikeMovie = api.movie.unLikeMovie.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading("Removing movie from likes...")
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID)
            toast.success("Movie removed from likes")
            void utils.movie.getLikedMovies.invalidate()
            void utils.movie.getMostRecent4LikedMovies.invalidate()
            setLiked(false)
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Unable to remove movie from likes. Please try again")
        }
    })

    return <div className='flex flex-col items-center gap-1'>
        <button
            onClick={() => {
                unLikeMovie.mutate({ movieId })
            }}
            className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
            <OutlineLike className="group-hover:text-rose-500 size-6 group-active:block hidden" />
            <SolidLike className="text-rose-500 size-6 group-active:hidden block" />
        </button>
        <span className='text-xs text-neutral-400'>{liked ? 'Liked' : 'Like'}</span>
    </div>
}