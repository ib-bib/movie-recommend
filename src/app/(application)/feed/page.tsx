import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

export default async function Feed() {
    return (
        <main className="w-full flex flex-col grow items-center gap-4">
            <h1 className="text-2xl font-bold py-2">Feed</h1>
            <div className="pb-4 w-4/5 sm:w-3/4 md:w-1/2 lg:w-1/3 grow flex">
                <div className="w-3/4 grow flex flex-col justify-between border border-white rounded-lg">
                    <div>Test</div>
                    <div>Test 2</div>
                    <div>Test 3</div>
                </div>
                <div className="w-1/4 flex flex-col items-center justify-center gap-4">
                    <button className="size-8 border-white active:scale-95 transition-all border rounded-full flex justify-center items-center">
                        <ArrowUpIcon className="size-6" />
                    </button>
                    <button className="size-8 border-white border rounded-full flex justify-center items-center">
                        <ArrowDownIcon className="size-6" />
                    </button>
                </div>
            </div>
            <div className="h-1 pb-1"></div>
        </main>
    )
}
