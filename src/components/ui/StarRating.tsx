import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number; // e.g. 4.5
  max?: number;
  size?: number; // width/height in px
  className?: string;
  showText?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 16,
  className = '',
  showText = false
}) => {
  const roundedRating = Math.round(rating * 2) / 2; // round to nearest 0.5
  const fullStars = Math.floor(roundedRating);
  const hasHalf = roundedRating % 1 !== 0;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex items-center">
        {/* Render Full Stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="text-amber-400 fill-amber-400"
            style={{ width: size, height: size }}
          />
        ))}

        {/* Render Half Star */}
        {hasHalf && (
          <div className="relative" style={{ width: size, height: size }}>
            <Star
              className="text-gray-300 absolute top-0 left-0"
              style={{ width: size, height: size }}
            />
            <div className="overflow-hidden absolute top-0 left-0 w-1/2">
              <Star
                className="text-amber-400 fill-amber-400"
                style={{ width: size, height: size }}
              />
            </div>
          </div>
        )}

        {/* Render Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="text-gray-300"
            style={{ width: size, height: size }}
          />
        ))}
      </div>
      
      {showText && (
        <span className="text-xs font-bold text-[#1A1A2E] bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200 font-mono">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
