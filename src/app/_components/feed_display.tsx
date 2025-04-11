"use client"

import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { ArrowDownCircleIcon as SolidArrowDownIcon, ArrowUpCircleIcon as SolidArrowUpIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export function FeedDisplay() {
    const [hoverup, sethoverup] = useState(false)
    const [hoverdown, sethoverdown] = useState(false)

    return <main className="w-full flex flex-col grow items-center gap-4">
        <h1 className="text-2xl font-bold pt-2 pb-4">Feed</h1>
        <div className="pb-4 pl-4 w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 grow flex justify-center">
            <div className="w-4/5 h-96 flex flex-col justify-between items-center border border-white rounded-lg">
                <div className="py-2">Test</div>
                <div className="grow flex justify-center items-center border border-white w-11/12">Test 2</div>
                <div className="py-2">Test 3</div>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center gap-4">
                <button
                    onMouseEnter={() => sethoverup(true)}
                    onMouseLeave={() => sethoverup(false)}
                    className="hover:cursor-pointer active:scale-95 transition-all border rounded-full flex justify-center items-center"
                >
                    {hoverup ?
                        <SolidArrowUpIcon className="size-8" />
                        : <ArrowUpCircleIcon className="size-8" />
                    }
                </button>
                <button
                    onMouseEnter={() => sethoverdown(true)}
                    onMouseLeave={() => sethoverdown(false)}
                    className="hover:cursor-pointer active:scale-95 transition-all border rounded-full flex justify-center items-center"
                >
                    {hoverdown ?
                        <SolidArrowDownIcon className="size-8" />
                        : <ArrowDownCircleIcon className="size-8" />
                    }
                </button>

            </div>
        </div>
    </main>
}