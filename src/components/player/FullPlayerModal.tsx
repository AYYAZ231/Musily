import React from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Flame,
  Sparkles,
  Disc3,
  Radio,
  ArrowUp,
  Share2
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

  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  const emojis = ['🔥', '🎉', '🔊', '❤️', '💃', '⚡'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07090E]/95 backdrop-blur-3xl animate-fadeIn overflow-hidden">
      {/* Background Ambient Glow matching album art */}
      <div
        className="absolute inset-0 opacity-20 filter blur-3xl scale-125 pointer-events-none transition-all duration-1000"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, #EC4899 0%, #8B5CF6 40%, transparent 70%)`
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Disc3 className="w-5 h-5 text-party-pink animate-spin-slow" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
            Musily Immersive Player
          </span>
          {state.isPartyActive && (
            <span className="text-[10px] bg-party-pink/20 text-party-pink border border-party-pink/40 px-2 py-0.5 rounded-full font-bold ml-2">
              ROOM {state.partyRoom?.id}
            </span>
          )}
        </div>

        <button
          onClick={() => actions.setFullPlayerOpen(false)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* Center Body (Vinyl & Metadata) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full text-center">
        {/* Rotating Vinyl Record Artwork */}
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 mb-8">
          <div
            className={`w-full h-full rounded-full p-2 bg-gradient-to-tr from-party-pink via-primary to-party-cyan shadow-glow-party transition-transform duration-700 ${
              state.isPlaying ? 'animate-spin-slow' : ''
            }`}
          >
            <div className="w-full h-full rounded-full bg-[#090B10] p-3 flex items-center justify-center border-4 border-black/80 relative overflow-hidden">
              {/* Vinyl grooves */}
              <div className="absolute inset-2 rounded-full border border-white/10" />
              <div className="absolute inset-6 rounded-full border border-white/10" />
              <div className="absolute inset-10 rounded-full border border-white/5" />

              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover shadow-2xl relative z-10"
              />

              {/* Center spindle hole */}
              <div className="absolute w-6 h-6 rounded-full bg-black border-2 border-white/40 z-20" />
            </div>
          </div>

          {/* Equalizer Wave Overlay */}
          {state.isPlaying && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8 px-4 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
              {[40, 75, 55, 90, 60, 85, 45, 95, 70].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-gradient-to-t from-party-pink to-party-cyan rounded-full animate-equalizer"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Track Title, Artist, & Source Badge */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-white truncate max-w-md">
              {track.title}
            </h2>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                track.source === 'spotify'
                  ? 'bg-spotify/20 text-spotify border border-spotify/30'
                  : 'bg-youtube/20 text-youtube border border-youtube/30'
              }`}
            >
              {track.source}
            </span>
          </div>
          <p className="text-sm text-slate-400 font-medium">{track.artist}</p>
        </div>

        {/* The Drop Mode Button */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={actions.toggleDropMode}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
              state.dropMode
                ? 'bg-gradient-to-r from-party-pink to-primary text-white shadow-glow-party scale-105'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>The Drop Mode: {state.dropMode ? 'ACTIVE' : 'OFF'}</span>
          </button>

          {state.isPartyActive && (
            <button
              onClick={() => actions.voteTrack(track.id)}
              className="px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-party-pink font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
              <span>{track.votes} Votes</span>
            </button>
          )}
        </div>

        {/* Timeline Progress Bar */}
        <div className="w-full space-y-2 mb-6">
          <input
            type="range"
            min={0}
            max={state.duration || 100}
            value={state.currentTime}
            onChange={(e) => actions.seek(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-party-pink"
          />
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-6">
          <button
            onClick={actions.prevTrack}
            className="p-3 text-slate-400 hover:text-white transition-colors active:scale-90"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={actions.togglePlay}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 shadow-glow-primary transition-all"
          >
            {state.isPlaying ? (
              <Pause className="w-7 h-7 fill-black" />
            ) : (
              <Play className="w-7 h-7 fill-black ml-1" />
            )}
          </button>

          <button
            onClick={actions.nextTrack}
            className="p-3 text-slate-400 hover:text-white transition-colors active:scale-90"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Live Reaction Emojis Burst */}
        {state.isPartyActive && (
          <div className="flex items-center justify-center gap-3 pt-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => actions.sendReaction(emoji)}
                className="text-2xl p-2 rounded-2xl bg-white/5 hover:bg-white/15 hover:scale-125 active:scale-90 transition-transform"
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
