import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CalculatorCard } from './components/CalculatorCard';
import { CalculatorDetail } from './components/CalculatorDetail';
import { CategoryView } from './components/CategoryView';
import { NotFoundView } from './components/NotFoundView';
import { SearchModal } from './components/SearchModal';
import { MyFilesDrawer } from './components/MyFilesDrawer';
import { AiSuiteView } from './components/AiSuiteView';
import { HeroSection } from './components/HeroSection';
import { SeoInspectorModal } from './components/SeoInspectorModal';
import { AuthModal } from './components/AuthModal';
import { LegalPagesModal, LegalTab } from './components/LegalPagesModal';
import { updateDocumentSeo } from './lib/seo-service';
import { getCanonicalUrl } from './lib/seo-config';
import { useRouter } from './lib/router';
import {
  ALL_CALCULATORS,
  CATEGORIES,
  getCalculatorById,
  getCalculatorsByCategory,
  getCategoryById,
} from './lib/calculators-data';
import { Calculator, SavedCalculation, UserProfile } from './types';
import {
  Sparkles,
  TrendingUp,
  Grid,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Search,
  Code2,
  Globe,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Flame,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  const { route, pathname, navigate } = useRouter();

  // Filter & Search states for the homepage directory grid
  const [selectedHomeCategory, setSelectedHomeCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [gridSearchQuery, setGridSearchQuery] = useState<string>('');

  // Drawers & Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilesDrawerOpen, setIsFilesDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGlobalSeoModalOpen, setIsGlobalSeoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacy');

  const handleOpenLegal = (tab: LegalTab) => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // User Profile State (Persisted)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('nsc_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('nsc_current_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('nsc_current_user');
    } catch (e) {
      console.error(e);
    }
  };

  // Saved Calculations State
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>(() => {
    try {
      const stored = localStorage.getItem('nsc_saved_calculations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nsc_saved_calculations', JSON.stringify(savedCalculations));
    } catch (e) {
      console.error(e);
    }
  }, [savedCalculations]);

  // Global Homepage & View SEO Management
  useEffect(() => {
    if (route.type === 'home') {
      const homeCanonical = getCanonicalUrl('/');
      updateDocumentSeo({
        title: 'Free Online Calculators – Flames Calculator',
        description: 'Use free online calculators for finance, math, health, everyday calculations and more. Fast, simple, and easy-to-use precision calculator tools on Flames Calculator.',
        canonicalUrl: homeCanonical,
        schemaJson: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': `${homeCanonical}#website`,
              url: homeCanonical,
              name: 'Flames Calculator',
              description: 'Free online calculation platform with verified financial, health, scientific, and math calculators.',
              publisher: {
                '@type': 'Organization',
                '@id': `${homeCanonical}#org`,
                name: 'Flames Calculator',
                url: homeCanonical,
                logo: `${homeCanonical}icon.png`,
              },
            },
            {
              '@type': 'WebApplication',
              '@id': `${homeCanonical}#app`,
              name: 'Flames Calculator',
              url: homeCanonical,
              description: 'Free online calculation platform with verified financial, health, scientific, and math calculators.',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'All Modern Browsers',
              offers: {
                '@type': 'Offer',
                price: '0.00',
                priceCurrency: 'USD',
              },
            },
            {
              '@type': 'Organization',
              '@id': `${homeCanonical}#org`,
              name: 'Flames Calculator',
              url: homeCanonical,
              logo: `${homeCanonical}icon.png`,
            },
          ],
        },
      });
    } else if (route.type === 'ai-suite') {
      updateDocumentSeo({
        title: 'Gemini AI Financial & Strategic Suite – Flames Calculator',
        description: 'Run neural scenario modeling, debt payoff comparisons, and health biometrics optimization powered by Google Gemini on Flames Calculator.',
        canonicalUrl: getCanonicalUrl('/ai-suite/'),
      });
    }
  }, [route.type]);

  // Global Keyboard Shortcut for Search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectCalculator = (calcId: string) => {
    navigate(`/calculators/${calcId}/`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string, calcId?: string) => {
    if (view === 'my-files') {
      setIsFilesDrawerOpen(true);
      return;
    }
    if (view === 'calculator' && calcId) {
      navigate(`/calculators/${calcId}/`);
    } else if (view === 'ai-suite') {
      navigate('/ai-suite/');
    } else if (view === 'all') {
      navigate('/');
      setSelectedHomeCategory('all');
      setVisibleCount(24);
      setGridSearchQuery('');
      const el = document.getElementById('calculators-grid-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setVisibleCount(24);
      setGridSearchQuery('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveCalculation = (calc: SavedCalculation) => {
    setSavedCalculations((prev) => [calc, ...prev.filter((c) => c.id !== calc.id)]);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedCalculations((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearAllSaved = () => {
    setSavedCalculations([]);
  };

  // Derive current active view string for Header
  const headerCurrentView =
    route.type === 'calculator'
      ? 'calculator'
      : route.type === 'category'
      ? 'category'
      : route.type === 'ai-suite'
      ? 'ai-suite'
      : 'home';

  // Active Category & Filtered Tools for Directory View on Home
  const activeCategoryInfo = CATEGORIES.find((c) => c.id === selectedHomeCategory);
  const currentCategoryTools =
    selectedHomeCategory === 'all'
      ? ALL_CALCULATORS
      : getCalculatorsByCategory(selectedHomeCategory);

  const filteredGridTools = gridSearchQuery.trim()
    ? currentCategoryTools.filter(
        (c) =>
          c.title.toLowerCase().includes(gridSearchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(gridSearchQuery.toLowerCase()) ||
          c.categoryName.toLowerCase().includes(gridSearchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(gridSearchQuery.toLowerCase())
      )
    : currentCategoryTools;

  const visibleTools = filteredGridTools.slice(0, visibleCount);
  const totalToolsCount = filteredGridTools.length;
  const hasMoreTools = visibleCount < totalToolsCount;

  // Selected calculator for SEO modal
  const selectedCalculator =
    route.type === 'calculator'
      ? getCalculatorById(route.slug) || ALL_CALCULATORS[0]
      : ALL_CALCULATORS[0];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentView={headerCurrentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        savedCount={savedCalculations.length}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSeoInspector={() => setIsGlobalSeoModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <div className="flex flex-1">
        {/* Dark Sidebar */}
        <Sidebar
          currentCategory={
            route.type === 'category'
              ? route.categoryId
              : route.type === 'ai-suite'
              ? 'ai-suite'
              : selectedHomeCategory
          }
          onSelectCategory={(catId) => {
            if (catId === 'all') {
              navigate('/');
              setSelectedHomeCategory('all');
            } else if (catId === 'ai-suite') {
              navigate('/ai-suite/');
            } else {
              navigate(`/category/${catId}/`);
            }
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSelectCalculator={(calcId) => {
            handleSelectCalculator(calcId);
            setIsSidebarOpen(false);
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8 bg-slate-50">
          {/* CALCULATOR DETAIL VIEW */}
          {route.type === 'calculator' ? (
            (() => {
              const calc = getCalculatorById(route.slug);
              if (!calc) {
                return <NotFoundView />;
              }
              return (
                <CalculatorDetail
                  calculator={calc}
                  onBack={() => navigate('/')}
                  onSelectCalculator={handleSelectCalculator}
                  onSaveCalculation={handleSaveCalculation}
                />
              );
            })()
          ) : route.type === 'category' ? (
            (() => {
              const category = getCategoryById(route.categoryId);
              if (!category) {
                return <NotFoundView />;
              }
              return (
                <CategoryView
                  categoryId={route.categoryId}
                  onSelectCalculator={handleSelectCalculator}
                />
              );
            })()
          ) : route.type === 'ai-suite' ? (
            /* AI SUITE VIEW */
            <AiSuiteView onSelectCalculator={handleSelectCalculator} />
          ) : route.type === 'not-found' ? (
            /* 404 VIEW */
            <NotFoundView />
          ) : (
            /* HOMEPAGE / DIRECTORY VIEW */
            <div className="mx-auto max-w-7xl space-y-10 pb-16">
              {/* Premium Hero Section */}
              <HeroSection
                onOpenSearch={() => setIsSearchOpen(true)}
                onSelectCalculator={handleSelectCalculator}
                onSelectCategory={(catId) => {
                  if (catId === 'all') {
                    setSelectedHomeCategory('all');
                    setVisibleCount(24);
                    setGridSearchQuery('');
                  } else if (catId === 'ai-suite') {
                    navigate('/ai-suite/');
                  } else {
                    navigate(`/category/${catId}/`);
                  }
                }}
              />

              {/* Calculators Directory Section with Step-by-Step 24 Loading */}
              <div id="calculators-grid-section" className="space-y-6">
                {/* Category Filter Pills & Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <button
                      onClick={() => {
                        setSelectedHomeCategory('all');
                        setVisibleCount(24);
                        setGridSearchQuery('');
                      }}
                      className={`rounded-xl px-4 py-2 text-xs font-semibold transition shrink-0 cursor-pointer ${
                        selectedHomeCategory === 'all'
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300'
                      }`}
                    >
                      All Categories ({ALL_CALCULATORS.length})
                    </button>

                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          if (cat.id === 'ai-suite') {
                            navigate('/ai-suite/');
                          } else {
                            navigate(`/category/${cat.id}/`);
                          }
                        }}
                        className={`rounded-xl px-4 py-2 text-xs font-semibold transition shrink-0 cursor-pointer ${
                          selectedHomeCategory === cat.id
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300'
                        }`}
                      >
                        {cat.name} ({cat.count})
                      </button>
                    ))}
                  </div>

                  {/* Quick Filter Input */}
                  <div className="relative shrink-0 min-w-[240px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={`Filter ${selectedHomeCategory === 'all' ? ALL_CALCULATORS.length : activeCategoryInfo?.count || ''} tools...`}
                      value={gridSearchQuery}
                      onChange={(e) => {
                        setGridSearchQuery(e.target.value);
                        setVisibleCount(24);
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-2xs"
                    />
                    {gridSearchQuery && (
                      <button
                        onClick={() => setGridSearchQuery('')}
                        className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Section Header: Title, Description & Step Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        {selectedHomeCategory === 'all'
                          ? 'All Calculation Engines'
                          : activeCategoryInfo?.name || 'Calculators'}
                      </h2>
                      <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700 border border-orange-200/80">
                        {totalToolsCount} Tools
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {selectedHomeCategory === 'all'
                        ? 'Institutional-grade calculators displayed in clean 24-tool increments. Click "View More Tools" to step through.'
                        : activeCategoryInfo?.description}
                    </p>
                  </div>

                  {/* Showing X of Y count badge */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 self-start sm:self-auto">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 border border-slate-200">
                      Showing <span className="text-orange-600 font-bold">{Math.min(visibleCount, totalToolsCount)}</span> of{' '}
                      <span className="text-slate-900 font-bold">{totalToolsCount}</span>
                    </span>
                  </div>
                </div>

                {/* Tool Card Grid (24 tools initially) */}
                {visibleTools.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {visibleTools.map((calculator) => (
                      <CalculatorCard
                        key={calculator.id}
                        calculator={calculator}
                        onClick={() => handleSelectCalculator(calculator.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                    <SlidersHorizontal className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <h3 className="text-sm font-bold text-slate-700">No calculators match "{gridSearchQuery}"</h3>
                    <p className="text-xs text-slate-500 mt-1">Try a different search keyword or category filter.</p>
                    <button
                      onClick={() => setGridSearchQuery('')}
                      className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500 cursor-pointer"
                    >
                      Clear Filter
                    </button>
                  </div>
                )}

                {/* View More Tools (Step by step: +24) */}
                {totalToolsCount > 24 && (
                  <div className="mt-8 flex flex-col items-center justify-center space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                    {/* Visual Progress Bar */}
                    <div className="w-full max-w-md space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>
                          Displaying {Math.min(visibleCount, totalToolsCount)} of {totalToolsCount} tools
                        </span>
                        <span className="text-orange-600 font-bold">
                          {Math.round((Math.min(visibleCount, totalToolsCount) / totalToolsCount) * 100)}% Loaded
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
                          style={{
                            width: `${Math.min(100, (visibleCount / totalToolsCount) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons: View More +24 & Show All */}
                    {hasMoreTools ? (
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => setVisibleCount((prev) => prev + 24)}
                          className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-500 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group"
                        >
                          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
                          <span>View More Tools (+24)</span>
                          <span className="rounded-md bg-orange-700/70 px-2 py-0.5 text-[10px] text-orange-100 font-mono">
                            {totalToolsCount - visibleCount} remaining
                          </span>
                        </button>

                        <button
                          onClick={() => setVisibleCount(totalToolsCount)}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
                        >
                          <span>Show All ({totalToolsCount})</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>All {totalToolsCount} calculation engines displayed</span>
                        </div>
                        <span className="text-slate-300 hidden sm:inline">•</span>
                        <button
                          onClick={() => {
                            setVisibleCount(24);
                            const el = document.getElementById('calculators-grid-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                          <span>Collapse to First 24</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer id="app-footer" className="bg-white border-t border-slate-200 py-6 px-4 lg:px-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Side: Copyright Lines */}
          <div id="footer-left-copyright" className="flex flex-col space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-600 text-white shadow-2xs">
                <Flame className="h-3.5 w-3.5 fill-white" />
              </div>
              <span className="font-bold text-slate-800 text-sm">
                © {new Date().getFullYear()} Flames Calculator. All rights reserved.
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-lg">
              Precision verified computational engines across {ALL_CALCULATORS.length} disciplines including finance, health, engineering, science, conversion, and mathematics.
            </p>
          </div>

          {/* Right Side: AdSense Legal & Policy Pages */}
          <div id="footer-right-links" className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
            <button
              id="footer-privacy-policy-link"
              onClick={() => handleOpenLegal('privacy')}
              className="hover:text-orange-600 transition cursor-pointer"
            >
              Privacy Policy
            </button>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <button
              id="footer-terms-conditions-link"
              onClick={() => handleOpenLegal('terms')}
              className="hover:text-orange-600 transition cursor-pointer"
            >
              Terms & Conditions
            </button>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <button
              id="footer-contact-us-link"
              onClick={() => handleOpenLegal('contact')}
              className="hover:text-orange-600 transition cursor-pointer"
            >
              Contact Us
            </button>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <button
              id="footer-disclaimer-link"
              onClick={() => handleOpenLegal('disclaimer')}
              className="hover:text-orange-600 transition cursor-pointer"
            >
              Disclaimer
            </button>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <button
              id="footer-about-us-link"
              onClick={() => handleOpenLegal('about')}
              className="hover:text-orange-600 transition cursor-pointer"
            >
              About Us
            </button>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <button
              id="footer-seo-schema-link"
              onClick={() => setIsGlobalSeoModalOpen(true)}
              className="flex items-center gap-1 hover:text-orange-600 transition cursor-pointer text-slate-500 font-normal"
            >
              <Code2 className="h-3.5 w-3.5 text-orange-600" />
              <span>Sitemap</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCalculator={handleSelectCalculator}
      />

      {/* My Files Drawer */}
      <MyFilesDrawer
        isOpen={isFilesDrawerOpen}
        onClose={() => setIsFilesDrawerOpen(false)}
        savedCalculations={savedCalculations}
        onSelectSaved={(saved) => {
          handleSelectCalculator(saved.calculatorId);
        }}
        onDeleteSaved={handleDeleteSaved}
        onClearAll={handleClearAllSaved}
      />

      {/* Global SEO & Schema Inspector */}
      <SeoInspectorModal
        isOpen={isGlobalSeoModalOpen}
        onClose={() => setIsGlobalSeoModalOpen(false)}
        calculator={selectedCalculator}
      />

      {/* Sign In & Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Google AdSense & Legal Pages Modal */}
      <LegalPagesModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
}
