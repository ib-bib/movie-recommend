"use client"

import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { ArrowDownCircleIcon as SolidArrowDownIcon, ArrowUpCircleIcon as SolidArrowUpIcon } from "@heroicons/react/24/solid";

export function FeedDisplay() {

    return <main className="w-full flex flex-col grow items-center gap-4">
        <h1 className="text-2xl font-bold pt-2 pb-4">Feed</h1>
        <div className="pb-4 pl-4 w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 grow flex justify-center">
            <div className="w-4/5 h-96 flex flex-col justify-between items-center border border-neutral-100 rounded-lg">
                <div className="py-2">Test</div>
                <div className="grow flex justify-center items-center border border-neutral-100 w-11/12">Test 2</div>
                <div className="py-2">Test 3</div>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center gap-4">
                <button
                    className="group hover:cursor-pointer active:scale-90 transition-all border rounded-full flex justify-center items-center"
                >
                    <SolidArrowUpIcon className="size-8 hidden group-hover:block" />
                    <ArrowUpCircleIcon className="size-8 group-hover:hidden" />
                </button>
                <button
                    className="group hover:cursor-pointer active:scale-90 transition-all border rounded-full flex justify-center items-center"
                >
                    <SolidArrowDownIcon className="size-8 hidden group-hover:block" />
                    <ArrowDownCircleIcon className="size-8 group-hover:hidden" />

                </button>

            </div>
        </div>
    </main>
}