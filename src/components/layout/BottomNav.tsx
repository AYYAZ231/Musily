import React from 'react';
import { Home, Search, Radio, Library, Flame } from 'lucide-react';
import { ActiveTab } from '../../types';
import { useMusicStore } from '../../store/useMusicStore';

export const BottomNav: React.FC = () => {
  const { state, actions } = useMusicStore();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; isParty?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
    {
      id: 'party',
      label: 'Party',
      icon: <Radio className="w-5 h-5" />,
      isParty: true
    },
    { id: 'library', label: 'Library', icon: <Library className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C0F17]/95 backdrop-blur-xl border-t border-white/5 py-2 px-3 pb-[env(safe-area-inset-bottom,8px)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = state.activeTab === tab.id;

          if (tab.isParty) {
            return (
              <button
                key={tab.id}
                onClick={() => actions.setActiveTab(tab.id)}
                className="relative -top-3 flex flex-col items-center group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    state.isPartyActive
                      ? 'bg-gradient-to-tr from-party-pink to-primary shadow-glow-party scale-110'
                      : 'bg-gradient-to-tr from-party-pink/90 to-primary text-white'
                  }`}
                >
                  <Flame className="w-6 h-6 text-white animate-bounce" />
                </div>
                <span className="text-[10px] font-bold text-party-pink mt-1">
                  {state.isPartyActive ? 'PARTY' : 'AUX'}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => actions.setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-primary font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
