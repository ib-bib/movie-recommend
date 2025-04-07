import { UserIcon } from "@heroicons/react/24/outline";
import { StarIcon, PuzzlePieceIcon, HeartIcon, BookmarkIcon, UserGroupIcon, FilmIcon, HandThumbUpIcon, NumberedListIcon } from '@heroicons/react/24/solid'

export default async function Profile() {
    return (
        <main className="w-full flex flex-col grow items-center">
            <h1 className="text-2xl font-bold py-2">My Profile</h1>
            <div className="w-11/12 gap-4 flex flex-row-reverse items-center pb-4">
                <button className="bg-gray-300 rounded-full px-6 py-2 hover:cursor-pointer hover:bg-white text-blue-700 hover:text-blue-900 active:scale-95 transition-all">Save</button>
                <div className="w-2/3 sm:w-1/2 lg:w-1/3 h-12 border border-white rounded-full flex px-2 gap-2 items-center">
                    <UserIcon className="size-5" />
                    <input type="text" name="username" className="outline-none" placeholder="Username" />
                </div>
            </div>
            <div className="w-11/12 sm:w-4/5 lg:w-2/3 flex flex-wrap justify-around items-center pb-2">
                <div className="flex flex-col items-center">
                    <div className="font-bold">Collaborative Filtering</div>
                    <div className="flex">
                        <StarIcon className="size-5" />
                        <UserGroupIcon className="size-5" />
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
                        <FilmIcon className="size-5" />
                        <PuzzlePieceIcon className="size-5" />
                    </div>
                    <div className="text-sm">(Similar movies)</div>
                    <div className="flex flex-col justify-center items-center text-sm">
                        <div><span className="font-bold">Recommendations: </span>10</div>
                        <div><span className="font-bold">Weight: </span>57%</div>
                    </div>
                </div>
            </div>
            <div className="w-11/12 flex flex-col gap-2 justify-center items-center pb-2">
                <div className="flex flex-col justify-center items-center">
                    <div className="font-bold">
                        Total Recommendations
                    </div>
                    <div className="flex gap-1"><NumberedListIcon className="size-5" /> 10</div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="font-bold">
                        Recommendations Liked/Saved
                    </div>
                    <div className="flex gap-1"><HandThumbUpIcon className="size-5" /> 10</div>
                </div>
            </div>
            <div className="w-11/12 sm:w-4/5 lg:w-2/3 flex flex-wrap justify-around items-center text-sm">
                <div className="flex flex-col justify-center items-center">
                    <HeartIcon className="size-5" />
                    <div className="flex gap-2">
                        <div className="font-bold">Liked Movies</div>
                        <div>10</div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <BookmarkIcon className="size-5" />
                    <div className="flex gap-2">
                        <div className="font-bold">Saved Movies</div>
                        <div>10</div>
                    </div>
                </div>
            </div>
        </main>
    )
}
