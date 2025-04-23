// components/FallbackImage.tsx
'use client'

import Image from "next/image";
import { useState } from "react";

type FallbackImageProps = {
    movieId: number;
    title: string;
    className?: string;
};

export default function FallbackImage({ movieId, title, className }: FallbackImageProps) {
    const [imageSrc, setImageSrc] = useState(`/images/${movieId}.jpg`)

    return <Image
        src={imageSrc}
        alt={title}
        width={0}
        height={0}
        sizes="100vw"
        className={cn("h-full w-auto max-w-full", className)}
        onError={() => setImageSrc('/images/placeholder.png')}
    />
}

function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(" ");
}
