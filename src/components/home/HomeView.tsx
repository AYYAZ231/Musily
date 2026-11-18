import React from 'react';
import {
  Play,
  Plus,
  Radio,
  Zap,
  ArrowRight,
  Sparkles,
  Flame,
  Check
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { FEATURED_SPOTIFY_TRACKS } from '../../services/spotifyService';
import { FEATURED_YOUTUBE_TRACKS } from '../../services/youtubeService';
import { Track } from '../../types';

interface HomeViewProps {
  onOpenPartyModal: () => void;
  onOpenAccountModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenPartyModal }) => {
  const { state, actions } = useMusicStore();

  const partyTracks = [
    FEATURED_YOUTUBE_TRACKS[0], // Tauba Tauba
    FEATURED_SPOTIFY_TRACKS[2], // Brown Munde
    FEATURED_SPOTIFY_TRACKS[0], // Starboy
    FEATURED_YOUTUBE_TRACKS[1], // Obsessed
    FEATURED_YOUTUBE_TRACKS[3], // Proper Patola
    FEATURED_SPOTIFY_TRACKS[1], // Blinding Lights
  ];

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 select-none">
      {/* Brutalist Editorial Hero (NAUX Style) */}
      <section className="p-6 md:p-10 rounded-2xl bg-ink-900 border border-ink-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-ink-800 border border-ink-700 text-lime text-xs font-mono font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            The Aux, Handled
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-none">
            PARTY DROPS FROM <br />
            <span className="text-lime">SPOTIFY & YOUTUBE.</span>
          </h1>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl">
            Tell Musily the vibe and it handles the Aux. Hindi, Punjabi & global party songs that drop straight into the hook, skip the awkward lulls, and sync live with your friends for free.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenPartyModal}
              className="px-5 py-2.5 rounded-lg bg-lime hover:bg-lime-hover text-black font-bold text-xs transition-all active:scale-[0.98] flex items-center gap-2 shadow-subtle"
            >
              <Radio className="w-4 h-4" />
              <span>{state.isPartyActive ? 'Return to Room' : 'Create Party Room'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={actions.toggleDropMode}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                state.dropMode
                  ? 'bg-ink-800 border-lime text-lime font-bold'
                  : 'bg-ink-850 hover:bg-ink-800 border-ink-700 text-zinc-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>The Drop Mode: {state.dropMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 1: NAUX Curated Drop Set */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              <span>Curated Party Drops</span>
              <span className="text-xs font-mono font-normal text-zinc-500">· Hook & Chorus Mix</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Starts every track at its best part. Zero silence between songs.
            </p>
          </div>

          <button
            onClick={() => actions.setActiveTab('search')}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Explore all ➔
          </button>
        </div>

        {/* Clean Human-Designed Song Table */}
        <div className="rounded-xl bg-ink-900 border border-ink-800 overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 px-4 py-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider border-b border-ink-800">
            <span className="col-span-1">#</span>
            <span className="col-span-6">Title & Artist</span>
            <span className="col-span-2">Source</span>
            <span className="col-span-2 text-right">Drop Cue</span>
            <span className="col-span-1 text-right">Time</span>
          </div>

          <div className="divide-y divide-ink-800/60">
            {partyTracks.map((t, idx) => {
              const isCurrent = state.currentTrack?.id === t.id;
              return (
                <div
                  key={t.id}
                  className={`grid grid-cols-12 items-center px-4 py-2.5 hover:bg-ink-850 transition-colors group cursor-pointer ${
                    isCurrent ? 'bg-ink-850/80' : ''
                  }`}
                  onClick={() => actions.playTrack(t)}
                >
                  {/* # or Play indicator */}
                  <div className="col-span-1 flex items-center text-xs font-mono text-zinc-500">
                    <span className="group-hover:hidden">{idx + 1}</span>
                    <Play className="w-3.5 h-3.5 text-white fill-white hidden group-hover:block" />
                  </div>

                  {/* Title & Cover */}
                  <div className="col-span-9 sm:col-span-6 flex items-center gap-3 min-w-0 pr-2">
                    <img
                      src={t.coverUrl}
                      alt=""
                      className="w-10 h-10 rounded-md object-cover shrink-0 bg-ink-800"
                    />
                    <div className="min-w-0 truncate">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCurrent ? 'text-lime' : 'text-white'
                        }`}
                      >
                        {t.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">{t.artist}</p>
                    </div>
                  </div>

                  {/* Source Pill */}
                  <div className="hidden sm:flex col-span-2 items-center">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        t.source === 'spotify'
                          ? 'border-spotify/30 text-spotify bg-spotify/5'
                          : 'border-youtube/30 text-youtube bg-youtube/5'
                      }`}
                    >
                      {t.source === 'spotify' ? 'Spotify' : 'YouTube'}
                    </span>
                  </div>

                  {/* Drop Cue */}
                  <div className="hidden sm:block col-span-2 text-right font-mono text-xs text-lime">
                    {t.dropTime ? `Drop @ ${t.dropTime}s` : 'Full'}
                  </div>

                  {/* Duration & Quick Add */}
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-2 text-right text-xs font-mono text-zinc-400">
                    <span className="group-hover:hidden">{formatDuration(t.duration)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.addToQueue(t);
                      }}
                      className="p-1.5 rounded hover:bg-ink-700 text-zinc-300 hover:text-white hidden group-hover:block"
                      title={state.isPartyActive ? 'Queue to party' : 'Add to queue'}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Spotify Top Trending */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-spotify" />
            <h2 className="text-base sm:text-lg font-display font-bold text-white">
              Trending on Spotify
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono">Live Global Catalog</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FEATURED_SPOTIFY_TRACKS.map((t) => (
            <div
              key={t.id}
              onClick={() => actions.playTrack(t)}
              className="p-2.5 rounded-xl bg-ink-900 border border-ink-800 hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2 bg-ink-800">
                <img
                  src={t.coverUrl}
                  alt={t.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-subtle hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.playTrack(t);
                  }}
                >
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </button>
              </div>

              <p className="text-xs font-semibold text-white truncate">{t.title}</p>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">{t.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: YouTube Music Party Anthems */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-youtube" />
            <h2 className="text-base sm:text-lg font-display font-bold text-white">
              YouTube Music Party Anthems
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono">Full Audio Streams</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FEATURED_YOUTUBE_TRACKS.map((t) => (
            <div
              key={t.id}
              onClick={() => actions.playTrack(t)}
              className="p-2.5 rounded-xl bg-ink-900 border border-ink-800 hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2 bg-ink-800">
                <img
                  src={t.coverUrl}
                  alt={t.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-subtle hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.playTrack(t);
                  }}
                >
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </button>
              </div>

              <p className="text-xs font-semibold text-white truncate">{t.title}</p>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">{t.artist}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
