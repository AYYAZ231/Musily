import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Radio,
  User,
  Zap,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  Settings,
  LogOut,
  ChevronDown,
  CheckCircle2,
  X,
  ShieldCheck,
  Disc3
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { BrandLogo } from '../common/BrandLogo';

interface TopBarProps {
  onOpenPartyModal: () => void;
  onOpenAccountModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenPartyModal, onOpenAccountModal }) => {
  const { state, actions } = useMusicStore();
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close user dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
      }
      // ⌘K or Ctrl+K focuses the search input
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        if (state.activeTab !== 'search') {
          actions.setActiveTab('search');
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.activeTab]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    actions.setSearchQuery(val);
    if (state.activeTab !== 'search') {
      actions.setActiveTab('search');
    }
  };

  const handleSearchFocus = () => {
    if (state.activeTab !== 'search') {
      actions.setActiveTab('search');
    }
  };

  const userName =
    state.currentUser?.name || state.linkedAccounts.spotify.username || 'Musily User';
  const userEmail = state.currentUser?.email || 'Logged In Account';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 bg-white/90 dark:bg-[#090A0E]/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      {/* Mobile Brand Title */}
      <div
        className="flex md:hidden items-center cursor-pointer mr-3"
        onClick={() => actions.setActiveTab('home')}
      >
        <BrandLogo size="sm" />
      </div>

      {/* Global Interactive Search Input Bar */}
      <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mr-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={state.searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="Search songs, artists, albums (e.g. Karan Aujla, Eminem)..."
            className="w-full pl-10 pr-16 py-2 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 focus:bg-white dark:focus:bg-[#121216] border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-xs sm:text-sm font-medium transition-all shadow-xs"
          />
          <div className="absolute right-2.5 flex items-center gap-1.5">
            {state.searchQuery ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  actions.setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block text-[10px] font-mono bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 shadow-xs pointer-events-none">
                ⌘K
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Equalizer Quick Button */}
        <button
          onClick={() => actions.toggleEqualizerModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all text-xs font-semibold"
          title="Acoustic Equalizer & AI Sound Engine"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-[#D4FF00]" />
          <span className="hidden sm:inline">EQ</span>
        </button>

        {/* Theme Quick Cycle Button (Dark -> Light -> Liquid Glass) */}
        <button
          onClick={actions.toggleTheme}
          className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all"
          title={`Active Theme: ${state.theme}. Click to switch theme.`}
        >
          {state.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : state.theme === 'light' ? (
            <Sparkles className="w-4 h-4 text-sky-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-300" />
          )}
        </button>

        {/* Drop Mode Switch (Skip to Chorus) */}
        <button
          onClick={actions.toggleDropMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            state.dropMode
              ? 'bg-[#10B981] text-white dark:bg-[#D4FF00] dark:text-black border-transparent font-bold shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
          }`}
          title="The Hook / Drop: Skip intros and jump straight to the chorus"
        >
          <Zap className={`w-3.5 h-3.5 ${state.dropMode ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">
            {state.dropMode ? 'Drop: ON' : 'Drop: OFF'}
          </span>
        </button>

        {/* Party Status / Start Party */}
        {state.isPartyActive ? (
          <button
            onClick={() => actions.setActiveTab('party')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10B981]/10 dark:bg-[#D4FF00]/10 border border-[#10B981]/40 dark:border-[#D4FF00]/40 text-[#059669] dark:text-[#D4FF00] text-xs font-mono font-bold transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] dark:bg-[#D4FF00] animate-ping" />
            <span className="hidden sm:inline">ROOM #{state.partyRoom?.id}</span>
          </button>
        ) : (
          <button
            onClick={onOpenPartyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-black dark:bg-[#D4FF00] dark:hover:bg-[#C4ED00] text-white dark:text-black text-xs font-bold transition-all shadow-sm"
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Host Party</span>
          </button>
        )}

        {/* =========================================================================
            USER PROFILE & LOGOUT DROPDOWN BUTTON ON NAVBAR
            Replaces the sidebar profile widget with sleek top-right dropdown
            ========================================================================= */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border transition-all ${
              isUserMenuOpen
                ? 'bg-zinc-200 dark:bg-zinc-800 border-emerald-500 dark:border-[#D4FF00]'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800'
            }`}
            title="User Account & Settings"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {userInitial}
            </div>
            <span className="text-xs font-bold text-zinc-900 dark:text-white max-w-[90px] sm:max-w-[120px] truncate">
              {userName}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                isUserMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Floating Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 p-3 backdrop-blur-xl animate-fade-in divide-y divide-zinc-200 dark:divide-zinc-800/80">
              {/* User Header Section */}
              <div className="pb-3 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {userName}
                    </p>
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate font-mono">
                    {userEmail}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {state.linkedAccounts.spotify.isConnected && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono">
                        Spotify ✓
                      </span>
                    )}
                    {state.linkedAccounts.youtube.isConnected && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold font-mono">
                        YouTube ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Navigation Actions */}
              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenAccountModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
                >
                  <User className="w-4 h-4 text-emerald-500" />
                  <span>Account & Connected Services</span>
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    actions.setActiveTab('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
                >
                  <Settings className="w-4 h-4 text-zinc-400" />
                  <span>Settings & Preferences</span>
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    actions.toggleEqualizerModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
                >
                  <Sliders className="w-4 h-4 text-[#D4FF00]" />
                  <span>Acoustic Equalizer & AI Tuning</span>
                </button>
              </div>

              {/* Logout Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    actions.logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
