'use client'

import {
    HeartIcon as OutlineLike,
    BookmarkIcon as OutlineSave,
    XCircleIcon as OutlineDislike,
} from "@heroicons/react/24/outline";
import {
    HeartIcon as SolidLike,
    BookmarkIcon as SolidSave,
    XCircleIcon as SolidDislike,
} from "@heroicons/react/24/solid";
import { toast } from 'sonner'

import { api } from "~/trpc/react";

export function RecommendationActions({ movieId, recId, model }: { movieId: number, recId: number, model: string }) {
    const utils = api.useUtils()

    let loadingToastID: string | number

    const likeRec = api.movie.likeRec.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading("Adding movie to likes...")
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID)
            toast.success("Added movie to likes")

            void utils.movie.getMyRecommendations.invalidate()
            void utils.movie.getMyMostRecent4Recommendations.invalidate()
            void utils.movie.getMostRecent4LikedMovies.invalidate()
            void utils.movie.getLikedMovies.invalidate()
            void utils.movie.getLikedCount.invalidate()
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Unable to add movie to likes. PLease try again")
        }
    })

    const dislikeRec = api.movie.dislikeRec.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading("Adding movie to dislikes...")
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID)
            toast.success("Added movie to dislikes")

            void utils.movie.getMyRecommendations.invalidate()
            void utils.movie.getMyMostRecent4Recommendations.invalidate()
            void utils.movie.getMostRecent4DislikedMovies.invalidate()
            void utils.movie.getDislikedMovies.invalidate()
            void utils.movie.getDislikedCount.invalidate()
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Unable to add movie to dislikes. PLease try again")
        }
    })

    const saveRec = api.movie.saveRec.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading("Saving movie to watch later...")
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID)
            toast.success("Saved movie to watch later")

            void utils.movie.getMyRecommendations.invalidate()
            void utils.movie.getMyMostRecent4Recommendations.invalidate()
            void utils.movie.getMostRecent4SavedMovies.invalidate()
            void utils.movie.getSavedMovies.invalidate()
            void utils.movie.getSavedCount.invalidate()
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Unable to save movie to watch later. PLease try again")
        }
    })

    return <div className="flex flex-col items-start gap-4 w-24">
        <button
            onClick={() => {
                likeRec.mutate({ movieId, model, recId })
            }}
            className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
            <OutlineLike className="group-hover:text-rose-500 size-6 group-active:hidden block" />
            <SolidLike className="text-rose-500 size-6 group-active:block hidden" />
        </button>
        <button
            onClick={() => {
                saveRec.mutate({ movieId, model, recId })
            }}
            className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
            <OutlineSave className="group-hover:text-green-500 size-6 group-active:hidden block" />
            <SolidSave className="text-green-500 size-6 group-active:block hidden" />
        </button>
        <button
            onClick={() => {
                dislikeRec.mutate({ movieId, model, recId })
            }}
            className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
            <OutlineDislike className="group-hover:text-red-500 size-6 group-active:hidden block" />
            <SolidDislike className="text-red-500 size-6 group-active:block hidden" />
        </button>
    </div>
}