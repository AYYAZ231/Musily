import React from 'react';
import { Search, Radio, Sparkles, User, Link as LinkIcon, Zap } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';

interface TopBarProps {
  onOpenPartyModal: () => void;
  onOpenAccountModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenPartyModal, onOpenAccountModal }) => {
  const { state, actions } = useMusicStore();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 py-3 bg-ink-950/80 backdrop-blur-md border-b border-ink-800">
      {/* Mobile Brand Title */}
      <div
        className="flex md:hidden items-center gap-2 cursor-pointer"
        onClick={() => actions.setActiveTab('home')}
      >
        <div className="w-7 h-7 rounded-lg bg-ink-850 border border-ink-700 flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-lime" />
        </div>
        <span className="font-display font-extrabold text-sm tracking-tight text-white">
          MUSILY
        </span>
      </div>

      {/* Search Input Trigger */}
      <div
        onClick={() => actions.setActiveTab('search')}
        className="hidden sm:flex items-center gap-2.5 w-80 lg:w-96 px-3.5 py-1.5 rounded-lg bg-ink-900 border border-ink-800 hover:border-ink-700 cursor-pointer text-zinc-400 hover:text-zinc-200 transition-all text-xs"
      >
        <Search className="w-3.5 h-3.5 text-zinc-500" />
        <span className="flex-1">Search Spotify, YouTube Music, artists...</span>
        <kbd className="text-[10px] font-mono bg-ink-800 text-zinc-400 px-1.5 py-0.5 rounded border border-ink-700">
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Drop Mode Switch (NAUX Signature: Play straight from the hook) */}
        <button
          onClick={actions.toggleDropMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            state.dropMode
              ? 'bg-lime text-black border-lime font-bold'
              : 'bg-ink-900 text-zinc-400 border-ink-800 hover:text-white hover:border-ink-700'
          }`}
          title="The Hook / Drop Mode: Skip intro and jump straight to the chorus (like naux.party)"
        >
          <Zap className={`w-3.5 h-3.5 ${state.dropMode ? 'fill-black' : ''}`} />
          <span className="hidden sm:inline">
            {state.dropMode ? 'Drop: ON' : 'Drop: OFF'}
          </span>
        </button>

        {/* Party Status / Start Party */}
        {state.isPartyActive ? (
          <button
            onClick={() => actions.setActiveTab('party')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-900 border border-lime/40 text-lime text-xs font-mono font-bold hover:bg-ink-850 transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-ping" />
            <span>ROOM #{state.partyRoom?.id}</span>
          </button>
        ) : (
          <button
            onClick={onOpenPartyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-900 hover:bg-ink-850 border border-ink-800 text-white text-xs font-semibold transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-lime" />
            <span className="hidden sm:inline">Host Party</span>
          </button>
        )}

        {/* User Avatar / Profile */}
        <button
          onClick={onOpenAccountModal}
          className="w-8 h-8 rounded-lg bg-ink-900 border border-ink-800 hover:border-zinc-600 flex items-center justify-center text-zinc-300 hover:text-white transition-all text-xs font-bold"
          title="Manage Accounts"
        >
          {state.linkedAccounts.spotify.username?.charAt(0) || <User className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
