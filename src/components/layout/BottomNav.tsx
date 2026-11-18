import React from 'react';
import { Compass, Search, Radio, Library } from 'lucide-react';
import { ActiveTab } from '../../types';
import { useMusicStore } from '../../store/useMusicStore';

export const BottomNav: React.FC = () => {
  const { state, actions } = useMusicStore();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; isParty?: boolean }[] = [
    { id: 'home', label: 'Discover', icon: <Compass className="w-4 h-4" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
    {
      id: 'party',
      label: 'Party Aux',
      icon: <Radio className="w-4 h-4" />,
      isParty: true
    },
    { id: 'library', label: 'Library', icon: <Library className="w-4 h-4" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0C0C0F]/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 py-1.5 px-3 select-none transition-colors duration-200 shadow-md">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = state.activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => actions.setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors relative ${
                isActive
                  ? 'text-zinc-900 dark:text-white font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                <span className={isActive ? 'text-[#059669] dark:text-[#D4FF00]' : ''}>
                  {tab.icon}
                </span>
                {tab.isParty && state.isPartyActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#10B981] dark:bg-[#D4FF00] animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
