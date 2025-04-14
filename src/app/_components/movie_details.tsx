"use client"

import { HeartIcon as OutlineHeart, BookmarkIcon as OutlineSave, XCircleIcon as OutlineDislike } from "@heroicons/react/24/outline"
import { StarIcon, HeartIcon as SolidHeart, BookmarkIcon as SolidSave, XCircleIcon as SolidDislike, ArrowLeftIcon, ChevronLeftIcon, SparklesIcon } from "@heroicons/react/24/solid"
import { useSelectedMovieStore } from "../utils/store"
import { useState } from "react"
import Image from "next/image"
import { staticMovies } from "~/lib/staticMovies"
import { usePathname } from "next/navigation"
import { normalizeTitle } from "./search_bar"
import Link from "next/link"
import { api } from "~/trpc/react"
import { toast } from 'sonner'

export const MovieDetails = () => {
    const id = usePathname().split('/')[2]
    const { movie: backupMovie, setMovie } = useSelectedMovieStore()
    const movie = staticMovies.find(movie => movie.movieId == Number(id)) ?? backupMovie

    const likeMovieFn = api.movie.likeMovie.useMutation()
    const saveMovieFn = api.movie.saveMovie.useMutation()
    const dislikeMovieFn = api.movie.dislikeMovie.useMutation()

    const [hoverHeart, setHoverHeart] = useState(false)
    const [hoverSave, setHoverSave] = useState(false)
    const [hoverDislike, setHoverDislike] = useState(false)
    const [hoverReturn, setHoverReturn] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [disliked, setDisliked] = useState(false)

    return <main className="w-full flex flex-col items-center tracking-wider">
        <h1 className="text-2xl font-bold pt-2 pb-2 w-full text-center">{normalizeTitle(movie.title)}</h1>
        <div className="flex flex-col items-center md:items-start md:justify-center md:flex-row w-11/12 sm:w-4/5 lg:w-2/3 gap-2">
            <div className="h-72 w-72 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto flex items-center justify-center bg-white/10 rounded-md overflow-hidden">
                {imageError ?
                    <Image src={`${movie.image ? `/images/${movie.image}` : backupMovie.image}`} alt="Movie"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-full w-auto max-w-full object-contain" />
                    :
                    <Image src={`/images/${String(movie.movieId)}__${movie.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim()} ${String(movie.releaseYear)}.jpg`} alt="Movie"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-full w-auto max-w-full object-contain" onError={() => setImageError(true)} />
                }
            </div>
            <div className="flex flex-col border border-white h-32 w-11/12 md:w-80 md:h-80 lg:w-96 lg:h-96 gap-4 justify-between">
                <div className="flex items-center justify-around md:pl-2 md:pt-2">
                    <div>
                        <span className="font-bold">Release Year: </span>{movie.releaseYear}
                    </div>
                    <div className="flex gap-1 items-center">
                        <div><span className="font-bold">Rating: </span>{movie.bayesianRating} / 5</div>
                        <StarIcon className="size-4 md:size-5 text-amber-400" />
                    </div>
                </div>
                <div className="flex gap-8 justify-center">
                    {!disliked && !saved &&
                        <button
                            onMouseOver={() => setHoverHeart(true)}
                            onMouseOut={() => setHoverHeart(false)}
                            onClick={() => {
                                const loadingToastID = toast.loading("Saving movie to liked...")
                                likeMovieFn.mutate({
                                    id: movie.movieId,
                                    title: movie.title,
                                    year: movie.releaseYear!
                                }, {
                                    onSuccess: () => {
                                        toast.dismiss(loadingToastID)
                                        toast.success("Movie added to liked collection")
                                    },
                                    onError: () => {
                                        toast.dismiss(loadingToastID)
                                        toast.error("Error occurred. Please try again")
                                    }
                                })
                                setLiked(!liked)
                            }}
                            className="size-7 hover:cursor-pointer active:scale-90 transition-all">
                            {hoverHeart || liked ?
                                <SolidHeart className="text-rose-500 size-7" />
                                :
                                <OutlineHeart className="text-rose-500 size-7" />
                            }
                        </button>
                    }
                    {!liked && !disliked &&
                        <button
                            onMouseOver={() => setHoverSave(true)}
                            onMouseOut={() => setHoverSave(false)}
                            onClick={() => {
                                const loadingToastID = toast.loading("Saving movie to watch later...")
                                saveMovieFn.mutate({
                                    id: movie.movieId,
                                    title: movie.title,
                                    year: movie.releaseYear!
                                },
                                    {
                                        onSuccess: () => {
                                            toast.dismiss(loadingToastID)
                                            toast.success("Movie saved to watch later")
                                        },
                                        onError: () => {
                                            toast.dismiss(loadingToastID)
                                            toast.error("Error occurred. Please try again")
                                        }
                                    }
                                )
                                setSaved(!saved)
                            }}
                            className="size-7 hover:cursor-pointer active:scale-90 transition-all">
                            {hoverSave || saved ?
                                <SolidSave className="text-green-600 size-7" />
                                :
                                <OutlineSave className="text-green-600 size-7" />
                            }
                        </button>
                    }
                    {!liked && !saved &&
                        <button
                            onMouseOver={() => setHoverDislike(true)}
                            onMouseOut={() => setHoverDislike(false)}
                            onClick={() => {
                                const loadingToastID = toast.loading("Saving movie to disliked...")
                                dislikeMovieFn.mutate({
                                    id: movie.movieId,
                                },
                                    {
                                        onSuccess: () => {
                                            toast.dismiss(loadingToastID)
                                            toast.success("Movie added to disliked collection")
                                        },
                                        onError: () => {
                                            toast.dismiss(loadingToastID)
                                            toast.error("Error occurred. Please try again")
                                        }
                                    }
                                )
                                setDisliked(!disliked)
                            }}
                            className="size-7 hover:cursor-pointer active:scale-90 transition-all">
                            {hoverDislike || disliked ?
                                <SolidDislike className="text-red-600 size-7" />
                                :
                                <OutlineDislike className="size-7" />
                            }
                        </button>
                    }
                </div>
                <div className="py-2 w-full flex justify-around items-center">
                    <Link
                        onMouseOver={() => setHoverReturn(true)}
                        onMouseOut={() => setHoverReturn(false)}
                        href="/home"
                        className="flex w-fit justify-center items-center gap-2 hover:underline underline-offset-4"
                    >
                        {hoverReturn ? <ArrowLeftIcon className="size-4" /> : <ChevronLeftIcon className="size-4" />}
                        Return Home
                    </Link>
                    {(liked || saved) && <Link
                        onMouseOver={() => setHoverReturn(true)}
                        onMouseOut={() => setHoverReturn(false)}
                        onClick={() =>
                            setMovie({
                                movieId: -1,
                                title: "Movie Title",
                                image: "/images/placeholder.png",
                                bayesianRating: 0.0,
                                releaseYear: 1000,
                            })
                        }
                        href="/movies"
                        className="flex w-fit justify-center items-center gap-2 hover:underline underline-offset-4"
                    >
                        <SparklesIcon className="size-4 text-amber-400" />
                        See Recommended
                    </Link>}
                </div>
            </div>
        </div>
    </main>
}