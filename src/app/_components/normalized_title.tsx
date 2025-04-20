'use client';

import { normalizeTitle } from '~/app/utils/normalized_strings';

export const NormalizedTitle = ({ title }: { title: string | null | undefined }) => {
    const displayTitle = normalizeTitle(title ?? 'Movie');

    return (
        <div className="relative group w-11/12 flex justify-center">
            <h1 className="text-2xl font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                {displayTitle}
            </h1>

            {/* Tooltip */}
            <span className="invisible group-hover:visible absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs bg-black text-white text-sm rounded-md px-3 py-1 shadow-lg z-10 whitespace-normal">
                {displayTitle}
            </span>
        </div>
    );
};
