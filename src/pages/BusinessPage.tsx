import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVycinty } from '../store/state';
import { SEED_CATEGORIES } from '../data';
import { StarRating } from '../components/ui/StarRating';
import { 
  MapPin, Phone, MessageSquare, Mail, Globe, Instagram, Share2, 
  CheckCircle, FileQuestion, HelpCircle, Heart, AlertTriangle, 
  Send, ShieldCheck, CheckCheck, Clock, CheckCircle2, ChevronRight, Copy
} from 'lucide-react';
import { motion } from 'motion/react';

export const BusinessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, businesses, reviews, claims, addReview, claimBusiness } = useVycinty();
  
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'submitted'>('idle');

  // Find the business matching ID
  const business = useMemo(() => {
    return businesses.find(b => b.id === id);
  }, [businesses, id]);

  const category = useMemo(() => {
    if (!business) return null;
    return SEED_CATEGORIES.find(c => c.id === business.categoryId);
  }, [business]);

  // Reviews list for this business
  const bizReviews = useMemo(() => {
    if (!business) return [];
    return reviews.filter(r => r.businessId === business.id);
  }, [reviews, business]);

  // Verify if current user already reviewed
  const userHasReviewed = useMemo(() => {
    if (!currentUser || !business) return false;
    return bizReviews.some(r => r.userId === currentUser.id);
  }, [currentUser, bizReviews, business]);

  // Verify if current user already submitted a claim
  const isAlreadyClaimedOrSubmitting = useMemo(() => {
    if (!business) return true;
    if (business.ownerId) return true; // Already owned
    if (!currentUser) return false;
    return claims.some(c => c.businessId === business.id && c.userId === currentUser.id);
  }, [claims, business, currentUser]);

  // Average Rating calculation
  const stats = useMemo(() => {
    const total = bizReviews.length;
    if (total === 0) {
      return { average: 4.5, count: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const sum = bizReviews.reduce((acc, r) => acc + r.rating, 0);
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    bizReviews.forEach(r => {
      const rate = r.rating as 5 | 4 | 3 | 2 | 1;
      if (breakdown[rate] !== undefined) {
        breakdown[rate]++;
      }
    });

    return {
      average: sum / total,
      count: total,
      breakdown
    };
  }, [bizReviews]);

  // Determine initial selected image when business details load
  React.useEffect(() => {
    if (business) {
      setSelectedImg(business.coverImage);
    }
  }, [business]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !business || !userComment.trim()) return;

    addReview(business.id, userRating, userComment.trim());
    setUserComment('');
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
    }, 4500);
  };

  const handleClaimSubmit = () => {
    if (!currentUser || !business) return;
    claimBusiness(business.id);
    setClaimStatus('submitted');
  };

  if (!business) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Business listing not found</h2>
        <p className="text-slate-500 text-xs font-sans">The listing might have been removed or suspended by site administrators.</p>
        <Link to="/" className="inline-block bg-[#FF5722] text-white px-5 py-2 rounded-lg text-xs font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb path */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-6 flex-wrap font-sans">
          <Link to="/" className="hover:text-[#FF5722] decoration-none transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          {category && (
            <>
              <Link to={`/category/${category.slug}`} className="hover:text-[#FF5722] decoration-none transition-colors">{category.name}</Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </>
          )}
          <span className="font-semibold text-slate-800 tracking-tight">{business.name}</span>
        </div>

        {/* Layout container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Column (Left, spans 2 grid points on large displays) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Visual Header / Cover and Thumbnail strip */}
            <div className="space-y-4">
              <div className="h-96 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-xs relative">
                <img
                  src={selectedImg || business.coverImage}
                  alt={business.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Category Label */}
                {category && (
                  <span className="absolute top-4 left-4 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-slate-900/85 backdrop-blur-xs shadow-md font-mono">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </span>
                )}
              </div>

              {/* Gallery Strip */}
              {business.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-thin">
                  {business.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(img)}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        (selectedImg || business.coverImage) === img 
                          ? 'border-[#FF5722] ring-1 ring-[#FF5722]' 
                          : 'border-transparent opacity-85 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Business Primary Branding and description block */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 space-y-5 shadow-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] tracking-tight font-heading">
                      {business.name}
                    </h1>
                    
                    {/* Verification and claim Badges */}
                    {business.isVerified && (
                      <span className="inline-flex items-center bg-[#22C55E]/10 border border-emerald-200 text-[#22C55E] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 fill-current" /> Verified
                      </span>
                    )}

                    {business.ownerId ? (
                      <span className="inline-flex items-center bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                        Claimed Listing
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                        Unclaimed
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <StarRating rating={stats.average} size={15} showText />
                    <span className="text-slate-500 font-medium font-sans">
                      ({stats.count} {stats.count === 1 ? 'Community Review' : 'Community Reviews'})
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 text-[#1A1A2E] space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A2E] font-mono">About this business</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                  {business.description}
                </p>
              </div>

              {/* Digital Contacts section bar */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A2E] font-mono mb-4">Contact & Media Presence</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {business.phone && (
                    <div className="flex items-center space-x-3 text-slate-600">
                      <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#1A1A2E]">
                        <Phone className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider">Phone Call</span>
                        <a href={`tel:${business.phone}`} className="text-xs font-semibold hover:text-[#FF5722] decoration-none transition-colors">
                          {business.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.email && (
                    <div className="flex items-center space-x-3 text-slate-600">
                      <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#1A1A2E]">
                        <Mail className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider">Email Address</span>
                        <a href={`mailto:${business.email}`} className="text-xs font-semibold hover:text-[#FF5722] decoration-none transition-colors">
                          {business.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.website && (
                    <div className="flex items-center space-x-3 text-slate-600">
                      <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#1A1A2E]">
                        <Globe className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider">Official Site</span>
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold hover:text-[#FF5722] decoration-none transition-colors truncate block max-w-[200px]">
                          {business.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.instagram && (
                    <div className="flex items-center space-x-3 text-slate-600">
                      <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#1A1A2E]">
                        <Instagram className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider">Instagram handle</span>
                        <a href={`https://instagram.com/${business.instagram}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold hover:text-[#FF5722] decoration-none transition-colors">
                          @{business.instagram}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Opening Hours Table component */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A2E] font-mono mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-[#FF5722]" /> Opening Hours
              </h3>
              
              <div className="divide-y divide-gray-100 text-xs sm:text-sm">
                {[
                  { label: 'Monday', val: business.openingHours.mon || 'Closed' },
                  { label: 'Tuesday', val: business.openingHours.tue || 'Closed' },
                  { label: 'Wednesday', val: business.openingHours.wed || 'Closed' },
                  { label: 'Thursday', val: business.openingHours.thu || 'Closed' },
                  { label: 'Friday', val: business.openingHours.fri || 'Closed' },
                  { label: 'Saturday', val: business.openingHours.sat || 'Closed' },
                  { label: 'Sunday', val: business.openingHours.sun || 'Closed' }
                ].map((item, id) => (
                  <div key={id} className="flex justify-between py-2.5">
                    <span className="text-slate-500 font-medium">{item.label}</span>
                    <span className={`font-mono text-slate-800 font-semibold ${item.val === 'Closed' ? 'text-red-500' : ''}`}>
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Structured local review system */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 space-y-6 shadow-xs">
              <h2 className="text-xl font-extrabold text-[#1A1A2E] font-heading tracking-tight">
                Customer Reviews
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-[#FAFAF8] p-5 rounded-2xl border border-gray-100">
                {/* Big number review rating */}
                <div className="text-center md:border-r border-gray-200 pb-4 md:pb-0">
                  <p className="text-4xl font-extrabold text-[#1A1A2E] font-heading leading-tight">{stats.average.toFixed(1)}</p>
                  <div className="flex justify-center my-1.5">
                    <StarRating rating={stats.average} size={15} />
                  </div>
                  <p className="text-slate-500 text-xs font-mono font-medium">Out of 5 Stars</p>
                </div>

                {/* Rating bars */}
                <div className="md:col-span-2 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = stats.breakdown[stars as 5 | 4 | 3 | 2 | 1] || 0;
                    const percent = stats.count > 0 ? (count / stats.count) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center space-x-3 text-xs">
                        <span className="font-bold text-[#1A1A2E] w-3 text-right">{stars}★</span>
                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: `${percent || 2}%` }}></div>
                        </div>
                        <span className="text-slate-500 font-mono font-semibold w-10 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leave Review Form */}
              <div className="border-t border-gray-100 pt-6">
                {!currentUser ? (
                  <div className="p-4 bg-orange-50 border border-orange-100 text-orange-900 rounded-lg text-xs font-semibold flex items-center justify-between">
                    <span>You must be signed in to submit a rating and review on Vycinty.</span>
                    <Link to="/auth/login" className="bg-[#FF5722] text-white px-3 py-1.5 rounded-md decoration-none text-xs hover:bg-[#1A1A2E] transition-all">Sign In</Link>
                  </div>
                ) : userHasReviewed ? (
                  <div className="p-4 bg-gray-50 border border-gray-200 text-slate-600 rounded-xl text-xs font-medium">
                     ✅ You have already submitted a community review for {business.name}. Thank you for your feedback!
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <h3 className="text-sm font-bold text-[#1A1A2E] font-heading uppercase tracking-wider">Leave a Review</h3>
                    
                    {reviewSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium rounded-lg text-xs">
                        🎉 Review published! Your response has been added to the rating index instantly.
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-semibold text-slate-500">Pick rating stars:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setUserRating(val)}
                            className="text-amber-400 focus:outline-none cursor-pointer hover:scale-110 transition-transform"
                          >
                            <svg className={`w-6 h-6 ${userRating >= val ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-500">Describe your experience (honest community feedback):</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write your review... Mention food taste, price, environment safety, customer support quality."
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        className="w-full text-slate-800 text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#1A1A2E] hover:bg-[#FF5722] text-white font-bold px-6 py-2.5 rounded-lg text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Review</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-slate-500 font-heading uppercase tracking-wider">Recent Experiences</h3>
                {bizReviews.length > 0 ? (
                  <div className="space-y-4 divide-y divide-gray-100">
                    {bizReviews.map((rev) => (
                      <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <img
                              src={rev.userAvatar || `https://api.dicebear.com/7.x/beta-genders/svg?seed=${rev.userName}`}
                              alt={rev.userName}
                              className="w-8 h-8 rounded-full bg-orange-100 border object-cover"
                            />
                            <div>
                              <p className="text-xs font-bold text-[#1A1A2E] leading-none">{rev.userName}</p>
                              <span className="text-[10px] text-slate-400 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <StarRating rating={rev.rating} size={12} />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pl-1">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No community evaluations catalogued yet. Be the first to share your experience!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right column) */}
          <div className="space-y-6">
            
            {/* Action Bar (Share, Whatsapp, Directions) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
              
              {/* WhatsApp direct chat CTA */}
              {business.whatsapp && (
                <a
                  href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi, I discovered ${business.name} on Vycinty. I'd like to make an inquiry!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#22C55E] hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-xs hover:shadow-md decoration-none cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Connect on WhatsApp</span>
                </a>
              )}

              {/* Call Phone */}
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-[#1A1A2E] font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors decoration-none cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {business.name}</span>
                </a>
              )}

              {/* Embed Map if coordinates exist and is physical */}
              {business.isPhysical && (
                <div className="space-y-2.5 pt-2 border-t border-gray-100">
                  <div className="flex items-start text-xs text-slate-600">
                    <MapPin className="w-4 h-4 text-[#FF5722] mr-2 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[#1A1A2E] font-sans">Physical Address</span>
                      <span className="font-sans text-xs">{business.address}</span>
                    </div>
                  </div>

                  <div className="h-44 rounded-xl overflow-hidden border border-gray-200 bg-slate-50 relative mt-2">
                    <iframe
                      src={`https://maps.google.com/maps?q=${business.latitude},${business.longitude}&z=14&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 border border-[#FF5722] text-[#FF5722] hover:bg-orange-50 font-bold rounded-xl text-[11px] flex items-center justify-center space-x-1.5 transition-all decoration-none cursor-pointer"
                  >
                    <span>Get Navigation Map</span>
                    <span>↗</span>
                  </a>
                </div>
              )}

              {/* Social sharing and copying */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold font-mono uppercase tracking-wider">Share Listing</span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyLink}
                    className="p-2 hover:bg-slate-100 rounded-full text-[#1A1A2E] transition-colors cursor-pointer"
                    title="Copy listing URL"
                  >
                    {copied ? (
                      <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-1.5 py-0.5 rounded">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out ${business.name} in Ile-Ife on Vycinty: ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-slate-100 rounded-full text-[#22C55E] transition-colors decoration-none"
                    title="Share via WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Claim Listing Widget */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-[#1A1A2E] uppercase font-mono tracking-wider flex items-center justify-between">
                <span>Business Owner?</span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              </h3>
              
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                Are you the legally recognised manager of **{business.name}**? Claim this business to handle listing images, hours of operation, and verify details for users.
              </p>

              {isAlreadyClaimedOrSubmitting ? (
                <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-[10px] font-mono flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 shrink-0 text-indigo-600" />
                  <span>
                    {business.ownerId ? 'Claim already assigned to verified account.' : 'Claim application pending for evaluation.'}
                  </span>
                </div>
              ) : !currentUser ? (
                <div className="text-center pt-2">
                  <Link
                    to="/auth/login"
                    className="block w-full py-2 bg-slate-100 hover:bg-[#FF5722] hover:text-white text-[#1A1A2E] text-xs font-bold rounded-lg transition-colors decoration-none"
                  >
                    Login to claim listing
                  </Link>
                </div>
              ) : claimStatus === 'submitted' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg text-[10px] font-mono">
                   🎉 Claim request submitted! Navigate to your Sandbox Dashboard to simulate Admin evaluation approval.
                </div>
              ) : (
                <button
                  onClick={handleClaimSubmit}
                  className="w-full py-2.5 bg-linear-to-r from-indigo-900 to-slate-900 hover:from-[#FF5722] hover:to-orange-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Apply to Claim Listing
                </button>
              )}
            </div>

            {/* Safety policy / Report */}
            <div className="text-center">
              <span className="inline-flex items-center text-[10px] text-slate-400 font-mono hover:text-[#FF5722] cursor-pointer">
                <AlertTriangle className="w-3 h-3 mr-1" /> Flag incorrect coordinates or details
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
