import { UserIcon } from "@heroicons/react/24/outline";
import { StarIcon, PuzzlePieceIcon, HeartIcon, BookmarkIcon, UserGroupIcon, FilmIcon, HandThumbUpIcon, HandThumbDownIcon, NumberedListIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Profile() {
    const session = await auth();
    const weights = await api.movie.getMyWeights()
    const cf_counts = await api.movie.getCollaborativeCounts()
    const cbf_counts = await api.movie.getContentBasedCounts()
    const [search_likes, search_dislikes, search_saves] = await Promise.all([
        api.movie.getLikedFromSearchCount(),
        api.movie.getDislikedFromSearchCount(),
        api.movie.getSavedFromSearchCount(),
    ])

    return (
        <main className="w-full flex flex-col grow items-center">
            <h1 className="text-2xl font-bold pt-2 pb-4">My Profile</h1>
            <div className="w-11/12 flex justify-end items-center pb-6 gap-1">
                <UserIcon className="size-6" />
                <div className="font-semibold">{session?.user.name}</div>
            </div>
            <div className="w-11/12 sm:w-4/5 lg:w-2/3 flex flex-wrap justify-around items-center pb-8">
                <div className="flex flex-col items-center">
                    <div className="font-bold">Collaborative Filtering</div>
                    <div className="flex">
                        <StarIcon className="size-6 text-amber-400" />
                        <UserGroupIcon className="size-6" />
                    </div>
                    <div className="text-sm">(Similar user tastes)</div>
                    <div className="flex flex-col justify-center items-center text-sm">
                        <div className="flex gap-2">
                            <span className="flex gap-1">
                                <span className="font-bold">Recommendations: </span>
                                {cf_counts.total}
                            </span>
                            <span className="flex gap-2">
                                <span className="flex items-center gap-0.5">
                                    &#40;<HeartIcon className="size-4 text-amber-400" /> {cf_counts.liked}
                                </span>
                                <span className="flex items-center gap-0.5">
                                    <BookmarkIcon className="size-4 text-amber-400" /> {cf_counts.saved}
                                </span>
                                <span className="flex items-center gap-0.5">
                                    <XCircleIcon className="size-4 text-amber-400" /> {cf_counts.disliked} &#41;
                                </span>
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <span className="font-bold">Weight: </span>{weights.cf}%
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="font-bold">Content-based Filtering</div>
                    <div className="flex">
                        <FilmIcon className="size-6" />
                        <PuzzlePieceIcon className="size-6 text-indigo-400" />
                    </div>
                    <div className="text-sm">(Similar movies)</div>
                    <div className="flex flex-col justify-center items-center text-sm">
                        <div className="flex gap-2">
                            <span className="flex gap-1">
                                <span className="font-bold">Recommendations: </span>{cbf_counts.total}
                            </span>
                            <span className="flex gap-2">
                                <span className="flex items-center gap-0.5">
                                    &#40;<HeartIcon className="size-4 text-indigo-400" /> {cbf_counts.liked}
                                </span>
                                <span className="flex items-center gap-0.5">
                                    <BookmarkIcon className="size-4 text-indigo-400" /> {cbf_counts.saved}
                                </span>
                                <span className="flex items-center gap-0.5">
                                    <XCircleIcon className="size-4 text-indigo-400" /> {cbf_counts.disliked} &#41;
                                </span>
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold">Weight: </span>{weights.cbf}%
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-11/12 sm:w-4/5 lg:w-2/3 flex flex-col gap-2 justify-center items-center pb-8">
                <div className="flex flex-col justify-center items-center">
                    <div className="font-bold">
                        Total Recommendations
                    </div>
                    <div className="flex gap-1">
                        <NumberedListIcon className="size-6" />
                        <span>{cbf_counts.total + cf_counts.total}</span>
                    </div>
                </div>
                <div className="w-11/12 sm:w-4/5 lg:w-2/3 flex items-center justify-between">
                    <div className="flex flex-col justify-center items-center">
                        <div className="font-bold">
                            Good Recommendations
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                                <HandThumbUpIcon className="size-6 text-blue-600" />
                                <span>{cbf_counts.liked + cf_counts.liked + cbf_counts.saved + cf_counts.saved}</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center">
                                    &#40;<HeartIcon className="size-4 text-blue-600" /> {cbf_counts.liked + cf_counts.liked}
                                </div>
                                <div className="flex items-center">
                                    <BookmarkIcon className="size-4 text-blue-600" /> {cbf_counts.saved + cf_counts.saved}&#41;
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <div className="font-bold">
                            Bad Recommendations
                        </div>
                        <div className="flex gap-1"><HandThumbDownIcon className="size-6 text-red-500" /> {cbf_counts.disliked + cf_counts.disliked}</div>
                    </div>
                </div>
            </div>
            <div className="w-11/12 sm:w-4/5 lg:w-2/3 flex flex-wrap justify-around items-center text-sm pt-4">
                <div className="flex flex-col justify-center items-center">
                    <HeartIcon className="size-6 text-rose-500" />
                    <div className="flex gap-2">
                        <div className="font-bold">Liked Movies</div>
                        <div>{search_likes + cf_counts.liked + cbf_counts.liked}</div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <BookmarkIcon className="size-6 text-green-500" />
                    <div className="flex gap-2">
                        <div className="font-bold">Saved Movies</div>
                        <div>{search_saves + cf_counts.saved + cbf_counts.saved}</div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <XCircleIcon className="size-6 text-red-500" />
                    <div className="flex gap-2">
                        <div className="font-bold">Disliked Movies</div>
                        <div>{search_dislikes + cf_counts.disliked + cbf_counts.disliked}</div>
                    </div>
                </div>
            </div>
        </main>
    )
}
