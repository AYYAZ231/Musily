import React, { useState } from 'react';
import {
  Play,
  Pause,
  Plus,
  Radio,
  Zap,
  ArrowRight,
  Flame,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  Disc3,
  Sliders,
  ListPlus,
  ExternalLink,
  Layers,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { FEATURED_SPOTIFY_TRACKS, FEATURED_SPOTIFY_PLAYLISTS } from '../../services/spotifyService';
import { FEATURED_YOUTUBE_TRACKS, FEATURED_YOUTUBE_PLAYLISTS } from '../../services/youtubeService';
import { SpotifyIcon, YouTubeIcon } from '../common/StreamingIcons';
import { EqualizerBars } from '../common/EqualizerBars';
import { Track, Playlist } from '../../types';

interface HomeViewProps {
  onOpenPartyModal: () => void;
  onOpenAccountModal: () => void;
}

type RecommendationFilter = 'all' | 'spotify' | 'youtube' | 'personalized';

export const HomeView: React.FC<HomeViewProps> = ({ onOpenPartyModal, onOpenAccountModal }) => {
  const { state, actions } = useMusicStore();
  const [platformFilter, setPlatformFilter] = useState<RecommendationFilter>('all');
  const [selectedVibe, setSelectedVibe] = useState('all');

  const vibeCategories = [
    { id: 'all', label: '🔥 All Bangers', filter: () => true },
    { id: 'drops', label: '⚡ Fast Hook Drops (≤30s)', filter: (t: Track) => !!t.dropTime && t.dropTime <= 30 },
    { id: 'club', label: '🔊 Club & Party Heat', filter: (t: Track) => t.votes > 25 },
    { id: 'punjabi', label: '💥 Desi & Punjabi Hits', filter: (t: Track) => /Karan|AP Dhillon|Diljit|Riar|Arijit|Pritam/i.test(t.artist) },
    { id: 'global', label: '🌍 Global Top 40', filter: (t: Track) => /Weeknd|Eminem|Dua Lipa|Drake|Taylor Swift|Sabrina|Billie|Styles|Balvin|Fonsi/i.test(t.artist) }
  ];

  const currentVibeFilter = vibeCategories.find((v) => v.id === selectedVibe)?.filter || (() => true);

  const filteredSpotifyTracks = FEATURED_SPOTIFY_TRACKS.filter(currentVibeFilter);
  const filteredYouTubeTracks = FEATURED_YOUTUBE_TRACKS.filter(currentVibeFilter);

  // Mixed curated list for the party table
  const mixedPartyDrops = [
    FEATURED_SPOTIFY_TRACKS[0], // Starboy
    FEATURED_YOUTUBE_TRACKS[0], // Tauba Tauba
    FEATURED_SPOTIFY_TRACKS[2], // Brown Munde
    FEATURED_YOUTUBE_TRACKS[1], // Obsessed
    FEATURED_SPOTIFY_TRACKS[6], // Espresso
    FEATURED_YOUTUBE_TRACKS[3], // Proper Patola
    FEATURED_SPOTIFY_TRACKS[7], // Birds of a Feather
    FEATURED_YOUTUBE_TRACKS[6], // Kinni Kinni
  ].filter(currentVibeFilter);

  const spotlightTrack = state.currentTrack || FEATURED_SPOTIFY_TRACKS[0];

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePlayAll = (tracks: Track[]) => {
    if (!tracks.length) return;
    actions.playTrack(tracks[0]);
    tracks.slice(1).forEach((t) => actions.addToQueue(t));
  };

  const handleQueueAll = (tracks: Track[]) => {
    tracks.forEach((t) => actions.addToQueue(t));
  };

  const isSpotifyConnected = state.linkedAccounts.spotify.isConnected;
  const isYouTubeConnected = state.linkedAccounts.youtube.isConnected;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 select-none animate-fade-in">
      {/* =========================================================================
          HERO STAGE: Cinematic Editorial Banner & Interactive Spotlight
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-6 sm:p-10 border border-zinc-800/80 shadow-2xl">
        {/* Ambient Gradient Orbs behind hero */}
        <div className="absolute top-0 right-1/4 -mt-16 w-96 h-96 bg-emerald-500/15 dark:bg-[#D4FF00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 -mb-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Story & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-emerald-400 dark:text-[#D4FF00] tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-[#D4FF00] animate-ping" />
              <span>LIVE AUX ACTIVE</span>
              <span className="text-white/40">|</span>
              <span className="text-white/80 font-normal">Real-Time Sync</span>
            </div>

            {/* Hero Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.05] text-white">
                THE AUX CORD, <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-[#D4FF00] dark:from-[#D4FF00] dark:via-lime-300 dark:to-emerald-400 bg-clip-text text-transparent">
                  REINVENTED.
                </span>
              </h1>
              <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-normal">
                Continuous high-energy music drops straight into the hook and chorus. Browse full recommendations from YouTube Music and Spotify, pass the Aux to friends live online, and upvote what plays next — 100% free with zero fees.
              </p>
            </div>

            {/* Hero Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenPartyModal}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 dark:from-[#D4FF00] dark:to-[#B6EB00] text-black font-extrabold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 shadow-lg shadow-emerald-950/40 dark:shadow-[#D4FF00]/10"
              >
                <Radio className="w-4 h-4" />
                <span>{state.isPartyActive ? 'Open Active Party Room' : 'Host Free Party Room'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={actions.toggleDropMode}
                className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 ${
                  state.dropMode
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-md animate-drop-glow'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
                }`}
                title="Automatically skips slow song intros and jumps straight into the energetic hook/chorus"
              >
                <Zap className={`w-4 h-4 ${state.dropMode ? 'fill-current text-amber-400' : 'text-zinc-400'}`} />
                <span>The Drop Mode: {state.dropMode ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => actions.toggleEqualizerModal(true)}
                className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
                title="Open 10-Band EQ & AI Sound Studio"
              >
                <Sliders className="w-4 h-4 text-emerald-400 dark:text-[#D4FF00]" />
                <span className="hidden sm:inline">10-Band EQ</span>
              </button>
            </div>
          </div>

          {/* Right Spotlight Vinyl Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-sm p-4 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-300 hover:border-white/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 dark:text-[#D4FF00] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-[#D4FF00] animate-pulse" />
                  Spotlight Drop
                </span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    spotlightTrack.source === 'spotify' ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'bg-[#FF0000]/20 text-[#FF0000]'
                  }`}>
                    {spotlightTrack.source === 'spotify' ? <SpotifyIcon className="w-3 h-3" /> : <YouTubeIcon className="w-3 h-3" />}
                    {spotlightTrack.source === 'spotify' ? 'Spotify' : 'YouTube'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    ⚡ Hook @ {spotlightTrack.dropTime || 28}s
                  </span>
                </div>
              </div>

              {/* Artwork with subtle emerging vinyl disc on hover */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-lg bg-zinc-950 mb-3.5">
                <img
                  src={spotlightTrack.coverUrl}
                  alt={spotlightTrack.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Big Glass Play Overlay Button */}
                <button
                  onClick={() => {
                    if (state.currentTrack?.id === spotlightTrack.id) {
                      actions.togglePlay();
                    } else {
                      actions.playTrack(spotlightTrack);
                    }
                  }}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl"
                >
                  {state.isPlaying && state.currentTrack?.id === spotlightTrack.id ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>

                {/* Equalizer indicator if playing */}
                {state.isPlaying && state.currentTrack?.id === spotlightTrack.id && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/70 backdrop-blur-md flex items-center gap-1.5 border border-white/20">
                    <EqualizerBars isPlaying={true} size="sm" />
                    <span className="text-[9px] font-mono font-bold text-emerald-400">LIVE</span>
                  </div>
                )}
              </div>

              {/* Spotlight Title & Action */}
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 dark:group-hover:text-[#D4FF00] transition-colors">
                    {spotlightTrack.title}
                  </h3>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{spotlightTrack.artist}</p>
                </div>
                <button
                  onClick={() => actions.addToQueue(spotlightTrack)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                  title="Add to Next Up Queue"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Queue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PRIMARY RECOMMENDATION SOURCE FILTER BAR
          Allows instant switching between All, Spotify, YouTube & Personalized
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-500 dark:text-[#D4FF00]" />
              <span>Discover Streaming Recommendations</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Live recommendations sourced directly from YouTube Music and Spotify official catalogs.
            </p>
          </div>

          {/* Source Tabs */}
          <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 self-start sm:self-auto">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                platformFilter === 'all'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Recommendations</span>
            </button>

            <button
              onClick={() => setPlatformFilter('spotify')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                platformFilter === 'spotify'
                  ? 'bg-[#1DB954] text-black shadow-xs'
                  : 'text-zinc-500 hover:text-[#1DB954]'
              }`}
            >
              <SpotifyIcon className="w-3.5 h-3.5" />
              <span>Spotify ({FEATURED_SPOTIFY_TRACKS.length})</span>
            </button>

            <button
              onClick={() => setPlatformFilter('youtube')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                platformFilter === 'youtube'
                  ? 'bg-[#FF0000] text-white shadow-xs'
                  : 'text-zinc-500 hover:text-[#FF0000]'
              }`}
            >
              <YouTubeIcon className="w-3.5 h-3.5" />
              <span>YouTube ({FEATURED_YOUTUBE_TRACKS.length})</span>
            </button>

            <button
              onClick={() => setPlatformFilter('personalized')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                platformFilter === 'personalized'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Disc3 className="w-3.5 h-3.5" />
              <span>For You</span>
            </button>
          </div>
        </div>

        {/* Vibe Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {vibeCategories.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => setSelectedVibe(vibe.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border shrink-0 ${
                selectedVibe === vibe.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-xs scale-[1.02]'
                  : 'bg-white dark:bg-[#121216] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
            >
              {vibe.label}
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION: PERSONALIZED MIX & ACCOUNT SYNC
          Visible in 'all' or 'personalized' views
          ========================================================================= */}
      {(platformFilter === 'all' || platformFilter === 'personalized') && (
        <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-500/[0.05] via-zinc-900/[0.02] to-cyan-500/[0.05] dark:from-emerald-500/[0.08] dark:to-cyan-500/[0.08] border border-emerald-500/20 dark:border-emerald-500/30 shadow-sm relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
                <h3 className="text-base sm:text-lg font-display font-extrabold text-zinc-900 dark:text-white">
                  Curated For Your Connected Accounts
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                AI recommendations combined from your active Spotify & YouTube streaming profiles.
              </p>
            </div>

            {/* Badges or Connect CTA */}
            <div className="flex flex-wrap items-center gap-2">
              {isSpotifyConnected ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1DB954]/15 border border-[#1DB954]/30 text-[#1DB954] text-xs font-mono font-bold">
                  <SpotifyIcon className="w-3.5 h-3.5" />
                  <span>@{state.linkedAccounts.spotify.username}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                </div>
              ) : (
                <button
                  onClick={onOpenAccountModal}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 transition-colors"
                >
                  <SpotifyIcon className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>Link Spotify</span>
                </button>
              )}

              {isYouTubeConnected ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF0000]/15 border border-[#FF0000]/30 text-[#FF0000] text-xs font-mono font-bold">
                  <YouTubeIcon className="w-3.5 h-3.5" />
                  <span>@{state.linkedAccounts.youtube.channelTitle}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF0000]" />
                </div>
              ) : (
                <button
                  onClick={onOpenAccountModal}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 hover:border-red-500 transition-colors"
                >
                  <YouTubeIcon className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>Link YouTube</span>
                </button>
              )}

              <button
                onClick={onOpenAccountModal}
                className="text-xs font-bold text-emerald-600 dark:text-[#D4FF00] hover:underline ml-1"
              >
                Manage
              </button>
            </div>
          </div>

          {/* Quick 4-card personalized preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
            {[FEATURED_SPOTIFY_TRACKS[0], FEATURED_YOUTUBE_TRACKS[0], FEATURED_SPOTIFY_TRACKS[2], FEATURED_YOUTUBE_TRACKS[1]].map((recTrack) => {
              const isCurrent = state.currentTrack?.id === recTrack.id;
              const isPlaying = isCurrent && state.isPlaying;

              return (
                <div
                  key={recTrack.id}
                  onClick={() => actions.playTrack(recTrack)}
                  className="group relative p-3 rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200/90 dark:border-zinc-800/90 hover:border-emerald-500/40 dark:hover:border-[#D4FF00]/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-xs"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-2.5">
                    <img
                      src={recTrack.coverUrl}
                      alt={recTrack.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Source Pill */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md flex items-center gap-1 text-[9px] font-bold text-white">
                      {recTrack.source === 'spotify' ? (
                        <SpotifyIcon className="w-2.5 h-2.5 text-[#1DB954]" />
                      ) : (
                        <YouTubeIcon className="w-2.5 h-2.5 text-[#FF0000]" />
                      )}
                      <span>{recTrack.source === 'spotify' ? 'Spotify' : 'YouTube'}</span>
                    </div>

                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-mono text-emerald-400 font-bold">
                      ⚡ 0:{recTrack.dropTime}
                    </div>

                    {/* Play Overlay */}
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {isPlaying ? (
                        <EqualizerBars isPlaying={true} size="sm" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white dark:bg-[#D4FF00] text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-[#D4FF00] transition-colors">
                      {recTrack.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {recTrack.artist}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION: SPOTIFY TOP RECOMMENDATIONS (12 CURATED CHARTBUSTERS)
          Visible when platformFilter === 'all' || platformFilter === 'spotify'
          ========================================================================= */}
      {(platformFilter === 'all' || platformFilter === 'spotify') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1DB954]/15 border border-[#1DB954]/30 flex items-center justify-center text-[#1DB954] shadow-xs">
                <SpotifyIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-zinc-900 dark:text-white">
                    Spotify Top Recommendations & Viral Hits
                  </h3>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-[10px] font-mono font-bold border border-[#1DB954]/20">
                    Official Catalog
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Chart-topping worldwide hits, high-octane streaming drops, and club chartbusters.
                </p>
              </div>
            </div>

            {/* Quick Batch Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayAll(filteredSpotifyTracks)}
                className="px-3.5 py-1.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play All ({filteredSpotifyTracks.length})</span>
              </button>

              <button
                onClick={() => handleQueueAll(filteredSpotifyTracks)}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1"
                title="Add all Spotify recommendations to party queue"
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Queue All</span>
              </button>
            </div>
          </div>

          {/* Spotify Recommendations Grid (Responsive 2 to 6 columns) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {filteredSpotifyTracks.map((track) => {
              const isCurrent = state.currentTrack?.id === track.id;
              const isPlaying = isCurrent && state.isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => actions.playTrack(track)}
                  className={`group relative p-3 rounded-2xl bg-white dark:bg-[#0E0F14] border transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-xs ${
                    isCurrent
                      ? 'border-[#1DB954] ring-1 ring-[#1DB954]/30 shadow-md'
                      : 'border-zinc-200/90 dark:border-zinc-800/90 hover:border-[#1DB954]/50'
                  }`}
                >
                  {/* Artwork Container */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-2.5 shadow-xs">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Top Spotify Brand Tag */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md flex items-center gap-1 text-[9px] font-bold text-[#1DB954] border border-[#1DB954]/30">
                      <SpotifyIcon className="w-2.5 h-2.5" />
                      <span>Spotify</span>
                    </div>

                    {/* Hook Drop Cue Badge */}
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[9px] font-mono font-bold text-amber-300 border border-white/10">
                      ⚡ 0:{track.dropTime || 28}
                    </div>

                    {/* Floating Play Overlay */}
                    <div className={`absolute inset-0 bg-black/35 flex items-center justify-center transition-opacity duration-300 ${
                      isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrent) {
                            actions.togglePlay();
                          } else {
                            actions.playTrack(track);
                          }
                        }}
                        className="w-11 h-11 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all hover:scale-105 active:scale-95"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>

                    {/* Live Equalizer indicator when playing */}
                    {isPlaying && (
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#1DB954]/40 flex items-center gap-1">
                        <EqualizerBars isPlaying={true} size="sm" />
                      </div>
                    )}
                  </div>

                  {/* Track Meta & Quick Controls */}
                  <div className="space-y-1">
                    <h4
                      className={`text-xs font-bold truncate transition-colors ${
                        isCurrent
                          ? 'text-[#1DB954]'
                          : 'text-zinc-900 dark:text-white group-hover:text-[#1DB954]'
                      }`}
                      title={track.title}
                    >
                      {track.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate" title={track.artist}>
                      {track.artist}
                    </p>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100 dark:border-zinc-800/60" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => actions.addToQueue(track)}
                        className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 text-[10px] font-semibold"
                        title="Add to Next Up Queue"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Queue</span>
                      </button>

                      <button
                        onClick={() => actions.voteTrack(track.id)}
                        className="p-1 rounded-md text-zinc-400 hover:text-[#1DB954] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-0.5 text-[10px] font-mono font-bold"
                        title="Upvote on Aux"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{track.votes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION: YOUTUBE MUSIC RECOMMENDATIONS (12 CURATED VIRAL DROPS & VIDEOS)
          Visible when platformFilter === 'all' || platformFilter === 'youtube'
          ========================================================================= */}
      {(platformFilter === 'all' || platformFilter === 'youtube') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF0000]/15 border border-[#FF0000]/30 flex items-center justify-center text-[#FF0000] shadow-xs">
                <YouTubeIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-zinc-900 dark:text-white">
                    YouTube Music Recommendations & Viral Drops
                  </h3>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#FF0000]/10 text-[#FF0000] text-[10px] font-mono font-bold border border-[#FF0000]/20">
                    Trending Video Catalog
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  High-energy official music video drops, Punjabi dance heaters, and viral YouTube anthems.
                </p>
              </div>
            </div>

            {/* Quick Batch Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayAll(filteredYouTubeTracks)}
                className="px-3.5 py-1.5 rounded-xl bg-[#FF0000] hover:bg-[#e60000] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play All ({filteredYouTubeTracks.length})</span>
              </button>

              <button
                onClick={() => handleQueueAll(filteredYouTubeTracks)}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1"
                title="Add all YouTube recommendations to party queue"
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Queue All</span>
              </button>
            </div>
          </div>

          {/* YouTube Recommendations Grid (Responsive 2 to 6 columns) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {filteredYouTubeTracks.map((track) => {
              const isCurrent = state.currentTrack?.id === track.id;
              const isPlaying = isCurrent && state.isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => actions.playTrack(track)}
                  className={`group relative p-3 rounded-2xl bg-white dark:bg-[#0E0F14] border transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-xs ${
                    isCurrent
                      ? 'border-[#FF0000] ring-1 ring-[#FF0000]/30 shadow-md'
                      : 'border-zinc-200/90 dark:border-zinc-800/90 hover:border-[#FF0000]/50'
                  }`}
                >
                  {/* Artwork Container */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-2.5 shadow-xs">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Top YouTube Brand Tag */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md flex items-center gap-1 text-[9px] font-bold text-[#FF0000] border border-[#FF0000]/30">
                      <YouTubeIcon className="w-2.5 h-2.5" />
                      <span>YouTube</span>
                    </div>

                    {/* Hook Drop Cue Badge */}
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[9px] font-mono font-bold text-amber-300 border border-white/10">
                      ⚡ 0:{track.dropTime || 28}
                    </div>

                    {/* Floating Play Overlay */}
                    <div className={`absolute inset-0 bg-black/35 flex items-center justify-center transition-opacity duration-300 ${
                      isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrent) {
                            actions.togglePlay();
                          } else {
                            actions.playTrack(track);
                          }
                        }}
                        className="w-11 h-11 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all hover:scale-105 active:scale-95"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>

                    {/* Live Equalizer indicator when playing */}
                    {isPlaying && (
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#FF0000]/40 flex items-center gap-1">
                        <EqualizerBars isPlaying={true} size="sm" />
                      </div>
                    )}
                  </div>

                  {/* Track Meta & Quick Controls */}
                  <div className="space-y-1">
                    <h4
                      className={`text-xs font-bold truncate transition-colors ${
                        isCurrent
                          ? 'text-[#FF0000]'
                          : 'text-zinc-900 dark:text-white group-hover:text-[#FF0000]'
                      }`}
                      title={track.title}
                    >
                      {track.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate" title={track.artist}>
                      {track.artist}
                    </p>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100 dark:border-zinc-800/60" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => actions.addToQueue(track)}
                        className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 text-[10px] font-semibold"
                        title="Add to Next Up Queue"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Queue</span>
                      </button>

                      <button
                        onClick={() => actions.voteTrack(track.id)}
                        className="p-1 rounded-md text-zinc-400 hover:text-[#FF0000] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-0.5 text-[10px] font-mono font-bold"
                        title="Upvote on Aux"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{track.votes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          FEATURED STREAMING PLAYLIST SETS (SPOTIFY & YOUTUBE MUSIC)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-display font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
              <span>Curated Streaming Playlists</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Hand-picked sets engineered for zero dead air and continuous party momentum.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...FEATURED_SPOTIFY_PLAYLISTS, ...FEATURED_YOUTUBE_PLAYLISTS].map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => handlePlayAll(playlist.tracks)}
              className="group relative p-4 rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200/90 dark:border-zinc-800/90 hover:border-emerald-500/40 dark:hover:border-[#D4FF00]/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-xs"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 mb-3 shadow-sm">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Source Pill */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md flex items-center gap-1.5 text-[10px] font-bold text-white border border-white/10">
                  {playlist.source === 'spotify' ? (
                    <SpotifyIcon className="w-3 h-3 text-[#1DB954]" />
                  ) : (
                    <YouTubeIcon className="w-3 h-3 text-[#FF0000]" />
                  )}
                  <span>{playlist.source === 'spotify' ? 'Spotify Curated' : 'YouTube Music'}</span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-[#D4FF00] text-black flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-[#D4FF00] transition-colors">
                  {playlist.name}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {playlist.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>{playlist.trackCount} Banger Tracks</span>
                  <span className="text-emerald-600 dark:text-[#D4FF00] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Play Set</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION: CURATED PARTY DROPS TABLE (CROSS-PLATFORM QUICK MIX)
          ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-lg sm:text-xl font-display font-extrabold text-zinc-900 dark:text-white">
                Live Aux Party Drops Mix
              </h3>
              <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
                · Zero Dead Air
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Hook drops fast-forwarded into the chorus across Spotify & YouTube Music.
            </p>
          </div>

          <button
            onClick={() => actions.setActiveTab('search')}
            className="text-xs font-bold text-emerald-600 dark:text-[#D4FF00] hover:underline flex items-center gap-1"
          >
            <span>Live Catalog Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean Modern Track List */}
        <div className="rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-4 py-2.5 text-[11px] font-mono uppercase text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800/60 font-semibold">
            <span className="col-span-1 text-center">#</span>
            <span className="col-span-6 sm:col-span-5">Title & Source</span>
            <span className="hidden sm:block sm:col-span-3 text-right">Drop Cue</span>
            <span className="col-span-3 sm:col-span-2 text-right">Duration</span>
            <span className="col-span-2 sm:col-span-1 text-center">Aux</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {mixedPartyDrops.map((track, index) => {
              const isCurrent = state.currentTrack?.id === track.id;
              const isPlaying = isCurrent && state.isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => actions.playTrack(track)}
                  className={`grid grid-cols-12 gap-3 px-4 py-3 items-center cursor-pointer transition-all duration-200 group relative ${
                    isCurrent
                      ? 'bg-emerald-500/[0.08] dark:bg-[#D4FF00]/[0.08]'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  {/* Left accent bar for active track */}
                  {isCurrent && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-500 dark:bg-[#D4FF00]" />
                  )}

                  {/* Col 1: Index or Animated Equalizer */}
                  <div className="col-span-1 flex items-center justify-center">
                    {isPlaying ? (
                      <EqualizerBars isPlaying={true} size="sm" />
                    ) : (
                      <span className="text-xs font-mono text-zinc-400 group-hover:hidden">
                        {index + 1}
                      </span>
                    )}
                    <Play className="w-3.5 h-3.5 text-zinc-900 dark:text-white hidden group-hover:block" />
                  </div>

                  {/* Col 2: Thumbnail, Title, Artist, Source */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm relative">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isCurrent
                              ? 'text-emerald-700 dark:text-[#D4FF00] font-bold'
                              : 'text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-white'
                          }`}
                        >
                          {track.title}
                        </p>
                        {track.source === 'spotify' ? (
                          <span className="shrink-0 p-0.5 rounded text-[#1DB954]" title="Spotify">
                            <SpotifyIcon className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="shrink-0 p-0.5 rounded text-[#FF0000]" title="YouTube">
                            <YouTubeIcon className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  {/* Col 3: Drop Cue Hook Timestamp */}
                  <div className="hidden sm:flex sm:col-span-3 items-center justify-end">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-bold border border-amber-500/20">
                      <Zap className="w-3 h-3 fill-current" />
                      Drop @ {track.dropTime || 28}s
                    </span>
                  </div>

                  {/* Col 4: Track Duration */}
                  <div className="col-span-3 sm:col-span-2 text-right">
                    <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                      {formatDuration(track.duration)}
                    </span>
                  </div>

                  {/* Col 5: Upvote & Quick Queue */}
                  <div
                    className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => actions.addToQueue(track)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      title="Add to Party Queue"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => actions.voteTrack(track.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-600 dark:hover:text-[#D4FF00] hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-0.5"
                      title="Upvote on Aux"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span className="text-[10px] font-mono">{track.votes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: FREE ONLINE PARTY AUX CALLOUT
          ========================================================================= */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-[#0A0D14] border border-zinc-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 dark:text-[#D4FF00] font-bold">
            <Radio className="w-4 h-4" />
            <span>Live Aux Party Mode</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight">
            Want to listen synchronized with friends right now?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg">
            Create a party room, share the 6-letter room code, and Musily syncs playback via real-time WebRTC peer-to-peer data channels for 100% free.
          </p>
        </div>

        <button
          onClick={onOpenPartyModal}
          className="px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-100 font-extrabold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shrink-0 flex items-center gap-2"
        >
          <Radio className="w-4 h-4 text-emerald-600" />
          <span>Launch Party Deck</span>
        </button>
      </section>
    </div>
  );
};
