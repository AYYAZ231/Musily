import React, { useState, useEffect } from 'react';
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
  Layers,
  CheckCircle2,
  Clock,
  Music,
  Heart,
  User
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { FEATURED_SPOTIFY_TRACKS, FEATURED_SPOTIFY_PLAYLISTS } from '../../services/spotifyService';
import { FEATURED_YOUTUBE_TRACKS, FEATURED_YOUTUBE_PLAYLISTS } from '../../services/youtubeService';
import { RecommendationService, RecentRecommendation } from '../../services/recommendationService';
import { CatalogService, OFFICIAL_ARTISTS } from '../../services/catalogService';
import { AlbumViewModal } from '../album/AlbumViewModal';
import { EqualizerBars } from '../common/EqualizerBars';
import { Track, Album } from '../../types';

interface HomeViewProps {
  onOpenPartyModal: () => void;
  onOpenAccountModal: () => void;
}

type RecommendationFilter = 'all' | 'recents' | 'chartbusters' | 'viral' | 'personalized';

export const HomeView: React.FC<HomeViewProps> = ({ onOpenPartyModal, onOpenAccountModal }) => {
  const { state, actions } = useMusicStore();
  const [platformFilter, setPlatformFilter] = useState<RecommendationFilter>('all');
  const [selectedVibe, setSelectedVibe] = useState('all');
  const [recentRecommendations, setRecentRecommendations] = useState<RecentRecommendation[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const featuredAlbums = CatalogService.getAllReleases();

  // Refresh dynamic recommendations based on followed artists, liked songs & recent listens
  useEffect(() => {
    const recs = RecommendationService.getRecommendationsFromRecents();
    setRecentRecommendations(recs);
  }, [state.currentTrack?.id, state.history.length, state.followedArtists, state.likedSongs]);

  const vibeCategories = [
    { id: 'all', label: '🔥 All Bangers', filter: () => true },
    { id: 'drops', label: '⚡ Fast Hook Drops (≤30s)', filter: (t: Track) => !!t.dropTime && t.dropTime <= 30 },
    { id: 'club', label: '🔊 Club & Party Heat', filter: (t: Track) => t.votes > 25 },
    { id: 'punjabi', label: '💥 Desi & Punjabi Hits', filter: (t: Track) => /Karan|AP Dhillon|Diljit|Riar|Arijit|Pritam/i.test(t.artist) },
    { id: 'global', label: '🌍 Global Top 40', filter: (t: Track) => /Weeknd|Eminem|Dua Lipa|Drake|Taylor Swift|Sabrina|Billie|Styles|Balvin|Fonsi/i.test(t.artist) }
  ];

  const currentVibeFilter = vibeCategories.find((v) => v.id === selectedVibe)?.filter || (() => true);

  const filteredChartbusters = FEATURED_SPOTIFY_TRACKS.filter(currentVibeFilter);
  const filteredViralDrops = FEATURED_YOUTUBE_TRACKS.filter(currentVibeFilter);

  // Curated list for the party table without platform mentions
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
        {/* Ambient Gradient Orbs */}
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
                Continuous high-energy music drops straight into the hook and chorus. Dynamic recommendations tuned to your recent listening history, pass the Aux to friends live online, and upvote what plays next — 100% free with zero fees.
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

          {/* Right Spotlight Vinyl Card (Clean: no provider branding on song/album) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-sm p-4 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-300 hover:border-white/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 dark:text-[#D4FF00] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-[#D4FF00] animate-pulse" />
                  Spotlight Drop
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white font-mono">
                    Curated
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
          RECOMMENDATION SOURCE & VIBE FILTER BAR
          Clean categorized filters without platform badges on songs
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-500 dark:text-[#D4FF00]" />
              <span>Discover Music Recommendations</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Dynamically adapted to your recent listening history and curated charts.
            </p>
          </div>

          {/* Clean Recommendation Tabs */}
          <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 self-start sm:self-auto flex-wrap">
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
              onClick={() => setPlatformFilter('recents')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                platformFilter === 'recents'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-emerald-600'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Based on Your Recents</span>
            </button>

            <button
              onClick={() => setPlatformFilter('chartbusters')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                platformFilter === 'chartbusters'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-amber-500'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Chartbusters ({FEATURED_SPOTIFY_TRACKS.length})</span>
            </button>

            <button
              onClick={() => setPlatformFilter('viral')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                platformFilter === 'viral'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-cyan-600'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Viral Drops ({FEATURED_YOUTUBE_TRACKS.length})</span>
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
          PRIMARY DYNAMIC SECTION: BASED ON YOUR RECENT LISTENS
          Dynamically tuned to user's recent Spotify and YouTube listening history
          ========================================================================= */}
      {(platformFilter === 'all' || platformFilter === 'recents') && recentRecommendations.length > 0 && (
        <section className="space-y-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-500/[0.06] via-zinc-900/[0.02] to-teal-500/[0.06] dark:from-emerald-500/[0.09] dark:to-teal-500/[0.09] border border-emerald-500/25 dark:border-emerald-500/35 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
                <h3 className="text-base sm:text-lg font-display font-extrabold text-zinc-900 dark:text-white">
                  Based on Your Recent Listens
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#D4FF00] text-[10px] font-mono font-bold border border-emerald-500/20">
                  Adaptive Engine
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Recommendations automatically adapt whenever you play or stream songs from your connected accounts.
              </p>
            </div>

            {/* Quick Batch Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayAll(recentRecommendations.map((r) => r.track))}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Recents Mix</span>
              </button>
            </div>
          </div>

          {/* Dynamic Recent Recommendations Grid (Clean: zero platform labels on cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5 pt-1">
            {recentRecommendations.map((item) => {
              const track = item.track;
              const isCurrent = state.currentTrack?.id === track.id;
              const isPlaying = isCurrent && state.isPlaying;

              return (
                <div
                  key={`rec_${track.id}`}
                  onClick={() => actions.playTrack(track)}
                  className={`group relative p-3 rounded-2xl bg-white dark:bg-[#0E0F14] border transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-xs ${
                    isCurrent
                      ? 'border-emerald-500 ring-1 ring-emerald-500/30 shadow-md'
                      : 'border-zinc-200/90 dark:border-zinc-800/90 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-2.5 shadow-xs">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Hook Drop Cue Badge */}
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[9px] font-mono font-bold text-amber-300 border border-white/10">
                      ⚡ 0:{track.dropTime || 28}
                    </div>

                    {/* Inspired by badge on artwork */}
                    <div className="absolute bottom-2 left-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] text-zinc-200 font-medium truncate border border-white/10">
                      ✨ {item.inspiredBy}
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
                        className="w-11 h-11 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all hover:scale-105 active:scale-95"
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
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-emerald-500/40 flex items-center gap-1">
                        <EqualizerBars isPlaying={true} size="sm" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4
                      className={`text-xs font-bold truncate transition-colors ${
                        isCurrent
                          ? 'text-emerald-600 dark:text-[#D4FF00]'
                          : 'text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#D4FF00]'
                      }`}
                      title={track.title}
                    >
                      {track.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate" title={track.artist}>
                      {track.artist}
                    </p>

                    {/* Action Footer with Heart, Queue, Aux */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100 dark:border-zinc-800/60" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => actions.toggleLikeSong(track)}
                        className={`p-1 rounded-md transition-colors flex items-center gap-1 text-[10px] font-semibold ${
                          actions.isSongLiked(track.id, track.title)
                            ? 'text-rose-500 hover:text-rose-600'
                            : 'text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                        title={actions.isSongLiked(track.id, track.title) ? 'Unlike' : 'Like'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${actions.isSongLiked(track.id, track.title) ? 'fill-rose-500' : ''}`} />
                      </button>

                      <div className="flex items-center gap-1">
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
                          className="p-1 rounded-md text-zinc-400 hover:text-emerald-600 dark:hover:text-[#D4FF00] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-0.5 text-[10px] font-mono font-bold"
                          title="Upvote on Aux"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{track.votes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION: PERSONALIZED FOR YOU (CONNECTED PROFILES)
          Visible in 'all' or 'personalized' views
          ========================================================================= */}
      {(platformFilter === 'all' || platformFilter === 'personalized') && (
        <section className="p-5 sm:p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
                <h3 className="text-base sm:text-lg font-display font-extrabold text-zinc-900 dark:text-white">
                  Curated For Your Taste
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Personalized selections based on your streaming profile preferences.
              </p>
            </div>

            {/* Account Status Badges or Link Trigger */}
            <div className="flex flex-wrap items-center gap-2">
              {isSpotifyConnected && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                  <span>@{state.linkedAccounts.spotify.username}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              )}

              {isYouTubeConnected && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono font-bold">
                  <span>@{state.linkedAccounts.youtube.channelTitle}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                </div>
              )}

              {(!isSpotifyConnected || !isYouTubeConnected) && (
                <button
                  onClick={onOpenAccountModal}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 transition-colors"
                >
                  <span>Connect Streaming Accounts</span>
                </button>
              )}

              <button
                onClick={onOpenAccountModal}
                className="text-xs font-bold text-emerald-600 dark:text-[#D4FF00] hover:underline ml-1"
              >
                Settings
              </button>
            </div>
          </div>

          {/* Quick 4-card personalized preview (Clean: zero platform labels on cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
            {[FEATURED_SPOTIFY_TRACKS[0], FEATURED_YOUTUBE_TRACKS[0], FEATURED_SPOTIFY_TRACKS[2], FEATURED_YOUTUBE_TRACKS[1]].map((recTrack) => {
              const isCurrent = state.currentTrack?.id === recTrack.id;
              const isPlaying = isCurrent && state.isPlaying;

              return (
                <div
                  key={`curated_${recTrack.id}`}
                  onClick={() => actions.playTrack(recTrack)}
                  className="group relative p-3 rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200/90 dark:border-zinc-800/90 hover:border-emerald-500/40 dark:hover:border-[#D4FF00]/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-xs"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-2.5">
                    <img
                      src={recTrack.coverUrl}
                      alt={recTrack.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-mono text-amber-300 font-bold border border-white/10">
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
          SECTION: TOP CHARTBUSTERS & HIT DROPS (12 CURATED BANGERS)
          Clean: Zero platform badges/mentions on songs and albums
          ========================================================================= */}
      {(platformFilter === 'all' || platformFilter === 'chartbusters') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xs">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-zinc-900 dark:text-white">
                    Top Chartbusters & Global Hits
                  </h3>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-mono font-bold border border-amber-500/20">
                    High Energy
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Chart-topping worldwide hits, high-octane streaming drops, and club anthems.
                </p>
              </div>
            </div>

            {/* Quick Batch Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayAll(filteredChartbusters)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play All ({filteredChartbusters.length})</span>
              </button>

              <button
                onClick={() => handleQueueAll(filteredChartbusters)}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1"
                title="Add all to party queue"
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Queue All</span>
              </button>
            </div>
          </div>

          {/* Grid (Clean: no platform labels on artwork or titles) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {filteredChartbusters.map((track) => {
              const isCurrent = state.currentTrack?.id === track.id;
              const isPlaying = isCurrent && state.isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => actions.playTrack(track)}
                  className={`group relative p-3 rounded-2xl bg-white dark:bg-[#0E0F14] border transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-xs ${
                    isCurrent
                      ? 'border-amber-500 ring-1 ring-amber-500/30 shadow-md'
                      : 'border-zinc-200/90 dark:border-zinc-800/90 hover:border-amber-500/50'
                  }`}
                >
                  {/* Artwork Container (Clean: zero provider tags) */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-2.5 shadow-xs">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

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
                        className="w-11 h-11 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all hover:scale-105 active:scale-95"
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
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-amber-500/40 flex items-center gap-1">
                        <EqualizerBars isPlaying={true} size="sm" />
                      </div>
                    )}
                  </div>

                  {/* Track Meta & Quick Controls */}
                  <div className="space-y-1">
                    <h4
                      className={`text-xs font-bold truncate transition-colors ${
                        isCurrent
                          ? 'text-amber-500'
                          : 'text-zinc-900 dark:text-white group-hover:text-amber-500'
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
                        className="p-1 rounded-md text-zinc-400 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-0.5 text-[10px] font-mono font-bold"
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
          SECTION: VIRAL DROPS & VIDEO ANTHEMS (12 CURATED VIRAL BANGERS)
          Clean: Zero platform badges/mentions on songs and albums
          ========================================================================= */}
      {(platformFilter === 'all' || platformFilter === 'viral') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-zinc-900 dark:text-white">
                    Viral Drops & Video Anthems
                  </h3>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-mono font-bold border border-cyan-500/20">
                    Worldwide Trending
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  High-energy dance heaters, Punjabi anthems, and worldwide trending sensations.
                </p>
              </div>
            </div>

            {/* Quick Batch Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayAll(filteredViralDrops)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play All ({filteredViralDrops.length})</span>
              </button>

              <button
                onClick={() => handleQueueAll(filteredViralDrops)}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1"
                title="Add all to party queue"
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Queue All</span>
              </button>
            </div>
          </div>

          {/* Grid (Clean: no platform labels on artwork or titles) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {filteredViralDrops.map((track) => {
              const isCurrent = state.currentTrack?.id === track.id;
              const isPlaying = isCurrent && state.isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => actions.playTrack(track)}
                  className={`group relative p-3 rounded-2xl bg-white dark:bg-[#0E0F14] border transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-xs ${
                    isCurrent
                      ? 'border-cyan-500 ring-1 ring-cyan-500/30 shadow-md'
                      : 'border-zinc-200/90 dark:border-zinc-800/90 hover:border-cyan-500/50'
                  }`}
                >
                  {/* Artwork Container (Clean: zero provider tags) */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-2.5 shadow-xs">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

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
                        className="w-11 h-11 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all hover:scale-105 active:scale-95"
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
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-cyan-500/40 flex items-center gap-1">
                        <EqualizerBars isPlaying={true} size="sm" />
                      </div>
                    )}
                  </div>

                  {/* Track Meta & Quick Controls */}
                  <div className="space-y-1">
                    <h4
                      className={`text-xs font-bold truncate transition-colors ${
                        isCurrent
                          ? 'text-cyan-500'
                          : 'text-zinc-900 dark:text-white group-hover:text-cyan-500'
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
                        className="p-1 rounded-md text-zinc-400 hover:text-cyan-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-0.5 text-[10px] font-mono font-bold"
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
          FEATURED OFFICIAL ALBUMS & EPS (Click to view full tracklist like Spotify)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
            <div>
              <h3 className="text-lg sm:text-xl font-display font-extrabold text-zinc-900 dark:text-white">
                Official Albums & EPs
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Explore complete official tracklists, original artwork, and seamless album playback.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400">Click to open album</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featuredAlbums.slice(0, 12).map((album) => (
            <div
              key={album.id}
              onClick={() => setSelectedAlbum(album)}
              className="group relative p-3 rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200/90 dark:border-zinc-800/90 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-xs"
            >
              {/* 1000x1000 Original Album Cover */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-2.5 shadow-sm">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Album / EP Pill */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[9px] font-mono uppercase font-bold text-white border border-white/10">
                  {album.type}
                </div>

                {/* Floating Play Button */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl transform scale-80 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-[#D4FF00] transition-colors">
                  {album.title}
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {album.artist}
                </p>
                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                  {album.year || '2024'} · {album.trackCount} tracks
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          FEATURED & FOLLOWED ARTISTS (Follow artists to tune recommendations)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
            <div>
              <h3 className="text-lg sm:text-xl font-display font-extrabold text-zinc-900 dark:text-white">
                Featured & Followed Artists
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Follow your favorite artists to immediately tune your Discover recommendations.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400">1000x1000 Original Artwork</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {OFFICIAL_ARTISTS.map((artist) => {
            const isFollowed = actions.isArtistFollowed(artist.name);
            return (
              <div
                key={artist.id}
                onClick={() => {
                  actions.setActiveTab('search');
                }}
                className="group p-3.5 rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200/90 dark:border-zinc-800/90 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center shadow-xs"
              >
                <div className="relative aspect-square w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-zinc-900 mb-2.5 shadow-md border-2 border-zinc-200 dark:border-zinc-700 group-hover:border-emerald-500 transition-colors">
                  <img
                    src={artist.avatarUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate w-full group-hover:text-emerald-600 dark:group-hover:text-[#D4FF00] transition-colors">
                  {artist.name}
                </h4>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                  {artist.genre}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.toggleFollowArtist(artist);
                  }}
                  className={`mt-2.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                    isFollowed
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-[#D4FF00] border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30'
                      : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700'
                  }`}
                  title={isFollowed ? 'Click to Unfollow' : 'Follow Artist'}
                >
                  {isFollowed ? '✓ Following' : '+ Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          FEATURED STREAMING PLAYLIST SETS
          Clean: No platform names in titles or badges
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

                {/* Clean Source Pill */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md flex items-center gap-1.5 text-[10px] font-bold text-white border border-white/10">
                  <Music className="w-3 h-3 text-emerald-400" />
                  <span>Curated Set</span>
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
          SECTION: CURATED PARTY DROPS TABLE (CLEAN - ZERO PLATFORM BADGES ON ROWS)
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
              Hook drops fast-forwarded into the chorus for pure uninterrupted energy.
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
            <span className="col-span-6 sm:col-span-5">Title & Artist</span>
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

                  {/* Col 2: Thumbnail, Title, Artist (Clean: NO platform icon) */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm relative">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 truncate">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCurrent
                            ? 'text-emerald-700 dark:text-[#D4FF00] font-bold'
                            : 'text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-white'
                        }`}
                      >
                        {track.title}
                      </p>
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

      {/* Full Spotify-Style Album Details Modal */}
      <AlbumViewModal
        album={selectedAlbum}
        isOpen={!!selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </div>
  );
};
