import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVycinty } from '../store/state';
import { BusinessCard } from '../components/home/BusinessCard';
import { Search, MapPin, Sparkles, PlusCircle, ArrowRight, Star, Compass, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  const { categories, businesses, reviews } = useVycinty();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Ile-Ife');

  const activeBusinesses = businesses.filter(b => b.status === 'active');

  const featured = activeBusinesses.filter(b => b.isFeatured);
  const recentlyAdded = [...activeBusinesses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Top level categories (parentId === null)
  const topCategories = categories.filter(c => c.parentId === null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen pb-12 font-sans">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-2">
        <section className="relative overflow-hidden bg-[#1A1A2E] text-white p-6 sm:p-10 rounded-2xl border border-gray-800">
          {/* Subtle Accent blur sphere */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5722] opacity-15 -mr-20 -mt-20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center space-x-1.5 bg-white/10 text-white border border-white/5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>Discover Ile-Ife Osun State</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-5xl text-white clash-heading leading-tight mb-2 select-none"
            >
              Discover everything <br />
              <span className="text-[#FF5722] font-black">Ile-Ife</span> has to offer.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-white/70 text-xs sm:text-sm max-w-xl font-sans leading-relaxed"
            >
              Find top-rated restaurants, filling stations, phone & gadgets vendors, guest suites, and student lounges around Obafemi Awolowo University (OAU) and the historic town.
            </motion.p>

            {/* Centralized Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row bg-[#FFFFFF] p-1.5 rounded-xl border border-gray-200 max-w-2xl items-center space-y-1.5 sm:space-y-0 sm:space-x-2 shadow-sm"
            >
              {/* City Pill Select */}
              <div className="flex items-center space-x-1.5 px-3 py-1 border-b sm:border-b-0 sm:border-r border-gray-100 shrink-0 select-none">
                <MapPin className="w-3.5 h-3.5 text-[#FF5722]" />
                <span className="text-xs font-bold text-[#1A1A2E] font-mono select-none">Ile-Ife ▾</span>
              </div>

              {/* Search String */}
              <div className="relative w-full flex-1">
                <input
                  type="text"
                  placeholder="Amala, Hillside Suites, gadgets, lounges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-[#1A1A2E] placeholder-gray-400 text-xs focus:outline-none py-1 px-2 font-sans"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#FF5722] hover:bg-[#1A1A2E] text-white px-5 py-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </motion.form>
            
            {/* Quick stats indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="pt-1 flex items-center gap-4 text-[10px] text-white/50 font-mono"
            >
              <div className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                <span>Verified Listings Seeding</span>
              </div>
              <div className="h-3 w-[1px] bg-white/20"></div>
              <div>
                <span className="font-bold text-[#FF5722]">{activeBusinesses.length}</span> Businesses Live
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Main Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="text-center md:text-left mb-5">
          <h2 className="text-lg font-extrabold text-[#1A1A2E] font-heading tracking-tight flex items-center justify-center md:justify-start gap-1.5 uppercase text-xs">
            <Compass className="w-4 h-4 text-[#FF5722]" />
            <span>Browse by Category</span>
          </h2>
          <p className="text-slate-400 text-[10px] mt-0.5 font-mono uppercase tracking-wide">
            Verified directories directly around OAU Campus
          </p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
        >
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="decoration-none text-inherit block"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -3, scale: 1.01 }}
                className="card hover:bg-orange-50/10 p-3.5 flex flex-col items-center text-center transition-all select-none cursor-pointer group"
              >
                <div className={`w-11 h-11 ${cat.color} rounded-xl flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <span className="mt-3 text-[11px] font-black text-[#1A1A2E] group-hover:text-[#FF5722] transition-colors leading-tight uppercase font-mono tracking-tight text-center">
                  {cat.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="bg-white border-y border-[#E5E7EB] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-5 text-center md:text-left">
            <div>
              <h2 className="text-lg font-extrabold text-[#1A1A2E] font-heading tracking-tight flex items-center justify-center md:justify-start gap-1.5 uppercase text-xs">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Featured Spotlights</span>
              </h2>
              <p className="text-slate-400 text-[10px] mt-0.5 font-mono uppercase">
                Promoted hotspots with verified identity
              </p>
            </div>
            <Link
              to="/category/food"
              className="mt-1 md:mt-0 inline-flex items-center space-x-1 text-[11px] font-black text-[#FF5722] hover:text-[#1A1A2E] transition-colors decoration-none uppercase font-mono"
            >
              <span>Explore All Listings →</span>
            </Link>
          </div>

          {/* Desktop/Mobile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.length > 0 ? (
              featured.slice(0, 3).map((biz) => (
                <BusinessCard key={biz.id} business={biz} reviews={reviews} />
              ))
            ) : (
              <p className="text-slate-500 text-[11px] italic">No featured listings right now. Check back soon!</p>
            )}
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-5 text-center md:text-left">
          <div>
            <h2 className="text-lg font-extrabold text-[#1A1A2E] font-heading tracking-tight uppercase text-xs">
              Recently Discovered
            </h2>
            <p className="text-slate-400 text-[10px] mt-0.5 font-mono uppercase">
              The newest additions to the local Ife registry
            </p>
          </div>
        </div>

        {/* List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentlyAdded.map((biz) => (
            <BusinessCard key={biz.id} business={biz} reviews={reviews} />
          ))}
        </div>
      </section>

      {/* Register Your Business Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <motion.div
          whileHover={{ y: -1 }}
          className="bg-gradient-to-tr from-[#1A1A2E] via-[#24243e] to-[#1A1A2E] border border-gray-800 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center"
        >
          {/* Background orange circular mesh */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#FF5722] opacity-10 blur-2xl z-0 pointer-events-none"></div>
          
          <div className="space-y-2 max-w-xl text-center md:text-left relative z-10">
            <h2 className="text-xl md:text-2xl font-black font-heading leading-tight tracking-tight">
              Own a business in Ile-Ife? <br />
              <span className="text-[#FF5722]">Get discovered for free.</span>
            </h2>
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
              Increase foot traffic to your lounge, guest suite, gadget store or Amala joint. Claim existing listings or upload your business details today. It takes less than 2 minutes!
            </p>
          </div>

          <div className="mt-5 md:mt-0 shrink-0 relative z-10 w-full md:w-auto text-center">
            <Link
              to="/register-business"
              className="inline-flex items-center space-x-1.5 bg-[#FF5722] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg text-xs transition-transform hover:scale-101 shadow-sm decoration-none cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Your Spot</span>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
