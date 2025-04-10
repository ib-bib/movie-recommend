import { BookmarkIcon, HeartIcon } from "@heroicons/react/24/solid";

export default async function Collection() {
    return (
        <main className="w-full flex flex-col grow items-center">
            <h1 className="text-2xl font-bold pt-2 pb-4">Collection</h1>
            <div className="flex gap-4 w-11/12 justify-center sm:justify-start">
                <div className="bg-slate-900/45 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                    <div className="font-bold h-1/6 w-full">Liked</div>
                    <div className="w-full p-2 flex flex-wrap h-4/6">
                        <div className="h-1/2 w-1/2 flex justify-center items-center">Image 1</div>
                        <div className="h-1/2 w-1/2 flex justify-center items-center">Image 2</div>
                        <div className="h-1/2 w-1/2 flex justify-center items-center">Image 3</div>
                        <div className="h-1/2 w-1/2 flex justify-center items-center">Image 4</div>
                    </div>
                    <div className="flex w-full items-end justify-end h-1/6">
                        <HeartIcon className="size-6 text-rose-500" />
                    </div>
                </div>
                <div className="bg-slate-900/45 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 p-2 flex flex-col justify-between">
                    <div className="font-bold w-full h-1/6">Watch Later</div>
                    <div className="w-full p-2 flex flex-wrap h-4/6">
                        <div className="h-1/2 w-1/2 flex justify-center items-center">Image 1</div>
                        <div className="h-1/2 w-1/2 flex justify-center items-center">Image 2</div>
                        <div className="h-1/2 w-1/2 flex justify-center items-center">Image 3</div>
                        <div className="h-1/2 w-1/2 flex justify-center items-center">Image 4</div>
                    </div>
                    <div className="flex w-full items-end justify-end h-1/6">
                        <BookmarkIcon className="size-6 text-green-600" />
                    </div>
                </div>
            </div>
        </main>
    )
}
