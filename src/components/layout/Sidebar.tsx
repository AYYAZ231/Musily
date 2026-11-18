import React from 'react';
import { Home, Search, Disc3, Radio, Library, Flame, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { ActiveTab } from '../../types';
import { useMusicStore } from '../../store/useMusicStore';

interface SidebarProps {
  onOpenAccountModal: () => void;
  onOpenPartyModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAccountModal, onOpenPartyModal }) => {
  const { state, actions } = useMusicStore();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'search', label: 'Search & Explore', icon: <Search className="w-5 h-5" /> },
    {
      id: 'party',
      label: 'Party Mode',
      icon: <Radio className="w-5 h-5 text-party-pink animate-pulse" />,
      badge: state.isPartyActive ? 'LIVE' : 'NAUX'
    },
    { id: 'library', label: 'My Library', icon: <Library className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[#0C0F17]/95 border-r border-white/5 p-5 select-none backdrop-blur-xl shrink-0">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 mb-8 cursor-pointer" onClick={() => actions.setActiveTab('home')}>
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-party-pink via-primary to-party-cyan shadow-glow-primary">
          <Disc3 className="w-6 h-6 text-white animate-spin-slow" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-spotify rounded-full border-2 border-background" />
        </div>
        <div>
          <span className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-200 to-primary-light bg-clip-text text-transparent">
            Musily
          </span>
          <span className="block text-[10px] uppercase tracking-wider font-semibold text-party-cyan">
            Spotify × YouTube
          </span>
        </div>
      </div>

      {/* Party CTA Card (NAUX Style) */}
      <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-br from-party-pink/20 via-primary/10 to-transparent border border-party-pink/30 shadow-glow-party relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-party-pink/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
        <div className="flex items-center gap-2 mb-1.5">
          <Flame className="w-4 h-4 text-party-pink fill-party-pink animate-bounce" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Pass the Aux</span>
        </div>
        <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
          Sync music live with friends online for free. Upvote tracks & drop straight to the chorus!
        </p>
        <button
          onClick={onOpenPartyModal}
          className="w-full py-2 px-3 bg-gradient-to-r from-party-pink to-primary hover:opacity-95 text-white font-semibold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Radio className="w-3.5 h-3.5" />
          {state.isPartyActive ? 'View Active Party' : 'Start / Join Party'}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = state.activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => actions.setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/20 text-white border border-primary/30 shadow-glow-primary'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badge === 'LIVE'
                      ? 'bg-party-pink text-white animate-pulse'
                      : 'bg-party-cyan/20 text-party-cyan'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Linked Accounts Indicator */}
      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Connected Sources
          </span>
          <button
            onClick={onOpenAccountModal}
            className="text-slate-400 hover:text-white transition-colors"
            title="Manage Accounts"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1.5">
          {/* Spotify Status */}
          <div
            onClick={onOpenAccountModal}
            className="flex items-center justify-between p-2 rounded-lg bg-surface/50 hover:bg-surface border border-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-spotify animate-ping" />
              <span className="text-xs font-medium text-slate-200">Spotify</span>
            </div>
            {state.linkedAccounts.spotify.isConnected ? (
              <span className="text-[10px] text-spotify flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Linked
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">Connect</span>
            )}
          </div>

          {/* YouTube Status */}
          <div
            onClick={onOpenAccountModal}
            className="flex items-center justify-between p-2 rounded-lg bg-surface/50 hover:bg-surface border border-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-youtube" />
              <span className="text-xs font-medium text-slate-200">YouTube Music</span>
            </div>
            {state.linkedAccounts.youtube.isConnected ? (
              <span className="text-[10px] text-youtube flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">Ready</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
