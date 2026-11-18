import React from 'react';
import {
  Compass,
  Search,
  Radio,
  Library,
  Settings,
  Sliders,
  PanelLeftClose,
  PanelLeftOpen,
  Volume2
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { useMusicStore } from '../../store/useMusicStore';
import { BrandLogo } from '../common/BrandLogo';

interface SidebarProps {
  onOpenAccountModal: () => void;
  onOpenPartyModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenPartyModal }) => {
  const { state, actions } = useMusicStore();
  const isCollapsed = state.isSidebarCollapsed;

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
    <aside
      className={`hidden md:flex flex-col h-screen pb-24 bg-white dark:bg-[#090A0E] border-r border-zinc-200/80 dark:border-zinc-800/80 select-none shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[72px] p-2.5 items-center' : 'w-64 p-4'
      }`}
    >
      {/* Brand Header + Collapse Button */}
      <div
        className={`flex items-center mb-6 pt-1 ${
          isCollapsed ? 'flex-col gap-3 justify-center w-full' : 'justify-between px-1'
        }`}
      >
        <div
          className="cursor-pointer"
          onClick={() => actions.setActiveTab('home')}
          title="Musily Home"
        >
          <BrandLogo size={isCollapsed ? 'sm' : 'md'} />
        </div>

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={actions.toggleSidebarCollapse}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-emerald-500 dark:text-[#D4FF00]" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className={`space-y-1.5 mb-6 ${isCollapsed ? 'w-full' : ''}`}>
        {!isCollapsed && (
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold px-2.5 mb-2">
            Menu
          </div>
        )}

        {navItems.map((item) => {
          const isActive = state.activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => actions.setActiveTab(item.id)}
              className={`group relative flex items-center rounded-xl text-xs font-bold transition-all ${
                isCollapsed
                  ? 'w-11 h-11 justify-center mx-auto'
                  : 'w-full justify-between px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                <span
                  className={
                    isActive
                      ? 'text-emerald-400 dark:text-black'
                      : 'text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors'
                  }
                >
                  {item.icon}
                </span>
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.isParty && state.isPartyActive && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-[#059669] dark:text-[#D4FF00] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] dark:bg-[#D4FF00] animate-pulse" />
                  LIVE
                </span>
              )}

              {/* Tooltip on Collapsed Rail */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50 border border-zinc-700">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Party Mode Card / Trigger */}
      {isCollapsed ? (
        <div className="mb-3 w-full flex justify-center">
          <button
            onClick={onOpenPartyModal}
            className="group relative w-11 h-11 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 dark:text-[#D4FF00] border border-emerald-500/30 flex items-center justify-center transition-all shadow-xs"
            title="Start Party Aux"
          >
            <Radio className="w-4 h-4" />
            {state.isPartyActive && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#10B981] dark:bg-[#D4FF00] animate-ping" />
            )}
            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50 border border-zinc-700">
              Party Mode {state.isPartyActive ? `(#${state.partyRoom?.id})` : ''}
            </div>
          </button>
        </div>
      ) : (
        <div className="mb-3 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-zinc-50 to-teal-500/10 dark:from-[#121216] dark:to-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-500 dark:text-[#D4FF00]" />
              Party Mode
            </span>
            <span className="text-[10px] font-mono text-[#059669] dark:text-[#D4FF00] font-bold">
              P2P LIVE
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
            {state.isPartyActive
              ? `Room active: #${state.partyRoom?.id}`
              : 'Pass the Aux cord, drop to the hook, and sync live with friends.'}
          </p>
          <button
            onClick={onOpenPartyModal}
            className="w-full py-2 px-3 bg-[#10B981] hover:bg-[#059669] dark:bg-[#D4FF00] dark:hover:bg-[#C4ED00] text-white dark:text-black font-bold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{state.isPartyActive ? 'Open Room' : 'Start Party'}</span>
          </button>
        </div>
      )}

      {/* Acoustic Studio EQ Card / Trigger */}
      {isCollapsed ? (
        <div className="w-full flex justify-center">
          <button
            onClick={() => actions.toggleEqualizerModal(true)}
            className="group relative w-11 h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-all shadow-xs"
            title="Acoustic Studio Equalizer"
          >
            <Sliders className="w-4 h-4 text-emerald-500 dark:text-[#D4FF00]" />
            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50 border border-zinc-700">
              Acoustic Studio EQ
            </div>
          </button>
        </div>
      ) : (
        <div
          onClick={() => actions.toggleEqualizerModal(true)}
          className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 dark:bg-[#121216] dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer transition-all group shadow-xs"
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
      )}
    </aside>
  );
};
