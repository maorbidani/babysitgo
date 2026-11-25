import React, { useState } from 'react';

interface AvatarWithFallbackProps {
  src: string;
  alt: string;
  name: string;
  className?: string;
}

export const AvatarWithFallback: React.FC<AvatarWithFallbackProps> = ({
  src,
  alt,
  name,
  className = 'w-14 h-14 rounded-2xl object-cover',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#1A73E8]/15 to-[#34A853]/15 text-[#1A73E8] font-display font-bold select-none shrink-0 ${className}`}
        aria-label={alt}
      >
        <span className="text-lg">{name.slice(0, 1)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover shrink-0 bg-slate-100 ${className}`}
    />
  );
};
