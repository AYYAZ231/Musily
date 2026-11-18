import React from 'react';
import {
  Flame,
  Radio,
  Play,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Disc3,
  Plus
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { FEATURED_SPOTIFY_TRACKS } from '../../services/spotifyService';
import { FEATURED_YOUTUBE_TRACKS } from '../../services/youtubeService';
import { Track } from '../../types';

interface HomeViewProps {
  onOpenPartyModal: () => void;
  onOpenAccountModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenPartyModal, onOpenAccountModal }) => {
  const { state, actions } = useMusicStore();

  const handlePlayTrack = (track: Track) => {
    actions.playTrack(track);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      {/* Hero Party Banner (NAUX Style) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#200A38] via-[#11162B] to-[#0A1728] border border-party-pink/30 p-6 md:p-10 overflow-hidden shadow-glow-party">
        <div className="absolute top-0 right-0 w-80 h-80 bg-party-pink/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-party-cyan/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-party-pink/20 border border-party-pink/40 text-party-pink text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-party-pink animate-bounce" />
            <span>The Aux, Handled</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-tight tracking-tight">
            Stream Spotify & YouTube Music Together.{' '}
            <span className="bg-gradient-to-r from-party-pink via-primary to-party-cyan bg-clip-text text-transparent">
              Party with Friends.
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Host live party rooms with friends online for free. Pass the Aux cord, drop straight to the hook/chorus without awkward lulls, and let everyone vote on what plays next!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenPartyModal}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-party-pink via-primary to-party-cyan text-white font-bold text-sm shadow-glow-party hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>{state.isPartyActive ? 'Go to Active Party' : 'Host a Party Room'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => actions.setActiveTab('search')}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition-all"
            >
              Search & Explore
            </button>
          </div>
        </div>
      </div>

      {/* The Drop Zone (NAUX Drop Format) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-party-yellow" />
            <div>
              <h2 className="text-lg md:text-xl font-display font-bold text-white">
                NAUX Drop Zone 🔥
              </h2>
              <p className="text-xs text-slate-400">
                Tracks crafted to jump straight to the energetic beat drop and chorus
              </p>
            </div>
          </div>
          <button
            onClick={actions.toggleDropMode}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
              state.dropMode
                ? 'bg-party-yellow/20 border-party-yellow text-party-yellow shadow'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {state.dropMode ? 'Drop Mode: ACTIVE' : 'Enable Drop Mode'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...FEATURED_SPOTIFY_TRACKS.slice(0, 3), ...FEATURED_YOUTUBE_TRACKS.slice(0, 3)].map(
            (track) => {
              const isCurrent = state.currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all group ${
                    isCurrent
                      ? 'bg-primary/20 border-primary/50 shadow-glow-primary'
                      : 'bg-surface/60 hover:bg-surface border-white/5 hover:border-white/15'
                  }`}
                >
                  <div
                    onClick={() => handlePlayTrack(track)}
                    className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow shrink-0">
                      <img src={track.coverUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>

                    <div className="min-w-0 truncate">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            track.source === 'spotify'
                              ? 'bg-spotify/20 text-spotify'
                              : 'bg-youtube/20 text-youtube'
                          }`}
                        >
                          {track.source}
                        </span>
                        {track.dropTime && (
                          <span className="text-[9px] text-party-yellow font-bold flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> Drop @ {track.dropTime}s
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => actions.addToQueue(track)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95 shrink-0 ml-2"
                    title={state.isPartyActive ? 'Queue to Party' : 'Add to Queue'}
                  >
                    {state.isPartyActive ? (
                      <Flame className="w-4 h-4 text-party-pink" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Spotify Top Hits */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-spotify shadow-glow-spotify" />
            <h2 className="text-lg md:text-xl font-display font-bold text-white">
              Trending on Spotify
            </h2>
          </div>
          <button
            onClick={() => actions.setActiveTab('search')}
            className="text-xs text-primary-light hover:text-white font-semibold transition-colors"
          >
            See All ➔
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FEATURED_SPOTIFY_TRACKS.map((t) => (
            <div
              key={t.id}
              onClick={() => handlePlayTrack(t)}
              className="p-3 rounded-2xl bg-surface/50 hover:bg-surface border border-white/5 hover:border-white/15 cursor-pointer transition-all group"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5 shadow bg-surface-elevated">
                <img
                  src={t.coverUrl}
                  alt={t.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              <h4 className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                {t.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{t.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* YouTube Music Party Banger Hits */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-youtube" />
            <h2 className="text-lg md:text-xl font-display font-bold text-white">
              YouTube Music Party Anthems
            </h2>
          </div>
          <button
            onClick={() => actions.setActiveTab('search')}
            className="text-xs text-primary-light hover:text-white font-semibold transition-colors"
          >
            See All ➔
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FEATURED_YOUTUBE_TRACKS.map((t) => (
            <div
              key={t.id}
              onClick={() => handlePlayTrack(t)}
              className="p-3 rounded-2xl bg-surface/50 hover:bg-surface border border-white/5 hover:border-white/15 cursor-pointer transition-all group"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5 shadow bg-surface-elevated">
                <img
                  src={t.coverUrl}
                  alt={t.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              <h4 className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                {t.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{t.artist}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
