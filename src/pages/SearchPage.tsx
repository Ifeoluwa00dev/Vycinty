import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useVycinty } from '../store/state';
import { BusinessCard } from '../components/home/BusinessCard';
import { SEED_CATEGORIES } from '../data';
import { Search, MapPin, Compass, AlertCircle } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { businesses, reviews } = useVycinty();
  
  const q = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!q.trim()) return [];
    
    const query = q.toLowerCase().trim();
    
    return businesses.filter(b => {
      if (b.status !== 'active') return false;

      const nameMatch = b.name.toLowerCase().includes(query);
      const descMatch = b.description.toLowerCase().includes(query);
      const addressMatch = b.address.toLowerCase().includes(query);
      
      // Find category
      const category = SEED_CATEGORIES.find(c => c.id === b.categoryId);
      const catNameMatch = category ? category.name.toLowerCase().includes(query) : false;

      // Find parent category
      const parentCat = category?.parentId 
        ? SEED_CATEGORIES.find(p => p.id === category.parentId) 
        : null;
      const parentMatch = parentCat ? parentCat.name.toLowerCase().includes(query) : false;

      return nameMatch || descMatch || addressMatch || catNameMatch || parentMatch;
    });
  }, [businesses, q]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newQ = data.get('query') as string;
    if (newQ !== null) {
      setSearchParams({ q: newQ.trim() });
    }
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search header layout */}
        <div className="max-w-3xl mx-auto space-y-4 text-center sm:text-left mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-[#1A1A2E] clash-heading flex flex-col sm:flex-row items-center gap-1.5 uppercase">
            <span>Search Results for</span>
            <span className="text-[#FF5722] font-mono italic">"{q}"</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wide">
             Vycinty scanning engine identified {results.length} matching {results.length === 1 ? 'placement' : 'placements'} active in Ile-Ife
          </p>

          <form onSubmit={handleSearchSubmit} className="flex bg-[#FFFFFF] p-1.5 rounded-xl border border-gray-200 shadow-xs w-full max-w-xl mx-auto sm:mx-0 items-center">
            <div className="flex items-center space-x-1.5 px-3 border-r border-gray-100 shrink-0 select-none">
              <MapPin className="w-3.5 h-3.5 text-[#FF5722]" />
              <span className="text-xs font-bold text-[#1A1A2E] font-mono">Ile-Ife</span>
            </div>
            <input
              type="text"
              name="query"
              defaultValue={q}
              required
              placeholder="Search amala, lounges, hotels in Ife..."
              className="text-xs p-1.5 w-full focus:outline-none text-[#1A1A2E] font-sans"
            />
            <button
              type="submit"
              className="bg-[#1A1A2E] text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              Search
            </button>
          </form>
        </div>

        {/* Dynamic results layout */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(biz => (
              <BusinessCard key={biz.id} business={biz} reviews={reviews} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-16 text-center space-y-5 max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto border border-amber-100">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="font-bold text-[#1A1A2E] text-base font-heading">No listings match your search term</p>
            <p className="text-slate-500 text-xs max-w-xs mx-auto font-sans leading-relaxed">
              We couldn't locate any results matching **{q}**. It might not be seeded yet, or is currently pending review.
            </p>
            <div className="flex space-x-2 justify-center pt-2">
              <Link
                to="/register-business"
                className="bg-[#FF5722] hover:bg-[#1A1A2E] text-white text-xs font-bold px-4 py-2.5 rounded-lg decoration-none transition-colors"
              >
                Register "{q}" Listing
              </Link>
              <Link
                to="/"
                className="border border-gray-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg decoration-none transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
