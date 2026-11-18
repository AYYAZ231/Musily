import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  Zap,
  Radio,
  Sliders,
  Heart,
  Sparkles
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { EqualizerBars } from '../common/EqualizerBars';

export const PlayerBar: React.FC = () => {
  const { state, actions } = useMusicStore();
  const track = state.currentTrack;

  if (!track) return null;

  const nextTrack = state.queue.length > 0 ? state.queue[0] : null;

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
    <footer className="player-bar-container shrink-0 z-30 mb-[56px] md:mb-0 bg-white/95 dark:bg-[#0C0C0F]/95 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 px-4 py-2.5 transition-colors duration-200 select-none shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Track Information */}
        <div className="flex items-center gap-2 min-w-0 max-w-[240px] sm:max-w-xs">
          <div
            onClick={() => actions.setFullPlayerOpen(true)}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
              <img
                src={track.coverUrl}
                alt={track.title}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  state.isPlaying ? 'scale-105' : ''
                }`}
              />
              {state.isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <EqualizerBars isPlaying={true} size="sm" />
                </div>
              )}
            </div>

            <div className="min-w-0 truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate group-hover:underline">
                  {track.title}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{track.artist}</p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {state.activeAIGenre && (
                  <span
                    className="text-[9px] font-mono font-bold text-emerald-600 dark:text-[#D4FF00] bg-emerald-500/10 dark:bg-[#D4FF00]/10 border border-emerald-500/25 dark:border-[#D4FF00]/25 px-1 py-0.2 rounded flex items-center gap-0.5 truncate max-w-[125px]"
                    title={`AI Genre: ${state.activeAIGenre}`}
                  >
                    <Sparkles className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{state.activeAIGenre}</span>
                  </span>
                )}
                {state.dropMode && (
                  <span className="text-[9px] font-mono font-bold text-[#059669] dark:text-[#D4FF00] flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5" />
                    Hook Drop
                  </span>
                )}
                {state.isPartyActive && (
                  <span className="text-[9px] font-mono text-emerald-600 dark:text-[#D4FF00] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#D4FF00] animate-ping" />
                    Party Synced
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Like / Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              actions.toggleLikeSong(track);
            }}
            className={`p-1.5 rounded-lg transition-all active:scale-75 shrink-0 ${
              actions.isSongLiked(track.id, track.title)
                ? 'text-rose-500 hover:text-rose-600'
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={actions.isSongLiked(track.id, track.title) ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                actions.isSongLiked(track.id, track.title) ? 'fill-rose-500 scale-110' : ''
              }`}
            />
          </button>
        </div>

        {/* Center: Controls & Scrubber */}
        <div className="flex flex-col items-center flex-1 max-w-xl">
          <div className="flex items-center gap-4 sm:gap-6 mb-1">
            {/* Previous */}
            <button
              onClick={actions.prevTrack}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all active:scale-90"
              title="Previous"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause with smooth scale */}
            <button
              onClick={actions.togglePlay}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
              title={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={actions.nextTrack}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all active:scale-90"
              title="Next"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Drop / Hook Toggle with pulse */}
            <button
              onClick={actions.toggleDropMode}
              className={`p-1 sm:px-2.5 sm:py-0.5 rounded text-[11px] font-mono uppercase flex items-center gap-1 transition-all border ${
                state.dropMode
                  ? 'bg-emerald-600 text-white dark:bg-[#D4FF00] dark:text-black border-transparent font-bold shadow-sm animate-drop-glow'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title="The Hook / Drop: Skip intros and jump straight to the drop"
            >
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">Drop Mode</span>
            </button>

            {/* AI Genre Radio Autoplay Toggle */}
            <button
              onClick={() => actions.toggleAiAutoplay()}
              className={`p-1 sm:px-2.5 sm:py-0.5 rounded text-[11px] font-mono uppercase flex items-center gap-1 transition-all border ${
                state.aiAutoplayEnabled
                  ? 'bg-emerald-600/15 text-emerald-600 dark:bg-[#D4FF00]/15 dark:text-[#D4FF00] border-emerald-500/40 dark:border-[#D4FF00]/40 font-bold shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title={
                state.aiAutoplayEnabled && nextTrack
                  ? `AI Genre Radio ON: ${state.activeAIGenre}\nUp Next (Same Genre): ${nextTrack.title} · ${nextTrack.artist}`
                  : 'Toggle AI Genre Radio & Autoplay'
              }
            >
              <Sparkles className={`w-3 h-3 ${state.aiAutoplayEnabled ? 'text-emerald-500 dark:text-[#D4FF00] animate-pulse' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">AI Radio</span>
            </button>
          </div>

          {/* Time Scrubber */}
          <div className="hidden sm:flex items-center gap-2.5 w-full">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono min-w-[32px] text-right">
              {formatTime(state.currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={state.duration || 100}
              value={state.currentTime}
              onChange={handleSeek}
              className="w-full"
            />
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono min-w-[32px]">
              {formatTime(state.duration)}
            </span>
          </div>

          {/* AI Up Next preview pill below scrubber */}
          {nextTrack && (
            <div className="hidden md:flex items-center justify-between w-full mt-1 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 px-1">
              <span className="flex items-center gap-1.5 truncate max-w-sm">
                <Sparkles className="w-2.5 h-2.5 text-emerald-500 dark:text-[#D4FF00] shrink-0" />
                <span className="font-semibold text-zinc-600 dark:text-zinc-300">Up Next:</span>
                <span className="truncate text-zinc-900 dark:text-white font-medium">{nextTrack.title}</span>
                <span className="text-zinc-400">·</span>
                <span className="truncate">{nextTrack.artist}</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-[#D4FF00] border border-zinc-200 dark:border-zinc-700 shrink-0 font-bold">
                ✨ {state.activeAIGenre || 'Genre Match'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Tools & Volume */}
        <div className="flex items-center gap-3">
          {/* Party Aux Status */}
          {state.isPartyActive && (
            <button
              onClick={() => actions.setActiveTab('party')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-[#D4FF00]" />
              <span>{state.hasAux ? 'You hold Aux' : 'Listening'}</span>
            </button>
          )}

          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => actions.setVolume(state.volume > 0 ? 0 : 0.8)}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
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
              className="w-20"
            />
          </div>

          {/* Equalizer & AI Acoustic Button */}
          <button
            onClick={() => actions.toggleEqualizerModal()}
            className={`p-1.5 rounded-lg transition-all active:scale-90 flex items-center gap-1 ${
              state.isEqualizerOpen
                ? 'bg-emerald-500/15 text-emerald-600 dark:bg-[#D4FF00]/15 dark:text-[#D4FF00]'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="Acoustic Equalizer & AI Sound Engine"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden xl:inline text-[10px] font-mono font-bold">EQ</span>
          </button>

          {/* Full Player Modal Button */}
          <button
            onClick={() => actions.setFullPlayerOpen(true)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-90"
            title="Expand Full View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
