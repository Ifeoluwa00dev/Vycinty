import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Category, Business, Review, BusinessClaim } from '../types';
import { SEED_CATEGORIES, SEED_BUSINESSES, SEED_REVIEWS } from '../data';

interface VycintyContextType {
  currentUser: User | null;
  categories: Category[];
  businesses: Business[];
  reviews: Review[];
  claims: BusinessClaim[];
  login: (email: string, role?: 'user' | 'owner' | 'admin', name?: string) => Promise<boolean>;
  signup: (fullName: string, email: string, role: 'user' | 'owner') => Promise<boolean>;
  logout: () => void;
  addBusiness: (business: Omit<Business, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'isVerified' | 'isFeatured'>) => Business;
  updateBusiness: (business: Business) => void;
  approveBusiness: (id: string) => void;
  rejectBusiness: (id: string) => void;
  addReview: (businessId: string, rating: number, comment: string) => void;
  claimBusiness: (businessId: string) => void;
  approveClaim: (claimId: string) => void;
  rejectClaim: (claimId: string) => void;
}

const VycintyContext = createContext<VycintyContextType | undefined>(undefined);

export const VycintyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vycinty_user');
    if (saved) return JSON.parse(saved);
    // Standard mock user for quick previewing at start
    return {
      id: 'u-default',
      fullName: 'Ife Shonibare',
      email: 'ife@oauife.edu.ng',
      role: 'owner', // Default role for demonstration
      createdAt: new Date().toISOString()
    };
  });

  const [categories] = useState<Category[]>(SEED_CATEGORIES);

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('vycinty_businesses');
    if (saved) return JSON.parse(saved);
    return SEED_BUSINESSES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('vycinty_reviews');
    if (saved) return JSON.parse(saved);
    return SEED_REVIEWS;
  });

  const [claims, setClaims] = useState<BusinessClaim[]>(() => {
    const saved = localStorage.getItem('vycinty_claims');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('vycinty_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('vycinty_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('vycinty_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('vycinty_claims', JSON.stringify(claims));
  }, [claims]);

  const login = async (email: string, role?: 'user' | 'owner' | 'admin', name?: string): Promise<boolean> => {
    const defaultName = name || (email.split('@')[0] || 'User');
    const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
    
    // Choose role based on input or guess
    const selectedRole = role || (email.includes('owner') ? 'owner' : email.includes('admin') ? 'admin' : 'user');
    
    const user: User = {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      fullName: formattedName,
      email: email,
      role: selectedRole,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(user);
    return true;
  };

  const signup = async (fullName: string, email: string, role: 'user' | 'owner'): Promise<boolean> => {
    const user: User = {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      fullName: fullName,
      email: email,
      role: role,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(user);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addBusiness = (businessData: Omit<Business, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'isVerified' | 'isFeatured'>) => {
    const newBiz: Business = {
      ...businessData,
      id: 'biz-' + Math.random().toString(36).substring(2, 9),
      status: 'pending', // Starts as pending until approved by admin
      isVerified: false,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setBusinesses(prev => [newBiz, ...prev]);
    return newBiz;
  };

  const updateBusiness = (updatedBiz: Business) => {
    setBusinesses(prev => prev.map(b => b.id === updatedBiz.id ? { ...updatedBiz, updatedAt: new Date().toISOString() } : b));
  };

  const approveBusiness = (id: string) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: 'active', isVerified: true } : b));
  };

  const rejectBusiness = (id: string) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
  };

  const addReview = (businessId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const newReview: Review = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      businessId,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userAvatar: currentUser.avatarUrl || `https://api.dicebear.com/7.x/beta-genders/svg?seed=${currentUser.fullName}`,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const claimBusiness = (businessId: string) => {
    if (!currentUser) return;
    
    // Check if already claimed
    const alreadyClaimed = claims.some(c => c.businessId === businessId && c.userId === currentUser.id);
    if (alreadyClaimed) return;

    const newClaim: BusinessClaim = {
      id: 'claim-' + Math.random().toString(36).substring(2, 9),
      businessId,
      userId: currentUser.id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setClaims(prev => [newClaim, ...prev]);
  };

  const approveClaim = (claimId: string) => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;

    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'approved' } : c));
    setBusinesses(prev => prev.map(b => b.id === claim.businessId ? { ...b, ownerId: claim.userId, isVerified: true } : b));
  };

  const rejectClaim = (claimId: string) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'rejected' } : c));
  };

  return (
    <VycintyContext.Provider value={{
      currentUser,
      categories,
      businesses,
      reviews,
      claims,
      login,
      signup,
      logout,
      addBusiness,
      updateBusiness,
      approveBusiness,
      rejectBusiness,
      addReview,
      claimBusiness,
      approveClaim,
      rejectClaim
    }}>
      {children}
    </VycintyContext.Provider>
  );
};

export const useVycinty = () => {
  const context = useContext(VycintyContext);
  if (!context) {
    throw new Error('useVycinty must be used within a VycintyProvider');
  }
  return context;
};
