"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  overlay?: boolean;
}

export default function BlogImage({ src, alt, className, wrapperClassName, overlay }: Props) {
  const [broken, setBroken] = useState(false);

  if (broken) return null;

  return (
    <div className={wrapperClassName}>
      <Image
        src={src}
        alt={alt}
        className={className}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        onError={() => setBroken(true)}
        loading="lazy"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
      )}
    </div>
  );
}
