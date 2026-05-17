import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVycinty } from '../store/state';
import { ShieldAlert, LogIn, Mail, Lock, User, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginPage: React.FC = () => {
  const { login, currentUser } = useVycinty();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'owner' | 'admin'>('user');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate minor delay
    setTimeout(async () => {
      await login(email, role);
      setLoading(false);
      navigate(role === 'owner' || role === 'admin' ? '/dashboard' : '/');
    }, 700);
  };

  const handleSandboxLogin = async (sandboxRole: 'user' | 'owner' | 'admin') => {
    setLoading(true);
    let sandboxEmail = 'student@oauife.edu.ng';
    let sandboxName = 'Ife Shonibare';
    if (sandboxRole === 'owner') {
      sandboxEmail = 'owner@hillsidesuites.com';
      sandboxName = 'Chief Adeleke (Owner)';
    } else if (sandboxRole === 'admin') {
      sandboxEmail = 'admin@vycinty.ng';
      sandboxName = 'Admin Controller';
    }

    setTimeout(async () => {
      await login(sandboxEmail, sandboxRole, sandboxName);
      setLoading(false);
      navigate(sandboxRole === 'owner' || sandboxRole === 'admin' ? '/dashboard' : '/');
    }, 400);
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-16 flex items-center justify-center font-sans">
      <div className="max-w-md w-full px-4 space-y-6">
        
        {/* Top Header details */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-black text-[#1A1A2E] font-heading decoration-none">
            <span className="w-8 h-8 bg-linear-to-tr from-[#FF5722] to-orange-400 rounded flex items-center justify-center text-white text-sm">V</span>
            <span>Vycinty<span className="text-[#FF5722]">.</span></span>
          </Link>
          <h2 className="text-xl font-extrabold tracking-tight text-[#1A1A2E] font-heading">
            Sign in to your account
          </h2>
          <p className="text-slate-500 text-xs">
            Read and publish local reviews or register your own business.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs space-y-6">
          
          {/* Quick sandbox logins */}
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-2.5">
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5722] fill-current" /> Instant Sandbox Profiler
            </p>
            <p className="text-[10px] text-slate-400">
              Click any profile below to instantly log in with preloaded permissions! Perfect for quick reviews:
            </p>
            
            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleSandboxLogin('user')}
                className="w-full flex justify-between items-center bg-white hover:bg-orange-50 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer text-[#1A1A2E] hover:text-[#FF5722] transition-colors"
              >
                <span>👤 OAU Student (User)</span>
                <span className="text-[10px] font-mono font-normal text-slate-400">student@oauife.edu.ng</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleSandboxLogin('owner')}
                className="w-full flex justify-between items-center bg-white hover:bg-orange-50 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer text-[#1A1A2E] hover:text-[#FF5722] transition-colors"
              >
                <span>🏨 Business Owner (Owner)</span>
                <span className="text-[10px] font-mono font-normal text-slate-400">owner@hillsidesuites.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleSandboxLogin('admin')}
                className="w-full flex justify-between items-center bg-white hover:bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer text-indigo-700 transition-colors"
              >
                <span>🛡️ Platform Controller (Admin)</span>
                <span className="text-[10px] font-mono font-normal text-indigo-400">admin@vycinty.ng</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400 font-mono uppercase text-[9px] tracking-widest font-bold">Or use custom email</span></div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@oauife.edu.ng"
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
              <div className="text-right">
                <span className="text-[10px] text-slate-400 hover:text-[#FF5722] cursor-pointer">Forgot password?</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700">Desired Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`text-xs py-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                    role === 'user'
                      ? 'border-[#FF5722] bg-[#FF5722] text-white'
                      : 'border-gray-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Standard User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`text-xs py-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                    role === 'owner'
                      ? 'border-[#FF5722] bg-[#FF5722] text-white'
                      : 'border-gray-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Business Owner
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A2E] hover:bg-[#FF5722] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500">
          <span>New to Vycinty? </span>
          <Link to="/auth/signup" className="text-[#FF5722] font-semibold hover:underline decoration-none">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
