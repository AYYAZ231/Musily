import React from 'react';
import {
  Play,
  Pause,
  Plus,
  Radio,
  Zap,
  ArrowRight,
  Flame,
  Sparkles,
  Music2
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

  const curatedDrops = [
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
    <div className="max-w-6xl mx-auto space-y-10 pb-20 select-none animate-fade-in">
      {/* Editorial Hero Banner */}
      <section className="p-6 md:p-10 rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[#059669] dark:text-[#D4FF00] text-xs font-mono font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#10B981] dark:bg-[#D4FF00] animate-ping" />
            The Aux, Handled
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-zinc-900 dark:text-white leading-none">
            CONTINUOUS PARTY DROPS. <br />
            <span className="text-[#059669] dark:text-[#D4FF00]">ZERO DEAD AIR.</span>
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl">
            Tell Musily the vibe and it handles the Aux. Songs that drop straight into the hook and chorus, skip the slow intros, and sync live across everyone's devices online for free.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenPartyModal}
              className="px-5 py-2.5 rounded-lg bg-[#10B981] hover:bg-[#059669] dark:bg-[#D4FF00] dark:hover:bg-[#C4ED00] text-white dark:text-black font-bold text-xs transition-all active:scale-[0.98] flex items-center gap-2 shadow-sm hover:shadow"
            >
              <Radio className="w-4 h-4" />
              <span>{state.isPartyActive ? 'Return to Room' : 'Start Party Room'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={actions.toggleDropMode}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                state.dropMode
                  ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-[#D4FF00] border-transparent font-bold shadow-sm animate-drop-glow'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${state.dropMode ? 'fill-current' : ''}`} />
              <span>The Drop Mode: {state.dropMode ? 'ACTIVE' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 1: Curated Drop Set (No platform labels) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Curated Party Drops</span>
              <span className="text-xs font-mono font-normal text-zinc-400">· Hook & Chorus Mix</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Starts every track straight at the drop. Zero awkward silence between songs.
            </p>
          </div>

          <button
            onClick={() => actions.setActiveTab('search')}
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Explore all</span>
            <span>➔</span>
          </button>
        </div>

        {/* Clean Song Table */}
        <div className="rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 px-4 py-2.5 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40">
            <span className="col-span-1">#</span>
            <span className="col-span-7">Title & Artist</span>
            <span className="col-span-3 text-right">Drop Cue</span>
            <span className="col-span-1 text-right">Time</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {curatedDrops.map((t, idx) => {
              const isCurrent = state.currentTrack?.id === t.id;
              const isPlayingCurrent = isCurrent && state.isPlaying;

              return (
                <div
                  key={t.id}
                  className={`grid grid-cols-12 items-center px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer ${
                    isCurrent ? 'bg-emerald-500/5 dark:bg-zinc-800/80' : ''
                  }`}
                  onClick={() => actions.playTrack(t)}
                >
                  {/* # or Playing Equalizer Animation */}
                  <div className="col-span-1 flex items-center text-xs font-mono text-zinc-400 dark:text-zinc-500">
                    {isPlayingCurrent ? (
                      <EqualizerBars isPlaying={true} size="sm" />
                    ) : (
                      <>
                        <span className="group-hover:hidden">{idx + 1}</span>
                        <Play className="w-3.5 h-3.5 text-zinc-900 dark:text-white fill-current hidden group-hover:block transition-transform active:scale-90" />
                      </>
                    )}
                  </div>

                  {/* Title & Cover */}
                  <div className="col-span-9 sm:col-span-7 flex items-center gap-3 min-w-0 pr-2">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                      <img
                        src={t.coverUrl}
                        alt=""
                        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          isPlayingCurrent ? 'scale-105' : ''
                        }`}
                      />
                    </div>
                    <div className="min-w-0 truncate">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCurrent
                            ? 'text-[#059669] dark:text-[#D4FF00]'
                            : 'text-zinc-900 dark:text-white'
                        }`}
                      >
                        {t.title}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {t.artist}
                      </p>
                    </div>
                  </div>

                  {/* Drop Cue */}
                  <div className="hidden sm:block col-span-3 text-right font-mono text-xs font-semibold text-[#059669] dark:text-[#D4FF00]">
                    {t.dropTime ? (
                      <span className="inline-flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Drop @ {t.dropTime}s
                      </span>
                    ) : (
                      'Full Track'
                    )}
                  </div>

                  {/* Duration & Quick Add */}
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-2 text-right text-xs font-mono text-zinc-400 dark:text-zinc-500">
                    <span className="group-hover:hidden">{formatDuration(t.duration)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.addToQueue(t);
                      }}
                      className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hidden group-hover:block transition-all active:scale-90"
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

      {/* Section 2: Global Chartbusters (No platform labels) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] dark:bg-[#D4FF00]" />
            <h2 className="text-base sm:text-lg font-display font-bold text-zinc-900 dark:text-white">
              Global Chartbusters
            </h2>
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">Trending Now</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FEATURED_SPOTIFY_TRACKS.map((t) => {
            const isPlayingThis = state.currentTrack?.id === t.id && state.isPlaying;

            return (
              <div
                key={t.id}
                onClick={() => actions.playTrack(t)}
                className="p-2.5 rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer group shadow-sm"
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2 bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={t.coverUrl}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isPlayingThis ? (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <EqualizerBars isPlaying={true} size="md" />
                    </div>
                  ) : (
                    <button
                      className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:scale-110 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.playTrack(t);
                      }}
                    >
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{t.title}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{t.artist}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Club & Festival Anthems (No platform labels) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-base sm:text-lg font-display font-bold text-zinc-900 dark:text-white">
              Club & Festival Bangers
            </h2>
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">High Energy</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FEATURED_YOUTUBE_TRACKS.map((t) => {
            const isPlayingThis = state.currentTrack?.id === t.id && state.isPlaying;

            return (
              <div
                key={t.id}
                onClick={() => actions.playTrack(t)}
                className="p-2.5 rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer group shadow-sm"
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2 bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={t.coverUrl}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isPlayingThis ? (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <EqualizerBars isPlaying={true} size="md" />
                    </div>
                  ) : (
                    <button
                      className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:scale-110 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.playTrack(t);
                      }}
                    >
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{t.title}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{t.artist}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
