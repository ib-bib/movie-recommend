'use client'

import {
    BookmarkIcon as OutlineSave,
} from "@heroicons/react/24/outline";
import {
    BookmarkIcon as SolidSave,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export function RemoveSaveButton({ movieId,
    nextId,
    prevId }: {
        movieId: number;
        nextId?: number;
        prevId?: number;
    }) {
    const [saved, setSaved] = useState(true)
    const router = useRouter();
    const utils = api.useUtils()

    let loadingToastID: number | string
    const unSaveMovie = api.movie.unSaveMovie.useMutation({
        onMutate: () => {
            setSaved(true)
            loadingToastID = toast.loading("Removing movie from watch later...")
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID)
            toast.success("Movie removed from watch later")
            void utils.movie.getSavedMovies.refetch()
            void utils.movie.getMostRecent4SavedMovies.refetch()
            // Auto-navigate after short delay
            setTimeout(() => {
                if (nextId) {
                    router.push(`/movies/saved/${nextId}`);
                } else if (prevId) {
                    router.push(`/movies/saved/${prevId}`);
                } else {
                    router.push("/movies/saved");
                }
            }, 1000);
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Unable to remove movie from watch later. Please try again")
            setSaved(false)
        },
        onSettled: () => {
            toast.dismiss(loadingToastID)
        }
    })

    return <div className='flex flex-col items-center gap-1'>
        <button
            onClick={() => {
                unSaveMovie.mutate({ movieId })
            }}
            className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
            {saved ? (
                <SolidSave className="text-green-500 size-6" />
            ) : (
                <OutlineSave className="text-green-500 size-6" />
            )}
        </button>
        <div className='text-xs text-neutral-400'>{saved ? 'Saved' : 'Save'}</div>
    </div>
}