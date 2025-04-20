'use client'

import {
    BookmarkIcon as OutlineSave,
} from "@heroicons/react/24/outline";
import {
    BookmarkIcon as SolidSave,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export function RemoveSaveButton({ movieId }: { movieId: number }) {
    const [saved, setSaved] = useState(true)

    const utils = api.useUtils()

    let loadingToastID: number | string
    const unSaveMovie = api.movie.unSaveMovie.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading("Removing movie from watch later...")
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID)
            toast.success("Movie removed from watch later")
            void utils.movie.getSavedMovies.invalidate()
            void utils.movie.getMostRecent4SavedMovies.invalidate()
            setSaved(false)
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Unable to remove movie from watch later. Please try again")
        }
    })

    return <div className='flex flex-col items-center gap-1'>
        <button
            onClick={() => {
                unSaveMovie.mutate({ movieId })
            }}
            className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
            <OutlineSave className="group-hover:text-green-500 size-6 group-active:hidden block" />
            <SolidSave className="text-green-500 size-6 group-active:block hidden" />
        </button>
        <span className='text-xs text-neutral-400'>{saved ? 'Saved' : 'Save'}</span>
    </div>
}