'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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

import { api } from "~/trpc/react";

export function RecommendationActions({
    movieId,
    recId,
    model,
    nextMovieId,
    prevMovieId,
}: {
    movieId: number,
    recId: number,
    model: string,
    nextMovieId?: number,
    prevMovieId?: number
}) {
    const router = useRouter()
    const utils = api.useUtils()
    const [selectedAction, setSelectedAction] = useState<"like" | "save" | "dislike" | null>(null)

    let loadingToastID: string | number

    const handleAfterSuccess = () => {
        setTimeout(() => {
            if (nextMovieId) {
                router.push(`/movies/recommended/${nextMovieId}`)
            } else if (prevMovieId) {
                router.push(`/movies/recommended/${prevMovieId}`)
            } else {
                router.push(`/movies/recommended`)
            }
        }, 500)
    }

    const likeRec = api.movie.likeRec.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading("Adding movie to likes...")
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID)
            toast.success("Added movie to likes")
            handleAfterSuccess()
            void utils.movie.getMyRecommendations.refetch()
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Unable to add movie to likes. Please try again")
            setSelectedAction(null)
        },
        onSettled: () => {
            toast.dismiss(loadingToastID)
        }
    })

    const dislikeRec = api.movie.dislikeRec.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading("Adding movie to dislikes...")
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID)
            toast.success("Added movie to dislikes")
            handleAfterSuccess()
            void utils.movie.getMyRecommendations.refetch()
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Unable to add movie to dislikes. Please try again")
            setSelectedAction(null)
        },
        onSettled: () => {
            toast.dismiss(loadingToastID)
        }
    })

    const saveRec = api.movie.saveRec.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading("Saving movie to watch later...")
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID)
            toast.success("Saved movie to watch later")
            handleAfterSuccess()
            void utils.movie.getMyRecommendations.refetch()
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Unable to save movie to watch later. Please try again")
            setSelectedAction(null)
        },
        onSettled: () => {
            toast.dismiss(loadingToastID)
        }
    })

    return (
        <div className="flex flex-col items-center gap-6 w-24">
            {/* Like */}
            {selectedAction === null || selectedAction === "like" ? (
                <div className="flex flex-col gap-1 items-center">
                    <button
                        onClick={() => {
                            setSelectedAction("like")
                            likeRec.mutate({ movieId, model, recId })
                        }}
                        className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                        <SolidLike className={`${selectedAction === "like" ? "text-rose-500" : "hidden"} size-6`} />
                        <OutlineLike className={`${selectedAction === null ? "group-hover:text-rose-500" : "hidden"} size-6`} />
                    </button>
                    <div className="text-xs text-neutral-400">Like</div>
                </div>
            ) : null}

            {/* Save */}
            {selectedAction === null || selectedAction === "save" ? (
                <div className="flex flex-col gap-1 items-center">
                    <button
                        onClick={() => {
                            setSelectedAction("save")
                            saveRec.mutate({ movieId, model, recId })
                        }}
                        className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                        <SolidSave className={`${selectedAction === "save" ? "text-green-500" : "hidden"} size-6`} />
                        <OutlineSave className={`${selectedAction === null ? "group-hover:text-green-500" : "hidden"} size-6`} />
                    </button>
                    <div className="text-xs text-neutral-400">Watch Later</div>
                </div>
            ) : null}

            {/* Dislike */}
            {selectedAction === null || selectedAction === "dislike" ? (
                <div className="flex flex-col gap-1 items-center">
                    <button
                        onClick={() => {
                            setSelectedAction("dislike")
                            dislikeRec.mutate({ movieId, model, recId })
                        }}
                        className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                        <SolidDislike className={`${selectedAction === "dislike" ? "text-red-500" : "hidden"} size-6`} />
                        <OutlineDislike className={`${selectedAction === null ? "group-hover:text-red-500" : "hidden"} size-6`} />
                    </button>
                    <div className="text-xs text-neutral-400">Dislike</div>
                </div>
            ) : null}
        </div>
    )
}
