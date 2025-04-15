import Link from "next/link";

export default async function RecommendedMovies() {
    return <main className="w-full flex flex-col grow items-center">
        <h1 className="text-2xl font-bold pt-2 pb-4">Recommended</h1>
        <div className="flex flex-wrap gap-4 pb-32 w-11/12 justify-center sm:justify-start *:hover:cursor-pointer overflow-y-scroll h-[30rem]">
            <Link href="/movies/recommended/1" className="bg-slate-900/75 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 1</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-4/6">
                    <div>Movie Poster</div>
                    <div>Rating</div>
                </div>
                <div className="flex w-full items-end justify-between h-1/6">
                    <div>Like</div>
                    <div>Save</div>
                    <div>Dislike</div>
                </div>
            </Link>
            <Link href="/movies/recommended/2" className="bg-slate-900/75 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 2</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-4/6">
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
            <Link href="/movies/recommended/3" className="bg-slate-900/75 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 3</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-4/6">
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
            <Link href="/movies/recommended/1" className="bg-slate-900/75 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 4</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-4/6">
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
            <Link href="/movies/recommended/2" className="bg-slate-900/75 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 5</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-4/6">
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
            <Link href="/movies/recommended/3" className="bg-slate-900/75 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 6</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-4/6">
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
            <Link href="/movies/recommended/1" className="bg-slate-900/75 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 7</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-4/6">
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
            <Link href="/movies/recommended/2" className="bg-slate-900/75 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 8</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-4/6">
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
            <Link href="/movies/recommended/3" className="bg-slate-900/75 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                <div className="font-bold w-full h-1/6">Movie 9</div>
                <div className="w-full p-2 flex flex-col justify-around items-center h-4/6">
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