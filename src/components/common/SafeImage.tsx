import React, { useState } from 'react';
import { getTopicFallbackSvg } from '../../data/svgTechnicalIllustrations';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  className?: string;
  topicType?: string;
  fallbackTitle?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

/**
 * SafeImage Component
 * Prevents broken image icons or blank rectangles anywhere in the engineering hub.
 * If the image fails to load, is an empty string, or undefined, it automatically
 * renders a crisp, high-precision technical SVG diagram tailored to the specific topic.
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  topicType = 'engineering',
  fallbackTitle,
  objectFit = 'cover',
  loading = 'lazy',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If source is missing, invalid or marked failed, immediately render the topic-aware technical SVG
  if (!src || hasError || src.trim() === '') {
    const fallbackSvg = getTopicFallbackSvg(topicType, fallbackTitle || alt);
    return (
      <div 
        className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950/80 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div 
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: fallbackSvg }}
        />
        {fallbackTitle && (
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-md px-2.5 py-1 text-[11px] font-mono text-slate-300 flex items-center justify-between shadow-lg pointer-events-none">
            <span className="truncate">{fallbackTitle}</span>
            <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold ml-2 shrink-0">Technical Illustration</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-950 ${className}`}>
      {/* Loading placeholder skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-cyan-500 animate-spin" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-${objectFit} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
