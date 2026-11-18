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
  Music2,
  TrendingUp,
  ThumbsUp,
  Headphones,
  Disc3,
  Sliders
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { FEATURED_SPOTIFY_TRACKS } from '../../services/spotifyService';
import { FEATURED_YOUTUBE_TRACKS } from '../../services/youtubeService';
import { EqualizerBars } from '../common/EqualizerBars';
import { Track } from '../../types';

interface HomeViewProps {
  onOpenPartyModal: () => void;
  onOpenAccountModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenPartyModal }) => {
  const { state, actions } = useMusicStore();
  const [selectedVibe, setSelectedVibe] = useState('all');

  const allTracks = [
    FEATURED_YOUTUBE_TRACKS[0], // Tauba Tauba
    FEATURED_SPOTIFY_TRACKS[2], // Brown Munde
    FEATURED_SPOTIFY_TRACKS[0], // Starboy
    FEATURED_YOUTUBE_TRACKS[1], // Obsessed
    FEATURED_YOUTUBE_TRACKS[3], // Proper Patola
    FEATURED_SPOTIFY_TRACKS[1], // Blinding Lights
  ];

  const vibeCategories = [
    { id: 'all', label: '🔥 All Bangers', filter: () => true },
    { id: 'drops', label: '⚡ Fast Hook Drops', filter: (t: Track) => !!t.dropTime && t.dropTime <= 30 },
    { id: 'club', label: '🔊 Club & Party Heat', filter: (t: Track) => t.votes > 15 },
    { id: 'synth', label: '🕶️ Synthwave & Pop', filter: (t: Track) => t.artist.includes('Weeknd') },
    { id: 'punjabi', label: '💥 Desi & Punjabi Hits', filter: (t: Track) => t.artist.includes('Karan') || t.artist.includes('AP') || t.artist.includes('Diljit') || t.artist.includes('Riar') }
  ];

  const filteredTracks = allTracks.filter(
    vibeCategories.find((v) => v.id === selectedVibe)?.filter || (() => true)
  );

  const spotlightTrack = state.currentTrack || allTracks[0];

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 select-none animate-fade-in">
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
              <span className="text-white/80 font-normal">Free P2P Online Sync</span>
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
                Continuous high-energy music drops straight into the hook and chorus. Skip slow intros, pass the Aux to friends live online, and democratically upvote what plays next — 100% free with zero cloud fees.
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
                <span className="text-[10px] font-mono text-zinc-400">
                  ⚡ Hook @ {spotlightTrack.dropTime || 28}s
                </span>
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
          VIBE & FILTER CHIP STRIP
          ========================================================================= */}
      <section className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {vibeCategories.map((vibe) => (
          <button
            key={vibe.id}
            onClick={() => setSelectedVibe(vibe.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
              selectedVibe === vibe.id
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-md scale-[1.02]'
                : 'bg-white dark:bg-[#121216] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
            }`}
          >
            {vibe.label}
          </button>
        ))}
      </section>

      {/* =========================================================================
          SECTION 1: CURATED PARTY DROPS (Refined Human Polish Table)
          ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-lg sm:text-xl font-display font-extrabold text-zinc-900 dark:text-white">
                Curated Party Drops
              </h2>
              <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
                · Zero Dead Air Mix
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Instant hook delivery. No 40-second slow acoustic build-ups.
            </p>
          </div>

          <button
            onClick={() => actions.setActiveTab('search')}
            className="text-xs font-bold text-emerald-600 dark:text-[#D4FF00] hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
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
            {filteredTracks.map((track, index) => {
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

                  {/* Col 2: Thumbnail, Title, Artist */}
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
          SECTION 2: GLOBAL CHARTBUSTERS & BANGERS (High-End Visual Cards)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
            <h2 className="text-lg sm:text-xl font-display font-extrabold text-zinc-900 dark:text-white">
              Trending Festival & Club Bangers
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">Updated Hourly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allTracks.slice(0, 4).map((track) => {
            const isPlaying = state.currentTrack?.id === track.id && state.isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => actions.playTrack(track)}
                className="group relative p-3.5 rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                {/* Artwork Container with Zoom & Floating Play */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-3 shadow-md">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hook Drop Cue Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300 border border-white/10">
                    ⚡ 0:{track.dropTime || 28}
                  </div>

                  {/* Hover Floating Play Button */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      className="w-12 h-12 rounded-full bg-white dark:bg-[#D4FF00] text-black flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Equalizer Wave if playing */}
                  {isPlaying && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/20">
                      <EqualizerBars isPlaying={true} size="sm" />
                    </div>
                  )}
                </div>

                {/* Track Details */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-[#D4FF00] transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: FREE ONLINE PARTY AUX CALLOUT
          ========================================================================= */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-[#0A0D14] border border-zinc-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 dark:text-[#D4FF00] font-bold">
            <Radio className="w-4 h-4" />
            <span>NAUX Signature Party Mode</span>
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
