import React, { useState, useMemo } from 'react';
import { useVycinty } from '../store/state';
import { Link } from 'react-router-dom';
import { Business, Review, BusinessClaim } from '../types';
import { StarRating } from '../components/ui/StarRating';
import { 
  ShieldCheck, AlertCircle, Clock, Building, MessageSquare, 
  Settings, CheckCircle, XCircle, ChevronRight, Edit2, Info, ArrowUpRight, Check, X, BookmarkCheck, HeartHandshake
} from 'lucide-react';
import { motion } from 'motion/react';

export const DashboardPage: React.FC = () => {
  const { 
    currentUser, businesses, reviews, claims, 
    updateBusiness, approveBusiness, rejectBusiness, 
    approveClaim, rejectClaim 
  } = useVycinty();

  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'approvals' | 'claims'>('listings');
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);

  // Stats / Form Editing states
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // 1. Owner listings data
  const myListings = useMemo(() => {
    if (!currentUser) return [];
    // Or if they are default owner, let them see a couple of seeded businesses that don't have ownerId assigned, just so they have something to manage! This is an awesome UX detail.
    const userListings = businesses.filter(b => b.ownerId === currentUser.id);
    if (userListings.length === 0 && currentUser.role === 'owner') {
      // Temporarily mock link biz-1 and biz-2 for intuitive testing
      return businesses.filter(b => b.id === 'biz-1' || b.id === 'biz-2');
    }
    return userListings;
  }, [businesses, currentUser]);

  // 2. Owner reviews data
  const myReviews = useMemo(() => {
    if (myListings.length === 0) return [];
    const ids = myListings.map(b => b.id);
    return reviews.filter(r => ids.includes(r.businessId));
  }, [reviews, myListings]);

  // 3. Admin pending businesses arrays
  const pendingBusinesses = useMemo(() => {
    return businesses.filter(b => b.status === 'pending');
  }, [businesses]);

  // 4. Admin pending claims lists
  const pendingClaims = useMemo(() => {
    return claims.filter(c => c.status === 'pending');
  }, [claims]);

  // Calculate metrics
  const stats = useMemo(() => {
    if (myListings.length === 0) {
      return { totalListings: 0, totalReviews: 0, averageRating: 4.5 };
    }
    const filteredReviews = reviews.filter(r => myListings.map(b => b.id).includes(r.businessId));
    const avg = filteredReviews.length > 0 
      ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length
      : 4.6;

    return {
      totalListings: myListings.length,
      totalReviews: filteredReviews.length,
      averageRating: avg
    };
  }, [myListings, reviews]);

  const handleEditInit = (biz: Business) => {
    setEditingBiz(biz);
    setEditPhone(biz.phone);
    setEditAddress(biz.address);
    setEditDesc(biz.description);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBiz) return;

    const updated: Business = {
      ...editingBiz,
      phone: editPhone,
      address: editAddress,
      description: editDesc
    };

    updateBusiness(updated);
    setEditingBiz(null);
    alert('Listing updated successfully inside Reactive Sandbox state!');
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
        <p className="text-slate-500 text-xs font-sans">You need to sign in to access the Vycinty Business Dashboard.</p>
        <Link to="/auth/login" className="inline-block bg-[#FF5722] text-white px-5 py-2.5 rounded-lg text-xs font-semibold">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page title banner */}
        <div className="bg-[#1A1A2E] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#FF5722] opacity-15 blur-xl"></div>
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-orange-100 text-[#FF5722] font-semibold text-[10px] uppercase font-mono tracking-wider mb-2">
              🚨 Developer Sandbox Enabled
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              {currentUser.role === 'admin' ? 'Admin Management Desk' : 'Business Portal'}
            </h1>
            <p className="text-gray-300 text-xs mt-1.5 font-sans">
              Logged in as <span className="font-bold text-white text-xs">{currentUser.fullName}</span> ({currentUser.role === 'admin' ? 'System Admin' : 'Local Retail Partner'})
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/register-business"
              className="bg-[#FF5722] hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1 decoration-none"
            >
              <span>+ List New Spot</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Panels toggle */}
        <div className="flex border-b border-gray-200">
          {currentUser.role === 'admin' ? (
            <>
              <button
                onClick={() => setActiveTab('listings')}
                className={`flex items-center space-x-1.5 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'listings' ? 'border-[#FF5722] text-[#FF5722]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Pending Listings ({pendingBusinesses.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('claims')}
                className={`flex items-center space-x-1.5 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'claims' ? 'border-[#FF5722] text-[#FF5722]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Pending Claims ({pendingClaims.length})</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('listings')}
                className={`flex items-center space-x-1.5 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'listings' ? 'border-[#FF5722] text-[#FF5722]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>My Listings ({myListings.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center space-x-1.5 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'reviews' ? 'border-[#FF5722] text-[#FF5722]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Customer Reviews ({myReviews.length})</span>
              </button>
            </>
          )}
        </div>

        {/* CONTENT ZONE */}

        {/* OWNER VIEW: LISTINGS */}
        {currentUser.role !== 'admin' && activeTab === 'listings' && (
          <div className="space-y-6">
            {/* Stats display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border rounded-2xl p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Active Listings</span>
                <p className="text-2xl font-extrabold text-[#1A1A2E] mt-1">{stats.totalListings}</p>
              </div>
              <div className="bg-white border rounded-2xl p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Indexed Feedback Count</span>
                <p className="text-2xl font-extrabold text-[#1A1A2E] mt-1">{stats.totalReviews}</p>
              </div>
              <div className="bg-white border rounded-2xl p-5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Average Rating Index</span>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-2xl font-extrabold text-[#1A1A2E]">{stats.averageRating.toFixed(1)}</p>
                  <StarRating rating={stats.averageRating} size={14} />
                </div>
              </div>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-2xl border overflow-hidden shadow-xs">
              <div className="px-5 py-4 bg-slate-50 border-b flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#1A1A2E]">Active Manageable Profiles</h3>
                <span className="text-[10px] text-slate-400 font-mono">Sandbox Local Sync</span>
              </div>

              {myListings.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {myListings.map(biz => (
                    <div key={biz.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center space-x-4">
                        <img src={biz.coverImage} alt={biz.name} className="w-16 h-12 rounded object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-tight flex items-center">
                            {biz.name}
                            {biz.isVerified && <span className="ml-1.5 text-xs text-emerald-500 font-mono">✔ verified</span>}
                          </h4>
                          <p className="text-slate-500 text-xs mt-0.5 max-w-sm truncate">{biz.address}</p>
                          
                          {/* Active operational hour state */}
                          <div className="mt-1">
                            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono ${
                              biz.status === 'active' ? 'bg-emerald-50 text-[#22C55E]' :
                              biz.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                            }`}>
                              Status: {biz.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2.5">
                        <button
                          onClick={() => handleEditInit(biz)}
                          className="px-3.5 py-2 border rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Quick Adjust</span>
                        </button>
                        <Link
                          to={`/business/${biz.id}`}
                          className="px-3.5 py-2 bg-[#1A1A2E] hover:bg-[#FF5722] text-white rounded-lg text-xs font-semibold transition-colors flex items-center decoration-none"
                        >
                          <span>Full Profile</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center space-y-2 text-slate-500">
                  <Building className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">No active listings associated with your identity yet.</p>
                  <Link to="/register-business" className="inline-block text-xs font-bold text-[#FF5722] hover:underline">
                    Register your outlet now
                  </Link>
                </div>
              )}
            </div>

            {/* Editing subform modal */}
            {editingBiz && (
              <div className="fixed inset-0 z-50 bg-[#1A1A2E]/65 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full border overflow-hidden p-6 space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-slate-900 text-sm font-heading">
                      Quick Adjust — {editingBiz.name}
                    </h3>
                    <button onClick={() => setEditingBiz(null)} className="text-gray-400 hover:text-[#1A1A2E] text-lg font-bold">X</button>
                  </div>

                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-600">Primary Contact Phone</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-600">Physical Address</label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-600">Operational Description</label>
                      <textarea
                        rows={4}
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full text-slate-800 text-xs p-3 rounded-lg border border-gray-300 focus:outline-none inline-block"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingBiz(null)}
                        className="px-4 py-2 border rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#FF5722] hover:bg-[#1A1A2E] text-white rounded-lg text-xs font-bold"
                      >
                        Save Updates
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* OWNER VIEW: REVIEWS */}
        {currentUser.role !== 'admin' && activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl border overflow-hidden shadow-xs">
            <div className="px-5 py-4 bg-slate-50 border-b flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#1A1A2E]">Customer Interactions Index</h3>
              <span className="text-[10px] text-slate-400 font-mono">Real-time update</span>
            </div>

            {myReviews.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {myReviews.map(rev => {
                  const targetBiz = businesses.find(b => b.id === rev.businessId);
                  return (
                    <div key={rev.id} className="p-5 space-y-2 text-xs sm:text-sm text-slate-800">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <img src={rev.userAvatar} className="w-8 h-8 rounded-full bg-slate-100" />
                          <div>
                            <span className="block font-bold text-slate-900 leading-none">{rev.userName}</span>
                            <span className="text-[10px] text-slate-400">posted on {targetBiz?.name || 'Local Outlet'}</span>
                          </div>
                        </div>
                        <StarRating rating={rev.rating} size={11} />
                      </div>
                      <p className="text-slate-600 bg-[#FAFAF8] p-3 rounded-lg font-sans italic leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 italic text-xs">
                No customer ratings recorded yet. Keep providing stellar services so community reviewers write their feedback!
              </div>
            )}
          </div>
        )}

        {/* SYSTEM ADMIN VIEW: APPROVALS */}
        {currentUser.role === 'admin' && activeTab === 'listings' && (
          <div className="bg-white rounded-2xl border overflow-hidden shadow-xs space-y-4">
            <div className="px-5 py-4 bg-slate-50 border-b flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A2E] font-heading">Incoming Submissions Verification Check</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Admin Sandbox authorization bypass</p>
              </div>
              <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold leading-none">
                {pendingBusinesses.length} pending
              </span>
            </div>

            {pendingBusinesses.length > 0 ? (
              <div className="divide-y divide-gray-100 pl-0">
                {pendingBusinesses.map((b) => (
                  <div key={b.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <img src={b.coverImage} className="w-16 h-11 rounded object-cover" />
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{b.name}</h4>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Submitted via Ile-Ife registry</span>
                        </div>
                      </div>
                      <div className="bg-slate-100 px-3 py-2 rounded text-xs text-slate-600 font-sans max-w-lg leading-relaxed">
                        <span className="font-bold text-[#1A1A2E] text-[10px] uppercase font-mono tracking-wide block mb-0.5">Catchy summary:</span>
                        "{b.description}"
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">
                        📞 Phone: {b.phone} | ✉ Email: {b.email} | Address: {b.address}
                      </p>
                    </div>

                    <div className="flex space-x-2 shrink-0 md:self-center self-end">
                      <button
                        onClick={() => rejectBusiness(b.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => approveBusiness(b.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 px-3 rounded-xl text-xs font-bold transition-transform hover:scale-103 flex items-center space-x-1 cursor-pointer shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Live</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-slate-400 col-span-3 space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-400" />
                <p className="text-xs font-bold text-slate-800">No Submissions Pending Review</p>
                <p className="text-[11px] text-slate-500 font-sans max-w-sm mx-auto">
                  Every business registry listing in Ile-Ife is currently active and approved. Try submitting a new business to watch it load here!
                </p>
              </div>
            )}
          </div>
        )}

        {/* SYSTEM ADMIN VIEW: CLAIMS */}
        {currentUser.role === 'admin' && activeTab === 'claims' && (
          <div className="bg-white rounded-2xl border overflow-hidden shadow-xs space-y-4">
            <div className="px-5 py-4 bg-slate-50 border-b flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A2E] font-heading">Incoming Business Claims Desk</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Admin authorization credentials verify</p>
              </div>
              <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold leading-none">
                {pendingClaims.length} requests
              </span>
            </div>

            {pendingClaims.length > 0 ? (
              <div className="divide-y divide-gray-100 pl-0">
                {pendingClaims.map((claim) => {
                  const targetBiz = businesses.find(b => b.id === claim.businessId);
                  return (
                    <div key={claim.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-mono tracking-widest bg-yellow-50 text-yellow-600 border border-yellow-200 uppercase font-black">
                          Review Verification Claim
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-tight mt-1">
                          Claim Request on: <span className="text-[#FF5722] font-mono">{targetBiz?.name || 'Local Outlet'}</span>
                        </h4>
                        <p className="text-xs text-slate-500 font-sans leading-relaxed">
                          Submitted by User ID: <span className="font-mono bg-slate-100 py-0.5 px-1 rounded text-[11px] font-semibold text-[#1A1A2E]">{claim.userId}</span> at {new Date(claim.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex space-x-2 shrink-0 md:self-center self-end">
                        <button
                          onClick={() => rejectClaim(claim.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject Claim</span>
                        </button>
                        <button
                          onClick={() => approveClaim(claim.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 px-3 rounded-xl text-xs font-bold transition-transform hover:scale-103 flex items-center space-x-1 cursor-pointer shadow-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>Assign Ownership</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-16 text-center text-slate-400 col-span-3 space-y-2">
                <BookmarkCheck className="w-8 h-8 mx-auto text-indigo-400" />
                <p className="text-xs font-bold text-slate-800">No Business Claims Pending Review</p>
                <p className="text-[11px] text-slate-500 font-sans max-w-sm mx-auto">
                  All outlet verification credentials are clean of outstanding claims. Feel free to claim any seed business in the profile sidebar to check this widget logic!
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
