import { UserIcon } from "@heroicons/react/24/outline";
import { StarIcon, PuzzlePieceIcon, HeartIcon, BookmarkIcon, UserGroupIcon, FilmIcon, HandThumbUpIcon, HandThumbDownIcon, NumberedListIcon, NoSymbolIcon } from '@heroicons/react/24/solid'
import { auth } from "~/server/auth";

export default async function Profile() {
    const session = await auth();

    return (
        <main className="w-full flex flex-col grow items-center">
            <h1 className="text-2xl font-bold pt-2 pb-4">My Profile</h1>
            <div className="w-11/12 flex justify-end items-center pb-4 gap-1">
                <UserIcon className="size-6" />
                <div className="font-semibold">{session?.user.name}</div>
            </div>
            <div className="w-11/12 sm:w-4/5 lg:w-2/3 flex flex-wrap justify-around items-center pb-6">
                <div className="flex flex-col items-center">
                    <div className="font-bold">Collaborative Filtering</div>
                    <div className="flex">
                        <StarIcon className="size-6 text-amber-400" />
                        <UserGroupIcon className="size-6" />
                    </div>
                    <div className="text-sm">(Similar user tastes)</div>
                    <div className="flex flex-col justify-center items-center text-sm">
                        <div><span className="font-bold">Recommendations: </span>10</div>
                        <div><span className="font-bold">Weight: </span>43%</div>
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
                        <div><span className="font-bold">Recommendations: </span>10</div>
                        <div><span className="font-bold">Weight: </span>57%</div>
                    </div>
                </div>
            </div>
            <div className="w-11/12 sm:w-4/5 lg:w-2/3 flex flex-col gap-2 justify-center items-center pb-6">
                <div className="flex flex-col justify-center items-center">
                    <div className="font-bold">
                        Total Recommendations
                    </div>
                    <div className="flex gap-1"><NumberedListIcon className="size-6" /> 10</div>
                </div>
                <div className="w-11/12 sm:w-4/5 lg:w-2/3 flex items-center justify-between">
                    <div className="flex flex-col justify-center items-center">
                        <div className="font-bold">
                            Good Recommendations
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                                <HandThumbUpIcon className="size-6 text-blue-600" />
                                <span>10</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1">
                                    &#40; <HeartIcon className="size-4 text-blue-600" /> 6
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookmarkIcon className="size-4 text-blue-600" /> 4 &#41;
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <div className="font-bold">
                            Bad Recommendations
                        </div>
                        <div className="flex gap-1"><HandThumbDownIcon className="size-6 text-red-600" /> 10</div>
                    </div>
                </div>
            </div>
            <div className="w-11/12 sm:w-4/5 lg:w-2/3 flex flex-wrap justify-around items-center text-sm">
                <div className="flex flex-col justify-center items-center">
                    <HeartIcon className="size-6 text-rose-500" />
                    <div className="flex gap-2">
                        <div className="font-bold">Liked Movies</div>
                        <div>10</div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <BookmarkIcon className="size-6 text-green-500" />
                    <div className="flex gap-2">
                        <div className="font-bold">Saved Movies</div>
                        <div>10</div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <NoSymbolIcon className="size-6 text-red-600" />
                    <div className="flex gap-2">
                        <div className="font-bold">Disliked Movies</div>
                        <div>10</div>
                    </div>
                </div>
            </div>
        </main>
    )
}
