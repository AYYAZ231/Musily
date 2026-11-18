import React from 'react';
import { Search, Radio, User, Zap, Sun, Moon, Sparkles, Sliders, Settings } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { BrandLogo } from '../common/BrandLogo';

interface TopBarProps {
  onOpenPartyModal: () => void;
  onOpenAccountModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenPartyModal, onOpenAccountModal }) => {
  const { state, actions } = useMusicStore();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 py-3 bg-white/80 dark:bg-[#0C0C0F]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      {/* Mobile Brand Title */}
      <div
        className="flex md:hidden items-center cursor-pointer"
        onClick={() => actions.setActiveTab('home')}
      >
        <BrandLogo size="sm" />
      </div>

      {/* Search Input Trigger */}
      <div
        onClick={() => actions.setActiveTab('search')}
        className="hidden sm:flex items-center gap-2.5 w-72 md:w-80 lg:w-96 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all text-xs shrink-0"
      >
        <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span className="flex-1 truncate whitespace-nowrap">Search music, artists, genres...</span>
        <kbd className="text-[10px] font-mono bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 shadow-sm shrink-0">
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Equalizer & AI Studio Quick Button */}
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

        {/* Drop Mode Switch (NAUX Signature) */}
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
            <span>ROOM #{state.partyRoom?.id}</span>
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

        {/* Settings Button */}
        <button
          onClick={() => actions.setActiveTab('settings')}
          className={`p-2 rounded-lg border transition-all ${
            state.activeTab === 'settings'
              ? 'bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white'
              : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}
          title="Settings, Themes & Accounts"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
