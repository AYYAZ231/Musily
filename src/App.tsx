import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { PlayerBar } from './components/layout/PlayerBar';
import { HomeView } from './components/home/HomeView';
import { UnifiedSearch } from './components/search/UnifiedSearch';
import { PartyRoomView } from './components/party/PartyRoomView';
import { PlaylistsView } from './components/library/PlaylistsView';
import { SettingsView } from './components/settings/SettingsView';
import { FloatingReactions } from './components/party/FloatingReactions';
import { JoinCreateModal } from './components/party/JoinCreateModal';
import { PassAuxModal } from './components/party/PassAuxModal';
import { AccountLinkModal } from './components/library/AccountLinkModal';
import { FullPlayerModal } from './components/player/FullPlayerModal';
import { EqualizerModal } from './components/player/EqualizerModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { OAuthPopupView } from './components/auth/OAuthPopupView';
import { useMusicStore } from './store/useMusicStore';

export const App: React.FC = () => {
  const { state, actions } = useMusicStore();
  const [isPartyModalOpen, setPartyModalOpen] = useState(false);
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [isPassAuxOpen, setPassAuxOpen] = useState(false);

  // Check if current window was spawned as an OAuth browser authentication window
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const oauthProvider = params.get('oauth');
    if (oauthProvider === 'spotify' || oauthProvider === 'youtube') {
      return <OAuthPopupView provider={oauthProvider} />;
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const partyCode = params.get('party') || params.get('room');
      if (partyCode && !state.isPartyActive) {
        setPartyModalOpen(true);
      }

      // Check if returning from official accounts.spotify.com OAuth redirect with #access_token=...
      if (window.location.hash.includes('access_token')) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const token = hashParams.get('access_token');
        if (token) {
          fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then((r) => r.json())
            .then((profile) => {
              if (profile && (profile.display_name || profile.id)) {
                const name = profile.display_name || profile.id;
                const avatar =
                  profile.images?.[0]?.url ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`;
                if (window.opener) {
                  window.opener.postMessage(
                    {
                      type: 'MUSILY_OAUTH_SUCCESS',
                      provider: 'spotify',
                      payload: { username: name, avatar, email: profile.email, token }
                    },
                    '*'
                  );
                  window.close();
                } else {
                  actions.linkSpotify(name);
                  window.history.replaceState(null, '', window.location.pathname);
                }
              }
            })
            .catch((e) => console.error('Spotify profile fetch error:', e));
        }
      }
    }
  }, []);

  // When not authenticated, present the cinema-grade full-screen Auth Experience
  if (!state.isAuthenticated) {
    return <AuthScreen />;
  }

  const isGlass = state.theme === 'glass';

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${
      isGlass ? 'bg-transparent text-white' : 'bg-[#F8F9FA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100'
    } transition-colors duration-200`}>
      {/* Floating Reaction Bursts */}
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

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-28 md:pb-24">
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

          {state.activeTab === 'settings' && (
            <SettingsView onOpenAccountModal={() => setAccountModalOpen(true)} />
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
      <EqualizerModal />
    </div>
  );
};

export default App;
