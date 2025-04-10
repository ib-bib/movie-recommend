"use client"

import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { ArrowDownIcon as SolidArrowDownIcon, ArrowUpIcon as SolidArrowUpIcon } from "@heroicons/react/24/solid";
import { useState } from "react"

export function FeedDisplay() {
    const [hoverUpArrow, setHoverUpArrow] = useState(false)
    const [hoverDownArrow, setHoverDownArrow] = useState(false)

    return <main className="w-full flex flex-col grow items-center gap-4">
        <h1 className="text-2xl font-bold pt-2 pb-4">Feed</h1>
        <div className="pb-4 pl-4 w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 grow flex justify-center">
            <div className="w-4/5 grow flex flex-col justify-between items-center border border-white rounded-lg">
                <div className="py-2">Test</div>
                <div className="grow flex justify-center items-center border border-white w-11/12">Test 2</div>
                <div className="py-2">Test 3</div>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center gap-4">
                <button onMouseLeave={() => setTimeout(() => { setHoverUpArrow(false) }, 150)} onMouseOver={() => setTimeout(() => { setHoverUpArrow(true) }, 150)} className="size-8 hover:cursor-pointer border-white active:scale-95 transition-all border rounded-full flex justify-center items-center">
                    {hoverUpArrow ? <SolidArrowUpIcon className="size-6" /> :
                        <ArrowUpIcon className="size-6" />
                    }
                </button>
                <button onMouseLeave={() => setTimeout(() => { setHoverDownArrow(false) }, 150)} onMouseOver={() => setTimeout(() => { setHoverDownArrow(true) }, 150)} className="size-8 hover:cursor-pointer border-white border rounded-full flex justify-center items-center">
                    {hoverDownArrow ? <SolidArrowDownIcon className="size-6" /> :
                        <ArrowDownIcon className="size-6" />
                    }
                </button>
            </div>
        </div>
        <div className="h-1 pb-1"></div>
    </main>
}