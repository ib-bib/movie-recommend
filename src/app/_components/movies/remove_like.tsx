'use client'

import {
    HeartIcon as OutlineLike,
} from "@heroicons/react/24/outline";
import {
    HeartIcon as SolidLike,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export function RemoveLikeButton({ movieId,
    nextId,
    prevId }: {
        movieId: number
        nextId?: number;
        prevId?: number;
    }) {
    const [liked, setLiked] = useState(true)
    const router = useRouter();
    const utils = api.useUtils()

    let loadingToastID: number | string
    const unLikeMovie = api.movie.unLikeMovie.useMutation({
        onMutate: () => {
            setLiked(true)
            loadingToastID = toast.loading("Removing movie from likes...")
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID)
            toast.success("Movie removed from likes")
            void utils.movie.getLikedMovies.refetch()
            void utils.movie.getMostRecent4LikedMovies.refetch()

            // Auto-navigate after short delay
            setTimeout(() => {
                if (nextId) {
                    router.push(`/movies/liked/${nextId}`);
                } else if (prevId) {
                    router.push(`/movies/liked/${prevId}`);
                } else {
                    router.push("/movies/liked");
                }
            }, 1000);
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Unable to remove movie from likes. Please try again")
            setLiked(true); // Revert icon if failed
        },
        onSettled: () => {
            toast.dismiss(loadingToastID)
        }
    })

    return <div className='flex flex-col items-center gap-1'>
        <button
            onClick={() => {
                unLikeMovie.mutate({ movieId })
            }}
            className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
            {liked ? (
                <SolidLike className="text-rose-500 size-6" />
            ) : (
                <OutlineLike className="text-rose-500 size-6" />
            )}
        </button>
        <div className='text-xs text-neutral-400'>{liked ? 'Liked' : 'Like'}</div>
    </div>
}