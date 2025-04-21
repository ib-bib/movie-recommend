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
import { useState } from "react";

type MovieCardProps = {
    movieId: number;
    title: string;
    rating: number;
    content?: "recommended" | "liked" | "saved" | "disliked";
    model?: string;
    recId?: number;
};

export default function MovieCard({
    movieId,
    title,
    rating,
    content = "recommended",
    model,
    recId
}: MovieCardProps) {
    const href = `/movies/${content}/${movieId}`;

    const [selectedAction, setSelectedAction] = useState<"like" | "save" | "dislike" | null>(null);

    const renderButtons = () => {
        switch (content) {
            case "liked":
                return (
                    <SingleButton
                        movieId={movieId}
                        action={content}
                        icon={<SolidHeart className="text-rose-500 size-6" />}
                    />
                );
            case "saved":
                return (
                    <SingleButton
                        movieId={movieId}
                        action={content}
                        icon={<SolidSave className="text-green-500 size-6" />}
                    />
                );
            case "disliked":
                return (
                    <SingleButton
                        movieId={movieId}
                        action={content}
                        icon={<SolidDislike className="text-red-500 size-6" />}
                    />
                );
            case "recommended":
            default:
                return (
                    <div className="flex w-full items-end justify-around h-fit px-2 pb-1 z-10">
                        <ActionButton
                            model={model!}
                            movieId={movieId}
                            recId={recId!}
                            action="like"
                            selectedAction={selectedAction}
                            setSelectedAction={setSelectedAction}
                            outlineIcon={<OutlineHeart className="group-hover:text-rose-500 size-6" />}
                            solidIcon={<SolidHeart className="text-rose-500 size-6" />}
                        />
                        <ActionButton
                            model={model!}
                            movieId={movieId}
                            recId={recId!}
                            action="save"
                            selectedAction={selectedAction}
                            setSelectedAction={setSelectedAction}
                            outlineIcon={<OutlineSave className="group-hover:text-green-500 size-6" />}
                            solidIcon={<SolidSave className="text-green-500 size-6" />}
                        />
                        <ActionButton
                            model={model!}
                            movieId={movieId}
                            recId={recId!}
                            action="dislike"
                            selectedAction={selectedAction}
                            setSelectedAction={setSelectedAction}
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
            <FallbackImage movieId={movieId} title={normalizeTitle(title)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover z-0" />

            {/* Optional overlay */}
            <Link title={normalizeTitle(title)} href={href} className="absolute inset-0 bg-black/40 z-0 transition-all hover:opacity-30" />

            {/* Title */}
            <Link href={href} className="font-bold w-52 p-1 pl-1.5 max-h-8 z-10 backdrop-blur-sm bg-black/60 text-ellipsis overflow-hidden whitespace-nowrap">
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

function ActionButton({
    outlineIcon,
    solidIcon,
    action,
    model,
    recId,
    movieId,
    selectedAction,
    setSelectedAction,
}: {
    outlineIcon: React.ReactNode;
    solidIcon: React.ReactNode;
    action: "like" | "save" | "dislike";
    model: string;
    recId: number;
    movieId: number;
    selectedAction: "like" | "save" | "dislike" | null;
    setSelectedAction: React.Dispatch<React.SetStateAction<"like" | "save" | "dislike" | null>>;
}) {
    const utils = api.useUtils();
    let loadingToastID: string | number = "";

    const handleSuccess = (message: string) => {
        toast.dismiss(loadingToastID);
        toast.success(message);

        // Invalidate related queries to refetch updated state
        void utils.movie.getMyRecommendations.refetch();
        void utils.movie.getMyMostRecent4Recommendations.refetch();
        void utils.movie.getLikedMovies.refetch();
        void utils.movie.getSavedMovies.refetch();
        void utils.movie.getDislikedMovies.refetch();
        void utils.movie.getMostRecent4LikedMovies.refetch();
        void utils.movie.getMostRecent4SavedMovies.refetch();
        void utils.movie.getMostRecent4DislikedMovies.refetch();
    };

    const handleError = (message: string) => {
        toast.dismiss(loadingToastID);
        toast.error(message);
        setSelectedAction(null); // rollback optimistic UI
    };

    const mutationOptions = {
        onMutate: () => {
            setSelectedAction(action); // optimistic UI
            loadingToastID = toast.loading(`Adding movie to ${action}...`);
        },
        onSuccess: () => {
            const msg =
                action === "like"
                    ? "Movie added to likes"
                    : action === "dislike"
                        ? "Movie added to dislikes"
                        : "Movie saved to watch later";

            handleSuccess(msg);
        },
        onError: () => {
            const msg =
                action === "like"
                    ? "Could not add movie to liked, please try again"
                    : action === "dislike"
                        ? "Could not add movie to disliked, please try again"
                        : "Could not save movie to watch later, please try again";

            handleError(msg);
        },
    };

    const likeRec = api.movie.likeRec.useMutation(mutationOptions).mutate;
    const dislikeRec = api.movie.dislikeRec.useMutation(mutationOptions).mutate;
    const saveRec = api.movie.saveRec.useMutation(mutationOptions).mutate;

    const handleClick = () => {
        if (selectedAction !== null) return; // prevent re-clicking

        if (action === "like") {
            likeRec({ model, movieId, recId });
        } else if (action === "dislike") {
            dislikeRec({ model, movieId, recId });
        } else {
            saveRec({ model, movieId, recId });
        }
    };

    if (selectedAction !== null && selectedAction !== action) {
        return null;
    }

    const isSelected = selectedAction === action;

    return (
        <button
            onClick={handleClick}
            className="group active:scale-90 rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow"
        >
            {isSelected ? solidIcon : outlineIcon}
        </button>
    );
}



function SingleButton({ icon, action, movieId }: { icon: React.ReactNode, action: "liked" | "saved" | "disliked", movieId: number }) {
    const utils = api.useUtils();
    const [isRemoving, setIsRemoving] = useState(false);
    let loadingToastID: string | number = "";

    const handleMutationError = (message: string) => {
        toast.dismiss(loadingToastID);
        toast.error(message);
        setIsRemoving(false); // Roll back UI
    };

    const handleMutationSuccess = (message: string, invalidate: () => void) => {
        invalidate();
        toast.dismiss(loadingToastID);
        toast.success(message);
    };

    const mutationMap = {
        liked: {
            mutation: api.movie.unLikeMovie.useMutation({
                onMutate: () => {
                    setIsRemoving(true);
                    loadingToastID = toast.loading("Removing movie from liked...");
                },
                onSuccess: () => handleMutationSuccess("Movie removed from likes", () => {
                    void utils.movie.getLikedCount.refetch();
                    void utils.movie.getLikedMovies.refetch();
                    void utils.movie.getMostRecent4LikedMovies.refetch();
                }),
                onError: () => handleMutationError("Could not remove movie from liked, please try again"),
            }).mutate,
        },
        disliked: {
            mutation: api.movie.unDislikeMovie.useMutation({
                onMutate: () => {
                    setIsRemoving(true);
                    loadingToastID = toast.loading("Removing movie from disliked...");
                },
                onSuccess: () => handleMutationSuccess("Movie removed from dislike", () => {
                    void utils.movie.getDislikedCount.refetch();
                    void utils.movie.getDislikedMovies.refetch();
                    void utils.movie.getMostRecent4DislikedMovies.refetch();
                }),
                onError: () => handleMutationError("Could not remove movie from disliked, please try again"),
            }).mutate,
        },
        saved: {
            mutation: api.movie.unSaveMovie.useMutation({
                onMutate: () => {
                    setIsRemoving(true);
                    loadingToastID = toast.loading("Removing movie from watch later...");
                },
                onSuccess: () => handleMutationSuccess("Movie removed from watch later", () => {
                    void utils.movie.getSavedCount.refetch();
                    void utils.movie.getSavedMovies.refetch();
                    void utils.movie.getMostRecent4SavedMovies.refetch();
                }),
                onError: () => handleMutationError("Could not remove movie from watch later, please try again"),
            }).mutate,
        },
    };

    const isActive = !isRemoving;

    return (
        <div className="flex w-full items-end justify-center h-fit px-2 pb-1 z-10">
            <button
                onClick={() => mutationMap[action].mutation({ movieId })}
                className="active:scale-90 rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow"
            >
                {isActive ? icon : (
                    // Render the corresponding *outline* version
                    action === "liked" ? <OutlineHeart className="size-6 text-rose-500" />
                        : action === "disliked" ? <OutlineDislike className="size-6 text-red-500" />
                            : <OutlineSave className="size-6 text-green-500" />
                )}
            </button>
        </div>
    );
}

