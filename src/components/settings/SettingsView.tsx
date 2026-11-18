import React, { useState } from 'react';
import {
  Palette,
  Link2,
  Sliders,
  Sparkles,
  Radio,
  Volume2,
  ShieldCheck,
  Check,
  ExternalLink,
  RefreshCw,
  LogOut,
  Zap,
  Layers,
  Smartphone,
  Laptop,
  Globe,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { ThemeMode } from '../../types';
import { SpotifyIcon, YouTubeIcon } from '../common/StreamingIcons';
import { OAuthBrowserService } from '../../services/oauthBrowserService';
import { AuthService } from '../../services/authService';

interface SettingsViewProps {
  onOpenAccountModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenAccountModal }) => {
  const { state, actions } = useMusicStore();
  const [audioBitrate, setAudioBitrate] = useState<'lossless' | 'high' | 'normal'>('high');
  const [djName, setDjName] = useState(state.linkedAccounts.spotify.username || 'MusilyDJ');
  const [dropThreshold, setDropThreshold] = useState(28); // 28% into track
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<'spotify' | 'youtube' | null>(null);

  const handleBrowserOAuthConnect = async (provider: 'spotify' | 'youtube') => {
    setIsOAuthLoading(provider);
    const res = await OAuthBrowserService.openOAuth(provider);
    setIsOAuthLoading(null);

    if (res.success) {
      if (provider === 'spotify') {
        await actions.linkSpotify(res.username || 'SpotifyUser');
      } else {
        await actions.linkYouTube(res.channelTitle || 'YouTubeUser');
      }

      // Also persist to current session user in AuthService if logged in
      if (state.currentUser) {
        AuthService.updateConnectedAccounts(
          state.currentUser.id,
          {
            connected: provider === 'spotify' ? true : state.linkedAccounts.spotify.isConnected,
            username: provider === 'spotify' ? res.username : state.linkedAccounts.spotify.username
          },
          {
            connected: provider === 'youtube' ? true : state.linkedAccounts.youtube.isConnected,
            channel: provider === 'youtube' ? res.channelTitle : state.linkedAccounts.youtube.channelTitle
          }
        );
      }
    }
  };

  const themeOptions: {
    id: ThemeMode;
    title: string;
    description: string;
    accentColor: string;
    bgPreview: string;
    badge: string;
  }[] = [
    {
      id: 'dark',
      title: 'Dark Obsidian',
      description: 'Deep zinc void with electric lime & night club contrast',
      accentColor: '#D4FF00',
      bgPreview: 'bg-[#09090B] border-zinc-800 text-white',
      badge: 'Classic Night'
    },
    {
      id: 'light',
      title: 'Light Alabaster',
      description: 'Ultra-crisp white canvas with dark typography & fresh emerald',
      accentColor: '#10B981',
      bgPreview: 'bg-[#F8F9FA] border-zinc-200 text-zinc-900',
      badge: 'Daylight Polish'
    },
    {
      id: 'glass',
      title: 'Liquid Glass',
      description: 'Translucent frosted glassmorphism with iridescent refractive sheen',
      accentColor: '#38BDF8',
      bgPreview: 'bg-gradient-to-br from-indigo-950/80 via-purple-950/50 to-slate-950/80 border-white/20 text-white backdrop-blur-xl',
      badge: 'New Luxury'
    }
  ];

  const handleSelectTheme = (theme: ThemeMode) => {
    actions.setTheme(theme);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Settings Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Settings & Audio Engine
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Customize visual themes, streaming accounts, 10-band equalizer, and party synchronization.
        </p>
      </div>

      {isSavedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>Theme preference updated and saved to local storage.</span>
        </div>
      )}

      {/* SECTION 1: VISUAL THEMES */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0C0C0F] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                Appearance & Visual Themes
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Choose your aesthetic environment. Seamlessly switch between dark, light, and liquid glass.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold border border-zinc-200 dark:border-zinc-700">
            {state.theme.toUpperCase()} ACTIVE
          </span>
        </div>

        {/* 3 Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {themeOptions.map((t) => {
            const isCurrent = state.theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleSelectTheme(t.id)}
                className={`p-4 rounded-xl cursor-pointer border-2 transition-all relative flex flex-col justify-between ${
                  isCurrent
                    ? 'border-emerald-500 dark:border-[#D4FF00] shadow-md scale-[1.02]'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/40'
                }`}
              >
                {/* Active check pill */}
                {isCurrent && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 dark:bg-[#D4FF00] text-white dark:text-black flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                {/* Theme Preview Swatch */}
                <div
                  className={`w-full h-20 rounded-lg mb-3.5 p-2.5 flex flex-col justify-between border shadow-inner ${t.bgPreview}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: t.accentColor }}
                      />
                      <span className="text-[10px] font-display font-extrabold tracking-tight">
                        MUSILY
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1 rounded bg-black/20 font-bold">
                      {t.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white/20" />
                    <div className="flex-1 h-1.5 rounded-full bg-white/30" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    {t.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    {t.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: CONNECTED STREAMING ACCOUNTS */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0C0C0F] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                Streaming Integrations & Music Sources
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Link your Spotify & YouTube Music accounts. Musily unifies both libraries into one clean catalog.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAccountModal}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Accounts
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Spotify Card */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/30 flex items-center justify-center text-[#1DB954]">
                  <SpotifyIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                    Spotify Integration
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {state.linkedAccounts.spotify.isConnected
                      ? `@${state.linkedAccounts.spotify.username}`
                      : 'Browser session linking'}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  state.linkedAccounts.spotify.isConnected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-[#1DB954] border-emerald-500/30'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700'
                }`}
              >
                {state.linkedAccounts.spotify.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">Personal Playlists & Drops</span>
              {state.linkedAccounts.spotify.isConnected ? (
                <button
                  onClick={actions.disconnectSpotify}
                  className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  Disconnect
                </button>
              ) : (
                <button
                  disabled={isOAuthLoading !== null}
                  onClick={() => handleBrowserOAuthConnect('spotify')}
                  className="px-3 py-1.5 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                >
                  <SpotifyIcon className="w-3.5 h-3.5" />
                  <span>
                    {isOAuthLoading === 'spotify' ? 'Connecting...' : 'Login with Spotify'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* YouTube Music Card */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF0000]/10 border border-[#FF0000]/30 flex items-center justify-center text-[#FF0000]">
                  <YouTubeIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                    YouTube Music Integration
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {state.linkedAccounts.youtube.isConnected
                      ? `@${state.linkedAccounts.youtube.channelTitle}`
                      : 'Browser session linking'}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  state.linkedAccounts.youtube.isConnected
                    ? 'bg-red-500/10 text-red-600 dark:text-[#FF0000] border-red-500/30'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700'
                }`}
              >
                {state.linkedAccounts.youtube.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">Video Fallback & Streams</span>
              {state.linkedAccounts.youtube.isConnected ? (
                <button
                  onClick={actions.disconnectYouTube}
                  className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  Disconnect
                </button>
              ) : (
                <button
                  disabled={isOAuthLoading !== null}
                  onClick={() => handleBrowserOAuthConnect('youtube')}
                  className="px-3 py-1.5 rounded-lg bg-[#FF0000] hover:bg-[#ff1a1a] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                >
                  <YouTubeIcon className="w-3.5 h-3.5" />
                  <span>
                    {isOAuthLoading === 'youtube' ? 'Connecting...' : 'Login with YouTube'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: AUDIO ENGINE & EQUALIZER */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0C0C0F] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                Audio Engine & AI Equalizer
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Fine-tune 10-band audio frequency spectrum and AI acoustic auto-mastering.
              </p>
            </div>
          </div>

          <button
            onClick={() => actions.toggleEqualizerModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-black dark:bg-[#D4FF00] dark:hover:bg-[#C4ED00] text-white dark:text-black transition-all flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Launch 10-Band EQ
          </button>
        </div>

        {/* EQ Status Summary */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">
                Active Sound Signature:
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#D4FF00] uppercase">
                {state.equalizer.preset}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Preamp: {state.equalizer.preamp > 0 ? `+${state.equalizer.preamp}` : state.equalizer.preamp}dB • Bass Slam: Lv. {state.equalizer.bassBoost}/10 • Spatial: {state.equalizer.spatialAudio}
            </p>
          </div>

          {/* Audio Quality Bitrate Selector */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-[11px] text-zinc-400 mr-1 font-medium">Quality:</span>
            {(['lossless', 'high', 'normal'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setAudioBitrate(q)}
                className={`px-2.5 py-1 text-[10px] font-mono rounded font-semibold border transition-all uppercase ${
                  audioBitrate === q
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent'
                    : 'bg-white dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PARTY & NAUX SYNC SETTINGS */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0C0C0F] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white">
            <Radio className="w-4 h-4 text-emerald-500 dark:text-[#D4FF00]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
              Party Aux & NAUX Live Sync
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Zero-cost WebRTC Peer-to-Peer synchronization options for online party rooms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* DJ Nickname */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Default DJ / Party Nickname
            </label>
            <input
              type="text"
              value={djName}
              onChange={(e) => setDjName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-[#D4FF00]"
            />
          </div>

          {/* The Drop Chorus Skip */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                "The Drop" Intro Skip Threshold
              </label>
              <span className="text-xs font-mono font-bold text-amber-500">
                {dropThreshold}%
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={45}
              step={1}
              value={dropThreshold}
              onChange={(e) => setDropThreshold(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <p className="text-[10px] text-zinc-400">
              Eliminates slow intros and skips straight into the energetic hook/chorus.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: APP PLATFORMS & FREE HOSTING */}
      <section className="p-5 sm:p-6 rounded-2xl bg-zinc-100 dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
          Musily Cross-Platform Deployment
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Musily is compiled to work natively on <strong>Windows Desktop</strong>, <strong>Web Browsers</strong>, and <strong>Android Mobile (APK)</strong>. All WebRTC real-time synchronization runs 100% free with zero cloud server costs.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2 text-zinc-500 text-xs">
          <span className="flex items-center gap-1.5">
            <Laptop className="w-4 h-4" /> Windows Desktop
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4" /> Web Browser
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" /> Android APK
          </span>
        </div>
      </section>
    </div>
  );
};
