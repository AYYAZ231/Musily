import React from 'react';
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
  Heart
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { EqualizerBars } from '../common/EqualizerBars';

export const FullPlayerModal: React.FC = () => {
  const { state, actions } = useMusicStore();
  const track = state.currentTrack;

  if (!state.isFullPlayerOpen || !track) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const emojis = ['🔥', '🔊', '🎉', '❤️', '💃', '⚡'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white/98 dark:bg-[#0C0C0F]/98 backdrop-blur-3xl p-6 md:p-10 select-none animate-fade-in transition-colors duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] dark:bg-[#D4FF00] animate-pulse" />
          <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            MUSILY NOW PLAYING
          </span>
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
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto">
        {/* Animated Vinyl Artwork */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-6 flex items-center justify-center">
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
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-2xl relative z-10 border-2 border-zinc-700">
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
        <div className="flex items-center justify-between w-full max-w-sm px-2 mb-6">
          <div className="text-left space-y-0.5 min-w-0 flex-1 pr-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-white truncate">
              {track.title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium truncate">{track.artist}</p>
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

        {/* The Drop Mode Switch with glow */}
        <button
          onClick={actions.toggleDropMode}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold border transition-all mb-6 flex items-center gap-1.5 ${
            state.dropMode
              ? 'bg-[#10B981] text-white dark:bg-[#D4FF00] dark:text-black border-transparent font-bold shadow-md animate-drop-glow'
              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>The Drop Mode: {state.dropMode ? 'ACTIVE' : 'OFF'}</span>
        </button>

        {/* Timeline Scrubber */}
        <div className="w-full space-y-1.5 mb-6">
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
        <div className="flex items-center justify-center gap-8 mb-6">
          <button
            onClick={actions.prevTrack}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all active:scale-90"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={actions.togglePlay}
            className="w-14 h-14 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
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
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Reactions in Party Mode */}
        {state.isPartyActive && (
          <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};
