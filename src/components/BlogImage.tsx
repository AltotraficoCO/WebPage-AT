"use client";

import { useState } from "react";

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
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setBroken(true)}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
      )}
    </div>
  );
}
