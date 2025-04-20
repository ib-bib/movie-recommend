'use client';

import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import {
    HeartIcon as OutlineHeart,
    BookmarkIcon as OutlineSave,
    XCircleIcon as OutlineDislike,
} from "@heroicons/react/24/outline";
import {
    HeartIcon as SolidHeart,
    BookmarkIcon as SolidSave,
    XCircleIcon as SolidDislike,
} from "@heroicons/react/24/solid";
import { normalizeTitle } from "~/app/utils/normalized_strings";
import FallbackImage from "~/app/_components/fallback_image";
import { api } from "~/trpc/react";
import { toast } from "sonner";

type MovieCardProps = {
    movieId: number;
    title: string;
    rating: number;
    hrefBase?: string; // e.g. "/movies/recommended"
    mode?: "recommended" | "liked" | "saved" | "disliked";
    model?: string;
    recId?: number;
};

export default function MovieCard({
    movieId,
    title,
    rating,
    hrefBase = "/movies/recommended",
    mode = "recommended",
    model,
    recId
}: MovieCardProps) {
    const href = `${hrefBase}/${movieId}`;

    const renderButtons = () => {
        switch (mode) {
            case "liked":
                return (
                    <SingleButton
                        movieId={movieId}
                        action={mode}
                        icon={<SolidHeart className="text-rose-500 size-6" />}
                    />
                );
            case "saved":
                return (
                    <SingleButton
                        movieId={movieId}
                        action={mode}
                        icon={<SolidSave className="text-green-500 size-6" />}
                    />
                );
            case "disliked":
                return (
                    <SingleButton
                        movieId={movieId}
                        action={mode}
                        icon={<SolidDislike className="text-red-500 size-6" />}
                    />
                );
            case "recommended":
            default:
                return (
                    <div className="flex w-full items-end justify-between h-fit px-2 pb-1 z-10">
                        <ActionButton
                            model={model!}
                            movieId={movieId}
                            recId={recId!}
                            action="like"
                            outlineIcon={<OutlineHeart className="group-hover:text-rose-500 size-6" />}
                            solidIcon={<SolidHeart className="text-rose-500 size-6" />}
                        />
                        <ActionButton
                            model={model!}
                            movieId={movieId}
                            recId={recId!}
                            action="save"
                            outlineIcon={<OutlineSave className="group-hover:text-green-500 size-6" />}
                            solidIcon={<SolidSave className="text-green-500 size-6" />}
                        />
                        <ActionButton
                            model={model!}
                            movieId={movieId}
                            recId={recId!}
                            action="dislike"
                            outlineIcon={<OutlineDislike className="group-hover:text-red-500 size-6" />}
                            solidIcon={<SolidDislike className="text-red-500 size-6" />}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="relative bg-neutral-100/10 border border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 flex flex-col justify-between overflow-hidden transition-all hover:cursor-pointer">
            {/* Background Image */}
            <FallbackImage movieId={movieId} title={title} />

            {/* Optional overlay */}
            <Link href={href} className="absolute inset-0 bg-black/40 z-0 transition-all hover:opacity-30" />

            {/* Title */}
            <Link href={href} className="font-bold w-52 p-1 max-h-8 z-10 backdrop-blur-sm bg-black/60 text-ellipsis overflow-hidden whitespace-nowrap">
                {normalizeTitle(title)}
            </Link>

            {/* Rating */}
            <div className="absolute bottom-14 right-2 z-10 p-1 bg-neutral-700/40 backdrop-blur-3xl rounded-4xl shadow border border-neutral-300 flex items-center gap-1 hover:cursor-text">
                {rating?.toFixed(2)} / 5
                <StarIcon className="text-amber-400 size-4" />
            </div>

            {/* Action Buttons */}
            {renderButtons()}
        </div>
    );
}

// ========== Small Helper Components ==========

function ActionButton({ outlineIcon, solidIcon, action, model, recId, movieId }: { outlineIcon: React.ReactNode; solidIcon: React.ReactNode, action: "like" | "save" | "dislike", model: string, recId: number, movieId: number }) {

    const utils = api.useUtils()
    let loadingToastID: string | number = ''

    const likeRec = api.movie.likeRec.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading('Adding movie to liked...')
        },
        onSuccess: () => {
            void utils.movie.getMyRecommendations.invalidate()
            void utils.movie.getMyMostRecent4Recommendations.invalidate()
            void utils.movie.getLikedMovies.invalidate()
            void utils.movie.getMostRecent4LikedMovies.invalidate()
            toast.dismiss(loadingToastID)
            toast.success('Movie added to likes')
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Could not add movie to liked, please try again")
        }
    }).mutate

    const dislikeRec = api.movie.dislikeRec.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading('Adding movie to disliked...')
        },
        onSuccess: () => {
            void utils.movie.getMyRecommendations.invalidate()
            void utils.movie.getMyMostRecent4Recommendations.invalidate()
            void utils.movie.getDislikedMovies.invalidate()
            void utils.movie.getMostRecent4DislikedMovies.invalidate()
            toast.dismiss(loadingToastID)
            toast.success('Movie added to dislikes')
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Could not add movie to disliked, please try again")
        }
    }).mutate

    const saveRec = api.movie.saveRec.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading('Adding movie to watch later...')
        },
        onSuccess: () => {
            void utils.movie.getMyRecommendations.invalidate()
            void utils.movie.getMyMostRecent4Recommendations.invalidate()
            void utils.movie.getSavedMovies.invalidate()
            void utils.movie.getMostRecent4SavedMovies.invalidate()
            toast.dismiss(loadingToastID)
            toast.success('Movie added to watch later')
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Could not add movie to watch later, please try again")
        }
    }).mutate

    return (
        <button onClick={() => {
            if (action === 'like') {
                likeRec({ model, movieId, recId })
            } else if (action === 'dislike') {
                dislikeRec({ model, movieId, recId })
            } else {
                saveRec({ model, movieId, recId })
            }
        }} className="group active:scale-90 rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
            <div className="group-hover:hidden block">{outlineIcon}</div>
            <div className="group-hover:block hidden">{solidIcon}</div>
        </button>
    );
}

