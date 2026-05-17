import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVycinty } from '../store/state';
import { UserPlus, Mail, Lock, User, Check, Building } from 'lucide-react';
import { motion } from 'motion/react';

export const SignupPage: React.FC = () => {
  const { signup } = useVycinty();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    const designatedRole = isOwner ? 'owner' : 'user';

    setTimeout(async () => {
      await signup(fullName, email, designatedRole);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate(designatedRole === 'owner' ? '/register-business' : '/');
      }, 1500);
    }, 800);
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-16 flex items-center justify-center font-sans">
      <div className="max-w-md w-full px-4 space-y-6">
        
        {/* Top Branding Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-black text-[#1A1A2E] font-heading decoration-none">
            <span className="w-8 h-8 bg-linear-to-tr from-[#FF5722] to-orange-400 rounded flex items-center justify-center text-white text-sm">V</span>
            <span>Vycinty<span className="text-[#FF5722]">.</span></span>
          </Link>
          <h2 className="text-xl font-extrabold tracking-tight text-[#1A1A2E] font-heading">
            Create your account
          </h2>
          <p className="text-slate-500 text-xs">
            Join the Vycinty discovery directory in Nigeria.
          </p>
        </div>

        {/* Form panel Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs">
          
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200">
                <Check className="w-6 h-6" />
              </div>
              <p className="font-bold text-[#1A1A2E] text-base font-heading">Registration Successful!</p>
              <p className="text-slate-500 text-xs">Singing you in and redirecting your console...</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Segun Ogunlade"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-slate-800 text-xs sm:text-sm p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="segun@oauife.edu.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-slate-800 text-xs sm:text-sm p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-slate-800 text-xs sm:text-sm p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-slate-800 text-xs sm:text-sm p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Is Owner checkbox */}
              <div className="pt-2">
                <label className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-orange-50 border border-orange-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOwner}
                    onChange={(e) => setIsOwner(e.target.checked)}
                    className="accent-[#FF5722] mt-0.5 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="block text-xs font-bold text-orange-950 flex items-center">
                      <Building className="w-3.5 h-3.5 mr-1" /> I want to lists / register my business
                    </span>
                    <span className="block text-[10px] text-orange-850 mt-0.5">
                      Check this option if you are a local restaurant manager, gadget shop owner, tailors, or hotel director.
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1A2E] hover:bg-[#FF5722] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
              </button>
            </form>
          )}
        </div>

        <div className="text-center text-xs text-slate-500">
          <span>Already have an account? </span>
          <Link to="/auth/login" className="text-[#FF5722] font-semibold hover:underline decoration-none">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
