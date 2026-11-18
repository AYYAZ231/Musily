import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Radio,
  Flame
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';

export const PlayerBar: React.FC = () => {
  const { state, actions } = useMusicStore();
  const track = state.currentTrack;

  if (!track) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    actions.seek(val);
  };

  return (
    <div className="fixed bottom-0 md:bottom-0 left-0 right-0 z-30 mb-[60px] md:mb-0 bg-[#0E121D]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-2.5 shadow-2xl transition-all">
      {/* Top scrubber bar (Slim interactive line) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 group cursor-pointer">
        <div
          className="h-full bg-gradient-to-r from-party-pink via-primary to-party-cyan relative"
          style={{ width: `${progress}%` }}
        >
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Track Info (Left) */}
        <div
          onClick={() => actions.setFullPlayerOpen(true)}
          className="flex items-center gap-3 min-w-0 max-w-[200px] sm:max-w-xs cursor-pointer group"
        >
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md shrink-0 bg-surface">
            <img
              src={track.coverUrl}
              alt={track.title}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                state.isPlaying ? 'animate-pulse' : ''
              }`}
            />
            {state.isPartyActive && (
              <span className="absolute bottom-1 right-1 p-0.5 rounded-full bg-party-pink shadow">
                <Flame className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </div>

          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5">
              <p className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                {track.title}
              </p>
              <span
                className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase shrink-0 ${
                  track.source === 'spotify'
                    ? 'bg-spotify/20 text-spotify border border-spotify/30'
                    : 'bg-youtube/20 text-youtube border border-youtube/30'
                }`}
              >
                {track.source === 'spotify' ? 'Spotify' : 'YouTube'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
          </div>
        </div>

        {/* Center Controls & Progress */}
        <div className="flex flex-col items-center flex-1 max-w-lg">
          <div className="flex items-center gap-3 sm:gap-6 mb-1">
            {/* The Drop Mode Button (NAUX signature feature) */}
            <button
              onClick={actions.toggleDropMode}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                state.dropMode
                  ? 'bg-gradient-to-r from-party-pink to-primary text-white shadow-glow-party scale-105'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
              }`}
              title="The Drop Mode: Skip intros and jump straight to the energetic drop/hook (like naux.party)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">The Drop</span>
            </button>

            {/* Prev Track */}
            <button
              onClick={actions.prevTrack}
              className="text-slate-400 hover:text-white transition-colors active:scale-90"
              title="Previous"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Play / Pause Main Button */}
            <button
              onClick={actions.togglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 shadow-glow-primary transition-all"
              title={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isPlaying ? (
                <Pause className="w-5 h-5 fill-black" />
              ) : (
                <Play className="w-5 h-5 fill-black ml-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={actions.nextTrack}
              className="text-slate-400 hover:text-white transition-colors active:scale-90"
              title="Next"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Party Aux Status indicator */}
            {state.isPartyActive && (
              <span
                onClick={() => actions.setActiveTab('party')}
                className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-party-pink bg-party-pink/10 px-2 py-0.5 rounded-full cursor-pointer hover:bg-party-pink/20"
              >
                <Radio className="w-3 h-3 animate-pulse" />
                {state.hasAux ? 'You hold the Aux' : 'Party synced'}
              </span>
            )}
          </div>

          {/* Time Scrubber (Desktop) */}
          <div className="hidden sm:flex items-center gap-3 w-full">
            <span className="text-[10px] text-slate-400 font-mono min-w-[32px] text-right">
              {formatTime(state.currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={state.duration || 100}
              value={state.currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-[10px] text-slate-400 font-mono min-w-[32px]">
              {formatTime(state.duration)}
            </span>
          </div>
        </div>

        {/* Right Tools (Volume & Fullscreen) */}
        <div className="flex items-center gap-3">
          {/* Volume Slider (Hidden on small mobile) */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => actions.setVolume(state.volume > 0 ? 0 : 0.8)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {state.volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={state.volume}
              onChange={(e) => actions.setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Open Full Screen Modal */}
          <button
            onClick={() => actions.setFullPlayerOpen(true)}
            className="p-2 rounded-xl bg-surface-elevated/70 border border-white/10 text-slate-300 hover:text-white hover:border-primary/40 transition-all"
            title="Expand Full Player & Visualizer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
