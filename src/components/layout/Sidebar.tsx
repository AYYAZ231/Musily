import React from 'react';
import { Compass, Search, Radio, Library, Sun, Moon, Link as LinkIcon, Settings2 } from 'lucide-react';
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
    <aside className="hidden md:flex flex-col w-60 h-screen pb-20 bg-white dark:bg-[#0C0C0F] border-r border-zinc-200 dark:border-zinc-800/80 p-4 select-none shrink-0 transition-colors duration-200">
      {/* Brand Header */}
      <div
        className="flex items-center gap-2.5 px-2 mb-6 cursor-pointer"
        onClick={() => actions.setActiveTab('home')}
      >
        <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-sm">
          <span className="w-3 h-3 rounded-full bg-[#10B981] dark:bg-[#D4FF00]" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base font-display font-extrabold tracking-tight text-zinc-900 dark:text-white">
            MUSILY
          </span>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold border border-zinc-200 dark:border-zinc-700">
            AUX
          </span>
        </div>
      </div>

      {/* Main Nav Links */}
      <div className="space-y-1 mb-6">
        <div className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2.5 mb-2">
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
                  ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white font-bold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#059669] dark:text-[#D4FF00]' : 'text-zinc-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.isParty && state.isPartyActive && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-[#059669] dark:text-[#D4FF00] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] dark:bg-[#D4FF00] animate-pulse" />
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Party Mode Card (NAUX Style) */}
      <div className="mb-6 p-3 rounded-xl bg-zinc-50 dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            Party Mode
          </span>
          <span className="text-[10px] font-mono text-[#059669] dark:text-[#D4FF00] font-bold">NAUX</span>
        </div>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
          {state.isPartyActive
            ? `Room active: ${state.partyRoom?.id}`
            : 'Pass the Aux cord, drop to the hook, and sync live with friends.'}
        </p>
        <button
          onClick={onOpenPartyModal}
          className="w-full py-2 px-3 bg-[#10B981] hover:bg-[#059669] dark:bg-[#D4FF00] dark:hover:bg-[#C4ED00] text-white dark:text-black font-bold text-xs rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{state.isPartyActive ? 'Open Room' : 'Start Party'}</span>
        </button>
      </div>

      {/* Connected Accounts */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between px-2.5 mb-2">
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Sources
          </span>
          <button
            onClick={onOpenAccountModal}
            className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Manage
          </button>
        </div>

        <button
          onClick={onOpenAccountModal}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
            <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Spotify</span>
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
            {state.linkedAccounts.spotify.isConnected ? 'Connected' : 'Link'}
          </span>
        </button>

        <button
          onClick={onOpenAccountModal}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FF0033]" />
            <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">YouTube Music</span>
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
            {state.linkedAccounts.youtube.isConnected ? 'Connected' : 'Ready'}
          </span>
        </button>
      </div>

      {/* Footer Profile & Theme Toggle */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-900 dark:text-white shrink-0">
            {state.linkedAccounts.spotify.username?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 truncate">
            <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
              {state.linkedAccounts.spotify.username || 'Local Host'}
            </p>
            <p className="text-[10px] text-zinc-400 truncate font-mono">Free Online</p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={actions.toggleTheme}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title={`Switch to ${state.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {state.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-600" />
          )}
        </button>
      </div>
    </aside>
  );
};