function SingleButton({ icon, action, movieId }: { icon: React.ReactNode, action: "liked" | "saved" | "disliked", movieId: number }) {
    const utils = api.useUtils()

    let loadingToastID: string | number = ''
    const unLikeMovie = api.movie.unLikeMovie.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading('Removing movie from liked...')
        },
        onSuccess: () => {
            void utils.movie.getLikedCount.invalidate()
            void utils.movie.getLikedMovies.invalidate()
            void utils.movie.getMostRecent4LikedMovies.invalidate()
            toast.dismiss(loadingToastID)
            toast.success('Movie removed from likes')
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Could not remove movie from liked, please try again")
        }
    }).mutate

    const unDislikeMovie = api.movie.unDislikeMovie.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading('Removing movie from disliked...')
        },
        onSuccess: () => {
            void utils.movie.getDislikedCount.invalidate()
            void utils.movie.getDislikedMovies.invalidate()
            void utils.movie.getMostRecent4DislikedMovies.invalidate()
            toast.dismiss(loadingToastID)
            toast.success('Movie removed from dislike')
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Could not remove movie from disliked, please try again")
        }
    }).mutate

    const unSaveMovie = api.movie.unSaveMovie.useMutation({
        onMutate: () => {
            loadingToastID = toast.loading('Removing movie from watch later...')
        },
        onSuccess: () => {
            void utils.movie.getSavedCount.invalidate()
            void utils.movie.getSavedMovies.invalidate()
            void utils.movie.getMostRecent4SavedMovies.invalidate()
            toast.dismiss(loadingToastID)
            toast.success('Movie removed from watch later')
        },
        onError: () => {
            toast.dismiss(loadingToastID)
            toast.error("Could not remove movie from watch later, please try again")
        }
    }).mutate

    return (
        <div className="flex w-full items-end justify-center h-fit px-2 pb-1 z-10">
            <button onClick={() => {
                if (action === 'liked') {
                    unLikeMovie({ movieId })
                } else if (action === 'disliked') {
                    unDislikeMovie({ movieId })
                } else {
                    unSaveMovie({ movieId })
                }
            }} className="active:scale-90 rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                {icon}
            </button>
        </div>
    );
}
