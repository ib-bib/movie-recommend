'use client';

import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import {
    HeartIcon as OutlineHeart,
    BookmarkIcon as OutlineSave,
    XCircleIcon as OutlineDislike,
} from "@heroicons/react/24/outline";
import {
    HeartIcon as SolidHeart,
    BookmarkIcon as SolidSave,
    XCircleIcon as SolidDislike,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { normalizeTitle } from "./search_bar";

type MovieCardProps = {
    id: number;
    title: string;
    rating: number;
    image: string;
    releaseYear: number;
    hrefBase?: string; // e.g. "/movies/recommended"
};

export default function MovieCard({ id, title, rating, image, releaseYear, hrefBase = "/movies/recommended" }: MovieCardProps) {
    const [imageError, setImageError] = useState(false)
    const href = `${hrefBase}/${id}`;
    return (
        <div className="relative bg-neutral-100/10 border border-neutral-100/20 backdrop-blur-xl shadow-lg rounded-lg h-64 w-52 flex flex-col justify-between overflow-hidden transition-all hover:cursor-pointer">
            {/* Background Image */}
            {imageError ?
                <Image src={`/images/${image}`} alt="Movie"
                    fill
                    className="object-contain z-0" />
                :
                <Image src={`/images/${String(id)}__${title.replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, ' ').trim()} ${String(releaseYear)}.jpg`} alt={title}
                    fill
                    className="object-contain z-0"
                    onError={() => setImageError(true)} />
            }
            {/* Optional overlay */}
            <Link href={href} className="absolute inset-0 bg-black/40 z-0 transition-all hover:opacity-30" />

            {/* Title */}
            <Link href={href} className="font-bold w-52 p-1 max-h-8 z-10 backdrop-blur-sm bg-black/60 text-ellipsis overflow-hidden whitespace-nowrap">
                {normalizeTitle(title)}
            </Link>

            {/* Rating */}
            <div className="absolute bottom-14 right-2 z-10 p-1 bg-neutral-700/40 backdrop-blur-3xl rounded-4xl shadow border border-neutral-300 flex items-center gap-1">
                {rating?.toFixed(1)} / 5
                <StarIcon className="text-amber-400 size-4" />
            </div>

            {/* Buttons */}
            <div className="flex w-full items-end justify-between h-fit px-2 pb-1 z-10">
                <button className="group active:scale-90 rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                    <OutlineHeart className="text-rose-500 size-6 group-hover:hidden block" />
                    <SolidHeart className="text-rose-500 size-6 group-hover:block hidden" />
                </button>
                <button className="group active:scale-90 rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                    <OutlineSave className="text-green-600 size-6 group-hover:hidden block" />
                    <SolidSave className="text-green-600 size-6 group-hover:block hidden" />
                </button>
                <button className="group active:scale-90 rounded-full size-8 flex justify-center items-center transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow">
                    <OutlineDislike className="text-red-600 size-6 group-hover:hidden block" />
                    <SolidDislike className="text-red-600 size-6 group-hover:block hidden" />
                </button>
            </div>
        </div>
    );
}
