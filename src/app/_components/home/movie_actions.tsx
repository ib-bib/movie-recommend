'use client'

import {
    HeartIcon as OutlineHeart,
    BookmarkIcon as OutlineSave,
    XCircleIcon as OutlineDislike,
} from '@heroicons/react/24/outline'
import {
    HeartIcon as SolidHeart,
    BookmarkIcon as SolidSave,
    XCircleIcon as SolidDislike,
} from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { Spinner } from '~/app/_components/spinner'
import { api } from '~/trpc/react'

type MovieActionProps = {
    movieId: number
    title: string
}

export function MovieActions({ movieId, title }: MovieActionProps) {
    const utils = api.useUtils()

    const likeMutation = api.movie.likeMovie.useMutation()
    const saveMutation = api.movie.saveMovie.useMutation()
    const dislikeMutation = api.movie.dislikeMovie.useMutation()

    const isLiked = api.movie.isLiked.useQuery({ movieId }, { refetchOnWindowFocus: false })
    const isSaved = api.movie.isSaved.useQuery({ movieId }, { refetchOnWindowFocus: false })
    const isDisliked = api.movie.isDisliked.useQuery({ movieId }, { refetchOnWindowFocus: false })

    const [status, setStatus] = useState<'likes' | 'watch later' | 'dislikes' | null>(null)
    const [optimisticStatus, setOptimisticStatus] = useState<'likes' | 'watch later' | 'dislikes' | null>(null)

    useEffect(() => {
        if (isLiked.data) setStatus('likes')
        else if (isSaved.data) setStatus('watch later')
        else if (isDisliked.data) setStatus('dislikes')
        else setStatus(null)
    }, [isLiked.data, isSaved.data, isDisliked.data])

    const handleToggle = (action: 'likes' | 'watch later' | 'dislikes') => {
        const isActive = status === action
        const nextStatus = isActive ? null : action

        setOptimisticStatus(action)

        const toastID = toast.loading(
            isActive
                ? `Removing from ${action}...`
                : `${action == 'watch later' ? 'Saving' : 'Adding'} movie to ${action}...`
        )

        const mutation =
            action === 'likes' ? likeMutation :
                action === 'watch later' ? saveMutation :
                    dislikeMutation

        mutation.mutate(
            { movieId, title },
            {
                onSuccess: () => {
                    void utils.movie.invalidate()
                    toast.dismiss(toastID)
                    toast.success(
                        isActive
                            ? `Movie removed from ${action}`
                            : `Movie added to ${action}`
                    )
                    setStatus(nextStatus)
                },
                onError: () => {
                    toast.dismiss(toastID)
                    toast.error('Something went wrong.')
                },
                onSettled: () => {
                    setOptimisticStatus(null)
                }
            }
        )
    }

    const isLoading = [isLiked, isSaved, isDisliked].some((q) => q.data === undefined)

    if (isLoading) return <Spinner />

    const activeAction = optimisticStatus ?? status

    return (
        <div className='flex flex-col items-start gap-4 transition-all w-24'>
            {(!activeAction || activeAction === 'likes') && (
                <div className='flex flex-col items-center gap-1'>
                    <ActionButton
                        active={optimisticStatus === 'likes' || status === 'likes'}
                        iconActive={<SolidHeart className="text-rose-500 size-6" />}
                        iconInactive={<OutlineHeart className="group-hover:text-rose-500 size-6" />}
                        onClick={() => handleToggle('likes')}
                    />
                    <span className='text-xs text-neutral-400'>{status === 'likes' ? 'Liked' : 'Like'}</span>
                </div>
            )}
            {(!activeAction || activeAction === 'watch later') && (
                <div className="flex flex-col items-center gap-1">
                    <ActionButton
                        active={optimisticStatus === 'watch later' || status === 'watch later'}
                        iconActive={<SolidSave className="text-green-500 size-6" />}
                        iconInactive={<OutlineSave className="group-hover:text-green-500 size-6" />}
                        onClick={() => handleToggle('watch later')}
                    />
                    <span className='text-xs text-neutral-400'>{status === 'watch later' ? 'Saved to Watch Later' : 'Watch Later'}</span>
                </div>
            )}
            {(!activeAction || activeAction === 'dislikes') && (
                <div className='flex flex-col items-center gap-1'>
                    <ActionButton
                        active={optimisticStatus === 'dislikes' || status === 'dislikes'}
                        iconActive={<SolidDislike className="text-red-500 size-6" />}
                        iconInactive={<OutlineDislike className="group-hover:text-red-500 size-6" />}
                        onClick={() => handleToggle('dislikes')}
                    />
                    <span className='text-xs text-neutral-400'>{status === 'dislikes' ? 'Disiked' : 'Dislike'}</span>
                </div>
            )}
        </div>
    )
}

function ActionButton({
    active,
    iconActive,
    iconInactive,
    onClick,
}: {
    active: boolean
    iconActive: React.ReactNode
    iconInactive: React.ReactNode
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className="group active:scale-90 rounded-full size-10 flex justify-center items-center transition-all bg-neutral-800/70 hover:bg-neutral-900/90 border border-neutral-300/20 hover:cursor-pointer backdrop-blur-md shadow"
        >
            {active ? iconActive : iconInactive}
        </button>
    )
}
