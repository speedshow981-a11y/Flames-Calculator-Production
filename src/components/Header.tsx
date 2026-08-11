import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  FolderArchive,
  Layers,
  Zap,
  Menu,
  Code2,
  Flame,
  LogIn,
  User,
  ChevronDown,
  LogOut,
  Shield,
  Search,
} from 'lucide-react';
import { UserProfile } from '../types';
import { Link } from '../lib/router';
import { ALL_CALCULATORS } from '../lib/calculators-data';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, calcId?: string) => void;
  onOpenSearch: () => void;
  savedCount: number;
  onToggleSidebar: () => void;
  onOpenSeoInspector?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  savedCount,
  onToggleSidebar,
  onOpenSeoInspector,
  currentUser,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-6 lg:px-8 shadow-xs">
      {/* Left: Mobile Toggle + Logo + Nav Links */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand Header Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2.5 group cursor-pointer focus:outline-none"
          title="Flames Calculator — Home"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
            <Flame className="h-5 w-5 sm:h-6 sm:w-6 fill-white" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center space-x-1">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                Flames
              </span>
              <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-500">
                Calculator
              </span>
              <span className="hidden sm:inline-block rounded-md bg-orange-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-orange-700 border border-orange-200/60">
                AI
              </span>
            </div>
            <span className="hidden md:block text-[10px] text-slate-400 font-medium -mt-1 tracking-tight">
              {ALL_CALCULATORS.length} Precision Engines
            </span>
          </div>
        </Link>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex space-x-5 text-sm font-medium text-slate-500 pl-4 border-l border-slate-200">
          <Link
            href="/"
            className={`h-16 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'text-orange-600 border-b-2 border-orange-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Zap className="h-4 w-4 text-orange-500" />
            <span>Quick Start</span>
          </Link>

          <Link
            href="/category/finance/"
            className={`h-16 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              currentView === 'all' || currentView === 'category'
                ? 'text-orange-600 border-b-2 border-orange-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Layers className="h-4 w-4 text-slate-400" />
            <span>All Calculators</span>
            <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-semibold">
              {ALL_CALCULATORS.length}
            </span>
          </Link>

          <button
            onClick={() => onNavigate('my-files')}
            className={`h-16 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              currentView === 'my-files'
                ? 'text-orange-600 border-b-2 border-orange-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <FolderArchive className="h-4 w-4 text-emerald-600" />
            <span>My Files</span>
            {savedCount > 0 && (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Right: Search, and Sign In / User Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Search Shortcut Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer shadow-2xs"
          title={`Search all ${ALL_CALCULATORS.length} calculators (Cmd+K)`}
        >
          <Search className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden md:inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-200">
            ⌘K
          </kbd>
        </button>

        {/* Sign In Button / User Profile Menu */}
        {currentUser ? (
          /* User Profile Dropdown Menu */
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 sm:px-3 sm:py-1.5 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white font-bold text-xs shadow-xs">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600">
                  {currentUser.plan} Plan
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu Popup */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <Shield className="h-3 w-3" />
                    <span>{currentUser.plan} Membership</span>
                  </div>
                </div>

                <div className="space-y-0.5 text-xs">
                  <button
                    onClick={() => {
                      onNavigate('my-files');
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <FolderArchive className="h-4 w-4 text-emerald-600" />
                    <span>Saved Calculations ({savedCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('ai-suite');
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span>AI Strategic Suite</span>
                  </button>

                  {onOpenSeoInspector && (
                    <button
                      onClick={() => {
                        onOpenSeoInspector();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex sm:hidden w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Code2 className="h-4 w-4 text-orange-600" />
                      <span>SEO & Schema</span>
                    </button>
                  )}
                </div>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      if (onSignOut) onSignOut();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Sign In Button */
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs shadow-orange-600/20 hover:bg-orange-500 transition cursor-pointer"
            title="Sign in to your account"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
