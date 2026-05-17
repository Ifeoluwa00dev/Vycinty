import React from 'react';
import { Link } from 'react-router-dom';
import { Business, Review } from '../../types';
import { SEED_CATEGORIES } from '../../data';
import { StarRating } from '../ui/StarRating';
import { MapPin, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BusinessCardProps {
  business: Business;
  reviews: Review[];
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, reviews }) => {
  // Find category info
  const categoryInfo = SEED_CATEGORIES.find(c => c.id === business.categoryId);
  const parentCategory = categoryInfo?.parentId 
    ? SEED_CATEGORIES.find(c => c.id === categoryInfo.parentId) 
    : null;

  const displayCategory = categoryInfo || { name: 'Local Business', color: 'bg-orange-500', icon: '🏢' };

  // Calculate average rating
  const bizReviews = reviews.filter(r => r.businessId === business.id);
  const averageRating = bizReviews.length > 0
    ? bizReviews.reduce((acc, rev) => acc + rev.rating, 0) / bizReviews.length
    : 4.5; // default fallback if no reviews yet

  const reviewSnippet = bizReviews.length > 0
    ? bizReviews[0].comment
    : `Excellent space to explore in ${business.city}. Checked and recommended!`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="card hover:shadow-md transition-all flex flex-col h-full group select-none overflow-hidden"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-32 overflow-hidden bg-gray-100">
        <img
          src={business.coverImage}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        
        {/* Category Pill */}
        <span className="absolute top-2.5 left-2.5 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[9px] font-bold text-white bg-[#1A1A2E]/85 backdrop-blur-xs shadow-xs category-badge">
          <span>{displayCategory.icon}</span>
          <span>{displayCategory.name}</span>
        </span>

        {/* Verification Badge */}
        {business.isVerified && (
          <span className="absolute top-2.5 right-2.5 bg-[#22C55E]/90 backdrop-blur-xs text-white p-0.5 rounded-full shadow-xs" title="Vycinty Verified">
            <CheckCircle2 className="w-3.5 h-3.5 fill-white text-[#22C55E]" />
          </span>
        )}

        {/* Featured Badge */}
        {business.isFeatured && (
          <span className="absolute bottom-2.5 left-2.5 bg-[#FF5722] text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Rating */}
          <div className="flex items-center space-x-1.5">
            <StarRating rating={averageRating} size={12} />
            <span className="text-[10px] text-slate-500 font-medium font-mono">
              ({bizReviews.length || 1})
            </span>
          </div>

          <h3 className="text-sm font-black text-[#1A1A2E] leading-tight group-hover:text-[#FF5722] transition-colors line-clamp-1 font-heading">
            {business.name}
          </h3>

          <div className="flex items-center text-[11px] text-slate-500 font-medium font-sans">
            <MapPin className="w-3 h-3 text-[#FF5722] mr-1 shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>

          <p className="text-[11px] text-slate-500 line-clamp-2 pt-0.5 font-sans leading-relaxed">
            {business.description}
          </p>

          {/* Sincere Recommendation Review snippet quote */}
          <div className="mt-2 p-2 bg-[#FAFAF8] rounded-lg border-l-2 border-[#FF5722] text-[10px] text-slate-500 italic line-clamp-2 leading-relaxed">
            "{reviewSnippet}"
          </div>
        </div>

        {/* View Details action */}
        <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
          
          
          <Link
            to={`/business/${business.id}`}
            className="inline-flex items-center space-x-1 text-[11px] font-black text-[#FF5722] hover:text-[#1A1A2E] transition-all decoration-none"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
