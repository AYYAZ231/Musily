import React from 'react';
import { Search, Radio, Flame, Sparkles, User, Link as LinkIcon } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';

interface TopBarProps {
  onOpenPartyModal: () => void;
  onOpenAccountModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenPartyModal, onOpenAccountModal }) => {
  const { state, actions } = useMusicStore();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3.5 bg-background/80 backdrop-blur-xl border-b border-white/5">
      {/* Mobile Brand Title */}
      <div className="flex md:hidden items-center gap-2 cursor-pointer" onClick={() => actions.setActiveTab('home')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-party-pink to-primary flex items-center justify-center shadow-glow-primary">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-lg bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Musily
        </span>
      </div>

      {/* Global Search Trigger Bar */}
      <div
        onClick={() => actions.setActiveTab('search')}
        className="hidden sm:flex items-center gap-3 w-72 md:w-96 px-4 py-2 rounded-full bg-surface-elevated/70 border border-white/10 hover:border-primary/40 cursor-pointer transition-all text-slate-400 hover:text-slate-200 shadow-inner group"
      >
        <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
        <span className="text-xs font-medium">Search songs, Spotify, or YouTube Music...</span>
        <span className="ml-auto text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400">Ctrl + K</span>
      </div>

      {/* Right Action Center */}
      <div className="flex items-center gap-3">
        {/* Party Room Quick Status */}
        {state.isPartyActive ? (
          <button
            onClick={() => actions.setActiveTab('party')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-party-pink/20 border border-party-pink/40 text-party-pink text-xs font-bold shadow-glow-party transition-all hover:scale-105 active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-party-pink animate-ping" />
            <span>Room: {state.partyRoom?.id}</span>
          </button>
        ) : (
          <button
            onClick={onOpenPartyModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-party-pink to-primary hover:opacity-90 text-white text-xs font-semibold shadow-glow-party transition-all active:scale-95"
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Party Aux</span>
          </button>
        )}

        {/* Drop Mode Quick Indicator */}
        <button
          onClick={actions.toggleDropMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            state.dropMode
              ? 'bg-party-yellow/20 border-party-yellow text-party-yellow shadow-glow-party'
              : 'bg-surface-elevated/60 border-white/10 text-slate-400 hover:text-white'
          }`}
          title="Toggle Drop Mode (Jump straight to energetic chorus / drop like naux.party)"
        >
          <Sparkles className={`w-3.5 h-3.5 ${state.dropMode ? 'animate-spin-slow' : ''}`} />
          <span className="hidden sm:inline">Drop Mode</span>
        </button>

        {/* Link Accounts Shortcut */}
        <button
          onClick={onOpenAccountModal}
          className="p-2 rounded-full bg-surface-elevated/60 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all relative"
          title="Connect Spotify & YouTube"
        >
          <LinkIcon className="w-4 h-4" />
          {(state.linkedAccounts.spotify.isConnected || state.linkedAccounts.youtube.isConnected) && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-spotify rounded-full" />
          )}
        </button>

        {/* User Avatar */}
        <div
          onClick={onOpenAccountModal}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-party-cyan p-0.5 cursor-pointer shadow-md"
        >
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
            {state.linkedAccounts.spotify.avatar ? (
              <img src={state.linkedAccounts.spotify.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-slate-300" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
