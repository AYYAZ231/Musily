import React from 'react';
import { Compass, Search, Radio, Library, Settings, Sliders, Sparkles, LogOut } from 'lucide-react';
import { ActiveTab } from '../../types';
import { useMusicStore } from '../../store/useMusicStore';
import { BrandLogo } from '../common/BrandLogo';

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
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen pb-20 bg-white dark:bg-[#090A0E] border-r border-zinc-200/80 dark:border-zinc-800/80 p-4 select-none shrink-0 transition-colors duration-200">
      {/* Brand Header */}
      <div
        className="px-2 mb-7 cursor-pointer"
        onClick={() => actions.setActiveTab('home')}
      >
        <BrandLogo size="md" />
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
      <div className="mb-4 p-3 rounded-xl bg-zinc-50 dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            Party Mode
          </span>
          <span className="text-[10px] font-mono text-[#059669] dark:text-[#D4FF00] font-bold">P2P LIVE</span>
        </div>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
          {state.isPartyActive
            ? `Room active: #${state.partyRoom?.id}`
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

      {/* Quick Acoustic Studio EQ Card */}
      <div className="flex-1 mb-4">
        <div
          onClick={() => actions.toggleEqualizerModal(true)}
          className="p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-[#121216] dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-500 dark:text-[#D4FF00]" />
              Acoustic Studio
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-[#D4FF00] font-bold">
              EQ
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            10-band equalizer & AI sound tuning active.
          </p>
        </div>
      </div>

      {/* Footer Profile & Quick Actions */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-1">
        <div
          onClick={() => actions.setActiveTab('settings')}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
        >
          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-900 dark:text-white shrink-0 group-hover:border-zinc-500 transition-colors">
            {state.currentUser?.name?.charAt(0) || state.linkedAccounts.spotify.username?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 truncate">
            <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate group-hover:underline">
              {state.currentUser?.name || state.linkedAccounts.spotify.username || 'Musily User'}
            </p>
            <p className="text-[10px] text-zinc-400 truncate font-mono">
              {state.currentUser?.email || 'Logged In'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Settings button */}
          <button
            onClick={() => actions.setActiveTab('settings')}
            className={`p-1.5 rounded-lg transition-colors ${
              state.activeTab === 'settings'
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="Open Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Logout button */}
          {state.isAuthenticated && (
            <button
              onClick={actions.logout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Log Out of Musily"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

