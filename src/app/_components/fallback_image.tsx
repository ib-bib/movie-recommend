// components/FallbackImage.tsx
'use client'

import Image from "next/image";
import { useState } from "react";

type FallbackImageProps = {
    src: string;
    fallbackSrc: string;
    alt: string;
    className?: string;
};

export default function FallbackImage({ src, fallbackSrc, alt }: FallbackImageProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <Image
            src={imageError ? fallbackSrc : src}
            alt={alt}
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-auto max-w-full object-contain"
            onError={() => setImageError(true)}
        />
    );
}
