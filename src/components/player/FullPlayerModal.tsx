import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Zap,
  Volume2,
  VolumeX,
  Radio,
  Disc3,
  Heart,
  Sparkles,
  RefreshCw,
  ListMusic
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { EqualizerBars } from '../common/EqualizerBars';

export const FullPlayerModal: React.FC = () => {
  const { state, actions } = useMusicStore();
  const track = state.currentTrack;
  const [showQueue, setShowQueue] = useState(true);

  if (!state.isFullPlayerOpen || !track) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const emojis = ['🔥', '🔊', '🎉', '❤️', '💃', '⚡'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white/98 dark:bg-[#0C0C0F]/98 backdrop-blur-3xl p-4 sm:p-6 md:p-8 select-none animate-fade-in transition-colors duration-200 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] dark:bg-[#D4FF00] animate-pulse" />
          <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            MUSILY NOW PLAYING
          </span>
          {state.activeAIGenre && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-[#D4FF00] bg-emerald-500/10 dark:bg-[#D4FF00]/10 border border-emerald-500/25 dark:border-[#D4FF00]/25 px-2 py-0.5 rounded ml-1 font-bold">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>{state.activeAIGenre}</span>
            </span>
          )}
          {state.isPartyActive && (
            <span className="text-[10px] font-mono text-[#059669] dark:text-[#D4FF00] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded ml-2">
              ROOM #{state.partyRoom?.id}
            </span>
          )}
        </div>

        <button
          onClick={() => actions.setFullPlayerOpen(false)}
          className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95 border border-zinc-200 dark:border-zinc-700 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Deck */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full my-auto pb-6">
        {/* Animated Vinyl Artwork */}
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 mb-4 flex items-center justify-center">
          <div
            className={`w-full h-full rounded-full p-3 bg-zinc-900 border-4 border-zinc-800 shadow-xl flex items-center justify-center relative overflow-hidden ${
              state.isPlaying ? 'animate-vinyl' : ''
            }`}
          >
            {/* Vinyl grooves */}
            <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-5 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />

            {/* Album Center Label */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-2xl relative z-10 border-2 border-zinc-700">
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              {/* Spindle hole */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-zinc-900 border border-white/20 shadow-inner" />
            </div>
          </div>

          {/* Equalizer Wave Overlay badge */}
          {state.isPlaying && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-md flex items-center gap-1.5 z-20">
              <EqualizerBars isPlaying={true} size="md" />
              <span className="text-[10px] font-mono font-bold text-zinc-800 dark:text-zinc-200">
                PLAYING
              </span>
            </div>
          )}
        </div>

        {/* Title, Artist & Like Heart */}
        <div className="flex items-center justify-between w-full max-w-sm px-2 mb-4">
          <div className="text-left space-y-0.5 min-w-0 flex-1 pr-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-white truncate">
              {track.title}
            </h2>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium truncate">{track.artist}</p>
              {state.activeAIGenre && (
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-[#D4FF00] bg-emerald-500/10 dark:bg-[#D4FF00]/10 border border-emerald-500/20 dark:border-[#D4FF00]/20 px-1.5 py-0.2 rounded">
                  {state.activeAIGenre}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => actions.toggleLikeSong(track)}
            className={`p-3 rounded-full border transition-all active:scale-75 shrink-0 ${
              actions.isSongLiked(track.id, track.title)
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-500 hover:bg-rose-500/25 shadow-md shadow-rose-500/10'
                : 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
            }`}
            title={actions.isSongLiked(track.id, track.title) ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          >
            <Heart
              className={`w-5 h-5 transition-transform duration-200 ${
                actions.isSongLiked(track.id, track.title) ? 'fill-rose-500 scale-110' : ''
              }`}
            />
          </button>
        </div>

        {/* Dual Mode Switch: Hook Drop Mode & AI Genre Radio */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={actions.toggleDropMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all flex items-center gap-1.5 ${
              state.dropMode
                ? 'bg-[#10B981] text-white dark:bg-[#D4FF00] dark:text-black border-transparent font-bold shadow-md animate-drop-glow'
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Drop: {state.dropMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => actions.toggleAiAutoplay()}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all flex items-center gap-1.5 ${
              state.aiAutoplayEnabled
                ? 'bg-emerald-600/15 text-emerald-600 dark:bg-[#D4FF00]/15 dark:text-[#D4FF00] border-emerald-500/40 dark:border-[#D4FF00]/40 font-bold shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
            title="When active, AI continuously plays and suggests songs of the same genre"
          >
            <Sparkles className={`w-3.5 h-3.5 ${state.aiAutoplayEnabled ? 'text-emerald-500 dark:text-[#D4FF00] animate-pulse' : 'text-zinc-400'}`} />
            <span>AI Genre Radio: {state.aiAutoplayEnabled ? 'ACTIVE' : 'OFF'}</span>
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="w-full space-y-1.5 mb-4">
          <input
            type="range"
            min={0}
            max={state.duration || 100}
            value={state.currentTime}
            onChange={(e) => actions.seek(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 dark:text-zinc-500">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-8 mb-4">
          <button
            onClick={actions.prevTrack}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all active:scale-90"
            title="Previous"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={actions.togglePlay}
            className="w-14 h-14 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
            title={state.isPlaying ? 'Pause' : 'Play'}
          >
            {state.isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={actions.nextTrack}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all active:scale-90"
            title="Next Track (AI Genre Matched)"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Reactions in Party Mode */}
        {state.isPartyActive && (
          <div className="flex items-center gap-2 mb-4">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => actions.sendReaction(emoji)}
                className="text-xl p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-all active:scale-90 hover:-translate-y-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* =========================================================================
            AI GENRE SMART AUTOPLAY & UP NEXT QUEUE PANEL
            Live suggestions matching the current song's genre / vibe
            ========================================================================= */}
        <div className="w-full mt-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500 dark:text-[#D4FF00] animate-pulse" />
              <div>
                <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  AI Smart Radio · {state.activeAIGenre || 'Genre Match'}
                </span>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {state.aiAutoplayEnabled
                    ? `Auto-plays next songs in ${state.activeAIGenre || 'this genre'} seamlessly.`
                    : 'AI Continuous Autoplay is currently paused.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => actions.refreshAIGenreQueue()}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                title="Shuffle & Refresh AI Genre Suggestions"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => actions.toggleAiAutoplay()}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                  state.aiAutoplayEnabled
                    ? 'bg-emerald-500/15 text-emerald-600 dark:bg-[#D4FF00]/15 dark:text-[#D4FF00] border-emerald-500/30'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700'
                }`}
              >
                {state.aiAutoplayEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Queue Track List */}
          {state.queue.length > 0 ? (
            <div className="space-y-1.5 mt-2.5">
              {state.queue.slice(0, 4).map((qTrack, idx) => (
                <div
                  key={qTrack.id + '_' + idx}
                  onClick={() => actions.playTrack(qTrack, { keepQueue: true })}
                  className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/60 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-mono text-zinc-400 w-4 text-center">
                      {idx === 0 ? '▶' : `${idx + 1}`}
                    </span>
                    <img
                      src={qTrack.coverUrl}
                      alt={qTrack.title}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
                    />
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate group-hover:text-emerald-500 dark:group-hover:text-[#D4FF00] transition-colors">
                        {qTrack.title}
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                        {qTrack.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-[#D4FF00] bg-emerald-500/10 dark:bg-[#D4FF00]/10 border border-emerald-500/20 px-1.5 py-0.5 rounded truncate max-w-[125px]">
                      ✨ {qTrack.aiGenreMatch || state.activeAIGenre || 'Same Genre'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.playTrack(qTrack, { keepQueue: true });
                      }}
                      className="p-1 rounded-full text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      title="Play this track now"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              ))}

              {state.queue.length > 4 && (
                <p className="text-[10px] font-mono text-zinc-400 text-center pt-1">
                  +{state.queue.length - 4} more {state.activeAIGenre || 'genre'} tracks ready in AI radio queue
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 text-center text-xs text-zinc-400 font-mono">
              ✨ AI Smart Radio will auto-select the next matching song when this finishes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
