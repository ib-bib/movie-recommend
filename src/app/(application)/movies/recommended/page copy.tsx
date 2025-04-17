import { HeartIcon as OutlineHeart, BookmarkIcon as OutlineSave, XCircleIcon as OutlineDislike } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeart, BookmarkIcon as SolidSave, XCircleIcon as SolidDislike, StarIcon } from "@heroicons/react/24/solid";

import Image from "next/image";
import Link from "next/link";

export default async function RecommendedMovies() {
    return <main className="w-full flex flex-col grow items-center">
        <h1 className="text-2xl font-bold pt-2 pb-4">Recommended</h1>
        <div className="flex text-sm flex-wrap gap-4 pb-32 w-11/12 justify-center sm:justify-start overflow-y-scroll h-[30rem]">
            <div className="bg-neutral-100/10 border border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between transition-all hover:cursor-pointer">
                <Link href="/movies/recommended/1" className="font-bold w-full h-1/6 text-ellipsis">Movie 1</Link>
                <Link href="/movies/recommended/1" className="w-full p-2 flex flex-col justify-around items-center h-2/3 relative">
                    <div className="h-full w-full flex justify-center items-center">
                        <Image alt="Movie" src="/images/placeholder.png" height={0} width={0} sizes="100vw" className="h-full w-auto max-w-full object-contain" />
                    </div>
                    <div className="z-10 bottom-1 right-1 absolute p-1 bg-neutral-900/30 backdrop-blur-3xl rounded-4xl shadow border border-neutral-300 flex items-center gap-1">
                        4.1 / 5
                        <StarIcon className="text-amber-400 size-4" />
                    </div>
                </Link>
                <div className="flex w-full items-end justify-between h-1/6">
                    <button className="group rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800 hover:bg-neutral-900 hover:cursor-pointer backdrop-blur-lg shadow">
                        <OutlineHeart className="text-rose-500 size-5 group-hover:hidden block" />
                        <SolidHeart className="text-rose-500 size-5 group-hover:block hidden" />
                    </button>
                    <button className="group rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800 hover:bg-neutral-900 hover:cursor-pointer backdrop-blur-lg shadow">
                        <OutlineSave className="text-green-600 size-5 group-hover:hidden block" />
                        <SolidSave className="text-green-600 size-5 group-hover:block hidden" />
                    </button>
                    <button className="group rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800 hover:bg-neutral-900 hover:cursor-pointer backdrop-blur-lg shadow">
                        <OutlineDislike className="text-red-600 size-5 group-hover:hidden block" />
                        <SolidDislike className="text-red-600 size-5 group-hover:block hidden" />
                    </button>
                </div>
            </div>
            {/* Component 2 */}
            <div className="relative bg-neutral-100/10 border border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 flex flex-col justify-between overflow-hidden transition-all hover:cursor-pointer">
                {/* Background Image */}
                <Image
                    alt="Movie"
                    src="/images/1__Toy Story 1995.jpg"
                    fill
                    className="object-contain z-0"
                />

                {/* Optional dark overlay */}
                <Link href="/movies/recommended/1" className="absolute inset-0 bg-black/40 z-0 transition-all hover:opacity-50" />

                {/* Title */}
                <Link
                    href="/movies/recommended/1"
                    className="font-bold w-full p-1 h-fit z-10 backdrop-blur-sm bg-transparent text-ellipsis"
                >
                    Movie 1
                </Link>

                {/* Rating */}
                <Link
                    href="/movies/recommended/1"
                    className="absolute bottom-14 right-2 z-10 p-1 bg-neutral-900/40 backdrop-blur-3xl rounded-4xl shadow border border-neutral-300 flex items-center gap-1"
                >
                    4.1 / 5
                    <StarIcon className="text-amber-400 size-4" />
                </Link>

                {/* Buttons */}
                <div className="flex w-full items-end justify-between h-fit z-10 px-2 pb-1">
                    <button className="group active:scale-90 rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                        <OutlineHeart className="text-rose-500 transition-all size-6 group-hover:hidden block" />
                        <SolidHeart className="text-rose-500 transition-all size-6 group-hover:block hidden" />
                    </button>
                    <button className="group active:scale-90 rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                        <OutlineSave className="text-green-600 transition-all size-6 group-hover:hidden block" />
                        <SolidSave className="text-green-600 transition-all size-6 group-hover:block hidden" />
                    </button>
                    <button className="group active:scale-90 rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                        <OutlineDislike className="text-red-600 transition-all size-6 group-hover:hidden block" />
                        <SolidDislike className="text-red-600 transition-all size-6 group-hover:block hidden" />
                    </button>
                </div>
            </div>
            <Link href="/movies/recommended/3" className="bg-neutral-100/10 border border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 3</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-2/3">
                    <div>Movie Poster</div>
                    <div>Rating</div>
                </div>
                <div className="flex w-full items-end justify-between h-1/6">
                    <div>Like</div>
                    <div>Save</div>
                    <div>Dislike</div>
                    Rating
                </div>
            </Link>
            <Link href="/movies/recommended/1" className="bg-neutral-100/10 border border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 4</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-2/3">
                    <div>Movie Poster</div>
                    <div>Rating</div>
                </div>
                <div className="flex w-full items-end justify-between h-1/6">
                    <div>Like</div>
                    <div>Save</div>
                    <div>Dislike</div>
                    Rating
                </div>
            </Link>
            <Link href="/movies/recommended/2" className="bg-neutral-100/10 border border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 5</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-2/3">
                    <div>Movie Poster</div>
                    <div>Rating</div>
                </div>
                <div className="flex w-full items-end justify-between h-1/6">
                    <div>Like</div>
                    <div>Save</div>
                    <div>Dislike</div>
                    Rating
                </div>
            </Link>
            <Link href="/movies/recommended/3" className="bg-neutral-100/10 border border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 6</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-2/3">
                    <div>Movie Poster</div>
                    <div>Rating</div>
                </div>
                <div className="flex w-full items-end justify-between h-1/6">
                    <div>Like</div>
                    <div>Save</div>
                    <div>Dislike</div>
                    Rating
                </div>
            </Link>
            <Link href="/movies/recommended/1" className="bg-neutral-100/10 border border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 7</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-2/3">
                    <div>Movie Poster</div>
                    <div>Rating</div>
                </div>
                <div className="flex w-full items-end justify-between h-1/6">
                    <div>Like</div>
                    <div>Save</div>
                    <div>Dislike</div>
                    Rating
                </div>
            </Link>
            <Link href="/movies/recommended/2" className="bg-neutral-100/10 border border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 8</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-2/3">
                    <div>Movie Poster</div>
                    <div>Rating</div>
                </div>
                <div className="flex w-full items-end justify-between h-1/6">
                    <div>Like</div>
                    <div>Save</div>
                    <div>Dislike</div>
                    Rating
                </div>
            </Link>
            <Link href="/movies/recommended/3" className="bg-neutral-100/10 border border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 9</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-2/3">
                    <div>Movie Poster</div>
                    <div>Rating</div>
                </div>
                <div className="flex w-full items-end justify-between h-1/6">
                    <div>Like</div>
                    <div>Save</div>
                    <div>Dislike</div>
                    Rating
                </div>
            </Link>
        </div>
    </main>
}