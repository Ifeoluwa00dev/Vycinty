import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVycinty } from '../../store/state';
import { LogIn, LogOut, Shield, ChevronDown, User, PlusCircle, Building, Search, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout, login } = useVycinty();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setMobileMenuOpen(false);
    }
  };

  const handleRoleSwitch = async (role: 'user' | 'owner' | 'admin') => {
    let email = 'student@oauife.edu.ng';
    let name = 'Ife Shonibare';
    if (role === 'owner') {
      email = 'owner@hillsidesuites.com';
      name = 'Chief Adeleke (Owner)';
    } else if (role === 'admin') {
      email = 'admin@vycinty.ng';
      name = 'Admin Controller';
    }
    await login(email, role, name);
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E5E7EB] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand ID */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 decoration-none select-none">
              <span className="w-9 h-9 bg-linear-to-tr from-[#FF5722] to-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                V
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-[#1A1A2E] font-heading flex items-center">
                Vycinty
                <span className="text-[#FF5722] text-3xl leading-none">.</span>
              </span>
            </Link>
          </div>

          {/* Center Search bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search restaurants, hotels, gadgets in Ile-Ife..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-[#FAFAF8] text-[#1A1A2E] text-sm py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5722] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-6 text-[#1A1A2E] font-medium text-sm">
            <Link to="/" className="hover:text-[#FF5722] transition-colors decoration-none">Home</Link>
            <Link to="/register-business" className="flex items-center space-x-1 hover:text-[#FF5722] transition-colors decoration-none">
              <PlusCircle className="w-4 h-4 text-[#FF5722]" />
              <span>Add Business</span>
            </Link>
            
            {/* Quick role switch instructions and status */}
            <div className="h-6 w-[1px] bg-gray-200"></div>

            {/* User Area */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer select-none"
                >
                  <img
                    src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/beta-genders/svg?seed=${currentUser.fullName}`}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full bg-orange-100 object-cover"
                  />
                  <span className="text-[#1A1A2E] text-xs font-semibold max-w-[120px] truncate">
                    {currentUser.fullName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#6B7280]" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-1 text-sm font-normal text-[#1A1A2E] overflow-hidden animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-xs text-[#6B7280]">Logged in as</p>
                      <p className="font-semibold text-[#1A1A2E] truncate text-xs">{currentUser.email}</p>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-[#FF5722] uppercase tracking-wider font-mono">
                          {currentUser.role} View
                        </span>
                      </div>
                    </div>

                    {/* Navigation Options */}
                    {currentUser.role === 'owner' && (
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 hover:bg-orange-50/50 text-[#1A1A2E] hover:text-[#FF5722] transition-colors decoration-none text-xs font-medium"
                      >
                        <Building className="w-4 h-4 mr-2" />
                        Owner Dashboard
                      </Link>
                    )}

                    {currentUser.role === 'admin' && (
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 hover:bg-indigo-50/50 text-indigo-700 font-medium transition-colors decoration-none text-xs"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Approval Panel
                      </Link>
                    )}

                    {/* Simulated account switcher */}
                    <div className="border-t border-gray-100 my-1 bg-gray-50/30 px-3 py-1.5">
                      <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider font-mono mb-1">
                        Simulate Role Sandbox
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => handleRoleSwitch('user')}
                          className={`text-[10px] py-1 rounded font-semibold transition-all cursor-pointer ${
                            currentUser.role === 'user' ? 'bg-[#FF5722] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          User
                        </button>
                        <button
                          onClick={() => handleRoleSwitch('owner')}
                          className={`text-[10px] py-1 rounded font-semibold transition-all cursor-pointer ${
                            currentUser.role === 'owner' ? 'bg-[#FF5722] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Owner
                        </button>
                        <button
                          onClick={() => handleRoleSwitch('admin')}
                          className={`text-[10px] py-1 rounded font-semibold transition-all cursor-pointer ${
                            currentUser.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full text-left flex items-center px-4 py-2 hover:bg-red-50 text-red-600 transition-colors border-t border-gray-100 cursor-pointer text-xs"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login" className="text-[#1A1A2E] hover:text-[#FF5722] transition-colors decoration-none font-medium">
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="bg-[#1A1A2E] hover:bg-[#FF5722] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs hover:shadow-sm transition-all decoration-none"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#1A1A2E] p-1.5 focus:outline-none focus:ring-1 focus:ring-[#FF5722] rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white py-4 px-4 shadow-inner space-y-4 animate-fade-in">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search business names, categories..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-[#FAFAF8] text-[#1A1A2E] text-sm py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:border-[#FF5722]"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Main Nav */}
          <div className="flex flex-col space-y-3 font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#1A1A2E] hover:text-[#FF5722] decoration-none"
            >
              Home
            </Link>
            <Link
              to="/register-business"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#1A1A2E] flex items-center space-x-1.5 hover:text-[#FF5722] decoration-none"
            >
              <PlusCircle className="w-4 h-4 text-[#FF5722]" />
              <span>Register a Business</span>
            </Link>
            
            {currentUser && currentUser.role === 'owner' && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#1A1A2E] flex items-center space-x-1.5 hover:text-[#FF5722] decoration-none"
              >
                <Building className="w-4 h-4" />
                <span>Owner Dashboard</span>
              </Link>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-indigo-600 flex items-center space-x-1.5 font-bold decoration-none"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Approval Panel</span>
              </Link>
            )}
          </div>

          <div className="border-t border-gray-100 pt-3">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-lg">
                  <img
                    src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/beta-genders/svg?seed=${currentUser.fullName}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover bg-orange-100"
                  />
                  <div>
                    <p className="font-semibold text-[#1A1A2E] text-xs leading-none">{currentUser.fullName}</p>
                    <p className="text-[10px] text-[#6B7280] truncate mt-0.5">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[8px] font-bold bg-orange-100 text-[#FF5722] uppercase tracking-wider font-mono">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                {/* Sandbox roles switchers for mobile */}
                <div>
                  <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-1">
                    Simulate Role (Mobile)
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => { handleRoleSwitch('user'); setMobileMenuOpen(false); }}
                      className={`text-[10px] py-1 rounded font-semibold ${
                        currentUser.role === 'user' ? 'bg-[#FF5722] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      User
                    </button>
                    <button
                      onClick={() => { handleRoleSwitch('owner'); setMobileMenuOpen(false); }}
                      className={`text-[10px] py-1 rounded font-semibold ${
                        currentUser.role === 'owner' ? 'bg-[#FF5722] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Owner
                    </button>
                    <button
                      onClick={() => { handleRoleSwitch('admin'); setMobileMenuOpen(false); }}
                      className={`text-[10px] py-1 rounded font-semibold ${
                        currentUser.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-[#1A1A2E] font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 decoration-none"
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 bg-[#FF5722] text-white font-semibold rounded-lg hover:bg-orange-600 decoration-none"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
