"use client"

import {
    HeartIcon as OutlineHeart,
    BookmarkIcon as OutlineSave,
    XCircleIcon as OutlineDislike
} from "@heroicons/react/24/outline"
import {
    StarIcon,
    HeartIcon as SolidHeart,
    BookmarkIcon as SolidSave,
    XCircleIcon as SolidDislike,
    ArrowLeftIcon,
    ChevronLeftIcon,
} from "@heroicons/react/24/solid"
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

    const movieIsLiked = api.movie.isLiked.useQuery(
        {
            id: movie.movieId
        },
        {
            refetchOnWindowFocus: false
        }).data
    const movieIsSaved = api.movie.isSaved.useQuery(
        {
            id: movie.movieId
        },
        {
            refetchOnWindowFocus: false
        }).data
    const movieIsDisliked = api.movie.isDisliked.useQuery(
        {
            id: movie.movieId
        },
        {
            refetchOnWindowFocus: false
        }).data

    const [hoverHeart, setHoverHeart] = useState(false)
    const [hoverSave, setHoverSave] = useState(false)
    const [hoverDislike, setHoverDislike] = useState(false)
    const [hoverReturn, setHoverReturn] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [liked, setLiked] = useState(movieIsLiked ?? false)
    const [saved, setSaved] = useState(movieIsSaved ?? false)
    const [disliked, setDisliked] = useState(movieIsDisliked ?? false)

    return <main className="w-full flex flex-col items-center tracking-wider">
        <h1 className="text-2xl font-bold pt-2 pb-2 w-full text-center">{normalizeTitle(movie.title)}</h1>
        <div className="flex flex-col items-center md:items-start md:justify-center md:flex-row w-11/12 sm:w-4/5 lg:w-2/3 gap-2">
            <div className="h-72 w-72 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto flex items-center justify-center bg-white/10 rounded-md overflow-hidden">
                {imageError ?
                    <Image src={`/images/${movie.image ?? backupMovie.image}`} alt="Movie"
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
            {(movieIsLiked === undefined) || (movieIsSaved === undefined) || (movieIsDisliked === undefined) ? <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div> :
                <div className="flex flex-col h-32 w-11/12 md:w-80 md:h-80 lg:w-96 lg:h-96 gap-4 justify-between">
                    <div className="flex items-center justify-around md:pl-2 md:pt-2">
                        <div>
                            <span className="font-bold">Release Year: </span>{movie.releaseYear ?? 'Unavailable'}
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
                                    <SolidSave className="text-green-500 size-7" />
                                    :
                                    <OutlineSave className="text-green-500 size-7" />
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
                            onClick={() =>
                                setTimeout(() => setMovie({
                                    ...movie,
                                    movieId: -1,
                                    image: movie.image ?? backupMovie.image
                                }), 700)
                            }
                            href="/home"
                            className="flex w-fit justify-center items-center gap-2 hover:underline underline-offset-4"
                        >
                            {hoverReturn ? <ArrowLeftIcon className="size-4" /> : <ChevronLeftIcon className="size-4" />}
                            Return Home
                        </Link>
                    </div>
                </div>
            }
        </div>
    </main>
}