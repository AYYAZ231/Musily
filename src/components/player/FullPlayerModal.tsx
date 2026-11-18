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
  ChevronUp
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';

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
    <div className="fixed inset-0 z-50 flex flex-col bg-white/95 dark:bg-[#0C0C0F]/95 backdrop-blur-2xl p-6 md:p-10 select-none animate-fadeIn transition-colors duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] dark:bg-[#D4FF00]" />
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
          className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-700 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Deck */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto">
        {/* Cover Art */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-lg mb-6 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title & Artist */}
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-white truncate max-w-sm">
            {track.title}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{track.artist}</p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                track.source === 'spotify'
                  ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                  : 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10'
              }`}
            >
              {track.source === 'spotify' ? 'Spotify Catalog' : 'YouTube Music Stream'}
            </span>
          </div>
        </div>

        {/* The Drop Mode Switch */}
        <button
          onClick={actions.toggleDropMode}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all mb-6 flex items-center gap-1.5 ${
            state.dropMode
              ? 'bg-[#10B981] text-white dark:bg-[#D4FF00] dark:text-black border-transparent font-bold shadow-sm'
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
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors active:scale-90"
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
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors active:scale-90"
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
                className="text-xl p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-transform active:scale-90"
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
