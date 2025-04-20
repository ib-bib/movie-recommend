// components/FallbackImage.tsx
'use client'

import Image from "next/image";
import { useState } from "react";

type FallbackImageProps = {
    movieId: number;
    title: string;
};

export default function FallbackImage({ movieId, title }: FallbackImageProps) {
    const [imageError, setImageError] = useState(false);

    return imageError ? (
        <Image
            src={`/images/placeholder.png}`}
            alt={title}
            fill
            className="object-contain z-0"
        />
    ) : (
        <Image
            src={`/images/${movieId}.jpg`}
            alt={title}
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-auto max-w-full object-contain -z-10"
            onError={() => setImageError(true)}
        />
    );
}

