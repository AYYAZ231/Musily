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
  Heart,
  ListMusic
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

  // Resolve tracks; if empty (e.g. remote single), synthesize single track so it's directly playable
  const tracks: Track[] =
    fullAlbum.tracks && fullAlbum.tracks.length > 0
      ? fullAlbum.tracks
      : [
          {
            id: `tr_${fullAlbum.id}`,
            title: fullAlbum.title.replace(/\s*-\s*single/i, '').trim(),
            artist: fullAlbum.artist,
            album: fullAlbum.title,
            duration: 210,
            coverUrl: fullAlbum.coverUrl,
            source: fullAlbum.source || 'spotify',
            votes: 12,
            dropTime: 28
          }
        ];

  const isSingle = fullAlbum.type === 'single' || tracks.length === 1;

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
    // Queue subsequent tracks in album for seamless album playback
    tracks.slice(index + 1).forEach((t) => actions.addToQueue(t));
  };

  const handleQueueAll = () => {
    tracks.forEach((t) => actions.addToQueue(t));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      {/* Outer Modal Container with App Glass Aesthetics */}
      <div className="relative w-full max-w-4xl bg-[#0C0C0F]/95 backdrop-blur-3xl border border-white/10 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-white font-sans">
        
        {/* Sticky Header with Clean Type Pill and Close Button */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 px-6 bg-[#0C0C0F]/80 backdrop-blur-xl border-b border-white/10 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-extrabold bg-emerald-500/15 text-emerald-400 dark:text-[#D4FF00] border border-emerald-500/30">
              {isSingle ? 'OFFICIAL SINGLE' : fullAlbum.type === 'ep' ? 'OFFICIAL EP' : 'OFFICIAL ALBUM'}
            </span>
            <span className="text-zinc-600 dark:text-zinc-500">·</span>
            <span className="text-xs text-zinc-300 font-medium truncate max-w-xs sm:max-w-md font-sans">
              {fullAlbum.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-all active:scale-95"
            title="Close view"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1 scrollbar-thin">
          
          {/* Hero Header Section */}
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-white/10 dark:border-zinc-800">
            {/* Ambient artwork backdrop glow */}
            <div
              className="absolute -top-10 left-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, #10B981 0%, transparent 70%)'
              }}
            />

            {/* 1000x1000 Original Album Cover */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-zinc-900 border border-white/15 group">
              <img
                src={fullAlbum.coverUrl}
                alt={fullAlbum.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>

            {/* Album Metadata & Action CTA */}
            <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono uppercase font-bold text-emerald-400 dark:text-[#D4FF00] border border-white/15">
                  <Sparkles className="w-3 h-3" />
                  <span>{isSingle ? 'Official Single' : fullAlbum.type === 'ep' ? 'Official EP' : 'Official Album'}</span>
                </span>
                {fullAlbum.genre && (
                  <span className="inline-block px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono text-zinc-400 border border-white/10">
                    {fullAlbum.genre}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white leading-tight break-words">
                {fullAlbum.title}
              </h1>

              {/* Clean metadata line */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-zinc-400 font-medium">
                <span className="text-white font-bold">{fullAlbum.artist}</span>
                {fullAlbum.year && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span>{fullAlbum.year}</span>
                  </>
                )}
                <span className="text-zinc-600">•</span>
                <span>{tracks.length} {tracks.length === 1 ? 'song' : 'songs'}</span>
                {totalDurationSecs > 0 && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400 font-mono">{formatTotalTime(totalDurationSecs)}</span>
                  </>
                )}
              </div>

              {/* Modern Action Buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                <button
                  onClick={handlePlayAlbum}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 dark:from-[#D4FF00] dark:to-[#B6EB00] text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 dark:shadow-[#D4FF00]/10 hover:scale-105 active:scale-95 transition-all"
                >
                  {isAlbumPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>{isSingle ? 'Pause Song' : 'Pause Album'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>{isSingle ? 'Play Song' : 'Play Album'}</span>
                    </>
                  )}
                </button>

                {!isSingle && (
                  <button
                    onClick={handleQueueAll}
                    className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/15 transition-all active:scale-95"
                    title="Queue entire album to playlist"
                  >
                    <ListPlus className="w-4 h-4" />
                    <span>Queue All</span>
                  </button>
                )}

                {/* Like Button */}
                {tracks.length > 0 && (
                  <button
                    onClick={() => actions.toggleLikeSong(tracks[0])}
                    className={`p-3 rounded-full border transition-all active:scale-75 ${
                      actions.isSongLiked(tracks[0].id, tracks[0].title)
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                        : 'bg-white/10 border-white/15 text-zinc-400 hover:text-white hover:bg-white/15'
                    }`}
                    title={actions.isSongLiked(tracks[0].id, tracks[0].title) ? 'Remove from Liked' : 'Save to Liked'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        actions.isSongLiked(tracks[0].id, tracks[0].title) ? 'fill-rose-500' : ''
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tracklist Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-emerald-400 dark:text-[#D4FF00]" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  {isSingle ? 'Single Track' : 'Album Tracklist'}
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                {tracks.length} {tracks.length === 1 ? 'Track' : 'Tracks'}
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-zinc-400 flex flex-col items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading tracklist...</span>
              </div>
            ) : (
              <div className="rounded-2xl bg-zinc-900/60 border border-white/10 dark:border-zinc-800/80 overflow-hidden divide-y divide-white/5 dark:divide-zinc-800/50">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 px-4 py-2.5 text-[10px] font-mono uppercase text-zinc-400 bg-white/[0.02] border-b border-white/5 font-bold">
                  <span className="col-span-1 text-center">#</span>
                  <span className="col-span-7 sm:col-span-6">Title & Artist</span>
                  <span className="hidden sm:block sm:col-span-2 text-right">Hook Drop</span>
                  <span className="col-span-2 sm:col-span-2 text-right">Duration</span>
                  <span className="col-span-2 sm:col-span-1 text-center">Actions</span>
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
                          ? 'bg-emerald-500/10 dark:bg-[#D4FF00]/10 text-emerald-400 dark:text-[#D4FF00]'
                          : 'hover:bg-white/[0.04] text-zinc-200'
                      }`}
                    >
                      {/* Left accent bar for currently playing song */}
                      {isCurrent && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-500 dark:bg-[#D4FF00]" />
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
                            <Play className="w-3.5 h-3.5 text-white fill-white hidden group-hover:block" />
                          </>
                        )}
                      </div>

                      {/* Col 2: Title & Artist */}
                      <div className="col-span-7 sm:col-span-6 min-w-0 pr-2">
                        <p
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isCurrent
                              ? 'text-emerald-400 dark:text-[#D4FF00] font-bold'
                              : 'group-hover:text-white'
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
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-mono text-amber-300 border border-white/10">
                          <Zap className="w-2.5 h-2.5 text-amber-400" />
                          0:{track.dropTime || 28}
                        </span>
                      </div>

                      {/* Col 4: Track Duration */}
                      <div className="col-span-2 sm:col-span-2 text-right">
                        <span className="text-xs font-mono text-zinc-400">
                          {formatTrackDuration(track.duration || 180)}
                        </span>
                      </div>

                      {/* Col 5: Actions (Like, Queue, Upvote) */}
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
