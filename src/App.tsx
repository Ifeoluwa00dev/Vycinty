import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { VycintyProvider } from './store/state';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';

// Page Imports
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { BusinessPage } from './pages/BusinessPage';
import { RegisterBusinessPage } from './pages/RegisterBusinessPage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';

// 404 Page Component
const NotFound: React.FC = () => (
  <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
    <div className="text-4xl">🌵</div>
    <h2 className="text-xl font-bold text-slate-800">404 - Page Not Found</h2>
    <p className="text-slate-500 text-xs font-sans">The directory coordinate you requested doesn't exist in Ile-Ife yet.</p>
    <a href="#/" className="inline-block bg-[#FF5722] text-white px-5 py-2.5 rounded-lg text-xs font-bold decoration-none">
      Go back Home
    </a>
  </div>
);

export default function App() {
  return (
    <VycintyProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#FAFAF8] text-[#1A1A2E] font-sans">
          
          {/* Universal Header Navbar */}
          <Navbar />

          {/* Dynamic Content Main container */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/business/:id" element={<BusinessPage />} />
              <Route path="/register-business" element={<RegisterBusinessPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Universal Site Footer */}
          <Footer />

        </div>
      </HashRouter>
    </VycintyProvider>
  );
}
