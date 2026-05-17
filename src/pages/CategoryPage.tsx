import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVycinty } from '../store/state';
import { BusinessCard } from '../components/home/BusinessCard';
import { SEED_CATEGORIES } from '../data';
import { Star, Clock, ListFilter, ArrowLeft, ArrowUpDown } from 'lucide-react';
import { motion } from 'motion/react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { businesses, reviews } = useVycinty();
  const [activeSubId, setActiveSubId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'reviews'>('rating');

  // Find category based on slug
  const category = useMemo(() => {
    return SEED_CATEGORIES.find(c => c.slug === slug);
  }, [slug]);

  // If top level category, find child subcategories
  const subcategories = useMemo(() => {
    if (!category) return [];
    return SEED_CATEGORIES.filter(c => c.parentId === category.id);
  }, [category]);

  // Determine active filtering category IDS
  const filterCategoryIds = useMemo(() => {
    if (!category) return [];
    
    // If we've selected a specific subcategory tab
    if (activeSubId !== 'all') {
      return [activeSubId];
    }

    // If "All" is active, return parent category + all child subcategory IDs
    const kids = SEED_CATEGORIES.filter(c => c.parentId === category.id).map(c => c.id);
    return [category.id, ...kids];
  }, [category, activeSubId]);

  // Gather matching businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => 
      b.status === 'active' && 
      filterCategoryIds.includes(b.categoryId)
    );
  }, [businesses, filterCategoryIds]);

  // Average ratings mapped for sorting
  const businessesWithRatingStats = useMemo(() => {
    return filteredBusinesses.map(b => {
      const bizReviews = reviews.filter(r => r.businessId === b.id);
      const avg = bizReviews.length > 0
        ? bizReviews.reduce((sum, r) => sum + r.rating, 0) / bizReviews.length
        : 4.5;
      return {
        ...b,
        averageRating: avg,
        reviewCount: bizReviews.length
      };
    });
  }, [filteredBusinesses, reviews]);

  // Sort businesses
  const sortedBusinesses = useMemo(() => {
    return [...businessesWithRatingStats].sort((a, b) => {
      if (sortBy === 'rating') {
        return b.averageRating - a.averageRating;
      } else if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'reviews') {
        return b.reviewCount - a.reviewCount;
      }
      return 0;
    });
  }, [businessesWithRatingStats, sortBy]);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Category not found</h2>
        <p className="text-slate-500 text-xs text-sans">The category you requested does not exist in Ile-Ife yet.</p>
        <Link to="/" className="inline-block bg-[#FF5722] text-white px-5 py-2 rounded-lg text-xs font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Go Back */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-[#FF5722] decoration-none transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="font-semibold text-slate-800">{category.name}</span>
        </div>

        {/* Category Hero */}
        <div className="card p-4 sm:p-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3.5">
            <span className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-xl shadow-xs shrink-0`}>
              {category.icon}
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A2E] clash-heading tracking-tight">
                {category.name} Directory
              </h1>
              <p className="text-[11px] text-slate-500 font-mono uppercase tracking-tight mt-0.5">
                Showing {sortedBusinesses.length} {sortedBusinesses.length === 1 ? 'placement' : 'placements'} verified in Ile-Ife
              </p>
            </div>
          </div>
          
          <Link
            to="/"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#1A1A2E] hover:text-[#FF5722] transition-colors decoration-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Category</span>
          </Link>
        </div>

        {/* Filter and Sorting bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 card p-3 shadow-xs">
          {/* Subcategories Tabs if they exist */}
          {subcategories.length > 0 ? (
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none shrink-0 pr-2">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase flex items-center shrink-0 pr-1 select-none">
                <ListFilter className="w-3.5 h-3.5 mr-1 text-slate-400" /> Segment:
              </span>
              <button
                onClick={() => setActiveSubId('all')}
                className={`px-3 py-1 rounded text-xs font-bold font-mono uppercase transition-all cursor-pointer whitespace-nowrap ${
                  activeSubId === 'all'
                    ? 'bg-[#FF5722] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                All {category.name}
              </button>
              {subcategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubId(sub.id)}
                  className={`px-3 py-1 rounded text-xs font-bold font-mono uppercase transition-all cursor-pointer whitespace-nowrap ${
                    activeSubId === sub.id
                      ? 'bg-[#FF5722] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center text-[10px] text-slate-400 font-mono font-bold uppercase select-none">
              ⚡ Exclusive directory segment
            </div>
          )}

          {/* Sorting controls */}
          <div className="flex items-center space-x-2 w-full md:w-auto shrink-0 self-end md:self-center border-t md:border-0 pt-2.5 md:pt-0">
            <span className="text-xs text-slate-500 font-medium flex items-center font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1" /> Sort:
            </span>
            <div className="flex gap-0.5 bg-slate-100 p-0.5 rounded-md w-full md:w-auto">
              <button
                onClick={() => setSortBy('rating')}
                className={`flex-1 md:flex-none px-2.5 py-1 rounded text-xs font-bold font-mono uppercase transition-all cursor-pointer whitespace-nowrap ${
                  sortBy === 'rating' ? 'bg-white text-[#FF5722] shadow-xs' : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                Stars
              </button>
              <button
                onClick={() => setSortBy('newest')}
                className={`flex-1 md:flex-none px-2.5 py-1 rounded text-xs font-bold font-mono uppercase transition-all cursor-pointer whitespace-nowrap ${
                  sortBy === 'newest' ? 'bg-white text-[#FF5722] shadow-xs' : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy('reviews')}
                className={`flex-1 md:flex-none px-2.5 py-1 rounded text-xs font-bold font-mono uppercase transition-all cursor-pointer whitespace-nowrap ${
                  sortBy === 'reviews' ? 'bg-white text-[#FF5722] shadow-xs' : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {sortedBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedBusinesses.map(biz => (
              <BusinessCard key={biz.id} business={biz} reviews={reviews} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl py-16 px-4 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <span className="text-4xl">🏢</span>
            <p className="font-bold text-[#1A1A2E] text-base font-heading">No Listings in this Segment Yet</p>
            <p className="text-slate-500 text-xs max-w-sm mx-auto font-sans">
              Be the first to lists a physical shop or street vendor in {category.name}! Click below to lists for free.
            </p>
            <Link
              to="/register-business"
              className="inline-block bg-[#FF5722] hover:bg-[#1A1A2E] text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-colors decoration-none"
            >
              Add Business Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
