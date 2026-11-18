import React from 'react';
import { Compass, Search, Radio, Library, Plus, ArrowUpRight, Music2, Settings2 } from 'lucide-react';
import { ActiveTab } from '../../types';
import { useMusicStore } from '../../store/useMusicStore';

interface SidebarProps {
  onOpenAccountModal: () => void;
  onOpenPartyModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAccountModal, onOpenPartyModal }) => {
  const { state, actions } = useMusicStore();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; isParty?: boolean }[] = [
    { id: 'home', label: 'Discover', icon: <Compass className="w-4 h-4" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
    {
      id: 'party',
      label: 'Party Aux',
      icon: <Radio className="w-4 h-4" />,
      isParty: true
    },
    { id: 'library', label: 'Your Library', icon: <Library className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen bg-ink-950 border-r border-ink-800 p-4 select-none shrink-0">
      {/* Brand Header */}
      <div
        className="flex items-center gap-2.5 px-2 mb-7 cursor-pointer"
        onClick={() => actions.setActiveTab('home')}
      >
        <div className="w-8 h-8 rounded-lg bg-ink-850 border border-ink-700 flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-lime" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base font-display font-extrabold tracking-tight text-white">
            MUSILY
          </span>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-ink-800 text-zinc-400">
            AUX
          </span>
        </div>
      </div>

      {/* Main Nav Links */}
      <div className="space-y-1 mb-6">
        <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider px-2.5 mb-2">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = state.activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => actions.setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-ink-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-ink-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-lime' : 'text-zinc-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.isParty && state.isPartyActive && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-lime font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Party Mode Card (NAUX Style) */}
      <div className="mb-6 p-3 rounded-xl bg-ink-900 border border-ink-800">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
            Party Mode
          </span>
          <span className="text-[10px] font-mono text-lime font-bold">NAUX</span>
        </div>
        <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
          {state.isPartyActive
            ? `Active room: ${state.partyRoom?.id}. Aux handled.`
            : 'Pass the Aux cord, drop to the hook, and sync live with friends.'}
        </p>
        <button
          onClick={onOpenPartyModal}
          className="w-full py-2 px-3 bg-lime hover:bg-lime-hover text-black font-bold text-xs rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-subtle"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{state.isPartyActive ? 'Open Room' : 'Start Party'}</span>
        </button>
      </div>

      {/* Connected Accounts */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between px-2.5 mb-2">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Audio Sources
          </span>
          <button
            onClick={onOpenAccountModal}
            className="text-[11px] text-zinc-400 hover:text-white transition-colors"
          >
            Manage
          </button>
        </div>

        <button
          onClick={onOpenAccountModal}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-ink-900 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-spotify" />
            <span className="text-xs text-zinc-300">Spotify</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            {state.linkedAccounts.spotify.isConnected ? 'Connected' : 'Link'}
          </span>
        </button>

        <button
          onClick={onOpenAccountModal}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-ink-900 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-youtube" />
            <span className="text-xs text-zinc-300">YouTube Music</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            {state.linkedAccounts.youtube.isConnected ? 'Connected' : 'Ready'}
          </span>
        </button>
      </div>

      {/* Footer User Info */}
      <div className="pt-3 border-t border-ink-800 flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-ink-800 border border-ink-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {state.linkedAccounts.spotify.username?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 truncate">
            <p className="text-xs font-semibold text-white truncate">
              {state.linkedAccounts.spotify.username || 'Local Host'}
            </p>
            <p className="text-[10px] text-zinc-500 truncate">Free Plan</p>
          </div>
        </div>

        <button
          onClick={onOpenAccountModal}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-ink-850 transition-colors"
          title="Account Settings"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
