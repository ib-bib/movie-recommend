'use client'

import {
    XCircleIcon as OutlineDislike,
} from "@heroicons/react/24/outline";
import {
    XCircleIcon as SolidDislike,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export function RemoveDislikeButton({
    movieId,
    nextId,
    prevId
}: {
    movieId: number;
    nextId?: number;
    prevId?: number;
}) {
    const [disliked, setDisliked] = useState(true);
    const router = useRouter();
    const utils = api.useUtils();

    let loadingToastID: number | string;
    const unDislikeMovie = api.movie.unDislikeMovie.useMutation({
        onMutate: () => {
            setDisliked(false); // Optimistically switch to outline
            loadingToastID = toast.loading("Removing movie from dislikes...");
        },
        onSuccess: () => {
            toast.dismiss(loadingToastID);
            toast.success("Movie removed from dislikes");

            void utils.movie.getDislikedMovies.refetch();
            void utils.movie.getMostRecent4DislikedMovies.refetch();

            // Auto-navigate after short delay
            setTimeout(() => {
                if (nextId) {
                    router.push(`/movies/disliked/${nextId}`);
                } else if (prevId) {
                    router.push(`/movies/disliked/${prevId}`);
                } else {
                    router.push("/movies/disliked");
                }
            }, 1000);
        },
        onError: () => {
            toast.dismiss(loadingToastID);
            toast.error("Unable to remove movie from dislikes. Please try again.");
            setDisliked(true); // Revert icon if failed
        },
        onSettled: () => {
            toast.dismiss(loadingToastID)
        }
    });

    return (
        <div className='flex flex-col items-center gap-1'>
            <button
                onClick={() => unDislikeMovie.mutate({ movieId })}
                className="group active:scale-90 size-10 flex items-center justify-center rounded-full transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow"
            >
                {disliked ? (
                    <SolidDislike className="text-red-500 size-6" />
                ) : (
                    <OutlineDislike className="text-red-500 size-6" />
                )}
            </button>
            <div className='text-xs text-neutral-400'>{disliked ? 'Disliked' : 'Dislike'}</div>
        </div>
    );
}
