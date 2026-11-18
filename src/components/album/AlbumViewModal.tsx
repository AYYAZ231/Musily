import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Plus,
  Clock,
  Disc3,
  ListPlus,
  ThumbsUp,
  Zap,
  Sparkles,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';
import { Album, Track } from '../../types';
import { useMusicStore } from '../../store/useMusicStore';
import { CatalogService } from '../../services/catalogService';
import { EqualizerBars } from '../common/EqualizerBars';

interface AlbumViewModalProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AlbumViewModal: React.FC<AlbumViewModalProps> = ({ album, isOpen, onClose }) => {
  const { state, actions } = useMusicStore();
  const [fullAlbum, setFullAlbum] = useState<Album | null>(album);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!album) {
      setFullAlbum(null);
      return;
    }

    // Check if album already has loaded tracks
    if (album.tracks && album.tracks.length > 0) {
      setFullAlbum(album);
      return;
    }

    // Check local catalog by ID or title
    const local = CatalogService.getAlbumById(album.id) || CatalogService.getAlbumById(album.title);
    if (local && local.tracks && local.tracks.length > 0) {
      setFullAlbum(local);
      return;
    }

    // Otherwise fetch remote album tracklist from iTunes lookup
    const rawId = album.id.replace('alb_', '');
    if (/^\d+$/.test(rawId)) {
      setLoading(true);
      CatalogService.fetchRemoteAlbumDetails(rawId).then((res) => {
        if (res) {
          setFullAlbum(res);
        } else {
          setFullAlbum(album);
        }
        setLoading(false);
      });
    } else {
      setFullAlbum(album);
    }
  }, [album]);

  if (!isOpen || !fullAlbum) return null;

  const tracks = fullAlbum.tracks || [];

  const totalDurationSecs = tracks.reduce((acc, t) => acc + (t.duration || 180), 0);
  const formatTotalTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs} hr ${remMins} min`;
  };

  const formatTrackDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isAlbumPlaying =
    state.isPlaying &&
    tracks.some((t) => t.id === state.currentTrack?.id || t.title === state.currentTrack?.title);

  const handlePlayAlbum = () => {
    if (!tracks.length) return;
    if (isAlbumPlaying) {
      actions.togglePlay();
      return;
    }
    // Play first track and queue remaining
    actions.playTrack(tracks[0]);
    tracks.slice(1).forEach((t) => actions.addToQueue(t));
  };

  const handlePlayTrack = (track: Track, index: number) => {
    if (state.currentTrack?.id === track.id) {
      actions.togglePlay();
      return;
    }
    actions.playTrack(track);
    // Queue subsequent tracks in album for seamless album playback like Spotify
    tracks.slice(index + 1).forEach((t) => actions.addToQueue(t));
  };

  const handleQueueAll = () => {
    tracks.forEach((t) => actions.addToQueue(t));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      {/* Outer Modal Container */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col text-white">
        {/* Sticky Header with Close */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 px-6 bg-black/60 backdrop-blur-md border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 dark:text-[#D4FF00] font-bold">
              {fullAlbum.type.toUpperCase()}
            </span>
            <span className="text-zinc-500">·</span>
            <span className="text-xs text-zinc-300 font-medium truncate max-w-xs sm:max-w-md">
              {fullAlbum.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1 scrollbar-thin">
          {/* Hero Album Header Section (Spotify Style) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-zinc-800">
            {/* 1000x1000 Original Album Cover */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-zinc-900 border border-white/10 group">
              <img
                src={fullAlbum.coverUrl}
                alt={fullAlbum.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>

            {/* Album Metadata & Play CTA */}
            <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-mono uppercase font-bold text-emerald-400 dark:text-[#D4FF00] border border-white/15">
                Official {fullAlbum.type === 'single' ? 'Single' : fullAlbum.type === 'ep' ? 'EP' : 'Album'}
              </span>

              <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white leading-tight break-words">
                {fullAlbum.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-zinc-400 font-medium">
                <span className="text-white font-bold">{fullAlbum.artist}</span>
                {fullAlbum.year && (
                  <>
                    <span>•</span>
                    <span>{fullAlbum.year}</span>
                  </>
                )}
                <span>•</span>
                <span>{tracks.length} songs</span>
                {totalDurationSecs > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-zinc-400">{formatTotalTime(totalDurationSecs)}</span>
                  </>
                )}
                {fullAlbum.genre && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400/90 font-mono text-[11px]">{fullAlbum.genre}</span>
                  </>
                )}
              </div>

              {/* Big Spotify-Style Play & Queue Buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                <button
                  onClick={handlePlayAlbum}
                  className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  {isAlbumPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>Pause Album</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                      <span>Play Album</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleQueueAll}
                  className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/15 transition-colors"
                  title="Queue entire album to party deck"
                >
                  <ListPlus className="w-4 h-4" />
                  <span>Queue All</span>
                </button>
              </div>
            </div>
          </div>

          {/* Album Tracklist (Exact Spotify Style with Row Numbers) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 font-bold">
                Album Tracklist
              </h3>
              <span className="text-xs font-mono text-zinc-500">{tracks.length} Tracks</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-zinc-400 flex flex-col items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading album tracklist...</span>
              </div>
            ) : tracks.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                No individual tracks pre-loaded for this release.
              </div>
            ) : (
              <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800/80 overflow-hidden divide-y divide-zinc-800/50">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 px-4 py-2.5 text-[11px] font-mono uppercase text-zinc-400 border-b border-zinc-800 font-semibold">
                  <span className="col-span-1 text-center">#</span>
                  <span className="col-span-7 sm:col-span-6">Title & Artist</span>
                  <span className="hidden sm:block sm:col-span-2 text-right">Drop Cue</span>
                  <span className="col-span-2 sm:col-span-2 text-right">Duration</span>
                  <span className="col-span-2 sm:col-span-1 text-center">Aux</span>
                </div>

                {/* Track Rows */}
                {tracks.map((track, idx) => {
                  const isCurrent = state.currentTrack?.id === track.id || state.currentTrack?.title === track.title;
                  const isPlayingThis = isCurrent && state.isPlaying;

                  return (
                    <div
                      key={track.id || idx}
                      onClick={() => handlePlayTrack(track, idx)}
                      className={`grid grid-cols-12 gap-3 px-4 py-3 items-center cursor-pointer transition-colors group relative ${
                        isCurrent
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'hover:bg-white/[0.04] text-zinc-200'
                      }`}
                    >
                      {/* Left accent bar for currently playing song */}
                      {isCurrent && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-500" />
                      )}

                      {/* Col 1: Number or Playing Equalizer */}
                      <div className="col-span-1 flex items-center justify-center">
                        {isPlayingThis ? (
                          <EqualizerBars isPlaying={true} size="sm" />
                        ) : (
                          <>
                            <span className="text-xs font-mono text-zinc-400 group-hover:hidden">
                              {idx + 1}
                            </span>
                            <Play className="w-3.5 h-3.5 text-white hidden group-hover:block" />
                          </>
                        )}
                      </div>

                      {/* Col 2: Title & Artist */}
                      <div className="col-span-7 sm:col-span-6 min-w-0 pr-2">
                        <p
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isCurrent ? 'text-emerald-400 font-bold' : 'group-hover:text-white'
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {track.artist}
                        </p>
                      </div>

                      {/* Col 3: Drop Cue */}
                      <div className="hidden sm:flex sm:col-span-2 items-center justify-end">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/50 text-[10px] font-mono text-amber-300 border border-white/10">
                          <Zap className="w-2.5 h-2.5" />
                          0:{track.dropTime || 28}
                        </span>
                      </div>

                      {/* Col 4: Track Duration */}
                      <div className="col-span-2 sm:col-span-2 text-right">
                        <span className="text-xs font-mono text-zinc-400">
                          {formatTrackDuration(track.duration || 180)}
                        </span>
                      </div>

                      {/* Col 5: Like, Aux Queue / Vote */}
                      <div
                        className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => actions.toggleLikeSong(track)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            actions.isSongLiked(track.id, track.title)
                              ? 'text-rose-500 hover:text-rose-400'
                              : 'text-zinc-400 hover:text-white hover:bg-white/10'
                          }`}
                          title={actions.isSongLiked(track.id, track.title) ? 'Unlike' : 'Like'}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              actions.isSongLiked(track.id, track.title) ? 'fill-rose-500' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => actions.addToQueue(track)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Add to queue"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => actions.voteTrack(track.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-white/10 transition-colors hidden sm:flex items-center gap-0.5"
                          title="Upvote"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
