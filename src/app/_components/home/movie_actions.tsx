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

    const [status, setStatus] = useState<'like' | 'save' | 'dislike' | null>(null)
    const [optimisticStatus, setOptimisticStatus] = useState<'like' | 'save' | 'dislike' | null>(null)

    useEffect(() => {
        if (isLiked.data) setStatus('like')
        else if (isSaved.data) setStatus('save')
        else if (isDisliked.data) setStatus('dislike')
        else setStatus(null)
    }, [isLiked.data, isSaved.data, isDisliked.data])

    const handleToggle = (action: 'like' | 'save' | 'dislike') => {
        const isActive = status === action
        const nextStatus = isActive ? null : action

        setOptimisticStatus(action)

        const toastID = toast.loading(
            isActive
                ? `Removing from ${action}...`
                : `Adding movie to ${action}...`
        )

        const mutation =
            action === 'like' ? likeMutation :
                action === 'save' ? saveMutation :
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
            {(!activeAction || activeAction === 'like') && (
                <ActionButton
                    active={optimisticStatus === 'like' || status === 'like'}
                    iconActive={<SolidHeart className="text-rose-500 size-6" />}
                    iconInactive={<OutlineHeart className="group-hover:text-rose-500 size-6" />}
                    onClick={() => handleToggle('like')}
                />
            )}
            {(!activeAction || activeAction === 'save') && (
                <ActionButton
                    active={optimisticStatus === 'save' || status === 'save'}
                    iconActive={<SolidSave className="text-green-500 size-6" />}
                    iconInactive={<OutlineSave className="group-hover:text-green-500 size-6" />}
                    onClick={() => handleToggle('save')}
                />
            )}
            {(!activeAction || activeAction === 'dislike') && (
                <ActionButton
                    active={optimisticStatus === 'dislike' || status === 'dislike'}
                    iconActive={<SolidDislike className="text-red-500 size-6" />}
                    iconInactive={<OutlineDislike className="group-hover:text-red-500 size-6" />}
                    onClick={() => handleToggle('dislike')}
                />
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
