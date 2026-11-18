import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { PlayerBar } from './components/layout/PlayerBar';
import { HomeView } from './components/home/HomeView';
import { UnifiedSearch } from './components/search/UnifiedSearch';
import { PartyRoomView } from './components/party/PartyRoomView';
import { PlaylistsView } from './components/library/PlaylistsView';
import { FloatingReactions } from './components/party/FloatingReactions';
import { JoinCreateModal } from './components/party/JoinCreateModal';
import { PassAuxModal } from './components/party/PassAuxModal';
import { AccountLinkModal } from './components/library/AccountLinkModal';
import { FullPlayerModal } from './components/player/FullPlayerModal';
import { useMusicStore } from './store/useMusicStore';

export const App: React.FC = () => {
  const { state, actions } = useMusicStore();
  const [isPartyModalOpen, setPartyModalOpen] = useState(false);
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [isPassAuxOpen, setPassAuxOpen] = useState(false);

  // Check URL query params for ?party=CODE or ?room=CODE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const partyCode = params.get('party') || params.get('room');
      if (partyCode && !state.isPartyActive) {
        setPartyModalOpen(true);
      }
    }
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-slate-100">
      {/* Floating Reaction Bursts (Real-time live across entire app) */}
      <FloatingReactions />

      {/* Desktop Navigation Sidebar */}
      <Sidebar
        onOpenAccountModal={() => setAccountModalOpen(true)}
        onOpenPartyModal={() => setPartyModalOpen(true)}
      />

      {/* Main App Content View */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar
          onOpenPartyModal={() => setPartyModalOpen(true)}
          onOpenAccountModal={() => setAccountModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-36">
          {state.activeTab === 'home' && (
            <HomeView
              onOpenPartyModal={() => setPartyModalOpen(true)}
              onOpenAccountModal={() => setAccountModalOpen(true)}
            />
          )}

          {state.activeTab === 'search' && <UnifiedSearch />}

          {state.activeTab === 'party' && (
            <PartyRoomView
              onOpenPassAux={() => setPassAuxOpen(true)}
              onOpenSearch={() => actions.setActiveTab('search')}
            />
          )}

          {state.activeTab === 'library' && (
            <PlaylistsView onOpenAccountModal={() => setAccountModalOpen(true)} />
          )}
        </main>

        {/* Bottom Navigation for Mobile / APK */}
        <BottomNav />

        {/* Global Persistent Player Bar */}
        <PlayerBar />
      </div>

      {/* Modals & Dialogs */}
      <JoinCreateModal
        isOpen={isPartyModalOpen}
        onClose={() => setPartyModalOpen(false)}
      />

      <AccountLinkModal
        isOpen={isAccountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />

      <PassAuxModal
        isOpen={isPassAuxOpen}
        onClose={() => setPassAuxOpen(false)}
      />

      <FullPlayerModal />
    </div>
  );
};

export default App;
